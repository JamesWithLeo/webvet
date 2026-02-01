import { db, dbTx } from "@/db";
import {
    appointments,
    appointmentSchedules,
    AppointmentSchedulesTypeModel,
    appointmentsToPets,
    AppointmentType,
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
                gt(appointments.event_datetime, new Date().toISOString()),
                eq(appointments.type, type)
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
        event_datetime: string;
        type: AppointmentType;
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
            .values(appointmentData)
            .returning();

        let petNames: string[] = [];

        if (petIds.length > 0) {
            // 1. Perform the link
            await tx.insert(appointmentsToPets).values(
                petIds.map((petId) => ({
                    appointmentId: inserted.id,
                    petId,
                }))
            );

            // 2. Fetch the names of the pets we just linked
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
                appointments.type,
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

export const getNearestAppointment = async ({ id }: { id: string }) => {
    return await db
        .select({
            id: appointments.id,
            title: appointments.title,
            event_datetime: appointments.event_datetime,
            type: appointments.type,
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
            .select({ ...getTableColumns(appointments) })
            .from(appointments)
            .innerJoin(pets, eq(pets.id, petId))
            .orderBy(desc(appointments.event_datetime));
        // .groupBy(pets.id);
    } catch (error) {
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
            .innerJoin(
                pets,
                and(
                    eq(appointmentsToPets.petId, pets.id),
                    eq(pets.ownerId, ownerId)
                )
            )
            .where(
                and(
                    eq(appointments.id, appointmentId),
                    eq(pets.ownerId, ownerId)
                )
            )
            .groupBy(appointments.id)
            .limit(1)
            .then((v) => v[0]);
    } catch (error) {
        return null;
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
