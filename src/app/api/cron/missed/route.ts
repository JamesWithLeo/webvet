import { db } from "@/db";
import { appointments, appointmentsToPets } from "@/db/schema/appointments";
import { NextResponse } from "next/server";
import { and, gte, lte, eq, or, isNull } from "drizzle-orm";
import { pets } from "@/db/schema/pets";
import { users } from "@/db/schema/users";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { invoices } from "@/db/schema/invoice";
import { qstash } from "@/lib/qtash";
import { formatDateToReadable } from "@/lib/formatDateToReadable";

async function handler(request: Request) {
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
                id: appointments.id,
                title: appointments.title,
                event_datetime: appointments.event_datetime,
                email: users.email,
                firstName: users.firstName,
            })
            .from(appointmentsToPets)
            .innerJoin(
                appointments,
                eq(appointmentsToPets.appointmentId, appointments.id)
            )
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .innerJoin(users, eq(pets.ownerId, users.id))
            .leftJoin(invoices, eq(appointments.id, invoices.appointmentId))
            .where(
                and(
                    // 1. It is past the buffer time (it's in the past)
                    lte(appointments.event_datetime, incomingBuffer),
                    // 2. We haven't sent this notification yet
                    eq(appointments.expiredNotification, false),
                    // 3. The "Expired" logic:
                    or(
                        isNull(invoices.id), // No invoice created at all
                        eq(invoices.status, "PENDING") // Invoice exists but they never "Arrived"
                    )
                )
            )
            .groupBy(
                appointments.id,
                invoices.status,
                users.email,
                users.firstName
            );

        if (result.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No pending notifications",
            });
        }

        console.log("Missed appointment:", result.length);
        await qstash.batchJSON(
            result.map((item) => {
                const formattedDate = formatDateToReadable(item.event_datetime);

                return {
                    url: "https://www.josephmary.me/api/jobs/mail-missed",
                    method: "POST" as const,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        email: item.email,
                        eventDateTime: formattedDate,
                        title: item.title,
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
