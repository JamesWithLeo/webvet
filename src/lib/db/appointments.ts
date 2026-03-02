import { db, dbTx } from "@/db";
import {
    appointments,
    appointmentSchedules,
    AppointmentSchedulesTypeModel,
    appointmentsToPets,
    AppointmentToPetsTypeModel,
    AppointmentType,
    BlockDatesTypeModel,
    blockedDates,
    BookingSourceType,
} from "@/db/schema/appointments";
import { pets } from "@/db/schema/pets";
import {
    and,
    asc,
    desc,
    eq,
    getTableColumns,
    gt,
    gte,
    inArray,
    lt,
    lte,
    sql,
} from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { toTitleCase } from "../toTitleCase";
import { services } from "@/db/schema/services";
import { users } from "@/db/schema/users";
import { AppointmentFormInput } from "../validators/newAppointmentSchema";
import PetServiceMerged from "@/types/PetsServiceMerged";
import { invoices } from "@/db/schema/invoice";

export class ExistingAppointmentConflictError extends Error {
    public code: string;
    public petIds: string[];

    // FIXED: Added the 'c' to constructor
    constructor(petIds: string[], type: AppointmentType) {
        // We pass the formatted string to the parent Error
        super(
            `Pet/s [${toTitleCase(petIds.join(", "))}] already have ${toTitleCase(type)} appointment.`
        );

        this.name = "ExistingAppointmentConflictError";
        this.code = "Existing Appointment";
        this.petIds = petIds;
    }
}
const validateAllPetsAvailability = async (
    tx: PgTransaction<any, any, any>,
    selections: Record<
        string,
        {
            id: string;
            type: "CHECK_UP" | "GROOMING" | "VACCINATION" | "DEWORMING";
            title: string;
            name: string;
        }[]
    >
) => {
    const allPetIds = Object.keys(selections);
    // Flatten all service types into a unique array
    const allTypes = [
        ...new Set(
            Object.values(selections)
                .flat()
                .map((s) => s.type)
        ),
    ];

    const existing = await tx
        .select({
            petId: appointmentsToPets.petId,
            petName: pets.name,
            // title: appointment,
            title: services.title,
            type: services.type,
            // serviceType: appointments., // Assuming this exists in your schema
        })
        .from(appointmentsToPets)
        .innerJoin(
            appointments,
            eq(appointments.id, appointmentsToPets.appointmentId)
        )
        .innerJoin(services, eq(services.id, appointmentsToPets.serviceId))
        .innerJoin(pets, eq(pets.id, appointmentsToPets.petId))
        .where(
            and(
                inArray(appointmentsToPets.petId, allPetIds),
                inArray(services.type, allTypes),
                gt(appointments.event_datetime, new Date().toISOString())
            )
        );

    if (existing.length > 0) {
        // 1. Group the conflicts
        const conflictsByType: Record<string, string[]> = {};

        for (const row of existing) {
            const t = row.type;
            if (!conflictsByType[t]) conflictsByType[t] = [];
            conflictsByType[t].push(row.petName);
        }

        // 2. Extract the first conflict type
        const firstTypeString = Object.keys(conflictsByType)[0]; // This is a string
        const busyPets = conflictsByType[firstTypeString];

        throw new ExistingAppointmentConflictError(
            busyPets,
            firstTypeString as AppointmentType
        );
    }
};

export const saveAppointmentToDbV2 = async (
    appointmentData: AppointmentFormInput
) => {
    return await dbTx.transaction(async (tx) => {
        // Validate everything first
        await validateAllPetsAvailability(tx, appointmentData.selections);

        // Create a unique appointment record for THIS pet
        const [insertedAppointment] = await tx
            .insert(appointments)
            .values({
                title: appointmentData.title,
                event_datetime: appointmentData.event_datetime,
            })
            .returning();

        const allJoinEntries: Pick<
            AppointmentToPetsTypeModel,
            "appointmentId" | "petId" | "priceAtBooking" | "serviceId"
        >[] = [];
        const petNames: string[] = [];
        const petServices = new Set<string>();

        for (const [petId, servicesData] of Object.entries(
            appointmentData.selections
        )) {
            for (const s of servicesData) {
                petNames.push(s.name);
                petServices.add(toTitleCase(s.type));

                allJoinEntries.push({
                    appointmentId: insertedAppointment.id,
                    petId: petId,
                    serviceId: s.id,
                    priceAtBooking: s.priceAtBooking,
                });
            }
        }

        if (allJoinEntries.length > 0) {
            await tx.insert(appointmentsToPets).values(allJoinEntries);

            return {
                id: insertedAppointment.id,
                petNames: petNames,
                petServices: [...petServices],
            };
        }
    });
};
/**
 * Insert AppointmentToPets row, then return the inserted Id if successful.
 * Throws database errors so the caller (Server Action) can handle them specifically.
 */
export const saveAppointmentToPetsToDbAdmin = async (
    values: Pick<
        AppointmentToPetsTypeModel,
        "petId" | "appointmentId" | "priceAtBooking" | "serviceId" | "source"
    >
) => {
    const [result] = await db
        .insert(appointmentsToPets)
        .values(values)
        .returning({ id: appointmentsToPets.id });

    if (!result) {
        throw new Error("Failed to insert: No record returned");
    }

    return result.id;
};

export const getAppointments = async ({ id }: { id: string }) => {
    try {
        const response = await db
            .select({
                ...getTableColumns(appointments),
                // Squash the pet data into a single JSON array column

                invoiceStatus: invoices.paymentStatus,
                invoiceId: invoices.id,
                pets: sql<
                    {
                        id: string;
                        name: string;
                        photoUrl: string | null;
                        priceAtBooking: string;
                    }[]
                >`
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', ${pets.id}, 
                            'name', ${pets.name}, 
                            'photoUrl', ${pets.photoUrl},
                            'priceAtBooking', ${appointmentsToPets.priceAtBooking}
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
            .leftJoin(invoices, eq(invoices.appointmentId, appointments.id))
            .where(eq(pets.ownerId, id))
            .groupBy(appointments.id, invoices.id)
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
                pets: sql<
                    {
                        id: string;
                        name: string;
                        photoUrl: string | null;
                        type: AppointmentType;
                        title: string;
                        priceAtBooking: string;
                    }[]
                >`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ${pets.id}, 
                                'name', ${pets.name}, 
                                'photoUrl', ${pets.photoUrl},
                                'type', ${services.type},
                                'title', ${services.title},
                                'priceAtBooking', ${appointmentsToPets.priceAtBooking}
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
            .leftJoin(services, eq(services.id, appointmentsToPets.serviceId))
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .where(eq(pets.ownerId, id))
            .groupBy(
                appointments.id,
                services.id // Grouping by service ensures specific service/type pairs stay together
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
            // 1. Add service fields to the selection
            serviceType: services.type,
            serviceName: services.title,
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
        // 2. Join the services table
        .innerJoin(services, eq(services.id, appointmentsToPets.serviceId))
        .where(
            and(
                eq(pets.ownerId, id),
                gt(appointments.event_datetime, new Date().toISOString())
            )
        )
        .groupBy(
            appointments.id,
            // 3. Add service columns to groupBy to satisfy SQL requirements
            services.id,
            services.type,
            services.title
        )
        .orderBy(asc(appointments.event_datetime))
        .limit(1)
        .then((v) => v[0] ?? null);
};

export const getAppointmentHistoryByPet = async (petId: string) => {
    try {
        const now = new Date().toISOString();

        return await db
            .select({
                ...getTableColumns(appointments),
                serviceName: services.title,
                serviceType: services.type,
                paymentStatus: invoices.paymentStatus,
                invoiceId: invoices.id,
            })
            .from(appointments)
            .innerJoin(
                appointmentsToPets,
                eq(appointments.id, appointmentsToPets.appointmentId)
            )
            .innerJoin(services, eq(appointmentsToPets.serviceId, services.id))
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            // Use leftJoin so medical history isn't hidden if an invoice is missing
            .leftJoin(invoices, eq(appointments.id, invoices.appointmentId))
            .where(
                and(
                    eq(pets.id, petId),
                    // Strictly filters for timestamps before or equal to right now
                    lte(appointments.event_datetime, now)
                )
            )
            .orderBy(desc(appointments.event_datetime));
    } catch (error) {
        console.error("Database Error:", error);
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
                appointments.incomingNotification
            )
            .limit(1)
            .then((v) => v[0]);
    } catch (error) {
        return null;
    }
};
export const getAppointmentWithDetails = async ({
    appointmentId,
    ownerId,
}: {
    appointmentId: string;
    ownerId: string;
}) => {
    try {
        const result = await db
            .select({
                id: appointments.id,
                title: appointments.title,
                event_datetime: appointments.event_datetime,
                // Invoice details (will be null if no invoice exists)
                invoice: {
                    id: invoices.id,
                    paymentStatus: invoices.paymentStatus,
                    status: invoices.status,
                    totalAmount: invoices.totalAmount,
                    createdAt: invoices.createdAt,
                },
                pets: sql<
                    {
                        id: string;
                        name: string;
                        photoUrl: string | null;
                        priceAtBooking: string;
                        type: AppointmentType;
                        title: string;
                    }[]
                >`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ${pets.id}, 
                                'name', ${pets.name}, 
                                'photoUrl', ${pets.photoUrl},
                                'priceAtBooking', ${appointmentsToPets.priceAtBooking},
                                'type', ${services.type},
                                'title', ${services.title}
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
            // 1. Add Left Join for Invoice
            .leftJoin(invoices, eq(appointments.id, invoices.appointmentId))
            .where(
                and(
                    eq(appointments.id, appointmentId),
                    eq(pets.ownerId, ownerId)
                )
            )
            // 2. Add invoices.id to groupBy
            .groupBy(appointments.id, invoices.id)
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

export const getAppointmentAdmin = async (id: string) => {
    try {
        const response = await db
            .select({
                // Spreading into objects makes it much cleaner to handle in React
                ...getTableColumns(appointments),
                user: {
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    photoUrl: users.photoUrl,
                    contactNumber: users.contactNumber,
                    email: users.email,
                },
            })
            .from(appointments)
            .innerJoin(
                appointmentsToPets,
                eq(appointments.id, appointmentsToPets.appointmentId)
            )
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .innerJoin(users, eq(pets.ownerId, users.id))
            .where(eq(appointments.id, id))
            .orderBy(desc(appointments.event_datetime))
            .groupBy(appointments.id, users.id)
            .then((v) => v[0]);

        return { data: response, error: null };
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: "Failed to load all appointments for admin.",
        };
    }
};

/**
 *
 * @returns all appointment
 */
export const getAllAppointmentsAdmin = async (
    scope: "incoming" | "past" | "all" = "all"
) => {
    let filters = undefined;
    const now = new Date().toISOString();

    if (scope === "incoming") {
        filters = gte(appointments.event_datetime, now);
    } else if (scope === "past") {
        filters = lt(appointments.event_datetime, now);
    }
    try {
        const response = await db
            .select({
                // Spreading into objects makes it much cleaner to handle in React
                ...getTableColumns(appointments),
                user: {
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    photoUrl: users.photoUrl,
                    contactNumber: users.contactNumber,
                    email: users.email,
                },
                invoice: {
                    id: invoices.id,
                    totalAmount: invoices.totalAmount,
                    paymentStatus: invoices.paymentStatus,
                    createdAt: invoices.createdAt,
                    status: invoices.status,
                },
            })
            .from(appointments)
            .innerJoin(
                appointmentsToPets,
                eq(appointments.id, appointmentsToPets.appointmentId)
            )
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .innerJoin(users, eq(pets.ownerId, users.id))
            .leftJoin(invoices, eq(appointments.id, invoices.appointmentId))
            .where(filters)
            .orderBy(desc(appointments.event_datetime))
            .groupBy(appointments.id, users.id, invoices.id);

        return { data: response, error: null };
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: "Failed to load all appointments for admin.",
        };
    }
};

export const getAppointmentToPetsAdmin = async (id: string) => {
    try {
        const response = await db
            .select({
                pets: sql<PetServiceMerged[]>`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ${appointmentsToPets.id},
                                'petId', ${pets.id}, 
                                'name', ${pets.name}, 
                                'photoUrl', ${pets.photoUrl},
                                'title', ${services.title},
                                'type', ${services.type},
                                'serviceId', ${services.id},
                                'priceAtBooking', ${appointmentsToPets.priceAtBooking},
                                'species', ${pets.species},
                                'weight', ${pets.weight},
                                'source', ${appointmentsToPets.source}
                                
                            )
                        ) FILTER (WHERE ${pets.id} IS NOT NULL), 
                        '[]'
                    )`.as("pets"),
            })
            .from(appointmentsToPets)
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .innerJoin(services, eq(services.id, appointmentsToPets.serviceId))
            .where(eq(appointmentsToPets.appointmentId, id))
            .groupBy(appointmentsToPets.appointmentId)
            .then((v) => v[0]);

        return { data: response, error: null };
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: "Failed to load all appointments for admin.",
        };
    }
};
