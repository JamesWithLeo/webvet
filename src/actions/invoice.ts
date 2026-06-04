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
    markAsVoidInvoiceAdmin,
} from "@/lib/db/invoice";
import { unauthorized } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { resend } from "@/lib/resend";
import PaymentReceived from "@/components/emails/PaymentReceived";
import { formatDateToReadable } from "@/lib/formatDateToReadable";
import CurrencyFormatter from "@/lib/CurrencyFormatter";
import {
    refundSchema,
    RefundSchemaType,
} from "@/lib/validators/refundZodSchema";
import { success } from "zod";

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
    data: {
        id: string | null;
        email: string;
        firstName: string;
        total: number;
        pets: string[];
        paidAt: Date;
    }
) => {
    try {
        const { id, email } = data;
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

        const { error } = await resend.emails.send({
            from: "Joseph and Mary Clinic <no-reply@updates.josephmary.me>",
            to: [email],
            subject: `Payment Received`,
            react: PaymentReceived({
                id: updated.id,
                name: data.firstName,
                amount: CurrencyFormatter(data.total),
                paidAt: formatDateToReadable(data.paidAt),
                pets: data.pets,
            }),
        });
        if (error) {
            console.log("Resend error:", error);
            return {
                success: true,
                id: id,
                emailed: false,
                error: null,
                debug: {
                    code: error.name,
                    message: error.message,
                },
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

        revalidatePath("/v1/clinic/appointments/");
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

export async function MarkAsVoidInvoiceAdmin(
    prevState: any,
    id: string | null
) {
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
        const updated = await markAsVoidInvoiceAdmin(id);

        if (!updated || updated.status !== "VOID") {
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
}

export async function processRefundAction(
    prevData: any,
    values: RefundSchemaType
) {
    const session = await auth();
    if (session?.user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized action, only the admin can perform this action.",
        };
    }
    const validatedFields = refundSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Invalid refund data provided.");
    }

    const { invoiceId, refundAmount, reason, originalTotal, refundMethod } =
        validatedFields.data;

    try {
        // 2. Database Transaction

        await db
            .update(invoices)
            .set({
                updatedBy: session.user.id,
                paymentStatus: "REFUNDED",
                amountRefunded: refundAmount.toString(),
                refundReason: reason,
                refundMethod: refundMethod,
                updatedAt: new Date(),
            })
            .where(eq(invoices.id, invoiceId));

        // 3. Clear Cache for the specific invoice page and the list
        revalidatePath(`/v1/clinic/invoice/${invoiceId}`);
        revalidatePath(`/v1/clinic/invoice/`);

        return { success: true };
    } catch (error) {
        console.error("Database Error:", error);
        return {
            success: false,
            message: "Failed to update the financial record.",
        };
    }
}
