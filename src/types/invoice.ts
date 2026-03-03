import { InvoiceTypeModel } from "@/db/schema/invoice";

export type InvoiceTypeModelWithTotal = InvoiceTypeModel & {
    totalAmount: number;
};
