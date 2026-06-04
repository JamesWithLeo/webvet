import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllArchivedPets, getAllPets } from "@/lib/db/pets";

export const GET = auth(async function GET(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("id");
    const scope = searchParams.get("scope");

    if (!ownerId || !scope || !["all", "archived"].includes(scope)) {
        return NextResponse.json(
            {
                error: "Missing or invalid parameters",
                details:
                    "ownerId is required and scope must be 'all' or 'archived'.",
            },
            { status: 400 }
        );
    }

    try {
        switch (scope) {
            case "all":
                const all = await getAllPets(ownerId);
                return NextResponse.json(all);
            case "archived":
                const archived = await getAllArchivedPets(ownerId);
                return NextResponse.json(archived);
        }
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch pets" },
            { status: 500 }
        );
    }
});
