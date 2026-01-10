import { db } from "@/db";
import { appointments, AppointmentType } from "@/db/schema/appointments";
import { pets } from "@/db/schema/pets";
import { eq, getTableColumns } from "drizzle-orm";

export const saveAppointmentToDb = async ({
    title,
    petId,
    event_datetime,
    type,
}: {
    title: string;
    petId: string;
    event_datetime: string;
    type: AppointmentType;
}) => {
    return await db
        .insert(appointments)
        .values({
            title,
            petId: petId,
            event_datetime: event_datetime,
            type: type,
        })
        .returning()
        .then((v) => v[0]);
};

export const getAppointments = async ({ id }: { id: string }) => {
    return await db
        .select({
            breed: pets.breedSpecification,
            event_datetime: appointments.event_datetime,
            id: appointments.id,
            name: pets.name,
            petId: pets.id,
            photoUrl: pets.photoUrl,
            title: appointments.title,
            type: appointments.type,
        })
        .from(appointments)
        .innerJoin(pets, eq(appointments.petId, pets.id))
        .where(eq(pets.ownerId, id));
};
