"use server";

import { auth } from "@/auth";
import { saveAppointmentToDb } from "@/lib/db/appointments";
import {
    AppointmentFormInput,
    newAppointmentSchema,
} from "@/lib/validators/newAppointmentSchema";
import { unauthorized } from "next/navigation";

export default async function CreateAppointmentAction(
    prevState: any,
    data: AppointmentFormInput
) {
    const session = await auth();
    if (!session?.user?.id) unauthorized();

    const parsed = newAppointmentSchema.safeParse(data);
    if (!parsed.success) return { succesful: false };

    try {
        const { petIds, ...appintmentData } = parsed.data;

        const result = await saveAppointmentToDb({
            petIds: petIds,
            appointmentData: appintmentData,
        });
        if (!result || !result.id) {
            return { succesful: false };
        }

        // might add email notification here .

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
