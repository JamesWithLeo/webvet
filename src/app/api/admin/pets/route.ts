import { auth } from "@/auth";
import { getAllPetsAdmin } from "@/lib/db/pets";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await auth();
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page")) || 1;
        const pageSize = Number(searchParams.get("pageSize")) || 10;
        const highlight = searchParams.get("highlight");

        if (session?.user.role !== "admin" && session?.user.role !== "staff") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const result = await getAllPetsAdmin(page, pageSize, highlight);
        if (result.error) throw new Error(result.error);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch petss" },
            { status: 500 }
        );
    }
}
