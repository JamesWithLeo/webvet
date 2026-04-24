import { db, dbTx } from "@/db";
import {
    prices,
    ServiceMergePriceType,
    ServicePriceType,
    ServicePriceTypeModel,
    services,
    ServiceTypeModel,
} from "@/db/schema/services";
import { and, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import { AppointmentType } from "@/db/schema/appointments";
import { ServiceVariantFormOutput } from "../validators/serviceVariantSchema";
import { invoiceItems, invoices } from "@/db/schema/invoice";
import { users } from "@/db/schema/users";

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

type ChartRow = {
    month: string;
    matchKey?: string;
    [key: string]: string | number | undefined;
};

export const salesPerService = async (fromStr?: string, toStr?: string) => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // 1. Setup Date Range
    const startRange = fromStr
        ? new Date(fromStr)
        : new Date(currentYear, 0, 1);
    const endRange = toStr
        ? new Date(toStr)
        : new Date(currentYear, 11, 31, 23, 59, 59);

    // Normalize to midnight for consistent comparisons
    startRange.setHours(0, 0, 0, 0);
    endRange.setHours(23, 59, 59, 999);

    // 2. Determine Scale (Daily vs Monthly)
    const diffDays = Math.ceil(
        Math.abs(endRange.getTime() - startRange.getTime()) /
            (1000 * 60 * 60 * 24)
    );
    const isDaily = diffDays <= 31;
    const interval = isDaily ? "day" : "month";

    // 3. Get raw data from DB
    const rawData = await db
        .select({
            // We use sql.raw because date_trunc interval cannot be a bound parameter ($1)
            dateKey:
                sql<string>`date_trunc(${sql.raw(`'${interval}'`)}, ${invoices.createdAt})`.as(
                    "dateKey"
                ),
            serviceTitle: services.title,
            totalRevenue:
                sql<number>`sum(${invoiceItems.priceAtInvoice})`.mapWith(
                    Number
                ),
            quantity: sql<number>`count(${invoiceItems.id})`.mapWith(Number),
        })
        .from(invoiceItems)
        .innerJoin(invoices, eq(invoiceItems.invoiceId, invoices.id))
        .innerJoin(services, eq(invoiceItems.serviceId, services.id))
        .where(
            and(
                eq(invoices.paymentStatus, "PAID"),
                gte(invoices.createdAt, startRange),
                lte(invoices.createdAt, endRange)
            )
        )
        .groupBy(sql`"dateKey"`, services.id, services.title);

    // 4. Generate the Skeleton
    const chartData: ChartRow[] = [];
    const allServiceTitles = new Set<string>();
    let current = new Date(startRange);

    while (current <= endRange) {
        const label = isDaily
            ? current.toLocaleDateString("default", {
                  month: "short",
                  day: "numeric",
              }) // "Mar 1"
            : current.toLocaleDateString("default", {
                  month: "short",
                  year: "numeric",
              }); // "Mar 26"

        const matchKey = isDaily
            ? current.toISOString().split("T")[0] // "2026-03-01"
            : `${current.getMonth()}-${current.getFullYear()}`; // "2-2026"

        chartData.push({
            month: label,
            matchKey: matchKey,
        });

        // Increment logic
        if (isDaily) {
            current.setDate(current.getDate() + 1);
        } else {
            current.setMonth(current.getMonth() + 1);
        }
    }

    // 5. Merge DB Data into Skeleton
    rawData.forEach((row) => {
        const d = new Date(row.dateKey);
        const rowMatchKey = isDaily
            ? d.toISOString().split("T")[0]
            : `${d.getMonth()}-${d.getFullYear()}`;

        const monthEntry = chartData.find((m) => m.matchKey === rowMatchKey);

        if (monthEntry) {
            monthEntry[row.serviceTitle] = row.totalRevenue;
            monthEntry[`${row.serviceTitle}_qty`] = row.quantity;
            allServiceTitles.add(row.serviceTitle);
        }
    });

    // 6. Final Formatting (Add 0s and remove internal keys)
    const finalData = chartData.map((row) => {
        const { matchKey, ...rest } = row;
        const cleanedRow: any = { ...rest };

        allServiceTitles.forEach((title) => {
            if (!(title in cleanedRow)) cleanedRow[title] = 0;
            if (!(`${title}_qty` in cleanedRow)) cleanedRow[`${title}_qty`] = 0;
        });

        return cleanedRow;
    });

    return {
        data: finalData,
        keys: Array.from(allServiceTitles),
    };
};

export const getTransactionalLogs = async (
    fromStr?: string,
    toStr?: string
) => {
    const now = new Date();
    const currentYear = now.getFullYear();

    const startRange = fromStr
        ? new Date(fromStr)
        : new Date(currentYear, 0, 1);
    const endRange = toStr
        ? new Date(toStr)
        : new Date(currentYear, 11, 31, 23, 59, 59);

    return await db
        .select({
            date: invoices.createdAt,
            invoiceId: invoices.id,
            firstName: users.firstName,
            lastName: users.lastName,
            userId: users.id,
            serviceTitle: services.title,
            type: services.type,
            price: invoiceItems.priceAtInvoice,
        })
        .from(invoiceItems)
        .innerJoin(invoices, eq(invoiceItems.invoiceId, invoices.id))
        .innerJoin(services, eq(invoiceItems.serviceId, services.id))
        .innerJoin(users, eq(invoices.userId, users.id))
        .where(
            and(
                eq(invoices.paymentStatus, "PAID"),
                gte(invoices.createdAt, startRange),
                lte(invoices.createdAt, endRange)
            )
        )
        .orderBy(desc(invoices.createdAt));
};
