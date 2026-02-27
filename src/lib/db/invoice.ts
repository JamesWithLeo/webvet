import { db } from "@/db";
import { invoices } from "@/db/schema/invoice";

export const getInvoiceAdmin = async () => {
    return await db.select().from(invoices);
};
