import { db } from "@/db";
import { invoices } from "@/db/schema/invoice";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const callbackToken = req.headers.get("x-callback-token");

    if (!callbackToken || callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json().catch(() => null);

        if (!body) {
            return NextResponse.json(
                { error: "Invalid payload" },
                { status: 400 }
            );
        }

        const { external_id, status } = body;

        if (status === "PAID" && external_id) {
            const result = await db
                .update(invoices)
                .set({ status: "PAID" })
                .where(eq(invoices.id, external_id))
                .returning()
                .then((v) => v[0]);

            if (result) {
                console.log(`✅ Invoice ${external_id} processed.`);
                return NextResponse.json({ received: true }, { status: 200 });
            }
        }

        return NextResponse.json({ received: false }, { status: 200 });
    } catch (error) {
        console.error("Webhook Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
