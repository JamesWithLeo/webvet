"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { services } from "@/db/schema/services";
import { eq } from "drizzle-orm";
import { unauthorized } from "next/navigation";

export async function DeleteService(id: string) {
    const session = await auth();
    if (!session?.user.id || session.user.role !== "admin") unauthorized();
    try {
        const [response] = await db
            .delete(services)
            .where(eq(services.id, id))
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
