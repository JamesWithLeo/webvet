import { refundMethodEnum, refundMethodValues } from "@/db/schema/invoice";
import z from "zod/v4";

export const refundSchema = z
    .object({
        invoiceId: z
            .string()
            .uuid({ message: "Invalid Invoice ID" })
            .nonoptional(),

        originalTotal: z.number().positive().nonoptional(),

        // The actual amount being refunded
        refundAmount: z
            .number()
            .positive({ message: "Refund must be greater than ₱0" })
            .max(1000000, "Amount exceeds clinical limits")
            .transform((val) => Number(val.toFixed(2))), // Ensure 2 decimal places

        reason: z
            .string()
            .min(5, {
                message:
                    "Please provide a more detailed reason (min 5 characters)",
            })
            .max(255, { message: "Reason is too long" })
            .nonoptional(),
        refundMethod: z.enum(refundMethodEnum.enumValues).nonoptional(),
    })
    .refine((data) => data.refundAmount <= data.originalTotal, {
        message: "Refund amount cannot be greater than the original payment",
        path: ["refundAmount"], // Highlights the error on the number input
    });

// Type for your Form/Component
export type RefundSchemaType = z.infer<typeof refundSchema>;
