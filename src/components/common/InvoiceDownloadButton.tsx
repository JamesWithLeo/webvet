"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button, Loader } from "@mantine/core";
import { InvoiceDocument } from "./InvoiceDocument";

type Props = {
    data: {
        appointmentTitle: string;
        items: {
            petName: string | null;
            serviceTitle: string | null;
            id: string;
            invoiceId: string | null;
            petId: string | null;
            serviceId: string | null;
            priceAtInvoice: string;
        }[];

        id: string;
        userId: string;
        appointmentId: string | null;
        status:
            | "PENDING"
            | "ARRIVED"
            | "COMPLETED"
            | "CANCELLED"
            | "MISSED"
            | null;
        totalAmount: string;
        paymentStatus: "UNPAID" | "PAID" | "VOID" | null;
        createdAt: Date;
        createdById: string | null;
    };
    fullName: string;
};

export default function InvoiceDownloadButton({ data, fullName }: Props) {
    return (
        <PDFDownloadLink
            document={<InvoiceDocument data={data} fullName={fullName} />}
            fileName={`invoice-${data.id}.pdf`}
        >
            {({ loading }) => (
                <Button
                    disabled={loading}
                    variant="default"
                    size="sm"
                    radius={"md"}
                >
                    {loading ? <Loader size="xs" /> : "Download"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
