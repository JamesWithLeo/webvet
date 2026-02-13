import { z } from "zod/v4";
import { appointmentTypeValues } from "@/db/schema/appointments";
import { speciesConst } from "@/db/schema/pets";

const AllowedType = z.enum(appointmentTypeValues, {
    message: "Value must be a valid service type.",
});

export const createServiceSchema = z
    .object({
        title: z.string().trim().nonempty("Missing title").toLowerCase(),
        species: z
            .union([z.literal(""), z.enum(speciesConst)])
            .refine((val) => val !== "", "Please select a service type"),
        description: z
            .string()
            .trim()
            .nonempty("Missing description")
            .toLowerCase(),
        reminder: z.string().trim().nonempty("Missing reminder").toLowerCase(),
        type: z
            .union([z.literal(""), AllowedType])
            .refine((val) => val !== "", "Please select a service type"),
        inclusions: z
            .array(z.string())
            .min(1, "At least one inclusion is required"),
        isFlat: z.boolean(),
        flat: z.string().optional(),
        small: z.string().optional(),
        medium: z.string().optional(),
        large: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.isFlat) {
            if (!data.flat || parseFloat(data.flat) <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Flat rate is required",
                    path: ["flat"],
                });
            }
        } else {
            const sizes = ["small", "medium", "large"];
            const hasAtLeastOne = sizes.some((size) => {
                const val = data[size as keyof typeof data];
                return val && parseFloat(val as string) > 0;
            });

            if (!hasAtLeastOne) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "At least one size rate is required",
                    path: ["small"], // Point to the first one
                });
            }
        }
    });

export type ServiceFormInput = z.input<typeof createServiceSchema>;

export type ServiceFormOutput = z.output<typeof createServiceSchema>;

export const editServiceSchema = z.object({
    id: z.string().nonempty("Missing id"),
    title: z.string().trim().nonempty("Missing title").toLowerCase(),
    description: z
        .string()
        .trim()
        .nonempty("Missing description")
        .toLowerCase(),
    reminder: z.string().trim().nonempty("Missing reminder").toLowerCase(),
    gapInDays: z.coerce.number().nullable(),
    annualInterval: z.coerce.number().nullable(),
    inclusions: z.array(z.string()),
});

export type ServiceFormEditOuput = z.output<typeof editServiceSchema>;
