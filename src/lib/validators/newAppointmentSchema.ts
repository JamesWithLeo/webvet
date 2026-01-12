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
    petIds: z
        .array(
            z
                .string()
                .nonempty("Missing pet")
                .refine((val) => val !== "", "Please select pet to be seen")
        )
        .min(1, "Please select at least one pet") // Ensures the array isn't empty
        .nonoptional(),
    date: z.string().nonempty({ message: "Please select a date" }),
    event_datetime: z.string().nonempty({ message: "Please select a time" }),
});

export type AppointmentFormInput = z.input<typeof newAppointmentSchema>;

export type AppointmentFormOutput = z.output<typeof newAppointmentSchema>;
