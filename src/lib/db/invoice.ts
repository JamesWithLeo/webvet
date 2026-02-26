import { dbTx } from "@/db";
import { invoiceItems, invoices } from "@/db/schema/invoice";

type SavePropType = {
    userId: string;
    totalAmount: string;
    createdById: string;
};

type ItemPropType = {
    petId: string;
    priceAtInvoice: string;
};

export const saveInvoice = async (
    rawInvoice: SavePropType,
    items: ItemPropType[]
) => {
    if (!items || items.length === 0) {
        throw new Error("Cannot create an invoice with no items.");
    }

    try {
        return await dbTx.transaction(async (tx) => {
            const [insertedInvoice] = await tx
                .insert(invoices)
                .values({
                    ...rawInvoice,
                })
                .returning({ id: invoices.id });

            if (!insertedInvoice) {
                throw new Error("Failed to create invoice header.");
            }

            const itemsToInsert = items.map((item) => ({
                invoiceId: insertedInvoice.id,
                petId: item.petId,
                priceAtInvoice: item.priceAtInvoice,
            }));

            await tx.insert(invoiceItems).values(itemsToInsert);

            return {
                invoiceId: insertedInvoice.id,
            };
        });
    } catch (error) {
        console.error("INVOICE_SAVE_ERROR:", error);

        if (error instanceof Error) {
            return { error: error.message };
        }

        return {
            error: "An unexpected database error occurred.",
        };
    }
};
