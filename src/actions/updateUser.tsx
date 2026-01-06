"use server";

import { auth } from "@/auth";
import { saveSetupInDb } from "@/lib/db/users";
import {
    userSetupSchema,
    userEditSchema,
} from "@/lib/validators/usersZodSchema";

export default async function editUser(
    editProps: { userId: string | undefined; schema: "edit" | "setup" },
    prevState: any,
    formData: FormData
) {
    const { userId, schema } = editProps;
    if (!userId) {
        console.error("Missing user ID");
        return { succesful: false };
    }
    const session = await auth();
    if (!session || session.user.id !== userId)
        throw new Error("Not authenticated");

    const rawData = {
        firstName: formData.get("firstName")?.toString(),
        lastName: formData.get("lastName")?.toString(),
        sex: formData.get("sex")?.toString(),
        dateOfBirth: formData.get("dateOfBirth")?.toString(),
        photoUrl: formData.get("photoUrl")?.toString() ?? undefined,
    };
    const parsed =
        schema === "setup"
            ? userSetupSchema.safeParse(rawData)
            : userEditSchema.safeParse(rawData);

    if (!parsed.success) {
        console.error(`${parsed.error.name}: ${parsed.error.message}`);
        return { succesful: false };
    }
    // Filter out empty strings or nulls so they don't overwrite DB defaults
    const filteredData = Object.fromEntries(
        Object.entries(parsed.data).filter(
            ([_, value]) => value !== "" && value !== null
        )
    );
    const result = await saveSetupInDb(userId, filteredData);

    if (!Array.isArray(result) || !result.length) {
        return { succesful: false };
    }
    return { succesful: true, user: result[0] ? result[0] : undefined };
}
