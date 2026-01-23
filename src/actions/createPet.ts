"use server";

import { auth } from "@/auth";
import { PetTypeModel } from "@/db/schema/pets";
import { checkExistingPets, savePetsToDb } from "@/lib/db/pets";
import { DeleteUTFile } from "@/lib/uploadthing-util";
import { createPetSchema, PetFormInput } from "@/lib/validators/petsZodSchema";
import { unauthorized } from "next/navigation";

export type ActionResponse = {
    success: boolean;
    error?: string;
    existingPet?: Partial<PetTypeModel>;
    name?: string;
    photoUrl?: string;
    debug?: {
        code?: string;
        message?: string;
    };
};

export default async function CreatePet(
    prevState: any,
    data: PetFormInput & {
        photoUrlKey: string;
        isForce: boolean;
    }
): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) unauthorized();

    if (session.user.role === "client") {
        data.ownerId = session.user.id;
    } else {
        data.ownerId = undefined;
    }

    const parsed = createPetSchema.safeParse(data);

    if (!parsed.success) {
        await DeleteUTFile(data.photoUrlKey);
        return {
            success: false,
            error: "Pets data failed the validation",
        };
    }

    const parsedData = parsed.data;
    try {
        if (!data.isForce) {
            const existingPet = await checkExistingPets({
                name: parsedData.name,
                breedId: parsedData.breedId,
                ownerId: parsedData.ownerId,
            });

            if (existingPet && existingPet.length !== 0) {
                return {
                    success: false,
                    error: "Possible duplicate pets",
                    existingPet: existingPet[0],
                    photoUrl: data.photoUrl,
                    name: data.name,
                };
            }
        }
        await savePetsToDb(parsed.data);
        return {
            success: true,
            name: parsedData.name,
            photoUrl: parsedData.photoUrl,
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
