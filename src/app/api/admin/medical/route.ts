import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getVetKanbanData } from "@/lib/db/invoice";

export async function GET() {
    const session = await auth();

    if (
        !session ||
        (session.user.role !== "admin" && session.user.role !== "staff")
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await getVetKanbanData();
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET_MEDICAL_DATA_ERROR", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
