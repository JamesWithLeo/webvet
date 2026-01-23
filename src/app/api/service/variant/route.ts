import { db } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prices } from "@/db/schema/services";

export const GET = auth(async function GET(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (req.auth.user?.role !== "admin") {
        return NextResponse.json(
            { message: "Forbidden: Admins only" },
            { status: 403 }
        );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ variant: [] });
    try {
        const variant = await db
            .select()
            .from(prices)
            .where(eq(prices.serviceId, id));

        return NextResponse.json(variant);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
});
