import { InvoiceItemsTypeModel, InvoiceTypeModel } from "@/db/schema/invoice";

export type InvoiceTypeModelWithItems = {
    appointmentTitle: string;
    items: {
        petName: string | null;
        serviceTitle: string | null;
        id: string;
        invoiceId: string;
        petId: string;
        serviceId: string;
        itemStatus: "PENDING" | "COMPLETED" | "CANCELLED";
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

export type InvoiceAdmin = {
    firstName: string | null;
    lastName: string | null;
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

export type InvoiceItemWithPetName = InvoiceItemsTypeModel & {
    petName: string;
};
