import { auth } from "@/auth";
import { getAllAppointmentsAdmin } from "@/lib/db/appointments";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const scope =
        (searchParams.get("scope") as "incoming" | "past" | "all") || "all";
    try {
        const session = await auth();
        if (session?.user.role === "client") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 500 }
            );
        }
        const { data, error } = await getAllAppointmentsAdmin(scope);
        if (error) throw new Error(error);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
