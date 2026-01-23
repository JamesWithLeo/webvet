import { db, dbTx } from "@/db";
import {
    prices,
    ServicePriceType,
    ServicePriceTypeModel,
    servicePriceVariant,
    services,
} from "@/db/schema/services";
import { ServiceFormOutput } from "../validators/serviceZodSchema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { AppointmentType } from "@/db/schema/appointments";

export async function saveServiceToDb({
    serviceData,
    initailPrice,
}: {
    serviceData: {
        title: string;
        type: AppointmentType;
        description: string;
        reminder: string;
        inclusions: string[];
    };
    initailPrice: {
        isFlat: boolean;
        flat: string | undefined;
        small: string | undefined;
        medium: string | undefined;
        large: string | undefined;
    };
}) {
    try {
        return await dbTx.transaction(async (tx) => {
            const [inserted] = await tx
                .insert(services)
                .values(serviceData)
                .returning();
            const priceRows: {
                serviceId: string;
                variant: ServicePriceType;
                price: string;
            }[] = [];

            if (initailPrice.isFlat && initailPrice.flat) {
                priceRows.push({
                    serviceId: inserted.id,
                    variant: "FLAT",
                    price: initailPrice.flat,
                });
            } else {
                // Manually map the specific fields to the DB enum strings
                if (initailPrice.small) {
                    priceRows.push({
                        serviceId: inserted.id,
                        variant: "SMALL",
                        price: initailPrice.small,
                    });
                }
                if (initailPrice.medium) {
                    priceRows.push({
                        serviceId: inserted.id,
                        variant: "MEDIUM",
                        price: initailPrice.medium,
                    });
                }
                if (initailPrice.large) {
                    priceRows.push({
                        serviceId: inserted.id,
                        variant: "LARGE",
                        price: initailPrice.large,
                    });
                }
            }
            if (inserted.id) {
                await tx.insert(prices).values(priceRows).returning();
            }
            return inserted;
        });
    } catch (error: any) {}
}

export async function getServices() {
    try {
        return await db.select().from(services);
    } catch (error: any) {
        return [];
    }
}

export async function saveVariantToDB(variantData: {
    variant: (typeof servicePriceVariant)[number];
    serviceId: string;
    isAvailable: boolean;
    price: string;
}) {
    return await db
        .insert(prices)
        .values(variantData)
        .returning()
        .then((v) => v[0]);
}

export async function getServiceByType(type: AppointmentType) {
    try {
        return await db
            .select({
                ...getTableColumns(services),
                prices: sql<ServicePriceTypeModel[]>`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ${prices.id}, 
                                'price', ${prices.price}, 
                                'variant', ${prices.variant}
                            )
                        ) FILTER (WHERE ${prices.id} IS NOT NULL), 
                        '[]'
                    )`.as("prices"),
            })
            .from(services)
            .leftJoin(prices, eq(prices.serviceId, services.id))
            .where(eq(services.type, type))
            .groupBy(services.id);
    } catch (error: any) {
        console.error("Error fetching services:", error);
        return [];
    }
}
