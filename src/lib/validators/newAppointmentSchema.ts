import { appointmentTypeValues } from "@/db/schema/enums";
import { z } from "zod/v4";

const AllowedType = z.enum(appointmentTypeValues, {
    message: "Value must be a valid appointment type",
});

export const newAppointmentSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, { message: "Title must be at least 3 characters long" }),
    // type: z
    //     .union([AllowedType, z.literal("")])
    //     .refine((value) => value !== "", {
    //         message: "Please select an appointment type",
    //     }),
    // serviceId: z.string().trim().min(1),
    // petIds: z
    //     .array(
    //         z
    //             .string()
    //             .nonempty("Missing pet")
    //             .refine((val) => val !== "", "Please select pet to be seen")
    //     )
    //     .min(1, "Please select at least one pet")
    //     .nonoptional(),
    selections: z
        .record(
            z.string(), // Pet ID
            z
                .array(
                    z.object({
                        id: z.string(),
                        type: z.enum([
                            "CHECK_UP",
                            "GROOMING",
                            "VACCINATION",
                            "DEWORMING",
                        ]),
                        title: z.string(),
                        name: z.string(),
                        priceAtBooking: z.string(),
                    })
                )
                .min(1, "Each selected pet needs at least one service")
        )
        .refine((val) => Object.keys(val).length > 0, {
            message: "Please select at least one pet and service",
        }),
    date: z.string().nonempty({ message: "Please select a date" }),
    event_datetime: z.string().nonempty({ message: "Please select a time" }),
});

export type AppointmentFormInput = z.input<typeof newAppointmentSchema>;

// export type AppointmentFormOutput = z.output<typeof newAppointmentSchema>;
