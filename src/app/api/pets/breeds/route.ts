import { db } from "@/db";
import { breeds, speciesEnum } from "@/db/schema/pets";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = auth(async function GET(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const speciesTerm = searchParams.get("species");

    if (
        !speciesTerm ||
        !speciesEnum.enumValues.includes(speciesTerm.toLowerCase() as any)
    ) {
        return NextResponse.json({ breed: [] });
    }
    const species =
        speciesTerm.toLocaleLowerCase() as (typeof speciesEnum.enumValues)[number];

    try {
        const breedList = await db
            .select({ id: breeds.id, name: breeds.name })
            .from(breeds)
            .where(eq(breeds.species, species));

        return NextResponse.json({ breed: breedList });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
});
