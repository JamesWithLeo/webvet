import { db } from "@/db";
import {
    appointments,
    appointmentsToPets,
    AppointmentType,
    AppointmentTypeModel,
} from "@/db/schema/appointments";
import { pets } from "@/db/schema/pets";
import { eq, sql } from "drizzle-orm";

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
    return await db.transaction(async (tx) => {
        const [inserted] = await tx
            .insert(appointments)
            .values(appointmentData)
            .returning();

        if (petIds.length > 0) {
            await tx.insert(appointmentsToPets).values(
                petIds.map((petId) => ({
                    appointmentId: inserted.id,
                    petId,
                }))
            );
        }
        return inserted;
    });
    //     return await db
    //         .insert(appointments)
    //         .values({
    //             title,
    //             event_datetime: event_datetime,
    //             type: type,
    //         })
    //         .returning()
    //         .then((v) => v[0]);
};

export const getAppointments = async ({ id }: { id: string }) => {
    return await db
        .select({
            id: appointments.id,
            title: appointments.title,
            event_datetime: appointments.event_datetime,
            type: appointments.type,
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
        .groupBy(appointments.id);

    // return await db
    //     .select({
    //         breed: pets.breedSpecification,
    //         event_datetime: appointments.event_datetime,
    //         id: appointments.id,
    //         name: pets.name,
    //         petId: pets.id,
    //         photoUrl: pets.photoUrl,
    //         title: appointments.title,
    //         type: appointments.type,
    //     })
    //     .from(appointments)
    //     .innerJoin(pets, eq(appointments.petId, pets.id))
    //     .where(eq(pets.ownerId, id));
};
