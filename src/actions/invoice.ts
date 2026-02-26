"use server";

import { auth } from "@/auth";
import { dbTx } from "@/db";
import { invoiceItems, invoices } from "@/db/schema/invoice";
import { unauthorized } from "next/navigation";

type SavePropType = {
    userId: string;
    totalAmount: string;
};

type ItemPropType = {
    petId: string;
    priceAtInvoice: string;
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
                petId: item.petId,
                priceAtInvoice: item.priceAtInvoice,
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
