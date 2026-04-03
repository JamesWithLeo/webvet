import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { toTitleCase } from "@/lib/toTitleCase";
import IncomingAppointmentEmail from "@/components/emails/IncomingAppointmentEmail";
import { db } from "@/db";
import { appointments } from "@/db/schema/appointments";
import { eq } from "drizzle-orm";

async function handler(req: Request) {
    const body = await req.json();
    const { email, petsWithServiceType, firstName, id, eventDateTime } = body;

    if (
        !email ||
        !(
            Array.isArray(petsWithServiceType) &&
            petsWithServiceType.length >= 1
        ) ||
        !firstName ||
        !id ||
        !eventDateTime
    ) {
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
            subject: `Incoming Appointment`,
            react: IncomingAppointmentEmail({
                id: id,
                name: toTitleCase(firstName),
                petsWithServiceType: petsWithServiceType,
                eventDateTime: eventDateTime,
            }),
        });

        if (error) {
            console.error("Resend Error Details:", error);
            throw new Error(error.message);
        }
        await db
            .update(appointments)
            .set({ incomingNotification: true })
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
