import { db } from "@/db";
import { appointments, AppointmentType } from "@/db/schema/appointments";

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
