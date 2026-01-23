"use server";

import { auth } from "@/auth";
import { saveServiceToDb, saveVariantToDB } from "@/lib/db/services";
import {
    serviceVariantDbSchema,
    ServiceVariantFormOutput,
} from "@/lib/validators/serviceVariantSchema";
import {
    createServiceSchema,
    ServiceFormInput,
} from "@/lib/validators/serviceZodSchema";
import { unauthorized } from "next/navigation";

export default async function CreateVariant(
    prevState: any,
    data: ServiceVariantFormOutput
) {
    const session = await auth();
    if (!session?.user.id || session.user.role !== "admin") unauthorized();

    const parsed = serviceVariantDbSchema.safeParse(data);
    if (!parsed.success) return { succesful: false };

    try {
        const result = await saveVariantToDB(parsed.data);
        if (!result || !result.id) {
            return { succesful: false };
        }

        return { succesful: true, data: result };
    } catch (error: any) {
        const errorCode = error.code || "UNKNOWN_DB_ERR";
        const technicalMessage = error.message;

        return {
            succesful: false,
            error: "An unexpected database error occurred.",
            debug: {
                code: errorCode,
                message: technicalMessage,
            },
        };
    }
}
