import { z } from "zod/v4";
import { appointmentTypeValues } from "@/db/schema/appointments";

const AllowedType = z.enum(appointmentTypeValues, {
    message: "Value must be a valid service type",
});
export const createServiceSchema = z.object({
    title: z.string().trim().nonempty("Missing title").toLowerCase(),
    description: z
        .string()
        .trim()
        .nonempty("Missing description")
        .toLowerCase(),
    reminder: z.string().trim().nonempty("Missing description").toLowerCase(),
    type: z
        .union([AllowedType, z.literal("")])
        .refine((value) => value !== "", {
            message: "Please select an service type",
        }),
    inclusions: z

        .string()
        .max(200, "inclusion is too long.")
        .toLowerCase()
        .transform(
            (val) =>
                val
                    .split(".")
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0)
                    .filter(Boolean) // Remove empty entries
        ),
});

export type ServiceFormInput = z.input<typeof createServiceSchema>;
export type ServiceFormOutput = z.output<typeof createServiceSchema>;
