import { appointmentTypeValues } from "@/db/schema/appointments";
import { z } from "zod/v4";

const appointmentTypes = [
    "CHECK_UP",
    "GROOMING",
    "VACCINATION",
    "CONSULTATION",
    "DEWORMING",
] as const;

// Create the type for the allowed enum values
const AllowedType = z.enum(appointmentTypes, {
    message: "Value must be a valid appointment type",
});

// 💡 THE KEY FIX: Use z.union to allow the initial empty string,
// then use .refine() to fail validation if the value is ""
export const newAppointmentSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" }),

    type: z
        .union([AllowedType, z.literal("")])
        .refine((value) => value !== "", {
            message: "Please select an appointment type",
        }),

    selectedDate: z.string().nonempty({ message: "Please select a date" }),
    selectedDateTime: z.string().nonempty({ message: "Please select a time" }),
});
