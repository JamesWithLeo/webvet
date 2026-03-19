"use server";

import { auth } from "@/auth";
import { PetTypeModel } from "@/types/pets";
import { checkExistingPets, savePetsToDb, updatePetAdmin } from "@/lib/db/pets";
import { DeleteUTFile } from "@/lib/uploadthing-util";
import {
    createPetSchema,
    editPetSchemaAdmin,
    PetCreateFormInput,
    PetEditFormInput,
} from "@/lib/validators/petsZodSchema";
import { unauthorized } from "next/navigation";
import { db } from "@/db";
import { pets } from "@/db/schema/pets";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { revalidatePath } from "next/cache";

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

const utapi = new UTApi();

export async function UpdatePetPhoto(
    prevState: any,
    data: {
        petId: string;
        photoUrl: string;
        photoKey: string;
        oldKey: string | null;
    }
) {
    const session = await auth();
    if (!session?.user?.id) unauthorized();

    try {
        if (data.oldKey) {
            await utapi.deleteFiles(data.oldKey);
            console.log("Deleted old file:", data.oldKey);
        }
        const [updatedPet] = await db
            .update(pets)
            .set({ photoUrl: data.photoUrl, photoKey: data.photoKey })
            .where(eq(pets.id, data.petId))
            .returning({ id: pets.id });

        if (updatedPet) {
            return {
                success: true,
                petId: updatedPet.id,
            };
        }
    } catch (error) {
        return {
            success: false,
            petId: data.petId,
            error: "An unexpected database error occurred.",
        };
    }
}

export async function UpdatePetWeight(
    prevState: any,
    data: { weight: string; petId: string }
) {
    try {
        const [updatedPet] = await db
            .update(pets)
            .set({ weight: parseFloat(data.weight) })
            .where(eq(pets.id, data.petId))
            .returning({ id: pets.id, name: pets.name });

        if (!updatedPet) {
            return {
                success: false,
                error: "Pet not found or update failed.",
            };
        }

        revalidatePath("/v1/clinic/invoice/new");

        return {
            success: true,
            petId: updatedPet.id,
            petName: updatedPet.name,
        };
    } catch (error) {
        return {
            success: false,
            petId: data.petId,
            error: "An unexpected database error occurred.",
        };
    }
}
