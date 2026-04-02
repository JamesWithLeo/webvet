import { auth } from "@/auth";
import { getAppointmentToPetsAdmin } from "@/lib/db/appointments";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role === "client") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "No appointment id provided" },
                { status: 400 }
            );
        }

        const { data, error } = await getAppointmentToPetsAdmin(id);
        if (error) throw new Error(error);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
