import { auth } from "@/auth";
import { getAppointmentToPetsAdmin } from "@/lib/db/appointments";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await auth();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "No appointment id provided" },
                { status: 500 }
            );
        }
        if (session?.user.role === "client") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 500 }
            );
        }

        const { data, error } = await getAppointmentToPetsAdmin(id);
        if (error) throw new Error(error);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
