import { db } from "@/db";
import {
    appointments,
    appointmentsToPets,
    AppointmentToPetsStatus,
    AppointmentType,
    AppointmentTypeModel,
} from "@/db/schema/appointments";
import { invoiceItems, invoices, InvoiceTypeModel } from "@/db/schema/invoice";
import { medicalLogs } from "@/db/schema/medicalLogs";
import { pets } from "@/db/schema/pets";
import { services } from "@/db/schema/services";
import { users } from "@/db/schema/users";
import { InvoiceTypeModelWithTotal } from "@/types/invoice";
import PetServiceMerged from "@/types/PetsServiceMerged";
import { endOfDay, startOfDay } from "date-fns";
import { and, eq, getTableColumns, gte, lte, sql, sum } from "drizzle-orm";

export const getInvoiceAdmin = async (): Promise<
    InvoiceTypeModelWithTotal[]
> => {
    return await db
        .select({
            ...getTableColumns(invoices),
            totalAmount:
                sql<number>`sum(${invoiceItems.priceAtInvoice})`.mapWith(
                    Number
                ),
        })
        .from(invoices)
        .leftJoin(invoiceItems, eq(invoices.id, invoiceItems.invoiceId))
        .groupBy(invoices.id);
};

export const getInvoiceFullDetailsAdmin = async (invoiceId: string) => {
    try {
        const result = await db
            .select({
                invoice: getTableColumns(invoices),
                appointmentId: appointments.id,
                user: {
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    photoUrl: users.photoUrl,
                },
                pets: sql<PetServiceMerged[]>`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ${appointmentsToPets.id},
                                'petId', ${pets.id}, 
                                'name', ${pets.name}, 
                                'photoUrl', ${pets.photoUrl},
                                'title', ${services.title},
                                'type', ${services.type},
                                'serviceId', ${services.id},
                                'priceAtBooking', ${appointmentsToPets.priceAtBooking},
                                'species', ${pets.species},
                                'weight', ${pets.weight},
                                'source', ${appointmentsToPets.source}
                            )
                        ) FILTER (WHERE ${pets.id} IS NOT NULL), 
                        '[]'
                    )`.as("pets"),
            })
            .from(invoices)
            .innerJoin(
                appointments,
                eq(invoices.appointmentId, appointments.id)
            )
            .innerJoin(
                appointmentsToPets,
                eq(appointments.id, appointmentsToPets.appointmentId)
            )
            .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
            .innerJoin(users, eq(pets.ownerId, users.id))
            .innerJoin(services, eq(services.id, appointmentsToPets.serviceId))
            .where(eq(invoices.id, invoiceId))
            .groupBy(invoices.id, appointments.id, users.id)
            .then((res) => res[0]);

        return {
            data: result ?? null,
            error: result ? null : "Invoice not found",
        };
    } catch (error) {
        console.error(error);
        return { data: null, error: "Failed to fetch invoice details" };
    }
};

export const getInvoiceAdminV2 = async (invoiceId: string) => {
    const result = await db
        .select({
            invoice: getTableColumns(invoices),
            appointment: getTableColumns(appointments),
            user: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                photoUrl: users.photoUrl,
            },
        })
        .from(invoices)
        .innerJoin(appointments, eq(invoices.appointmentId, appointments.id))
        .innerJoin(
            appointmentsToPets,
            eq(appointments.id, appointmentsToPets.appointmentId)
        )
        .innerJoin(pets, eq(appointmentsToPets.petId, pets.id))
        .innerJoin(users, eq(pets.ownerId, users.id))
        .where(eq(invoices.id, invoiceId))
        .limit(1);

    return {
        data: result[0] ?? null,
        error: result[0] ? null : "Invoice not found",
    };
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
        .set({ paymentStatus: "PAID", status: "COMPLETED" })
        .where(eq(invoices.id, id))
        .returning({ id: invoices.id, status: invoices.paymentStatus })
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
            totalAmount:
                sql<number>`sum(${invoiceItems.priceAtInvoice})`.mapWith(
                    Number
                ),
        })
        .from(invoices)
        .leftJoin(invoiceItems, eq(invoices.id, invoiceItems.invoiceId))
        .where(eq(invoices.paymentStatus, "PAID")); // Only count actual money received

    // result.total will be a string (e.g. "1250.50") or null
    return Number(result?.totalAmount || 0);
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

export const getArrivedInvoiceWithAppointment = async () => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    return await db
        .select({
            ...getTableColumns(invoices),
            appointment: getTableColumns(appointments), // Include appointment data
        })
        .from(invoices)
        .innerJoin(appointments, eq(appointments.id, invoices.appointmentId))
        .where(
            and(
                eq(invoices.status, "ARRIVED"),
                gte(appointments.event_datetime, todayStart.toISOString()),
                lte(appointments.event_datetime, todayEnd.toISOString())
            )
        )
        .groupBy(invoices.id, appointments.id); // Group by both to avoid SQL errors
};

export type VetData = {
    appointment: AppointmentTypeModel;
    invoice: InvoiceTypeModel | null;
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        contactNumber: string | null;
        photoUrl: string | null;
    };
    pets: {
        id: string; // Pet ID
        joinId: string; // The unique ID from appointmentsToPets
        weight: number;
        name: string;
        species: "dog" | "cat";
        serviceName: string;
        serviceId: string;
        serviceType: AppointmentType;
        hasLogs: boolean; //
    }[];
};
export const getVetKanbanData = async (): Promise<VetData[]> => {
    const results = await db
        .select({
            appointment: appointments,
            invoice: invoices,
            user: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                contactNumber: users.contactNumber,
                photoUrl: users.photoUrl,
            },
            // This JSON array now represents the "Live Billing Checklist"
            pets: sql<
                {
                    id: string; // Pet ID
                    joinId: string; // The unique ID from appointmentsToPets
                    name: string;
                    species: "dog" | "cat";
                    weight: number;
                    serviceName: string;
                    serviceId: string;
                    serviceType: AppointmentType;
                    hasLogs: boolean; // Tells the UI if the Vet finished this specific task
                }[]
            >`json_agg(json_build_object(
                'id', ${pets.id},
                'joinId', ${appointmentsToPets.id}, 
                'name', ${pets.name},
                'weight', ${pets.weight},
                'species', ${pets.species},
                'serviceName', ${services.title},
                'serviceType', ${services.type},
                'serviceId', ${services.id}, 
                'hasLogs', CASE WHEN ${medicalLogs.id} IS NOT NULL THEN true ELSE false END
            ))`,
        })
        .from(appointments)
        .leftJoin(invoices, eq(invoices.appointmentId, appointments.id))
        .innerJoin(users, eq(invoices.userId, users.id))
        .leftJoin(
            appointmentsToPets,
            eq(appointmentsToPets.appointmentId, appointments.id)
        )
        .innerJoin(pets, eq(pets.id, appointmentsToPets.petId))
        .innerJoin(services, eq(services.id, appointmentsToPets.serviceId))
        // Link to MedicalLogs to see which "To-Do" items are "Done"
        .leftJoin(
            medicalLogs,
            and(
                eq(medicalLogs.appointmentId, appointments.id),
                eq(medicalLogs.petId, pets.id),
                eq(medicalLogs.serviceId, services.id)
            )
        )
        .groupBy(appointments.id, invoices.id, users.id)
        .orderBy(appointments.event_datetime);

    return results;
};
