"use server";

import { auth } from "@/auth";
import { saveVariantToDB, updateVariantToDB } from "@/lib/db/services";
import {
    serviceVariantDbSchema,
    serviceVariantFormInput,
    serviceVariantSchema,
} from "@/lib/validators/serviceVariantSchema";
import { db } from "@/db";
import { prices } from "@/db/schema/services";
import { eq } from "drizzle-orm";
import { unauthorized } from "next/navigation";

export async function CreateVariant(
    prevState: any,
    data: serviceVariantFormInput
) {
    const session = await auth();
    if (!session?.user.id || session.user.role !== "admin") unauthorized();

    const parsed = serviceVariantSchema.safeParse(data);
    if (!parsed.success)
        return {
            succesful: false,
            error: "Variant Data failed the validation",
        };

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

export async function EditVariant(
    prevState: any,
    data: serviceVariantFormInput & { id: string }
) {
    const session = await auth();
    if (!session?.user.id || session.user.role !== "admin") unauthorized();

    const parsed = serviceVariantDbSchema.safeParse(data);
    if (!parsed.success)
        return {
            succesful: false,
            error: "Variant Data failed the validation",
        };

    try {
        const result = await updateVariantToDB(parsed.data);
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

export async function DeleteVariant(id: string) {
    const session = await auth();
    if (!session?.user.id || session.user.role !== "admin") unauthorized();
    try {
        const [response] = await db
            .delete(prices)
            .where(eq(prices.id, id))
            .returning();
        if (!response.id) {
            console.log(response);
            return {
                succesful: false,
                error: "An unexpected database error occurred.",
            };
        }
        return { succesful: true, data: response };
    } catch (error: any) {
        return {
            succesful: false,
            error: "An unexpected database error occurred.",
        };
    }
}
