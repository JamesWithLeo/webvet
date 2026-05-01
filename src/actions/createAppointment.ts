"use server";

import { auth } from "@/auth";
import AppointmentSaved from "@/components/emails/AppointmentSaved";
import { saveAppointmentToDbV2 } from "@/lib/db/appointments";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    CreateAppointmentPayload,
    newAppointmentSchema,
} from "@/lib/validators/newAppointmentSchema";
import { unauthorized } from "next/navigation";
import { resend } from "@/lib/resend";
import LongItemFormatter from "@/lib/LongItemFormatter";
import { formatDateToReadable } from "@/lib/formatDateToReadable";

/**
 *
 *
 * In this action we're inserting appointment to the db,
 * existing appointment will not apply and
 * email the user if succesful,
 */

export default async function CreateAppointmentAction(
    prevState: any,
    data: CreateAppointmentPayload
) {
    const session = await auth();
    if (!session?.user?.id) unauthorized();

    const parsed = newAppointmentSchema.omit({ date: true }).safeParse(data);
    if (!parsed.success)
        return {
            successful: false,
            error: "Appointment Data failed the validation",
        };

    try {
        const result = await saveAppointmentToDbV2(parsed.data);
        if (!result || !result.id) {
            return { successful: false };
        }
        const email = session.user.email;
        const firstName = session.user.firstName;
        if (!email) return { succesful: true, emailed: false };

        const formattedServices = LongItemFormatter(result.petServices);

        const { error } = await resend.emails.send({
            from: "Joseph and Mary Clinic <no-reply@updates.josephmary.me>",
            to: [email],
            subject: `${toTitleCase(formattedServices)} Appointment`,
            react: AppointmentSaved({
                id: result.id,
                type: formattedServices,
                name: firstName ? toTitleCase(firstName) : "lovely fur parent",
                pets: result.petNames.join(", "),
                eventDateTime: formatDateToReadable(result.event_datetime),
            }),
        });
        if (error) {
            return {
                successful: true,
                appointmentId: result.id,
                emailed: false,
                debug: {
                    code: error.name,
                    message: error.message,
                },
            };
        }

        return { successful: true, appointmentId: result.id, emailed: true };
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
