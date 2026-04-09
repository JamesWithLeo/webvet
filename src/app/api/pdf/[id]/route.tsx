import { renderToStream } from "@react-pdf/renderer";
import InvoiceDocument from "@/components/common/InvoiceDocument";
import { NextResponse } from "next/server";
import { getInvoiceDownloadData } from "@/lib/db/invoice";
import { toTitleCase } from "@/lib/toTitleCase";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: "No appointment id provided" },
            { status: 400 }
        );
    }

    const data = await getInvoiceDownloadData(id);

    const nodeStream = await renderToStream(
        <InvoiceDocument
            data={data}
            fullName={toTitleCase(`${data.firstName} ${data.lastName}`)}
        />
    );

    const webStream = new ReadableStream({
        start(controller) {
            nodeStream.on("data", (chunk) => controller.enqueue(chunk));
            nodeStream.on("end", () => controller.close());
            nodeStream.on("error", (err) => controller.error(err));
        },
    });

    // 3. Return the response with PDF headers
    return new NextResponse(webStream, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="invoice.pdf"',
        },
    });
}
