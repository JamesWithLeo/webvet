"use server";

import { auth } from "@/auth";
import { AdminPetsSummary, PetTypeModel } from "@/types/pets";
import { checkExistingPets, savePetsToDb, updatePetAdmin } from "@/lib/db/pets";
import { DeleteUTFile } from "@/lib/uploadthing-util";
import {
    createPetSchema,
    editPetSchemaAdmin,
    PetCreateFormInput,
    PetEditFormInput,
} from "@/lib/validators/petsZodSchema";
import { unauthorized } from "next/navigation";
import { success } from "zod";

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

export async function CreatePet(
    prevState: any,
    data: PetCreateFormInput & {
        photoUrlKey: string;
        isForce: boolean;
    }
): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) unauthorized();

    const parsed = createPetSchema.safeParse(data);

    if (!parsed.success) {
        await DeleteUTFile(data.photoUrlKey);
        return {
            success: false,
            error: "Pets data failed the validation",
            debug: {
                code: "ZOD_SCHEMA_VALIDATION",
                message: parsed.error.message,
            },
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
        await savePetsToDb(parsedData);
        return {
            success: true,
            name: parsedData.name,
            photoUrl: parsedData.photoUrl,
        };
    } catch (error: any) {
        console.error(error);
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

export async function UpdatePetAdmin(
    prevState: any,
    data: { pet: Partial<PetEditFormInput>; petId: string }
) {
    const session = await auth();
    if (!session?.user?.id) unauthorized();
    if (session.user.role !== "admin" && session.user.role !== "staff")
        unauthorized();

    try {
        const parsed = editPetSchemaAdmin.partial().safeParse(data.pet);
        if (!parsed.success) {
            return {
                success: false,
                error: "Pets data failed the validation",
                petId: data.petId,
            };
        }
        const result = await updatePetAdmin(data.petId, parsed.data);
        if (result) return { success: true, pet: result.data };
        return { success: false, petId: data.petId };
    } catch (error) {
        return {
            success: false,
            petId: data.petId,
            error: "An unexpected database error occurred.",
        };
    }
}
