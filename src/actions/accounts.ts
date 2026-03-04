"use server";

import { db } from "@/db"; // Adjust based on your setup
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import {
    AccountUpdateFormInput,
    accountUpdateSchemaAdmin,
} from "@/lib/validators/usersZodSchema";

export async function updateAccountAction(data: {
    userId: string;
    rawData: Partial<AccountUpdateFormInput>;
}) {
    try {
        const validatedData = accountUpdateSchemaAdmin
            .partial()
            .parse(data.rawData);

        if (Object.keys(validatedData).length === 0) {
            return { success: false, message: "No changes detected." };
        }

        await db
            .update(users)
            .set({
                ...validatedData,
            })
            .where(eq(users.id, data.userId));

        return { success: true };
    } catch (error: any) {
        console.error("Server Action Error:", error);
        return {
            success: false,
            message: error?.message || "Failed to update account.",
        };
    }
}
