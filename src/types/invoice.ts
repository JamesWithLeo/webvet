import { InvoiceItemsTypeModel, InvoiceTypeModel } from "@/db/schema/invoice";

export type InvoiceTypeModelWithItems = {
    appointmentTitle: string;
    items: {
        id: string;
        priceAtInvoice: number;
        petName: string;
        serviceTitle: string;
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
    paymentStatus: "UNPAID" | "PAID" | "VOID" | null;
    createdAt: Date;
    createdById: string | null;
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
    paymentStatus: "UNPAID" | "PAID" | "VOID" | null;
    createdAt: Date;
    createdById: string | null;
};

export type InvoiceItemWithPetName = InvoiceItemsTypeModel & {
    petName: string;
};
