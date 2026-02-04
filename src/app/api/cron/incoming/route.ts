import { db } from "@/db";
import { appointments, appointmentsToPets } from "@/db/schema/appointments";
import { NextResponse } from "next/server";
import { and, gte, lte, eq, sql, inArray } from "drizzle-orm";
import { pets } from "@/db/schema/pets";
import { users } from "@/db/schema/users";
import { qstash } from "@/lib/qtash";

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
                id: appointments.id,
                firstName: users.firstName,
                type: appointments.type,
                userEmail: users.email,
                eventDateTime: appointments.event_datetime,
                pets: sql<{ name: string }[]>`id: string;
                COALESCE(
                    json_agg(
                        json_build_object(
                            'name', ${pets.name}, 
                        )
                    ) FILTER (WHERE ${pets.id} IS NOT NULL), 
                     '[]'
                )`.as("pets"),
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
                    gte(appointments.event_datetime, startWindow),
                    lte(appointments.event_datetime, endWindow),
                    eq(appointments.incomingNotification, false)
                )
            )
            .groupBy(
                appointments.id,
                users.email,
                users.firstName,
                appointments.type,
                appointments.event_datetime
            );

        if (result.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No pending notifications",
            });
        }
        await qstash.batchJSON(
            result.map((item) => {
                const petFormatter = new Intl.ListFormat("en", {
                    style: "long",
                    type: "conjunction",
                });
                const formattedPets = petFormatter.format(
                    item.pets.map((p) => p.name)
                );

                const formattedDate = new Date(
                    item.eventDateTime
                ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                });

                return {
                    url: `https://www.josephmary.me/api/jobs/send-email`,
                    body: {
                        email: item.userEmail,
                        pets: formattedPets,
                        type: item.type,
                        eventDateTime: formattedDate,
                        firstName: item.firstName,
                        id: item.id,
                    },
                    // Optional: delay them it doesn't hit email rate limits
                    delay: 5,
                };
            })
        );
        const processedIds = result.map((item) => item.id);
        await db
            .update(appointments)
            .set({ incomingNotification: true })
            .where(inArray(appointments.id, processedIds));

        return NextResponse.json({
            success: true,
            queued: result.length,
        });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
