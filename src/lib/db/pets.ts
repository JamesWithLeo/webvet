import { db } from "@/db";
import { breeds, pets } from "@/db/schema/pets";
import { and, eq, getTableColumns, isNotNull, isNull } from "drizzle-orm";

export const checkExistingPets = async ({
    name,
    breedId,
    ownerId,
}: {
    name: string;
    breedId: number | null;
    ownerId: string | undefined;
}) => {
    if (!breedId) return [];
    let condition = [eq(pets.name, name), eq(pets.breedId, breedId)];
    if (ownerId) condition.push(eq(pets.ownerId, ownerId));
    return await db
        .select({ photoUrl: pets.photoUrl, name: pets.name })
        .from(pets)
        .where(and(...condition))
        .limit(1);
};

export const savePetsToDb = async (petsData: typeof pets.$inferInsert) => {
    return await db
        .insert(pets)
        .values(petsData)
        .returning()
        .then((val) => val[0]);
};

export const archivePet = async (id: string) => {
    return await db
        .update(pets)
        .set({ archivedAt: new Date() })
        .where(eq(pets.id, id))
        .returning();
};
export const unarchivePet = async (id: string) => {
    return await db
        .update(pets)
        .set({ archivedAt: null })
        .where(eq(pets.id, id))
        .returning();
};

export const getAllPets = async (id: string) => {
    return await db
        .select({
            ...getTableColumns(pets),
            breed: breeds.name,
        })
        .from(pets)
        .leftJoin(breeds, eq(breeds.id, pets.breedId))
        .where(and(eq(pets.ownerId, id), isNull(pets.archivedAt)));
};
export const getAllArchivedPets = async (id: string) => {
    return await db
        .select({
            ...getTableColumns(pets),
            breed: breeds.name,
        })
        .from(pets)
        .where(and(eq(pets.ownerId, id), isNotNull(pets.archivedAt)))
        .leftJoin(breeds, eq(pets.breedId, breeds.id));
};

export const getAllAlivePets = async (id: string) => {
    return await db
        .select({ id: pets.id, name: pets.name })
        .from(pets)
        .where(and(eq(pets.ownerId, id), eq(pets.life, "alive")));
};

export const getAllPetsIdName = async (id: string) => {
    return await db
        .select({
            id: pets.id,
            name: pets.name,
            photoUrl: pets.photoUrl,
            species: pets.species,
            breed: pets.breedSpecification,
            weight: pets.weight,
        })
        .from(pets)
        .where(eq(pets.ownerId, id));
};

export const getPet = async (petId: string, ownerId: string) => {
    try {
        return await db
            .select()
            .from(pets)
            .where(and(eq(pets.id, petId), eq(pets.ownerId, ownerId)))
            .limit(1)
            .then((v) => v[0]);
    } catch (error) {
        return null;
    }
};

export const getAllPetsAdmin = async () => {
    try {
        const result = await db.select().from(pets);
        return { data: result, error: null };
    } catch (error) {
        console.error(error);
        return { data: null, error: "Failed to load all pets for admin" };
    }
};
