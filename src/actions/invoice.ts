"use server";

import { auth } from "@/auth";
import { dbTx } from "@/db";
import { invoiceItems, invoices, paymentStatusType } from "@/db/schema/invoice";
import { markAsPaidInvoiceAdmin } from "@/lib/db/invoice";
import { unauthorized } from "next/navigation";
import { revalidatePath } from "next/cache";

type SavePropType = {
    userId: string;
    totalAmount: string;
    status: (typeof paymentStatusType.enumValues)[number];
    appointmentId: string;
};

type ItemPropType = {
    petId: string;
    priceAtInvoice: string;
    serviceId: string;
};

type SaveInvoiceResponse =
    | { success: true; invoiceId: string; error: null }
    | { success: false; invoiceId: null; error: string };

export const CreateInvoice = async (
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
            const [insertedInvoice] = await tx
                .insert(invoices)
                .values({
                    createdById: session.user.id,
                    ...data.rawInvoice,
                })
                .returning({ id: invoices.id });

            if (!insertedInvoice) {
                throw new Error("Failed to create invoice header.");
            }

            const itemsToInsert = data.items.map((item) => ({
                invoiceId: insertedInvoice.id,
                petId:
                    item.petId && item.petId.trim() !== "" ? item.petId : null,
                priceAtInvoice: item.priceAtInvoice,
                serviceId: item.serviceId,
            }));

            await tx.insert(invoiceItems).values(itemsToInsert);

            return {
                success: true,
                invoiceId: insertedInvoice.id,
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
