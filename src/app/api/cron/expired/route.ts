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
        const isoNow = now.toISOString();

        // Window for Incoming (Starts 30 mins from now)
        const incomingTarget = new Date(
            now.getTime() + 30 * 60000
        ).toISOString();
        const incomingBuffer = new Date(
            now.getTime() + 32 * 60000
        ).toISOString();

        const result = await db
            .select({
                appointmentId: appointments.id,
                title: appointments.title,
                eventTime: appointments.event_datetime,
                type: appointments.type,
            })
            .from(appointmentsToPets)
            .innerJoin(
                appointments,
                eq(appointmentsToPets.appointmentId, appointments.id)
            )
            // Join the pets table to find out who the pet belongs to
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            // Join the users table to get the owner's details
            .innerJoin(users, eq(pets.ownerId, users.id))
            .where(
                and(
                    gte(appointments.event_datetime, incomingTarget),
                    lte(appointments.event_datetime, incomingBuffer),
                    eq(appointments.expiredNotication, false)
                )
            );

        if (result.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No pending notifications",
            });
        }
        // todo: add push api here

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
