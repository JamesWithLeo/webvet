import { NextResponse } from "next/server";
import { getServices, saveServiceToDb } from "@/lib/db/services";
import { createServiceSchema } from "@/lib/validators/serviceZodSchema";

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

        if (!body.serviceData || !body.initialPrice) {
            return NextResponse.json(
                { error: "Missing required data" },
                { status: 400 }
            );
        }

        const newService = await saveServiceToDb({
            serviceData: body.serviceData,
            initialPrice: body.initialPrice,
        });
        if (newService) return NextResponse.json(newService, { status: 201 });
        return NextResponse.json(
            { error: "Failed to create service" },
            { status: 500 }
        );
    } catch (error: any) {
        console.error("API POST Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create service" },
            { status: 500 }
        );
    }
}
