import { auth } from "@/auth";
import { getAllPetsAdmin } from "@/lib/db/pets";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (session?.user.role !== "admin" && session?.user.role !== "staff") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const { data, error } = await getAllPetsAdmin();
        if (error) throw new Error(error);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch petss" },
            { status: 500 }
        );
    }
}
