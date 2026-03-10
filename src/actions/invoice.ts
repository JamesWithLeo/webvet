"use server";

import { auth } from "@/auth";
import { db, dbTx } from "@/db";
import {
    invoices,
    invoiceStatus,
    paymentStatusType,
} from "@/db/schema/invoice";
import {
    getInvoiceDownloadData,
    InitializeInvoice,
    markAsPaidInvoiceAdmin,
} from "@/lib/db/invoice";
import { unauthorized } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

type SavePropType = {
    userId: string;
    appointmentId: string;
    status: (typeof invoiceStatus.enumValues)[number];
};

export const CreateInvoice = async (
    prevState: any,
    data: {
        rawInvoice: SavePropType;
        items: {
            priceAtInvoice: string;
            petId: string;
            serviceId: string;
        }[];
    }
) => {
    if (!data.items || data.items.length === 0) {
        return {
            success: false,
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
        const invoice = await InitializeInvoice({
            appointmentId: data.rawInvoice.appointmentId,
            userId: data.rawInvoice.userId,
            status: "ARRIVED",
            createdBy: session.user.id,
            items: data.items,
        });

        if (invoice && invoice.invoiceId)
            return {
                invoiceId: invoice.invoiceId,
                success: true,
                insertedInvoiceItemsLength: invoice.insertedItemsLength,
            };
        else {
            return {
                success: false,
            };
        }
    } catch (error) {
        console.error("INVOICE_SAVE_ERROR:", error);

        return {
            success: false,
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

        revalidatePath("/v1/clinic/invoice");

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

export async function getInvoiceDownloadDataAction(invoiceId: string) {
    try {
        const result = await getInvoiceDownloadData(invoiceId);

        return result || null;
    } catch (error) {
        console.error("Server Action Error:", error);
        throw new Error("Failed to fetch invoice data");
    }
}
