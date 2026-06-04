import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointmentsToPets } from "@/db/schema/appointments";
import { services } from "@/db/schema/services";
import { salesPerService } from "@/lib/db/services";
import { invoiceItems, invoices } from "@/db/schema/invoice";

import { eq, sum, sql, count } from "drizzle-orm";

export async function GET() {
    try {
        const quantityData = await db
            .select({
                date: sql<string>`DATE(${invoices.createdAt})`,
                serviceType: services.type,
                totalQuantity: count(invoiceItems.id),
            })
            .from(invoiceItems)
            .innerJoin(invoices, eq(invoiceItems.invoiceId, invoices.id))
            .innerJoin(services, eq(invoiceItems.serviceId, services.id))
            .groupBy(sql`DATE(${invoices.createdAt})`, services.type)
            .orderBy(sql`DATE(${invoices.createdAt})`);

        const chartDataMap: Record<string, any> = {};

        quantityData.forEach((curr) => {
            const date = curr.date;
            const type = curr.serviceType || "Other";
            const quantity = Number(curr.totalQuantity || 0);

            if (!chartDataMap[date]) {
                chartDataMap[date] = { date };
            }

            chartDataMap[date][type] = quantity;
        });

        return NextResponse.json(Object.values(chartDataMap));
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch uptake data" },
            { status: 500 }
        );
    }
}
