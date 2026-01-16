import { db } from "@/db";
import { appointments, appointmentsToPets } from "@/db/schema/appointments";
import { NextResponse } from "next/server";
import { and, gte, lte, eq } from "drizzle-orm";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    console.log("1. Full Auth Header:", authHeader);
    console.log("2. CRON_SECRET length:", process.env.CRON_SECRET?.length);
    console.log(
        "3. Expected start:",
        `Bearer ${process.env.CRON_SECRET?.substring(0, 3)}...`
    );
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const now = new Date();
        const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);

        const startWindow = now.toISOString();
        const endWindow = fiveMinutesLater.toISOString();

        const result = await db
            .select({
                appointmentId: appointments.id,
                title: appointments.title,
                eventTime: appointments.event_datetime,
                petId: appointmentsToPets.petId,
            })
            .from(appointmentsToPets)
            .innerJoin(
                appointments,
                eq(appointmentsToPets.appointmentId, appointments.id)
            )
            .where(
                and(
                    gte(appointments.event_datetime, startWindow),
                    lte(appointments.event_datetime, endWindow),
                    eq(appointmentsToPets.notified, false)
                )
            );

        if (result.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No pending notifications",
            });
        }

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
