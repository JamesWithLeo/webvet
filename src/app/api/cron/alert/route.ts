import { db } from "@/db";
import { appointments, appointmentsToPets } from "@/db/schema/appointments";
import { NextResponse } from "next/server";
import { and, gte, lte, eq } from "drizzle-orm";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    console.log("Header received:", authHeader);
    console.log("Secret expected:", process.env.CRON_SECRET);
    // 2. Get the secret and trim it
    const cronSecret = (process.env.CRON_SECRET || "").trim();
    const expectedHeader = `Bearer ${cronSecret}`;

    // 3. Log the lengths to catch "invisible" characters
    console.log(`Received length: ${authHeader?.length}`);
    console.log(`Expected length: ${expectedHeader.length}`);
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
