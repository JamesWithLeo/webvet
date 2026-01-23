import { db, dbTx } from "@/db";
import {
    appointments,
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

        if (petIds.length > 0) {
            await tx
                .insert(appointmentsToPets)
                .values(
                    petIds.map((petId) => ({
                        appointmentId: inserted.id,
                        petId,
                    }))
                )
                .returning();
        }
        return inserted;
    });
};

export const getAppointments = async ({ id }: { id: string }) => {
    return await db
        .select({
            ...getTableColumns(appointments),
            // Squash the pet data into a single JSON array column
            pets: sql<{ id: string; name: string; photoUrl: string | null }[]>`
      json_agg(
        json_build_object(
          'id', ${pets.id}, 
          'name', ${pets.name}, 
          'photoUrl', ${pets.photoUrl}
        )
      )`,
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
            appointments.expiredNotication,
            appointments.incomingNotification,
            appointments.invoiceId
        )
        .orderBy(desc(appointments.event_datetime));
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
