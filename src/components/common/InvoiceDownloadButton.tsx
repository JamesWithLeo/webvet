"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button, Loader } from "@mantine/core";
import { InvoiceDocument } from "./InvoiceDocument";
import { useMemo } from "react";
import { IconDownload } from "@tabler/icons-react";

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

        totalAmount: number;
        id: string;
        userId: string;
        appointmentId: string | null;
        status:
            | "PENDING"
            | "ARRIVED"
            | "COMPLETED"
            | "CANCELLED"
            | "MISSED"
            | "IN_PROGRESS"
            | null;
        paymentStatus: "UNPAID" | "PAID" | "REFUNDED" | "VOID" | null;
        createdAt: Date;
        createdById: string | null;
        // refund
        amountRefunded: number;
        netAmount: number;
        refundMethod: "CASH" | "DIGITAL" | null;
        refundReason: string | null;
        updatedAt: Date | null;
        updatedBy: string | null;
    };
    fullName: string;
};

export default function InvoiceDownloadButton({ data, fullName }: Props) {
    const totalAmount = useMemo(() => {
        // 1. Ensure items exist
        if (!data?.items) return 0;

        // 2. Sum up the prices
        return data.items.reduce((sum, item) => {
            // Convert string decimal to number safely
            const price = parseFloat(item.priceAtInvoice) || 0;
            return sum + price;
        }, 0);
    }, [data.items]);
    return (
        <PDFDownloadLink
            document={<InvoiceDocument data={data} fullName={fullName} />}
            fileName={`invoice-${data.id}.pdf`}
        >
            {({ loading }) => (
                <Button
                    leftSection={<IconDownload size={16} />}
                    disabled={loading}
                    variant="default"
                    size="sm"
                    radius={"md"}
                >
                    {loading ? <Loader size="xs" /> : "Download Receipt"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
