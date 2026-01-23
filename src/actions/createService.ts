"use server";

import { auth } from "@/auth";
import { saveServiceToDb } from "@/lib/db/services";
import {
    createServiceSchema,
    ServiceFormInput,
    ServiceFormOutput,
} from "@/lib/validators/serviceZodSchema";
import { unauthorized } from "next/navigation";

export default async function CreateService(
    prevState: any,
    data: ServiceFormInput
) {
    const parsed = createServiceSchema.safeParse(data);
    if (!parsed.success) return { succesful: false };

    const session = await auth();
    if (!session?.user.id || session.user.role !== "admin") unauthorized();

    try {
        const { isFlat, flat, small, medium, large, ...rest } = parsed.data;
        const result = await saveServiceToDb({
            serviceData: rest,
            initailPrice: {
                isFlat: isFlat,
                flat: flat,
                small: small,
                medium: medium,
                large: large,
            },
        });
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
