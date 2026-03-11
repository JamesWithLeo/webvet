import { db, dbTx } from "@/db";
import {
    appointments,
    appointmentsToPets,
    AppointmentType,
    AppointmentTypeModel,
} from "@/db/schema/appointments";
import {
    invoiceItems,
    invoices,
    invoiceStatus,
    InvoiceTypeModel,
    itemStatusEnum,
} from "@/db/schema/invoice";
import { medicalLogs } from "@/db/schema/medicalLogs";
import { pets } from "@/db/schema/pets";
import { services } from "@/db/schema/services";
import { users } from "@/db/schema/users";
import PetServiceMerged from "@/types/PetsServiceMerged";
import { endOfDay, startOfDay } from "date-fns";
import { and, eq, getTableColumns, gte, lte, sql, sum } from "drizzle-orm";

export const getInvoiceAdmin = async () => {
    return await db
        .select({
            ...getTableColumns(invoices),
            totalAmount:
                sql<number>`sum(${invoiceItems.priceAtInvoice})`.mapWith(
                    Number
                ),
            // firstName: sql<string>`COALESCE(MAX(${users.firstName}))`,
            // lastName: sql<string>`COALESCE(MAX(${users.lastName}))`,
        })
        .from(invoices)
        // 1. Join to Appointment
        .leftJoin(appointments, eq(appointments.id, invoices.appointmentId))
        // 2. Join to the Link Table (AppointmentToPets)
        // .leftJoin(
        //     appointmentsToPets,
        //     eq(appointmentsToPets.appointmentId, appointments.id)
        // )
        // // 3. Join to Pets
        // .leftJoin(pets, eq(pets.id, appointmentsToPets.petId))
        // // 4. Join to Users (Owner)
        // .leftJoin(users, eq(users.id, pets.ownerId))
        // 5. Join items for the total
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
        .leftJoin(invoiceItems, eq(invoices.id, invoiceItems.invoiceId))
        .leftJoin(pets, eq(invoiceItems.petId, pets.id))
        .leftJoin(services, eq(invoiceItems.serviceId, services.id))
        .innerJoin(appointments, eq(appointments.id, invoices.appointmentId))
        .where(eq(invoices.id, id));
    // DELETE THE .groupBy(invoices.id) LINE HERE

    if (rows.length === 0) return null;

    // The rest of your aggregation logic is already perfect for flat rows!
    const invoice = rows[0].invoice;
    const appointmentTitle = rows[0].appointmentTitle;

    const items = rows
        .filter((r) => r.item !== null)
        .map((r) => ({
            ...r.item!,
            petName: r.petName,
            serviceTitle: r.serviceTitle,
        }));

    // Calculate total on the application side to avoid SQL group-by headaches
    const totalAmount = items.reduce(
        (sum, item) => sum + (Number(item.priceAtInvoice) || 0),
        0
    );

    return {
        ...invoice,
        appointmentTitle,
        totalAmount,
        items,
    };
};

export const getInvoiceDownloadData = async (invoiceId: string) => {
    const rows = await db
        .select({
            ...getTableColumns(invoices),
            appointmentTitle: appointments.title,
            firstName: users.firstName,
            lastName: users.lastName,

            items: sql<
                {
                    id: string;
                    priceAtInvoice: number;
                    petName: string;
                    serviceTitle: string;
                }[]
            >`
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', ${invoiceItems.id},
                            'priceAtInvoice', ${invoiceItems.priceAtInvoice},
                            'petName', ${pets.name},
                            'serviceTitle', ${services.title}
                        )
                    ) FILTER (WHERE ${invoiceItems.id} IS NOT NULL),
                    '[]'
                )
            `.as("items"),
            totalAmount:
                sql<number>`COALESCE(SUM(${invoiceItems.priceAtInvoice}), 0)`.mapWith(
                    Number
                ),
        })
        .from(invoices)
        .leftJoin(invoiceItems, eq(invoices.id, invoiceItems.invoiceId))
        .leftJoin(pets, eq(invoiceItems.petId, pets.id))
        .leftJoin(services, eq(invoiceItems.serviceId, services.id))
        .innerJoin(appointments, eq(appointments.id, invoices.appointmentId))
        .leftJoin(users, eq(pets.ownerId, users.id))
        .where(eq(invoices.id, invoiceId))
        .groupBy(
            invoices.id,
            appointments.title,
            users.firstName,
            users.lastName
        );

    return rows[0] || null;
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
    invoice: InvoiceTypeModel;
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        contactNumber: string | null;
        photoUrl: string | null;
    } | null;
    pets: {
        photoUrl: string;
        id: string;
        invoiceItemId: string;
        itemStatus: (typeof itemStatusEnum.enumValues)[number];
        weight: number;
        name: string;
        species: "dog" | "cat";
        breedSpecification: string;
        serviceName: string;
        serviceId: string;
        serviceType: AppointmentType;
        log: string; //
    }[];
};

export const getVetKanbanData = async (
    fromStr?: string,
    toStr?: string
): Promise<VetData[]> => {
    // 1. Setup Date Range (Defaulting to today if no dates provided)
    const now = new Date();
    const startRange = fromStr
        ? new Date(fromStr)
        : new Date(now.setHours(0, 0, 0, 0));
    const endRange = toStr
        ? new Date(toStr)
        : new Date(now.setHours(23, 59, 59, 999));

    const results = await db
        .select({
            appointment: appointments,
            invoice: invoices,
            user: sql<VetData["user"]>`
                CASE 
                    WHEN ${users.id} IS NOT NULL THEN 
                        jsonb_build_object(
                            'id', ${users.id},
                            'firstName', ${users.firstName},
                            'lastName', ${users.lastName},
                            'contactNumber', ${users.contactNumber},
                            'photoUrl', ${users.photoUrl}
                        )
                    ELSE NULL 
                END`,
            pets: sql<VetData["pets"]>`
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', ${pets.id},
                            'invoiceItemId', ${invoiceItems.id},
                            'itemStatus', ${invoiceItems.itemStatus},
                            'name', ${pets.name},
                            'photoUrl', ${pets.photoUrl},
                            'breedSpecification', ${pets.breedSpecification},
                            'weight', ${pets.weight},
                            'species', ${pets.species},
                            'serviceName', ${services.title},
                            'serviceType', ${services.type},
                            'serviceId', ${services.id}, 
                            'log', (
                                SELECT ml.id 
                                FROM medical_logs ml 
                                WHERE ml.appointment_id = ${appointments.id} 
                                AND ml.pet_id = ${pets.id} 
                                AND ml.service_id = ${services.id}
                                LIMIT 1)
                        )
                    ) FILTER (WHERE ${invoiceItems.id} IS NOT NULL), 
                    '[]'
                )`,
        })
        .from(appointments)
        .leftJoin(invoices, eq(invoices.appointmentId, appointments.id))
        .leftJoin(users, eq(invoices.userId, users.id))
        .leftJoin(invoiceItems, eq(invoiceItems.invoiceId, invoices.id))
        .leftJoin(pets, eq(pets.id, invoiceItems.petId))
        .leftJoin(services, eq(services.id, invoiceItems.serviceId))
        .where(
            and(
                gte(appointments.event_datetime, startRange.toISOString()),
                lte(appointments.event_datetime, endRange.toISOString())
            )
        )
        .groupBy(appointments.id, invoices.id, users.id)
        .orderBy(appointments.event_datetime);

    return results as unknown as VetData[];
};

type InitializeInvoiceType = {
    userId: string;
    appointmentId: string;
    status: (typeof invoiceStatus.enumValues)[number];
    createdBy: string;
    items: {
        priceAtInvoice: string;
        petId: string;
        serviceId: string;
    }[];
};

export const InitializeInvoice = async ({
    userId,
    appointmentId,
    status,
    createdBy,
    items,
}: InitializeInvoiceType) => {
    return await dbTx.transaction(async (tx) => {
        const [insertedInvoice] = await tx
            .insert(invoices)
            .values({
                userId: userId,
                appointmentId: appointmentId,
                status: status,
                createdById: createdBy,
            })
            .returning();

        const insertedInvoiceItems = await tx
            .insert(invoiceItems)
            .values(items.map((i) => ({ ...i, invoiceId: insertedInvoice.id })))
            .returning();

        return {
            invoiceId: insertedInvoice.id,
            insertedItemsLength: insertedInvoiceItems.length,
        };
    });
};
