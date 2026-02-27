// import { db } from "@/db";
// import { invoices } from "@/db/schema/invoice";
// import { eq } from "drizzle-orm";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//     const callbackToken = req.headers.get("x-callback-token");

//     if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
//         return new NextResponse("Unauthorized", { status: 401 });
//     }

//     try {
//         const body = await req.json().catch(() => null);
//         if (!body)
//             return NextResponse.json({ error: "No body" }, { status: 400 });

//         const { external_id, status } = body;

//         // 1. Basic Validation
//         if (status === "PAID" && external_id) {
//             // 2. Wrap DB call to catch UUID format errors
//             try {
//                 const result = await db
//                     .update(invoices)
//                     .set({ status: "PAID" })
//                     .where(eq(invoices.id, external_id))
//                     .returning();

//                 if (result.length > 0) {
//                     console.log(`✅ Invoice ${external_id} updated.`);
//                 } else {
//                     console.warn(
//                         `⚠️ Invoice ID ${external_id} not found in DB.`
//                     );
//                 }
//             } catch (dbError) {
//                 // This catches the "invalid input syntax for type uuid" error
//                 console.error("Database Update Failed:", dbError);
//             }
//         }

//         // 3. Always return 200 to Xendit if the token was valid
//         return NextResponse.json({ received: true }, { status: 200 });
//     } catch (error) {
//         console.error("Webhook Global Error:", error);
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }
import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices } from "@/db/schema/invoice";
import { eq } from "drizzle-orm";

/**
 * Xendit Webhook Source IPs
 * These are the static IPs Xendit uses to send webhooks.
 * We check these instead of a token for a "firewall-style" security layer.
 */
const XENDIT_IPS = new Set([
    "44.227.184.232",
    "54.213.34.116",
    "35.163.225.101",
]);

export async function POST(req: Request) {
    // 1. Extract the real Client IP
    // Vercel populates 'x-forwarded-for'. The first IP in the list is the sender.
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "0.0.0.0";

    // 2. IP Validation
    if (!XENDIT_IPS.has(clientIp)) {
        console.warn(`🚫 Unauthorized IP Attempt: ${clientIp}`);
        // Returning 403 (Forbidden) is the standard response for IP blocks
        return new NextResponse("Forbidden: Unauthorized Source", {
            status: 403,
        });
    }

    try {
        const body = await req.json();
        const { external_id, status } = body;

        // 3. Status Check
        // We only care about PAID events. Ignore 'EXPIRED' or 'SETTLED' for this logic.
        if (status === "PAID" && external_id) {
            const result = await db
                .update(invoices)
                .set({ status: "PAID" })
                .where(eq(invoices.id, external_id))
                .returning();

            if (result.length > 0) {
                console.log(
                    `✅ Webhook Success: Invoice ${external_id} set to PAID`
                );
            } else {
                console.warn(
                    `⚠️ Webhook Received for unknown Invoice ID: ${external_id}`
                );
            }
        }

        // Always return 200 OK to Xendit if the IP was valid.
        // This stops Xendit from retrying the request.
        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        console.error("❌ Webhook JSON Parsing Error:", err);
        return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
    }
}

/**
 * Stop the 303/308 Redirects in Browsers
 * By defining a GET handler, Vercel won't try to redirect the browser
 * to a 'clean' URL or a login page when you test the link.
 */
export async function GET() {
    return new NextResponse("Webhook Node Active: Waiting for Xendit POST...", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
    });
}
