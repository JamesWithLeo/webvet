"use server";

import { auth } from "@/auth";
import { saveServiceToDb } from "@/lib/db/services";
import {
    createServiceSchema,
    ServiceFormInput,
} from "@/lib/validators/serviceZodSchema";
import { unauthorized } from "next/navigation";

export default async function CreateService(
    prevState: any,
    data: ServiceFormInput
) {
    const session = await auth();
    if (!session?.user.id || session.user.role !== "admin") unauthorized();

    const parsed = createServiceSchema.safeParse(data);
    if (!parsed.success) return { succesful: false };

    try {
        const result = await saveServiceToDb(parsed.data);
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
