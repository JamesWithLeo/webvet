import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { services } from "@/db/schema/services";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const body = await request.json();

        console.log("PATCH hit for ID:", id);

        const updatedService = await db
            .update(services)
            .set({
                title: body.title,
                gapInDays: body.gapInDays,
                annualInterval: body.annualInterval,
                description: body.description,
                reminder: body.reminder,
                inclusions: body.inclusions,
            })
            .where(eq(services.id, id))
            .returning();

        return NextResponse.json(updatedService[0]);
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json(
            { error: "Failed to update service" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const deletedService = await db
            .delete(services)
            .where(eq(services.id, id))
            .returning();

        if (deletedService.length === 0) {
            return NextResponse.json(
                { error: "Service not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json(
            { error: "Failed to delete service" },
            { status: 500 }
        );
    }
}
