"use server";

import { auth } from "@/auth";
import { savePetsToDb } from "@/lib/db/pets";
import { DeleteUTFile } from "@/lib/uploadthing-util";
import { petCreateSchema, PetFormInput } from "@/lib/validators/petsZodSchema";

export default async function CreatePet(
    prevState: any,
    data: PetFormInput & { userId: string; photoUrlKey: string }
) {
    if (!data.userId) {
        console.warn("Missing user ID");
        return { success: false, error: "Missing user ID." };
    }

    const session = await auth();
    if (!session || session.user.id !== data.userId)
        throw new Error("Not authenticated");

    const parsed = petCreateSchema.safeParse(data);

    if (parsed.success) {
        try {
            // todo: add check existing pet

            await savePetsToDb(parsed.data);
            return {
                success: true,
                error: null,
                name: parsed.data.name,
                photoUrl: parsed.data.photoUrl,
            };
        } catch (error: any) {
            const errorCode = error.code || "UNKNOWN_DB_ERR";
            const technicalMessage = error.message;

            await DeleteUTFile(data.photoUrlKey);
            return {
                success: false,
                error: "An unexpected database error occurred.",

                debug: {
                    code: errorCode,
                    message: technicalMessage,
                },
            };
        }
    }

    await DeleteUTFile(data.photoUrlKey);
    return { success: false, error: "Pets data failed the validation" };
}
