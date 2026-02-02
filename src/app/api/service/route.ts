// src/app/api/services/route.ts
import { NextResponse } from "next/server";
import { getServices, saveServiceToDb } from "@/lib/db/services";

export async function GET() {
    try {
        const data = await getServices();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.serviceData || !body.initailPrice) {
            return NextResponse.json(
                { error: "Missing required data" },
                { status: 400 }
            );
        }
        const newService = await saveServiceToDb({
            serviceData: body.serviceData,
            initailPrice: body.initailPrice,
        });

        return NextResponse.json(newService, { status: 201 });
    } catch (error: any) {
        console.error("API POST Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create service" },
            { status: 500 }
        );
    }
}
