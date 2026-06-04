import { auth } from "@/auth";
import { getInvoiceAdmin } from "@/lib/db/invoice";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (session?.user.role !== "admin" && session?.user.role !== "staff") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }
        const invoice = await getInvoiceAdmin();

        return NextResponse.json(invoice);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch invoices" },
            { status: 500 }
        );
    }
}
