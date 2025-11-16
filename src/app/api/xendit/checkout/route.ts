import { NextResponse } from "next/server";
import { Buffer } from "buffer"; // Next.js provides a polyfill for Buffer

export async function POST(req: Request) {
    // ⚠️ Recommended: Validate the incoming body fields here
    const body = await req.json();
    const { email, amount, currency = "PHP" } = body; // Add currency with a default, if appropriate

    // Basic Input Validation
    if (!email || !amount) {
        return NextResponse.json(
            {
                error: "Missing required fields: email, description, and amount.",
            },
            { status: 400 }
        );
    }

    // Ensure XENDIT_SECRET_KEY is defined
    const secretKey = process.env.XENDIT_SECRET_KEY;
    if (!secretKey) {
        console.error("XENDIT_SECRET_KEY environment variable is not set.");
        return NextResponse.json(
            { error: "Server configuration error: Xendit key missing." },
            { status: 500 }
        );
    }

    try {
        // Xendit Basic Auth: Secret Key + Colon (:) encoded in Base64
        const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");

        const response = await fetch("https://api.xendit.co/v2/invoices", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                external_id: `invoice-${Date.now()}`,
                payer_email: email,
                amount: amount,
                currency: currency,
                success_redirect_url: "http://localhost:3000/v1/appointments",
                failure_redirect_url: "http://localhost:3000/v1/",
            }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: "Xendit API Error",
                    details: data,
                },
                { status: response.status }
            );
        }

        // Response contains invoice_url which you need to return to the client
        return NextResponse.json(data);
    } catch (error) {
        console.error("Xendit integration failed:", error);
        return NextResponse.json(
            { error: "Internal server error during payment initiation." },
            { status: 500 }
        );
    }
}
