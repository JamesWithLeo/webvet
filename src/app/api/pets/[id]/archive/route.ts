import { db } from "@/db";
import { pets } from "@/db/schema/pets";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { isArchived } = await request.json();

        const [updatedPet] = await db
            .update(pets)
            .set({
                archivedAt: isArchived ? new Date() : null,
            })
            .where(eq(pets.id, id))
            .returning({
                id: pets.id,
                archivedAt: pets.archivedAt,
            });

        if (!updatedPet) {
            return NextResponse.json(
                { error: "Pet not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedPet);
    } catch (error) {
        console.error("Drizzle Update Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
