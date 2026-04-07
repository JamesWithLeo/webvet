"use server";

import { auth } from "@/auth";
import { saveSetupInDb } from "@/lib/db/users";
import {
    userSetupSchema,
    userEditSchema,
    userSetupFormInput,
    userEditFormInput,
} from "@/lib/validators/usersZodSchema";
import { unauthorized } from "next/navigation";

export default async function updateUser(
    editProps: { userId: string | undefined; schema: "edit" | "setup" },
    prevState: any,
    data: userEditFormInput
) {
    const { userId } = editProps;
    if (!userId) {
        console.error("Missing user ID");
        return { success: false };
    }
    const session = await auth();
    if (!session || session.user.id !== userId) unauthorized();

    const parsed = userEditSchema.safeParse(data);

    if (!parsed.success) {
        console.error(`${parsed.error.name}: ${parsed.error.message}`);
        return { success: false };
    }
    // Filter out empty strings or nulls so they don't overwrite DB defaults
    const filteredData = Object.fromEntries(
        Object.entries(parsed.data).filter(
            ([_, value]) => value !== "" && value !== null
        )
    );
    const result = await saveSetupInDb(userId, filteredData);

    if (!Array.isArray(result) || result.length === 0) {
        return { success: false };
    }
    return { success: true, user: result[0] ? result[0] : undefined };
}

export async function CreateUser(prevState: any, data: userSetupFormInput) {
    const session = await auth();
    if (!session || !session.user.id) unauthorized();

    const parsed = userSetupSchema.safeParse(data);

    if (!parsed.success) {
        console.error(`${parsed.error.name}: ${parsed.error.message}`);
        return { succesful: false, user: undefined };
    }
    const result = await saveSetupInDb(session.user.id, parsed.data);

    if (!Array.isArray(result) || result.length <= 0) {
        return { succesful: false, user: undefined };
    }
    return { succesful: true, user: result[0] ? result[0] : undefined };
}
