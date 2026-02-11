import { auth } from "@/auth";
import { db } from "@/db";
import { blockedDates } from "@/db/schema/appointments";
import { getBlockDates } from "@/lib/db/appointments";
import generateBlockPayload from "@/lib/generateBlockPayload";
import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await getBlockDates();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export const POST = auth(async function POST(request) {
    if (!request.auth || request.auth.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { dates, type, reason } = body;
    if (!dates || !Array.isArray(dates) || dates.length === 0) {
        return NextResponse.json(
            { message: "No dates provided" },
            { status: 400 }
        );
    }
    const adminId = request.auth.user.id;

    const dataToInsert = dates.map((dateStr: string) => {
        const payload = generateBlockPayload(dateStr, type);
        return {
            date: payload.date,
            // Force the +08:00 Manila offset for your clinic location
            startTime: payload.startTime.replace("Z", "+08:00"),
            endTime: payload.endTime.replace("Z", "+08:00"),
            reason: reason,
            blockedBy: adminId,
        };
    });

    // Insert multiple rows at once
    try {
        await db.insert(blockedDates).values(dataToInsert);
        // await db.insert(blockedDates).values(dataToInsert);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
});

export const DELETE = auth(async function DELETE(request) {
    if (!request.auth || request.auth.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { dates } = body;

        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            return NextResponse.json(
                { message: "No dates provided" },
                { status: 400 }
            );
        }
        await db.delete(blockedDates).where(inArray(blockedDates.date, dates));

        return NextResponse.json({ success: true, message: "Dates unblocked" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
});
