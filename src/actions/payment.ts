"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getInvoiceWithDetails } from "@/lib/db/invoice";
import { Xendit } from "xendit-node";

const xenditClient = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY!,
});

export async function createPaymentInvoice(prevState: any, invoiceId: string) {
    const session = await auth();
    let checkoutUrl: string | null = null; // 1. Store the URL in a variable

    try {
        const invoice = await getInvoiceWithDetails(invoiceId);

        if (!invoice || !session) {
            return {
                success: false,
                error: "Unauthorized or Invoice not found",
            };
        }

        const secretKey = process.env.XENDIT_SECRET_KEY;

        const BASE_URL =
            process.env.NEXT_DEV_APP_URL || "https://www.josephmary.me";

        const response = await xenditClient.Invoice.createInvoice({
            data: {
                externalId: invoice.id,
                amount: Number(invoice.totalAmount),
                currency: "PHP",
                payerEmail: session.user.email ?? undefined,
                successRedirectUrl: `${BASE_URL}/v1/appointments`,
                failureRedirectUrl: `${BASE_URL}/v1/invoices/${invoiceId}`,
            },
        });

        checkoutUrl = response.invoiceUrl;
    } catch (error) {
        console.error("Unexpected error during processing", error);
        return { success: false };
    }

    // 3. 🏆 Redirect outside the try-catch block
    if (checkoutUrl) {
        redirect(checkoutUrl);
    }

    return { success: false };
}
