import { userGenderValueTuple } from "@/db/schema/users";
import { z } from "zod";

export const userSetupSchema = z.object({
    firstName: z
        .string("Missing first name")
        .nonempty("Missing first name")
        .min(2, { message: "First name must be at least 2 characters" })
        .max(25, { message: "First name is too long" })
        .regex(/^[a-zA-Z ]*$/, "Only letters are allowed")
        .toLowerCase(),
    lastName: z
        .string("Missing Last name")
        .nonempty("Missing last name")
        .min(2, { message: "Last name must be at least 2 characters" })
        .max(25, { message: "Last name is too long" })
        .regex(/^[a-zA-Z]*$/, "Only letters are allowed")
        .toLowerCase(),
    gender: z.enum(userGenderValueTuple, { message: "Invalid gender" }),
    dateOfBirth: z
        .string()
        .nonempty("Missing date of birth")
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }),
    contactNumber: z
        .string()
        // Remove all non-numeric characters except the leading '+'
        .transform((val) => val.replace(/(?!^\+)\D/g, ""))
        // 2. Validate against E.164 length (min 10 for local+code, max 15 digits)
        .refine((val) => /^\+?[1-9]\d{1,14}$/.test(val), {
            message:
                "Invalid phone number format. Use E.164 (e.g., +1234567890)",
        }),
});

export type userSetupFormInput = z.input<typeof userSetupSchema>;

export const userEditSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    sex: z.enum(userGenderValueTuple, { message: "Invalid sex" }).optional(),
    dateOfBirth: z.string().optional(),
    photoUrl: z.string().optional(),
});
