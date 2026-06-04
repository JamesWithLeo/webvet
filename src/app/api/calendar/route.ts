import { getAppointmentsByStartEnd } from "@/lib/db/appointments";
import { NextResponse } from "next/server";

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

        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
