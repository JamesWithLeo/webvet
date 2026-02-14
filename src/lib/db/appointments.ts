import { db, dbTx } from "@/db";
import {
    appointments,
    appointmentSchedules,
    AppointmentSchedulesTypeModel,
    appointmentsToPets,
    AppointmentType,
    BlockDatesTypeModel,
    blockedDates,
} from "@/db/schema/appointments";
import { pets } from "@/db/schema/pets";
import {
    and,
    asc,
    desc,
    eq,
    getTableColumns,
    gt,
    inArray,
    sql,
} from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { toTitleCase } from "../toTitleCase";
import { services } from "@/db/schema/services";

export class ExistingAppointmentConflictError extends Error {
    public code: string;
    public petIds: string[];

    constructor(petIds: string[], type: AppointmentType) {
        super(
            `Pet/s [${toTitleCase(petIds.join(", "))}] already have ${toTitleCase(type)} appointment.`
        );
        this.name = "ExistingAppointmentConflictError";
        this.code = "Existing Appointment";
        this.petIds = petIds;
    }
}
/**
 * Check whether pets already have appointment to the given type
 *
 * @param tx drizzle websocket instance
 * @param petIds id to validate
 * @param type appointment type
 *
 * @throws ExistingAppintmentConflictError if not unavailable
 */
const validatePetsAvailability = async (
    tx: PgTransaction<any, any, any>,
    petIds: string[],
    type: AppointmentType
) => {
    const existing = await tx
        .select({
            name: pets.name,
        })
        .from(appointmentsToPets)
        .innerJoin(
            appointments,
            eq(appointments.id, appointmentsToPets.appointmentId)
        )
        .innerJoin(pets, eq(pets.id, appointmentsToPets.petId))
        .where(
            and(
                inArray(appointmentsToPets.petId, petIds),
                gt(appointments.event_datetime, new Date().toISOString())
                // eq(appointments.ser, type)
            )
        );

    if (existing.length > 0) {
        const busyPetIds = existing.map((row) => row.name);
        throw new ExistingAppointmentConflictError(busyPetIds, type);
    }
};

/**
 *
 * @param appointmentData
 * @param petId
 * @returns
 */
export const saveAppointmentToDb = async ({
    appointmentData,
    petIds,
}: {
    appointmentData: {
        title: string;
        type: "CHECK_UP" | "GROOMING" | "VACCINATION" | "DEWORMING";
        serviceId: string;
        date: string;
        event_datetime: string;
    };
    petIds: string[];
}) => {
    return await dbTx.transaction(async (tx) => {
        // check existing appointment
        if (petIds.length > 0) {
            await validatePetsAvailability(tx, petIds, appointmentData.type);
        }

        const [inserted] = await tx
            .insert(appointments)
            .values({ ...appointmentData })
            .returning();

        let petNames: string[] = [];

        if (petIds.length > 0) {
            // 1. Perform the link
            await tx.insert(appointmentsToPets).values(
                petIds.map((petId) => ({
                    appointmentId: inserted.id,
                    petId,
                    serviceId: appointmentData.serviceId,
                }))
            );

            const selectedPets = await tx
                .select({ name: pets.name })
                .from(pets)
                .where(inArray(pets.id, petIds));

            petNames = selectedPets.map((p) => p.name);
        }

        // Return the appointment data + the pet names
        return {
            ...inserted,
            petNames,
        };
    });
};

export const getAppointments = async ({ id }: { id: string }) => {
    try {
        const response = await db
            .select({
                ...getTableColumns(appointments),
                // Squash the pet data into a single JSON array column
                pets: sql<
                    { id: string; name: string; photoUrl: string | null }[]
                >`
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', ${pets.id}, 
                            'name', ${pets.name}, 
                            'photoUrl', ${pets.photoUrl}
                        )
                    ) FILTER (WHERE ${pets.id} IS NOT NULL), 
                     '[]'
                )`.as("pets"),
            })
            .from(appointments)
            .innerJoin(
                appointmentsToPets,
                eq(appointments.id, appointmentsToPets.appointmentId)
            )
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .where(eq(pets.ownerId, id))
            .groupBy(
                appointments.id,
                appointments.title,
                appointments.event_datetime,
                // appointments.type,
                appointments.created_at,
                appointments.expiredNotification,
                appointments.incomingNotification,
                appointments.invoiceId
            )
            .orderBy(desc(appointments.event_datetime));
        return { data: response, error: null };
    } catch (error) {
        return {
            data: null,
            error: "We're having trouble loading your appointments. Please try again later.",
        };
    }
};

export const getAppointmentsWithType = async ({ id }: { id: string }) => {
    try {
        const appointmentWithTypes = await db
            .select({
                title: appointments.title,
                id: appointments.id,
                event_datetime: appointments.event_datetime,
                serviceType: services.type,
                serviceName: services.title,
                pets: sql<
                    { id: string; name: string; photoUrl: string | null }[]
                >`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ${pets.id}, 
                                'name', ${pets.name}, 
                                'photoUrl', ${pets.photoUrl}
                            )
                        ) FILTER (WHERE ${pets.id} IS NOT NULL), 
                        '[]'
                    )`.as("pets"),
            })
            .from(appointments)
            .leftJoin(
                appointmentsToPets,
                eq(appointments.id, appointmentsToPets.appointmentId)
            )
            .leftJoin(services, eq(appointmentsToPets.serviceId, services.id))
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .where(eq(pets.ownerId, id))
            // Important: You must group by non-aggregated columns
            .groupBy(
                appointments.id,
                services.id, // Grouping by service ensures specific service/type pairs stay together
                services.type,
                services.title
            );

        return { data: appointmentWithTypes, error: null };
    } catch (error) {
        console.error(error); // Always good to log for your own debugging
        return {
            data: null,
            error: "We're having trouble loading your appointments. Please try again later.",
        };
    }
};

export const getNearestAppointment = async ({ id }: { id: string }) => {
    return await db
        .select({
            id: appointments.id,
            title: appointments.title,
            event_datetime: appointments.event_datetime,
            // type: appointments.type,
            pets: sql<{ id: string; name: string; photoUrl: string | null }[]>`
                json_agg(
                    json_build_object(
                        'id', ${pets.id}, 
                        'name', ${pets.name}, 
                        'photoUrl', ${pets.photoUrl}
                    )
                )`,
        })
        .from(appointmentsToPets)
        .innerJoin(
            appointments,
            eq(appointments.id, appointmentsToPets.appointmentId)
        )
        .innerJoin(pets, eq(pets.id, appointmentsToPets.petId))
        .where(
            and(
                eq(pets.ownerId, id),
                gt(appointments.event_datetime, new Date().toISOString())
            )
        )
        .groupBy(appointments.id)
        .orderBy(asc(appointments.event_datetime))
        .limit(1)
        .then((v) => v[0] ?? null);
};

export const getAppointmentsByPet = async (petId: string) => {
    try {
        return await db
            .select({
                ...getTableColumns(appointments),
                serviceType: services.type,
                serviceName: services.title,
            })
            .from(appointments)
            // 1. Join the junction table to the appointment
            .innerJoin(
                appointmentsToPets,
                eq(appointments.id, appointmentsToPets.appointmentId)
            )
            // 2. Join services from the junction table
            .innerJoin(services, eq(appointmentsToPets.serviceId, services.id))
            // 3. Join pets from the junction table
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            // 4. Filter for the specific pet ID here
            .where(eq(pets.id, petId))
            .orderBy(desc(appointments.event_datetime));
    } catch (error) {
        console.error("Query Error:", error);
        return null;
    }
};

export const getAppointment = async ({
    appointmentId,
    ownerId,
}: {
    appointmentId: string;
    ownerId: string;
}) => {
    try {
        return await db
            .select({
                ...getTableColumns(appointments),
                pets: sql<any>`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ${pets.id},
                                'name', ${pets.name},
                                'photoUrl', ${pets.photoUrl},
                                'service', json_build_object(
                                    'id', ${services.id}
                                )
                            )
                        ) FILTER (WHERE ${pets.id} IS NOT NULL),
                        '[]'
                    )`.as("pets"),
            })
            .from(appointments)
            .innerJoin(
                appointmentsToPets,
                eq(appointments.id, appointmentsToPets.appointmentId)
            )
            .innerJoin(
                pets,
                and(
                    eq(appointmentsToPets.petId, pets.id),
                    eq(pets.ownerId, ownerId)
                )
            )
            .innerJoin(services, eq(appointmentsToPets.serviceId, services.id))
            .where(
                and(
                    eq(appointments.id, appointmentId),
                    eq(pets.ownerId, ownerId)
                )
            )
            .groupBy(
                appointments.id,
                appointments.title,
                appointments.event_datetime,
                appointments.created_at,
                appointments.expiredNotification,
                appointments.incomingNotification,
                appointments.invoiceId
            )
            .limit(1)
            .then((v) => v[0]);
    } catch (error) {
        return null;
    }
};

export const getAppointmentWithDetails = async ({ id }: { id: string }) => {
    try {
        const result = await db
            .select({
                id: appointments.id,
                title: appointments.title,
                event_datetime: appointments.event_datetime,
                // Direct selection because there is only one service per appointment
                serviceType: services.type,
                serviceName: services.title,

                // Aggregate only the pets
                pets: sql<
                    { id: string; name: string; photoUrl: string | null }[]
                >`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ${pets.id}, 
                                'name', ${pets.name}, 
                                'photoUrl', ${pets.photoUrl}
                            )
                        ) FILTER (WHERE ${pets.id} IS NOT NULL), 
                        '[]'
                    )`.as("pets"),
            })
            .from(appointments)
            .innerJoin(
                appointmentsToPets,
                eq(appointments.id, appointmentsToPets.appointmentId)
            )
            .innerJoin(services, eq(appointmentsToPets.serviceId, services.id))
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .where(eq(appointments.id, id))
            // Group by everything EXCEPT the pets
            .groupBy(
                appointments.id,
                services.id,
                services.type,
                services.title
            )
            .limit(1);

        return { data: result[0] || null, error: null };
    } catch (error) {
        console.error("Database Error:", error);
        return {
            data: null,
            error: "We're having trouble loading this appointment.",
        };
    }
};

export const getAppointmentSchedules = async (): Promise<
    AppointmentSchedulesTypeModel[] | null
> => {
    try {
        return await db.select().from(appointmentSchedules);
    } catch (error: any) {
        return null;
    }
};

/**
 * Upserts an appointment schedule.
 * @param type - The appointment type (e.g., 'CHECK_UP')
 * @param days - Array of numbers [1, 2, 3...] where 1 is Sunday
 */
export const upsertAppointmentSchedule = async (
    type: AppointmentType,
    days: number[]
) => {
    return await db
        .insert(appointmentSchedules)
        .values({
            appointmentType: type,
            availableDays: days,
        })
        .onConflictDoUpdate({
            target: appointmentSchedules.appointmentType,
            set: {
                availableDays: days,
                updatedAt: new Date(),
            },
        })
        .returning();
};

export const getBlockDates = async (): Promise<
    BlockDatesTypeModel[] | null
> => {
    try {
        return await db.select().from(blockedDates);
    } catch (error: any) {
        return [];
    }
};
