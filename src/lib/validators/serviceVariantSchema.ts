import { servicePriceVariant } from "@/db/schema/services";
import { z } from "zod/v4";

const AllowedType = z.enum(servicePriceVariant, {
    message: "Value must be a valid service type.",
});

export const serviceVariantSchema = z.object({
    variant: z
        .union([z.literal(""), AllowedType])
        .refine((val) => val !== "", "Please select a service type"),
    price: z.union([z.string(), z.number()]).transform((val) => {
        const num = typeof val === "string" ? parseFloat(val) : val;
        if (isNaN(num)) return "0.00";
        return num.toFixed(2); // This returns the string Drizzle expects
    }),

    isAvailable: z.boolean().default(true),
});

export type serviceVariantInput = z.infer<typeof serviceVariantSchema>;

export const serviceVariantDbSchema = serviceVariantSchema.extend({
    serviceId: z.string().nonempty(),
});

export type ServiceVariantFormOutput = z.output<typeof serviceVariantDbSchema>;
