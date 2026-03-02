import { AppointmentType } from "@/db/schema/appointments";

export type AppointmentToPetsItem = {
    pets: {
        id: string;
        name: string;
        photoUrl: string | null;
        title: string;
        priceAtBooking: string;
        type: AppointmentType;
    }[];
};

export type AppointmentWithInvoice = {
    invoice: {
        id: string;
        paymentStatus: "UNPAID" | "PAID" | "VOID" | null;
        status:
            | "PENDING"
            | "ARRIVED"
            | "COMPLETED"
            | "CANCELLED"
            | "MISSED"
            | null;
        totalAmount: string;
        createdAt: Date;
    } | null;
    pets: {
        id: string;
        name: string;
        photoUrl: string | null;
        priceAtBooking: string;
    }[];
    id: string;
    title: string;
    event_datetime: string;
    created_at: Date;
    expiredNotification: boolean;
    incomingNotification: boolean;
};
