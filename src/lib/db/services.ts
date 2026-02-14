import { db, dbTx } from "@/db";
import {
    prices,
    ServiceMergePriceType,
    ServicePriceType,
    ServicePriceTypeModel,
    services,
    ServiceTypeModel,
} from "@/db/schema/services";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { AppointmentType } from "@/db/schema/appointments";
import { ServiceVariantFormOutput } from "../validators/serviceVariantSchema";

export async function saveServiceToDb({
    serviceData,
    initialPrice,
}: {
    serviceData: {
        title: string;
        type: AppointmentType;
        description: string;
        reminder: string;
        species: "dog" | "cat" | null;
        inclusions: string[];
        isFlat: boolean;
    };
    initialPrice: {
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

            if (serviceData.isFlat && initialPrice.flat) {
                priceRows.push({
                    serviceId: inserted.id,
                    variant: "FLAT",
                    price: initialPrice.flat,
                });
            } else {
                // Manually map the specific fields to the DB enum strings
                if (initialPrice.small) {
                    priceRows.push({
                        serviceId: inserted.id,
                        variant: "SMALL",
                        price: initialPrice.small,
                    });
                }
                if (initialPrice.medium) {
                    priceRows.push({
                        serviceId: inserted.id,
                        variant: "MEDIUM",
                        price: initialPrice.medium,
                    });
                }
                if (initialPrice.large) {
                    priceRows.push({
                        serviceId: inserted.id,
                        variant: "LARGE",
                        price: initialPrice.large,
                    });
                }
            }
            if (inserted.id) {
                await tx.insert(prices).values(priceRows).returning();
            }
            return inserted;
        });
    } catch (error: any) {
        console.log(error);
    }
}

export async function updateServiceToDB(
    serviceData: Partial<ServiceTypeModel>
) {
    return await db
        .update(services)
        .set(serviceData)
        .where(eq(services.id, serviceData.id!))
        .returning()
        .then((v) => v[0]);
}

export async function getServices(): Promise<ServiceTypeModel[]> {
    try {
        return await db.select().from(services);
    } catch (error: any) {
        return [];
    }
}

export async function saveVariantToDB(variantData: ServiceVariantFormOutput) {
    return await db
        .insert(prices)
        .values(variantData)
        .returning()
        .then((v) => v[0]);
}
export async function updateVariantToDB(
    variantData: Partial<ServicePriceTypeModel>
) {
    return await db
        .update(prices)
        .set(variantData)
        .where(eq(prices.id, variantData.id!))
        .returning()
        .then((v) => v[0]);
}

export async function getServiceByType(type: AppointmentType) {
    try {
        return await db
            .select({
                ...getTableColumns(services),
                variants: sql<ServicePriceTypeModel[]>`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ${prices.id}, 
                                'price', ${prices.price}, 
                                'variant', ${prices.variant}
                            )
                        ) FILTER (WHERE ${prices.id} IS NOT NULL), 
                        '[]'
                    )`.as("variants"),
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

export const getServicesGrouped = async (): Promise<
    ServiceMergePriceType[]
> => {
    const rows = await db
        .select({
            service: services,
            price: prices,
        })
        .from(services)
        .leftJoin(prices, eq(services.id, prices.serviceId))
        .where(eq(prices.isAvailable, true));

    // Transform flat rows into grouped objects
    const grouped = rows.reduce(
        (acc, row) => {
            const serviceId = row.service.id;

            if (!acc[serviceId]) {
                acc[serviceId] = {
                    ...row.service,
                    variants: [],
                };
            }

            if (row.price) {
                acc[serviceId].variants.push(row.price);
            }

            return acc;
        },
        {} as Record<string, any>
    );

    return Object.values(grouped);
};
