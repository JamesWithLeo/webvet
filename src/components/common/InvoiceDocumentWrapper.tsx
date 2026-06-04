"use client";

import dynamic from "next/dynamic";
import { Loader } from "@mantine/core";

const PDFLink = dynamic(
    () => import("@/components/common/InvoiceDownloadButton"),
    {
        ssr: false,
        loading: () => <Loader size="sm" />,
    }
);

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
        paymentStatus: "UNPAID" | "PAID" | "VOID" | "REFUNDED" | null;
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

export default function InvoiceDocumentWrapper({ data, fullName }: Props) {
    return (
        <div className="print-section">
            <PDFLink data={data} fullName={fullName} />
        </div>
    );
}
