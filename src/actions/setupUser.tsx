"use server";

import { saveSetupInDb } from "@/lib/db/users";
import { userSetupSchema } from "@/lib/validators/usersSetupSchema";

export async function setupUser(userId: string, formData: FormData) {
    if (!userId) {
        console.error("Missing user ID");
        return { succesful: false };
    }

    const rawData = {
        firstName: formData.get("firstName")?.toString(),
        lastName: formData.get("lastName")?.toString(),
        sex: formData.get("sex")?.toString(),
        dateOfBirth: formData.get("dateOfBirth")?.toString(),
    };

    const parsed = userSetupSchema.safeParse(rawData);
    if (!parsed.success) {
        console.error(`${parsed.error.name}: ${parsed.error.message}`);
        return { succesful: false };
    }

    const data = parsed.data;
    const result = await saveSetupInDb({
        id: userId,
        firstName: data.firstName,
        lastName: data.lastName,
        sex: data.sex,
        dateOfBirth: data.dateOfBirth,
    });

    if (!Array.isArray(result) || !result.length) {
        return { succesful: false };
    }

    return { succesful: true };
}
