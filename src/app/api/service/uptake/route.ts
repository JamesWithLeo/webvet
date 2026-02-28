import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointmentsToPets } from "@/db/schema/appointments";
import { services } from "@/db/schema/services";
import { count, eq } from "drizzle-orm";

export async function GET() {
    try {
        const uptake = await db
            .select({
                serviceType: services.type,
                source: appointmentsToPets.source,
                count: count(appointmentsToPets.id),
            })
            .from(appointmentsToPets)
            .innerJoin(services, eq(appointmentsToPets.serviceId, services.id))
            .groupBy(services.type, appointmentsToPets.source);

        const chartDataMap: Record<string, any> = {};

        uptake.forEach((curr) => {
            // Use a fallback "Unknown" if serviceType is missing
            const label = curr.serviceType || "Other";
            const source = curr.source;
            const value = Number(curr.count);

            if (!chartDataMap[label]) {
                chartDataMap[label] = {
                    service: label,
                    admin: 0,
                    staff: 0,
                    client: 0,
                };
            }

            // source is "admin" | "staff" | "client"
            chartDataMap[label][source] = value;
        });

        // CRITICAL: Convert the object map back to an array for the RadarChart
        const finalData = Object.values(chartDataMap);

        return NextResponse.json(finalData);
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch uptake data" },
            { status: 500 }
        );
    }
}
