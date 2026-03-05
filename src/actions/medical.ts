"use server";

import { auth } from "@/auth";
import { db, dbTx } from "@/db";
import { medicalLogs } from "@/db/schema/medicalLogs";
import { appointmentsToPets } from "@/db/schema/appointments";
import {
    InsertMedicalLog,
    insertMedicalLogSchema,
} from "@/lib/validators/newMedicalZodSchema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { unauthorized } from "next/navigation";
import { invoiceItems, invoices } from "@/db/schema/invoice";
import { prices, ServicePriceType } from "@/db/schema/services";
import { getSizeByWeight } from "@/lib/getSizeByWeight";

export async function CreateMedical(
    prevState: any,
    formData: InsertMedicalLog
) {
    const session = await auth();

    // 1. Guard Clause
    if (
        !session ||
        (session.user.role !== "admin" && session.user.role !== "staff")
    ) {
        return { success: false, error: "Unauthorized" };
    }

    // 2. Validate Data
    const validatedFields = insertMedicalLogSchema.safeParse(formData);
    if (!validatedFields.success) {
        return { success: false, error: "Validation Failed" };
    }

    const {
        appointmentId,
        petId,
        invoiceId,
        weight,
        temperature,
        symptoms,
        serviceId,
        diagnosis,
        prescription,
        notes,
    } = validatedFields.data;

    try {
        await dbTx.transaction(async (tx) => {
            const variantNeeded: ServicePriceType =
                weight && weight > 0 ? getSizeByWeight(weight) : "FLAT";

            // 2. Select the fresh price
            const priceRecords = await tx
                .select()
                .from(prices)
                .where(
                    and(
                        eq(prices.serviceId, serviceId),
                        eq(prices.variant, variantNeeded),
                        eq(prices.isAvailable, true)
                    )
                )
                .limit(1);

            let finalPrice: string;

            if (priceRecords.length > 0) {
                finalPrice = priceRecords[0].price;
            } else {
                const flatRecords = await tx
                    .select()
                    .from(prices)
                    .where(
                        and(
                            eq(prices.serviceId, serviceId),
                            eq(prices.variant, "FLAT"),
                            eq(prices.isAvailable, true)
                        )
                    )
                    .limit(1);

                if (flatRecords.length === 0) {
                    throw new Error(
                        "No available price found for this service."
                    );
                }
                finalPrice = flatRecords[0].price;
            }

            await tx.insert(medicalLogs).values({
                appointmentId: appointmentId ?? null,
                petId: petId,
                serviceId: serviceId,
                weight: weight.toString(),
                temperature: temperature?.toString() || null,
                symptoms: symptoms || null,
                diagnosis: diagnosis || null,
                prescription: prescription,
                notes: notes,
                veterinarianId: session.user.id,
                createdAt: new Date(),
            });

            // 4. Insert into Invoice Items
            // if (invoiceId) {
            //     await tx.insert(invoiceItems).values({
            //         invoiceId: invoiceId,
            //         petId: petId,
            //         serviceId: serviceId,
            //         priceAtInvoice: finalPrice,
            //     });
            // }
        });

        revalidatePath("/v1/admin/medical");
        return { success: true };
    } catch (error) {
        console.error("DATABASE_ERROR:", error);
        return { success: false, error: "Failed to save medical record." };
    }
}

export async function MarkAsInProgressAction(
    prevState: any,
    data: { invoiceId: string }
) {
    const { invoiceId } = data;
    const session = await auth();

    if (
        !session ||
        (session.user.role !== "admin" && session.user.role !== "staff")
    ) {
        unauthorized();
    }

    try {
        // 1. Update the invoice status in the database
        await db
            .update(invoices)
            .set({
                status: "IN_PROGRESS",
                // Optionally track who started the exam
                // updatedById: session.user.id
            })
            .where(eq(invoices.id, invoiceId));

        // 2. Clear the cache for the medical route so the card moves columns
        revalidatePath("/v1/admin/medical");

        return { success: true };
    } catch (error) {
        console.error("Start in-progress error:", error);
        return { success: false, error: "Failed to process in-progress" };
    }
}
export async function MarkAsComplete(
    prevState: any,
    data: { invoiceId: string }
) {
    const { invoiceId } = data;
    const session = await auth();

    if (
        !session ||
        (session.user.role !== "admin" && session.user.role !== "vet")
    ) {
        unauthorized();
    }

    try {
        await db
            .update(invoices)
            .set({
                status: "COMPLETED",
            })
            .where(eq(invoices.id, invoiceId));

        // // 2. Clear the cache for the medical route so the card moves columns
        // revalidatePath("/v1/admin/medical");

        return { success: true };
    } catch (error) {
        console.error("Start in-progress error:", error);
        return { success: false, error: "Failed to process in-progress" };
    }
}
