import { AppointmentType, BookingSourceType } from "@/db/schema/appointments";

type PetServiceMerged = {
    id: string;
    petId: string;
    name: string;
    photoUrl: string | null;
    species: "dog" | "cat";
    title: string;
    type: AppointmentType;
    priceAtBooking: number;
    weight: number;
    source: BookingSourceType;
};

export default PetServiceMerged;
