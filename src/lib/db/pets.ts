import { db } from "@/db";
import { breeds, pets, species } from "@/db/schema/pets";
import { and, eq, getTableColumns, ne, SQL } from "drizzle-orm";

export const checkExistingPets = async ({
    name,
    breedId,
    ownerId,
}: {
    name: string;
    breedId: number;
    ownerId: string | undefined;
}) => {
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

export const getPetsSpeciesExcept = async (names: string[]) => {
    let condition: SQL[] = [];
    names.forEach((element) => {
        condition.push(ne(species.name, element));
    });

    return await db
        .select()
        .from(species)
        .where(and(...condition));
};

export const getAllPets = async (id: string) => {
    return await db
        .select({
            ...getTableColumns(pets),
            species: species.name,
            breed: breeds.name,
        })
        .from(pets)
        .where(eq(pets.ownerId, id))
        .innerJoin(breeds, eq(pets.breedId, breeds.id))
        .innerJoin(species, eq(breeds.petTypeId, species.id));
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
            breed: pets.breedSpecification,
        })
        .from(pets)
        .where(eq(pets.ownerId, id));
};
