import MissedAppointmentEmail from "@/components/emails/MissedAppointmentEmail";
import { db } from "@/db";
import { appointments } from "@/db/schema/appointments";
import { formatDateToReadable } from "@/lib/formatDateToReadable";
import { resend } from "@/lib/resend";
import { toTitleCase } from "@/lib/toTitleCase";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function handler(req: Request) {
    const body = await req.json();

    const { title, id, event_datetime, email, firstName } = body;

    if (!title || !id || !event_datetime || !email || !firstName) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    try {
        console.log(`Attempting email for Appointment ${id} to ${email}`);

        const { error } = await resend.emails.send({
            from: "Joseph and Mary Clinic <no-reply@updates.josephmary.me>",
            to: [email],
            subject: `Expired Appointment`,
            react: MissedAppointmentEmail({
                id: id,
                name: toTitleCase(firstName),
                eventDateTime: formatDateToReadable(event_datetime),
                title: toTitleCase(title),
            }),
        });

        if (error) {
            console.error("Resend Error Details:", error);
            throw new Error(error.message);
        }
        await db
            .update(appointments)
            .set({ expiredNotification: true })
            .where(eq(appointments.id, id));

        return NextResponse.json({ delivered: true });
    } catch (error) {
        console.error("Handler Exception:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export const POST = verifySignatureAppRouter(handler);
