import { auth } from "@/auth";
import { getInvoiceItemAdmin } from "@/lib/db/invoice";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await auth();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "No appointment id provided" },
                { status: 500 }
            );
        }
        if (
            !session ||
            (session?.user.role !== "admin" && session?.user.role !== "staff")
        ) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 500 }
            );
        }

        const data = await getInvoiceItemAdmin(id);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch invoice item" },
            { status: 500 }
        );
    }
}
