import { db } from "@/db";
import { appointments, appointmentsToPets } from "@/db/schema/appointments";
import { NextResponse } from "next/server";
import { and, gte, lte, eq, sql } from "drizzle-orm";
import { pets } from "@/db/schema/pets";
import { users } from "@/db/schema/users";
import { qstash } from "@/lib/qtash";
import { services } from "@/db/schema/services";
import { formatDateToReadable } from "@/lib/formatDateToReadable";
import { appointmentStatusValues } from "@/db/schema/enums";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

async function handler(request: Request) {
    try {
        const now = new Date();
        // Lower Bound: Right now (don't notify for past events here)
        const startWindow = now.toISOString();
        // Upper Bound: 60 minutes from now
        // This ensures that even if the 5-minute cron is late, we catch the appointment
        const endWindow = new Date(now.getTime() + 60 * 60000).toISOString();

        const result = await db
            .select({
                id: appointments.id,
                firstName: users.firstName,
                email: users.email,
                eventDateTime: appointments.event_datetime,
                pets: sql<
                    {
                        name: string;
                        type: (typeof appointmentStatusValues)[number];
                    }[]
                >`
                COALESCE(
                    json_agg(
                        json_build_object(
                            'name', ${pets.name},
                            'type', ${services.type}
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
            // 2. Join the services table
            .innerJoin(services, eq(appointmentsToPets.serviceId, services.id))
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
                appointments.event_datetime,
                // 3. Add these to group by so the query doesn't error out
                services.id,
                services.type,
                services.title
            );

        if (result.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No pending notifications",
            });
        }

        await qstash.batchJSON(
            result.map((item) => {
                const formattedDate = formatDateToReadable(item.eventDateTime);

                return {
                    url: "https://www.josephmary.me/api/jobs/mail-incoming",
                    method: "POST" as const,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        email: item.email,
                        petsWithServiceType: item.pets,
                        eventDateTime: formattedDate,
                        firstName: item.firstName,
                        id: item.id,
                    },
                    delay: 5,
                };
            })
        );

        return NextResponse.json({
            success: true,
            queued: result.length,
        });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export const POST =
    process.env.NODE_ENV === "production"
        ? verifySignatureAppRouter(handler)
        : handler;
