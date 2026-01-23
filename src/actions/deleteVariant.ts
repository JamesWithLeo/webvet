"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { prices } from "@/db/schema/services";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { unauthorized } from "next/navigation";

export async function DeleteVariant(id: string) {
    const session = await auth();
    if (!session?.user.id || session.user.role !== "admin") unauthorized();
    try {
        await db.delete(prices).where(eq(prices.id, id));
        return { succesful: true };
    } catch (error: any) {
        return { succesful: false };
    }
}
