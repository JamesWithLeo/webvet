"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { medicalLogs } from "@/db/schema/medicalLogs";
import { InsertMedicalLog } from "@/lib/validators/newMedicalZodSchema";
import { eq, and } from "drizzle-orm";
import { unauthorized } from "next/navigation";
import {
    invoiceItems,
    invoices,
    invoiceStatus,
    itemStatusEnum,
} from "@/db/schema/invoice";

import { AppointedPet } from "@/types/pets";
export async function CreateMedical(prevState: any, values: InsertMedicalLog) {
    try {
        // 1. Explicitly prepare the data for Drizzle
        const dataToInsert: typeof medicalLogs.$inferInsert = {
            // IDs
            appointmentId: values.appointmentId ?? null,
            petId: values.petId,
            serviceId: values.serviceId,

            // Numeric Decimals (Drizzle decimal expects string)
            weight: values.weight?.toString() ?? "0.00",
            temperature: values.temperature?.toString() ?? null,

            // Text fields
            symptoms: values.symptoms ?? null,
            diagnosis: values.diagnosis ?? null,
            prescription: values.prescription ?? null,
            notes: values.notes,

            // Optional: Get this from your auth session on the server instead!
            // veterinarianId: session.user.id
        };

        // 2. Perform the Upsert
        await db
            .insert(medicalLogs)
            .values(dataToInsert)
            .onConflictDoUpdate({
                target: [
                    medicalLogs.appointmentId,
                    medicalLogs.petId,
                    medicalLogs.serviceId,
                ],
                set: {
                    ...dataToInsert,
                    createdAt: undefined,
                },
            });

        return { success: true, error: "" };
    } catch (e) {
        console.error("Failed to save medical log:", e);
        return { success: false, error: "Database operation failed." };
    }
}

export async function UpdateInvoiceStatus(
    prevState: any,
    data: {
        invoiceId: string;
        status: (typeof invoiceStatus.enumValues)[number];
    }
) {
    const session = await auth();

    if (
        !session ||
        (session.user.role !== "admin" && session.user.role !== "vet")
    ) {
        unauthorized();
    }

    try {
        const updatedInvoice = await db
            .update(invoices)
            .set({
                status: data.status,
            })
            .where(eq(invoices.id, data.invoiceId))
            .returning({ id: invoices.id, status: invoices.status });

        if (updatedInvoice && updatedInvoice.length > 0) {
            return {
                success: true,
                updatedInvoiceId: updatedInvoice[0].id,
                status: updatedInvoice[0].status,
            };
        }
        return { success: false };
    } catch (error) {
        console.error("Start in-progress error:", error);
        return { success: false, error: "Failed to process in-progress" };
    }
}

export async function UpdateInvoiceItemStatus(
    prevState: any,
    data: {
        invoiceItemId: string;
        status: (typeof itemStatusEnum.enumValues)[number];
    }
) {
    const session = await auth();

    if (
        !session ||
        (session.user.role !== "admin" && session.user.role !== "vet")
    ) {
        unauthorized();
    }

    try {
        const updatedInvoiceItem = await db
            .update(invoiceItems)
            .set({
                itemStatus: data.status,
            })
            .where(eq(invoiceItems.id, data.invoiceItemId))
            .returning({
                id: invoiceItems.id,
                itemStatus: invoiceItems.itemStatus,
            });

        if (updatedInvoiceItem && updatedInvoiceItem.length > 0) {
            return {
                success: true,
                updatedInvoiceId: updatedInvoiceItem[0].id,
                itemStatus: updatedInvoiceItem[0].itemStatus,
            };
        }
        return { success: false };
    } catch (error) {
        return { success: false, error: "Failed to mark as complete." };
    }
}

export async function GetMedicalLogAction(
    prevState: any,
    data: {
        appointmentId: string;
        pet: AppointedPet;
        serviceId: string;
    }
) {
    try {
        const log = await db
            .select()
            .from(medicalLogs)
            .where(
                and(
                    eq(medicalLogs.appointmentId, data.appointmentId),
                    eq(medicalLogs.petId, data.pet.id),
                    eq(medicalLogs.serviceId, data.serviceId)
                )
            )
            .limit(1);

        return {
            success: true,
            data: log[0] ?? null,
            appointmentId: data.appointmentId,
            pet: data.pet,
            serviceId: data.serviceId,
        };
    } catch (error) {
        return {
            success: false,
            error: "Could not retrieve medical record.",
            appointmentId: data.appointmentId,
            pet: data.pet,
            serviceId: data.serviceId,
        };
    }
}
