import { db } from "@/db";
import { breeds } from "@/db/schema/pets";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = auth(async function GET(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const speciesTerm = searchParams.get("species");

    // Validation: Ensure species exists and is numeric
    if (!speciesTerm || !/^\d+$/.test(speciesTerm)) {
        return NextResponse.json({ breed: [] });
    }

    try {
        const breedList = await db
            .select({ id: breeds.id, name: breeds.name })
            .from(breeds)
            .where(eq(breeds.petTypeId, parseInt(speciesTerm)))
            .orderBy(asc(breeds.id));

        return NextResponse.json({ breed: breedList });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
});
