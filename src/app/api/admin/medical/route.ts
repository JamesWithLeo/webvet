import { NextRequest, NextResponse } from "next/server";
import { getVetKanbanData } from "@/lib/db/invoice";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    const session = await auth();

    if (
        !session ||
        (session.user.role !== "admin" && session.user.role !== "staff")
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    try {
        // Pass the dates to your DB function
        const data = await getVetKanbanData(from, to);
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET_MEDICAL_DATA_ERROR", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
