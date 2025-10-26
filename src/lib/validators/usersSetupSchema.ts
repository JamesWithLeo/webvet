import { sexValuesTuple } from "@/db/schema/users";
import { z } from "zod";

export const userSetupSchema = z.object({
    firstName: z.string().nonempty("Missing firstName"),
    lastName: z.string().nonempty("Missing lastName"),
    sex: z.enum(sexValuesTuple, { message: "Invalid sex" }),
    dateOfBirth: z
        .string()
        .nonempty("Missing dateOfBirth")
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }),
});
