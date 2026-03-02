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
