"use server";

import { auth } from "@/auth";
import { dbTx } from "@/db";
import {
    invoiceItems,
    invoices,
    invoiceStatus,
    paymentStatusType,
} from "@/db/schema/invoice";
import { markAsPaidInvoiceAdmin } from "@/lib/db/invoice";
import { unauthorized } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

type SavePropType = {
    userId: string;
    invoiceId: string;
    totalAmount: string;
    paymentStatus: (typeof paymentStatusType.enumValues)[number];
    appointmentId: string | null;
    status: (typeof invoiceStatus.enumValues)[number];
};

type ItemPropType = {
    petId: string;
    priceAtInvoice: string;
    serviceId: string;
};

type SaveInvoiceResponse =
    | { success: true; invoiceId: string; error: null }
    | { success: false; invoiceId: null; error: string };

export const UpdateInvoice = async (
    prevState: any,
    data: {
        rawInvoice: SavePropType;
        items: ItemPropType[];
    }
): Promise<SaveInvoiceResponse> => {
    if (!data.items || data.items.length === 0) {
        return {
            success: false,
            invoiceId: null,
            error: "Cannot create an invoice with no items.",
        };
    }
    const session = await auth();
    if (
        !session ||
        (session.user.role !== "admin" && session.user.role !== "staff")
    )
        unauthorized();

    try {
        return await dbTx.transaction(async (tx) => {
            const [invoice] = await tx
                .select()
                .from(invoices)
                .where(eq(invoices.id, data.rawInvoice.invoiceId))
                .limit(1);
            if (!invoice) {
                throw new Error("Invoice doesn't exist");
            }

            const itemsToInsert = data.items.map((item) => ({
                invoiceId: invoice.id,
                petId:
                    item.petId && item.petId.trim() !== "" ? item.petId : null,
                priceAtInvoice: item.priceAtInvoice,
                serviceId: item.serviceId,
            }));

            await tx.insert(invoiceItems).values(itemsToInsert);
            await tx
                .update(invoices)
                .set({
                    status: data.rawInvoice.status, // The bill is now finalized
                    paymentStatus: data.rawInvoice.paymentStatus,
                    totalAmount: data.rawInvoice.totalAmount,
                })
                .where(eq(invoices.id, invoice.id));

            return {
                success: true,
                invoiceId: invoice.id,
                error: null,
            };
        });
    } catch (error) {
        console.error("INVOICE_SAVE_ERROR:", error);

        return {
            success: false,
            invoiceId: null,
            error:
                error instanceof Error
                    ? error.message
                    : "An unexpected database error occurred.",
        };
    }
};

export const MarkAsPaidInvoiceAdmin = async (
    prevState: any,
    id: string | null
) => {
    try {
        if (!id)
            return {
                success: false,
                error: "Missing Invoice ID.",
                id: null,
                status: null,
            };

        const session = await auth();
        if (!session || !["admin", "staff"].includes(session.user.role)) {
            unauthorized();
        }

        const updated = await markAsPaidInvoiceAdmin(id);

        if (!updated || updated.status !== "PAID") {
            return {
                success: false,
                error: "The invoice status could not be updated.",
                id: null,
                status: null,
            };
        }

        revalidatePath("/v1/admin/invoice");

        return {
            success: true,
            id: updated.id,
            error: null,
            status: updated.status,
        };
    } catch (error) {
        return {
            success: false,
            error: "A database error occurred.",
            id: null,
            status: null,
        };
    }
};

export async function markAsArrivedAction(
    prevState: any,
    data: {
        appointmentId: string;
        userId: string;
    }
) {
    const { appointmentId, userId } = data;
    const session = await auth();
    if (
        !session ||
        (session.user.role !== "admin" && session.user.role !== "staff")
    ) {
        unauthorized();
    }
    try {
        await dbTx.transaction(async (tx) => {
            const [invoice] = await tx
                .select()
                .from(invoices)
                .where(eq(invoices.appointmentId, appointmentId))
                .limit(1);

            if (invoice) throw new Error("Invoice Exist");

            await tx
                .insert(invoices)
                .values({
                    appointmentId: appointmentId,
                    userId: userId,
                    status: "ARRIVED",
                    paymentStatus: "UNPAID",
                    createdById: session.user.id,
                })
                .returning();
        });

        revalidatePath("/v0/admin/appointments/");
        return { success: true };
    } catch (error) {
        console.error("Check-in error:", error);
        return { success: false, error: "Failed to process arrival" };
    }
}
