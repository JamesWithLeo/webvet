"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getInvoiceWithDetails } from "@/lib/db/invoice";
import { revalidatePath } from "next/cache";
import { success } from "zod";

export async function createPaymentInvoice(invoiceId: string) {
    const session = await auth();
    // 1. Fetch the data on the server so it can't be tampered with
    const invoice = await getInvoiceWithDetails(invoiceId);

    if (!invoice || !session) {
        throw new Error("Unauthorized or Invoice not found");
    }
    console.log("Invoice.id", invoice.id);

    const secretKey = process.env.XENDIT_SECRET_KEY;
    const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");

    const BASE_URL =
        process.env.NEXT_DEV_APP_URL || "https://www.josephmary.me";

    const cleanCallbackUrl = `${BASE_URL.replace(/\/$/, "")}/api/webhooks/xendit`;

    // 2. Use the data from your DATABASE, not from the form
    const response = await fetch("https://api.xendit.co/v2/invoices", {
        method: "POST",
        headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            external_id: invoice.id,
            payer_email: session.user.email,
            amount: invoice.totalAmount,
            currency: "PHP",
            callback_url: cleanCallbackUrl,
            // callback_url: `${BASE_URL}/api/webhooks/xendit`,
            success_redirect_url: `${BASE_URL}/v1/appointments`,
            failure_redirect_url: `${BASE_URL}/v1/invoices/${encodeURIComponent(invoiceId)}`,
        }),
    });

    const data = await response.json();

    if (response.ok && data.invoice_url) {
        // revalidatePath(`/v1/invoice/${data.invoice_url}`);
        redirect(data.invoice_url);
        // return { success: true };
        // return { success: true };
    } else {
        console.error("Xendit Error:", data);
        throw new Error("Failed to create payment");
    }
}
