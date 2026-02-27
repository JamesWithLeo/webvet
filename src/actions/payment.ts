"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getInvoiceWithDetails } from "@/lib/db/invoice";

export async function createPaymentInvoice(prevState: any, invoiceId: string) {
    const session = await auth();
    let checkoutUrl: string | null = null;
    try {
        const invoice = await getInvoiceWithDetails(invoiceId);

        if (!invoice || !session) {
            return {
                success: false,
                error: "Unauthorized or Invoice not found",
            };
        }

        const secretKey = process.env.XENDIT_SECRET_KEY;
        // Important: Xendit requires the secret key followed by a colon, then Base64 encoded
        const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");

        const BASE_URL =
            process.env.NEXT_DEV_APP_URL || "https://www.josephmary.me";

        // Ensure no trailing slash on the base URL for the webhook
        const cleanWebhookUrl = `${BASE_URL.replace(/\/$/, "")}/api/webhooks/xendit`;
        const response = await fetch("https://api.xendit.co/v2/invoices", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                external_id: invoice.id,
                amount: Number(invoice.totalAmount),
                currency: "PHP",
                payer_email: session.user.email,
                // 💡 This "callback_url" is what tells Xendit where to send the "PAID" update
                callback_url: cleanWebhookUrl,
                success_redirect_url: `${BASE_URL}/v1/appointments`,
                failure_redirect_url: `${BASE_URL}/v1/invoices/${invoiceId}`,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Xendit API Error:", data);
            return {
                success: false,
                error: data.message || "Failed to create invoice",
            };
        }

        checkoutUrl = data.invoice_url;
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
