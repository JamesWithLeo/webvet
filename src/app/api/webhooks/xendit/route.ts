import { db } from "@/db";
import { invoices } from "@/db/schema/invoice";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const callbackToken = req.headers.get("X-CALLBACK-TOKEN");

    if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
        return new NextResponse("Invalid token", { status: 401 });
    }

    try {
        const body = await req.json();
        const { external_id, status } = body;

        if (status === "PAID") {
            await db
                .update(invoices)
                .set({ status: "PAID" })
                .where(eq(invoices.id, external_id));
            console.log(`✅ Invoice ${external_id} marked as PAID.`);
            return NextResponse.json({ received: true }, { status: 200 });
        }
        return NextResponse.json({ received: false }, { status: 200 });
    } catch (error) {
        console.error("Webhook processing failed:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
