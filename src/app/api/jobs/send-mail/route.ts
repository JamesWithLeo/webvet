import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { toTitleCase } from "@/lib/toTitleCase";
import IncomingAppointmentEmail from "@/components/emails/IncomingAppointmentEmail";

async function handler(req: Request) {
    const { email, pets, type, firstName, id, eventDateTime } =
        await req.json();

    try {
        console.log(`Sending email to ${email} for ${pets}`);

        const { error } = await resend.emails.send({
            from: "Joseph and Mary Clinic <no-reply@updates.josephmary.me>",
            to: [email],
            subject: `Incoming ${toTitleCase(type)} Appointment`,
            react: IncomingAppointmentEmail({
                type: type,
                id: id,
                name: toTitleCase(firstName!),
                pets: pets,
                eventDateTime: eventDateTime,
            }),
        });
        return NextResponse.json({ delivered: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

// Wrap the handler to verify it's actually from Upstash
export const POST = verifySignatureAppRouter(handler);
