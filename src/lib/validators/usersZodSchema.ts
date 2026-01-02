import { userGenderValueTuple } from "@/db/schema/users";
import { z } from "zod";

export const userSetupSchema = z.object({
    firstName: z.string().nonempty("Missing firstName"),
    lastName: z.string().nonempty("Missing lastName"),
    sex: z.enum(userGenderValueTuple, { message: "Invalid sex" }),
    dateOfBirth: z
        .string()
        .nonempty("Missing dateOfBirth")
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }),
    photoUrl: z.string(),
});

export const userEditSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    sex: z.enum(userGenderValueTuple, { message: "Invalid sex" }).optional(),
    dateOfBirth: z.string().optional(),
    photoUrl: z.string().optional(),
});
