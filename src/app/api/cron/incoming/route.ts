import { db } from "@/db";
import { appointments, appointmentsToPets } from "@/db/schema/appointments";
import { NextResponse } from "next/server";
import { and, gte, lte, eq } from "drizzle-orm";
import { pets } from "@/db/schema/pets";
import { users } from "@/db/schema/users";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const now = new Date();
        // Lower Bound: Right now (don't notify for past events here)
        const startWindow = now.toISOString();

        // Upper Bound: 35 minutes from now
        // This ensures that even if the 5-minute cron is late, we catch the appointment
        const endWindow = new Date(now.getTime() + 35 * 60000).toISOString();

        const result = await db
            .select({
                userId: users.id,
                userEmail: users.email,
                appointmentId: appointments.id,
                petName: pets.name,
                eventTime: appointments.event_datetime,
            })
            .from(appointmentsToPets)
            .innerJoin(
                appointments,
                eq(appointmentsToPets.appointmentId, appointments.id)
            )
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .innerJoin(users, eq(pets.ownerId, users.id))
            .where(
                and(
                    gte(appointments.event_datetime, startWindow), // From this second...
                    lte(appointments.event_datetime, endWindow), // ...up to 35 mins away
                    eq(appointments.incomingNotification, false) // But ONLY if not already sent
                )
            );

        if (result.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No pending notifications",
            });
        }
        // add enail here:

        return NextResponse.json({
            success: true,
            count: result.length,
            data: result,
        });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
