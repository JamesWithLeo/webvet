import { appointmentTypeValues } from "@/db/schema/appointments";
import { z } from "zod/v4";

const AllowedType = z.enum(appointmentTypeValues, {
    message: "Value must be a valid appointment type",
});

export const newAppointmentSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, { message: "Title must be at least 3 characters long" }),

    type: z
        .union([AllowedType, z.literal("")])
        .refine((value) => value !== "", {
            message: "Please select an appointment type",
        }),
    pet: z
        .string()
        .nonempty("Missing pet")
        .nonoptional()
        .refine((value) => value !== "", {
            message: "Please select pet to be seen",
        }),
    selectedDate: z.string().nonempty({ message: "Please select a date" }),
    selectedDateTime: z.string().nonempty({ message: "Please select a time" }),
});

export type AppointmentFormInput = z.input<typeof newAppointmentSchema>;
