import { getAppointmentsByStartEnd } from "@/lib/db/appointments";
import { NextResponse } from "next/server";

const MAX_CAPACITY = 3;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
        return NextResponse.json(
            { error: "Missing start/end" },
            { status: 400 }
        );
    }

    try {
        const response = await getAppointmentsByStartEnd(start, end);

        if (!response || "error" in response || !response.data) {
            return NextResponse.json([], { status: 200 });
        }

        // --- Transformation Logic ---
        const hourlyCount: Record<string, number> = {};

        response.data.forEach((apt: any) => {
            // 1. Database gives: "2026-05-01 13:00:00+00"
            const d = new Date(apt.event_datetime);
            if (isNaN(d.getTime())) return;

            // 2. Physically move the clock 8 hours forward to Manila time
            // 13:00 UTC becomes 21:00 (9:00 PM) Manila?
            // WAIT: If 13:00 UTC IS the correct Manila time, don't add 8!
            // But if 13:00 UTC is actually 9:00 PM Manila, then 13:00 is correct.

            // Use Intl to get the EXACT local hour in Manila
            const formatter = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Manila",
                hour12: false,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
            });

            const parts = formatter.formatToParts(d);
            const get = (type: string) =>
                parts.find((p) => p.type === type)?.value;

            // Construct: YYYY-MM-DDTHH:00:00 (Floating time)
            // This string has NO timezone info, so the browser won't shift it.
            const slotKey = `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:00:00`;

            hourlyCount[slotKey] = (hourlyCount[slotKey] || 0) + 1;
        });

        const timeEvents = Object.entries(hourlyCount).map(([slot, count]) => {
            const isFull = count >= MAX_CAPACITY;

            // Calculate 1 hour gap for the 'end' property
            const startDate = new Date(slot);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
            const endSlot =
                endDate.getFullYear() +
                "-" +
                String(endDate.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(endDate.getDate()).padStart(2, "0") +
                "T" +
                String(endDate.getHours()).padStart(2, "0") +
                ":00:00";

            return {
                id: `time-${slot}`,
                title: `(${count}/${MAX_CAPACITY}) Slots`,
                start: slot,
                end: endSlot,
                display: "block",
                date: slot,
                backgroundColor: isFull ? "#e03131" : "#14678f",
                borderColor: isFull ? "#c92a2a" : "#0e4a68",
                textColor: "#ffffff",
                extendedProps: { count, isFull },
            };
        });

        return NextResponse.json(timeEvents);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
