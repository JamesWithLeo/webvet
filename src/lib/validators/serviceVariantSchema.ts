import { servicePriceVariant } from "@/db/schema/services";
import { z } from "zod/v4";

const AllowedType = z.enum(servicePriceVariant, {
    message: "Value must be a valid service type.",
});

export const serviceVariantSchema = z.object({
    serviceId: z.string().nonempty(),
    variant: z
        .union([z.literal(""), AllowedType])
        .refine((val) => val !== "", "Please select a service type"),
    price: z.union([z.string(), z.number()]).transform((val) => {
        const num = typeof val === "string" ? parseFloat(val) : val;
        if (isNaN(num)) return "0.00";
        return num.toFixed(2); // This returns the string Drizzle expects
    }),

    isAvailable: z.boolean(),
});

export type serviceVariantFormInput = z.input<typeof serviceVariantSchema>;

export type ServiceVariantFormOutput = z.output<typeof serviceVariantSchema>;

export const serviceVariantDbSchema = serviceVariantSchema.extend({
    id: z.string().nonempty(),
});
export type ServiceVariantEditInput = z.input<typeof serviceVariantDbSchema>;
