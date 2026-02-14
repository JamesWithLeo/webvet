"use server";

import { auth } from "@/auth";
import AppointmentSaved from "@/components/emails/AppointmentSaved";
import { saveAppointmentToDb } from "@/lib/db/appointments";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    AppointmentFormInput,
    newAppointmentSchema,
} from "@/lib/validators/newAppointmentSchema";
import { unauthorized } from "next/navigation";
import { resend } from "@/lib/resend";

/**
 *
 *
 * In this action we're inserting appointment to the db,
 * existing appointment will not apply and
 * email the user if succesful,
 */
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
        const email = session.user.email;
        const firstName = session.user.firstName;
        if (!email) return { succesful: true, emailed: false };

        const { error } = await resend.emails.send({
            from: "Joseph and Mary Clinic <no-reply@updates.josephmary.me>",
            to: [email],
            subject: `${toTitleCase(data.type)} Appointment`,
            react: AppointmentSaved({
                id: result.id,
                type: data.type,
                name: firstName ? toTitleCase(firstName) : "lovely fur parent",
                pets: result.petNames.join(", "),
            }),
        });
        if (error) {
            return {
                succesful: true,
                appointmentId: result.id,
                emailed: false,
                debug: {
                    code: error.name,
                    message: error.message,
                },
            };
        }

        return { succesful: true, appointmentId: result.id, emailed: true };
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
