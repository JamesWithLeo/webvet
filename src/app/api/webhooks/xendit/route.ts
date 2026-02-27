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
import ipRangeCheck from "ip-range-check";

// Official Xendit Webhook IPs
const XENDIT_CIDR_LIST = [
    "44.227.184.232/32",
    "54.213.34.116/32",
    "35.163.225.101/32",
];

export async function POST(req: Request) {
    // 1. Get Client IP from Vercel's Forwarded Header
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "";

    // 2. Verify IP is in Xendit's Range
    if (!ipRangeCheck(clientIp, XENDIT_CIDR_LIST)) {
        console.error(`🚫 Unauthorized IP attempt: ${clientIp}`);
        return new NextResponse("Forbidden: IP not in allowlist", {
            status: 403,
        });
    }

    try {
        const body = await req.json().catch(() => null);
        if (!body) return NextResponse.json({ received: true });

        const { external_id, status } = body;

        if (status === "PAID" && external_id) {
            // Defensive DB update to prevent UUID format crashes
            try {
                await db
                    .update(invoices)
                    .set({ status: "PAID" })
                    .where(eq(invoices.id, external_id));

                console.log(`✅ Invoice ${external_id} verified via IP.`);
            } catch (dbErr) {
                console.error("DB Update Error:", dbErr);
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
