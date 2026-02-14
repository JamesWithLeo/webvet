import {
    OWNERSHIP_STATUS,
    petGenderValues,
    speciesConst,
    speciesEnum,
} from "@/db/schema/pets";
import { z } from "zod/v4";

export const createPetSchema = z.object({
    name: z
        .string()
        .regex(
            /^[a-zA-Z0-9 .\-]+$/,
            "Only letters, numbers, spaces, periods, and hyphens are allowed."
        )
        .trim()
        .nonempty("Missing pets name.")
        .toLowerCase(),
    breedId: z.number().nonnegative().nullable(),
    color: z
        .string()
        .regex(/^[a-zA-Z ]+$/, "No special characters in color description")
        .trim()
        .nonempty("Missing pets color.")
        .toLowerCase(),
    dateOfBirth: z
        .string("Invalid date.")
        .nonempty("Please select the date of birth of pet."),
    isEstimatedDOB: z.boolean().nonoptional(),
    breedSpecification: z
        .string()
        .trim()
        .nonempty("Missing pet breed.")
        .toLowerCase(),
    photoUrl: z.string().nonempty("Missing pet profile picture."),
    gender: z.enum(petGenderValues).nonoptional("Missing pet gender"),
    distinguishingMarks: z
        .string()
        .nonempty("Distinguishing marks is too short.")
        .regex(/^[a-zA-Z0-9\s,]*$/, "Only letters, numbers, and commas allowed")
        .max(200, "Distinguishing marks is too long.")
        .toLowerCase()
        .transform(
            (val) =>
                val
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0)
                    .filter(Boolean) // Remove empty entries
        ),
    diet: z
        .string()
        .nonempty("Diet description is too short.")
        .regex(/^[a-zA-Z0-9\s,]*$/, "Only letters, numbers, and commas allowed")
        .max(300, "Diet description is too long.")
        .toLowerCase()
        .transform((val) =>
            val
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
        ),
    allergies: z
        .string()
        .max(200, "Allergies description is too long.")
        .toLowerCase()
        .transform(
            (val) =>
                val
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0)
                    .filter(Boolean) // Remove empty entries
        )
        .optional(),

    ownerId: z.string().trim().optional(),
    ownershipStatus: z.enum(OWNERSHIP_STATUS).nonoptional(),
    species: z
        .union([z.literal(""), z.enum(speciesConst)])
        .refine((val) => val !== "", "Please select a species")
        .nonoptional(),
});

// Use this for your React Hook Form / UI State
export type PetFormInput = z.input<typeof createPetSchema>;
// Result: { name: string; diet: string; }

// Use this for your Server Action / Drizzle Insert
export type PetFormOutput = z.output<typeof createPetSchema>;
// Result: { name: string; diet: string[]; }
