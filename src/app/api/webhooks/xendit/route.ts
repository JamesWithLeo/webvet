// import { db } from "@/db";
// import { invoices } from "@/db/schema/invoice";
// import { eq } from "drizzle-orm";
// import { NextResponse } from "next/server";

import { NextResponse } from "next/server";

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
//                 return NextResponse.json(
//                     { received: true, updated: false, body: body },
//                     { status: 200 }
//                 );
//             }
//         }

//         // 3. Always return 200 to Xendit if the token was valid
//         return NextResponse.json(
//             { received: true, body: body },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Webhook Global Error:", error);
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }
export async function POST(req: Request) {
    const body = await req.json();
    console.log("XENDIT WEBHOOK RECEIVED:", body);

    return new NextResponse("OK", { status: 200 });
}
