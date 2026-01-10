"use server";

import { auth } from "@/auth";
import { saveAppointmentToDb } from "@/lib/db/appointments";
import {
    AppointmentFormInput,
    newAppointmentSchema,
} from "@/lib/validators/newAppointmentSchema";

export default async function CreateAppointmentAction(
    prevState: any,
    data: AppointmentFormInput
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const parsed = newAppointmentSchema.safeParse(data);
    if (!parsed.success) return { succesful: false };

    try {
        const result = await saveAppointmentToDb(parsed.data);
        if (!result || !result.id) {
            return { succesful: false };
        }

        return { succesful: true, appointmentId: result.id };
    } catch (error: any) {
        const errorCode = error.code || "UNKNOWN_DB_ERR";
        const technicalMessage = error.message;

        return {
            success: false,
            error: "An unexpected database error occurred.",
            debug: {
                code: errorCode,
                message: technicalMessage,
            },
        };
    }
}
