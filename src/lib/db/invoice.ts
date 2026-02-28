import { db } from "@/db";
import { appointments } from "@/db/schema/appointments";
import { invoiceItems, invoices } from "@/db/schema/invoice";
import { pets } from "@/db/schema/pets";
import { services } from "@/db/schema/services";
import { eq, sum } from "drizzle-orm";

export const getInvoiceAdmin = async () => {
    return await db.select().from(invoices);
};

export const getInvoiceItemAdmin = async (id: string) => {
    return await db
        .select()
        .from(invoiceItems)
        .where(eq(invoiceItems.invoiceId, id));
};

export const markAsPaidInvoiceAdmin = async (id: string) => {
    return await db
        .update(invoices)
        .set({ status: "PAID" })
        .where(eq(invoices.id, id))
        .returning({ id: invoices.id, status: invoices.status })
        .then((v) => v[0]);
};

export const getInvoiceWithDetails = async (id: string) => {
    const rows = await db
        .select({
            invoice: invoices,
            item: invoiceItems,
            appointmentTitle: appointments.title,
            petName: pets.name,
            serviceTitle: services.title,
        })
        .from(invoices)
        // 1. Join the items to the invoice
        .leftJoin(invoiceItems, eq(invoices.id, invoiceItems.invoiceId))
        // 2. Join the pet to the item
        .leftJoin(pets, eq(invoiceItems.petId, pets.id))
        // 3. Join the service to the item
        .leftJoin(services, eq(invoiceItems.serviceId, services.id))
        .innerJoin(appointments, eq(appointments.id, invoices.appointmentId))
        .where(eq(invoices.id, id));

    if (rows.length === 0) return null;

    // Aggregate the flat rows into a single object with an items array
    const invoice = rows[0].invoice;
    const appointmentTitle = rows[0].appointmentTitle;

    const items = rows
        .filter((r) => r.item !== null) // Handle case where invoice has 0 items
        .map((r) => ({
            ...r.item!,
            petName: r.petName,
            serviceTitle: r.serviceTitle,
            // appointmentTitle: r.appointmentTitle,
        }));

    return {
        ...invoice,
        appointmentTitle,
        items,
    };
};

export const getGrossRevenue = async () => {
    const [result] = await db
        .select({
            total: sum(invoices.totalAmount),
        })
        .from(invoices)
        .where(eq(invoices.status, "PAID")); // Only count actual money received

    // result.total will be a string (e.g. "1250.50") or null
    return Number(result?.total || 0);
};

export const getSalesByService = async () => {
    return await db
        .select({
            serviceType: services.type, // Grouping by 'grooming', 'vaccination', etc.
            revenue: sum(invoiceItems.priceAtInvoice),
        })
        .from(invoiceItems)
        .innerJoin(services, eq(invoiceItems.serviceId, services.id))
        .groupBy(services.type);
};
