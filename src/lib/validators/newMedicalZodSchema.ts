import z4 from "zod/v4";

export const insertMedicalLogSchema = z4.object({
    // IDs are usually handled by the server or hidden inputs
    appointmentId: z4.uuid().optional().nullable(),
    petId: z4.uuid({ message: "Pet ID is required" }).nonoptional(),
    serviceId: z4.uuid().nonoptional(),
    invoiceId: z4.uuid().nonoptional(),
    // priceAtInvoice: z4.string(),

    // Clinical Data
    // We use coerce to handle inputs from form fields which are usually strings
    weight: z4.coerce
        .number()
        .min(0, "Weight cannot be negative")
        .max(999.99, "Weight exceeds maximum precision")
        .optional()
        .nullable(),

    temperature: z4.coerce
        .number()
        .min(30, "Temperature too low")
        .max(45, "Temperature too high")
        .optional()
        .nullable(),

    symptoms: z4.string().trim().optional().nullable(),
    diagnosis: z4.string().trim().optional().nullable(),
    prescription: z4.string().trim().nonoptional(),
    notes: z4
        .string()
        .trim()
        .min(1, { message: "Clinical notes are required for medical records" }),
});

// Type inference for your frontend form
export type InsertMedicalLog = z4.infer<typeof insertMedicalLogSchema>;
