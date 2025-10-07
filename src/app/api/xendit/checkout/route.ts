// app/api/xendit/checkout/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    try {
        const response = await fetch("https://api.xendit.co/invoices", {
            method: "POST",
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString(
                        "base64"
                    ),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                external_id: `invoice-${Date.now()}`,
                payer_email: body.email,
                description: body.description,
                amount: body.amount,
                success_redirect_url: "http://localhost:3000/v1/dashboard",
                failure_redirect_url: "http://localhost:3000/v1/payment",
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Xendit error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
