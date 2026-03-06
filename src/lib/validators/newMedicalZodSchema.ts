import z4 from "zod/v4";

export const insertMedicalLogSchema = z4.object({
    // IDs are usually handled by the server or hidden inputs
    appointmentId: z4.uuid().optional().nullable(),
    petId: z4.uuid({ message: "Pet ID is required" }).nonoptional(),
    serviceId: z4.uuid().nonoptional(),
    invoiceId: z4.uuid().nonoptional(),
    // priceAtInvoice: z4.string(),

    weight: z4.coerce
        .number()
        .min(0, "Weight cannot be negative")
        .max(500, "Weight seems too high") // 999 is a bit high for a pet!
        .optional()
        .nullable()
        .or(z4.literal("")),

    temperature: z4.coerce
        .number() // Use number for range validation
        .min(30, "Temperature too low (Min 30°C)")
        .max(45, "Temperature too high (Max 45°C)")
        .optional()
        .nullable()
        .or(z4.literal("")),

    symptoms: z4.string().trim().optional().nullable(),
    diagnosis: z4.string().trim().optional().nullable(),
    prescription: z4.string().trim().nullable(),
    notes: z4
        .string()
        .trim()
        .min(1, { message: "Clinical notes are required for medical records" }),
});

// Type inference for your frontend form
export type InsertMedicalLog = z4.infer<typeof insertMedicalLogSchema>;
