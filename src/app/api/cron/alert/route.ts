import { db } from "@/db";
import { appointmentsToPets } from "@/db/schema/appointments";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const result = await db.select().from(appointmentsToPets);
        if (result.length === 0) {
            return NextResponse.json({ success: false });
        }
    } catch (error) {
        return NextResponse.json({ success: false });
    }

    return NextResponse.json({ succcess: true });
}
