import { z } from "zod/v4";
import { appointmentTypeValues } from "@/db/schema/appointments";

const AllowedType = z.enum(appointmentTypeValues, {
    message: "Value must be a valid service type.",
});

export const createServiceSchema = z
    .object({
        title: z.string().trim().nonempty("Missing title").toLowerCase(),
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
            .string()
            .max(200)
            .transform((val) =>
                val
                    .split(".")
                    .map((i) => i.trim())
                    .filter(Boolean)
            ),
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
            // If not flat, all three sizes must be filled
            ["small", "medium", "large"].forEach((size) => {
                const val = data[size as keyof typeof data];
                if (!val || parseFloat(val as string) <= 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `${size} rate is required`,
                        path: [size],
                    });
                }
            });
        }
    });

export type ServiceFormInput = z.input<typeof createServiceSchema>;

export type ServiceFormOutput = z.output<typeof createServiceSchema>;
