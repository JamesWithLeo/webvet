import { db } from "@/db";
import {
    servicePrices,
    servicePriceVariant,
    services,
} from "@/db/schema/services";
import { ServiceFormOutput } from "../validators/serviceZodSchema";

export async function saveServiceToDb(serviceData: ServiceFormOutput) {
    return await db
        .insert(services)
        .values(serviceData)
        .returning()
        .then((v) => v[0]);
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
        .insert(servicePrices)
        .values(variantData)
        .returning()
        .then((v) => v[0]);
}
