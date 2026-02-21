import {
    lifeStatusEnum,
    OWNERSHIP_STATUS,
    petGenderValues,
    reproductiveStatusEnum,
    speciesConst,
} from "@/db/schema/pets";
import z4 from "zod/v4";

export const createPetSchema = z4.object({
    name: z4
        .string()
        .regex(
            /^[a-zA-Z0-9 .\-]+$/,
            "Only letters, numbers, spaces, periods, and hyphens are allowed."
        )
        .trim()
        .nonempty("Missing pets name.")
        .toLowerCase(),
    breedId: z4.number().nonnegative().nullable(),
    color: z4
        .string()
        .regex(/^[a-zA-Z ]+$/, "No special characters in color description")
        .trim()
        .nonempty("Missing pets color.")
        .toLowerCase(),
    dateOfBirth: z4
        .string("Invalid date.")
        .nonempty("Please select the date of birth of pet."),
    isEstimatedDOB: z4.boolean().nonoptional(),
    breedSpecification: z4
        .string()
        .trim()
        .nonempty("Missing pet breed.")
        .toLowerCase(),
    photoUrl: z4.string().nonempty("Missing pet profile picture."),
    gender: z4.enum(petGenderValues).nonoptional("Missing pet gender"),
    distinguishingMarks: z4
        .array(z4.string().toLowerCase())
        .nonempty("Missing distinguishing marks")
        .min(1, "At least one distinguishing mark is required"),
    diet: z4
        .array(z4.string().toLowerCase())
        .nonempty("Missing Diet")
        .min(1, "At least one diet is required."),
    allergies: z4.array(z4.string().toLowerCase()).optional(),

    ownerId: z4.string().trim().optional(),
    ownershipStatus: z4.enum(OWNERSHIP_STATUS).nonoptional(),
    species: z4
        .union([z4.literal(""), z4.enum(speciesConst)])
        .refine((val) => val !== "", "Please select a species")
        .nonoptional(),
});

export type PetCreateFormInput = z4.input<typeof createPetSchema>;

export const editPetSchemaAdmin = z4.object({
    name: z4
        .string()
        .regex(
            /^[a-zA-Z0-9 .\-]+$/,
            "Only letters, numbers, spaces, periods, and hyphens are allowed."
        )
        .trim()
        .toLowerCase()
        .optional(),
    dateOfBirth: z4.string("Invalid date.").optional(),
    breedSpecification: z4.string().trim().toLowerCase().optional(),
    gender: z4.enum(petGenderValues).optional(),
    distinguishingMarks: z4.array(z4.string().toLowerCase()).optional(),
    diet: z4.array(z4.string().toLowerCase()).optional(),
    allergies: z4
        .array(z4.string().toLowerCase())
        .nullish()
        .optional()
        .transform((v) => v ?? []),

    ownershipStatus: z4.enum(OWNERSHIP_STATUS).optional(),
    species: z4
        .union([z4.literal(""), z4.enum(speciesConst)])
        .refine((val) => val !== "", "Please select a species")
        .optional(),
    weight: z4
        .number("Weight must be a number")
        .min(0, "Weight cannot be negative")
        .max(200, "Please verify weight (too high)")
        .optional()
        .nullable(),

    life: z4.enum(lifeStatusEnum.enumValues).optional(),

    reproductiveStatus: z4.enum(reproductiveStatusEnum.enumValues).optional(),
});

export type PetEditFormInput = z4.input<typeof editPetSchemaAdmin>;
export type PetEditFormOutput = z4.output<typeof editPetSchemaAdmin>;
