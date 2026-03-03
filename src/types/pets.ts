import { AppointmentType } from "@/db/schema/appointments";
import { pets } from "@/db/schema/pets";

export type PetTypeModel = typeof pets.$inferSelect;

export type PetTypeModelWithBreed = PetTypeModel & { breed: string };

export type AdminPetsSummary = Pick<
    PetTypeModel,
    | "id"
    | "name"
    | "photoUrl"
    | "dateOfBirth"
    | "breedSpecification"
    | "species"
    | "life"
    | "ownershipStatus"
    | "reproductiveStatus"
    | "weight"
    | "allergies"
    | "distinguishingMarks"
    | "diet"
    | "gender"
>;

export type AppointedPet = {
    id: string; // Pet ID
    joinId: string; // The unique ID from appointmentsToPets
    name: string;
    species: "dog" | "cat";
    serviceName: string;
    serviceId: string;
    serviceType: AppointmentType;
    hasLogs: boolean; //
};
