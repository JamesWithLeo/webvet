import { auth } from "@/auth";
import { db } from "@/db";
import { medicalLogs } from "@/db/schema/medicalLogs";
import { pets } from "@/db/schema/pets";
import { services } from "@/db/schema/services";
import { eq, getTableColumns } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
    if (!req.auth) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }
    const { searchParams } = new URL(req.url);
    const petId = searchParams.get("petId");

    if (!petId) {
        return NextResponse.json(
            { error: "Pet ID is required" },
            { status: 400 }
        );
    }

    // 2. Optional: Role check (Vets, Staff, and Admins allowed)
    const role = req.auth.user?.role;
    const allowedRoles = ["admin", "vet", "staff"];

    if (!role || !allowedRoles.includes(role)) {
        return NextResponse.json(
            { error: "Forbidden: Insufficient permissions" },
            { status: 403 }
        );
    }

    try {
        const result = await db
            .select({
                ...getTableColumns(medicalLogs),
                service: services,
            })
            .from(medicalLogs)
            .leftJoin(services, eq(services.id, medicalLogs.serviceId))
            .where(eq(medicalLogs.petId, petId));
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
    }
});
