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
>;
