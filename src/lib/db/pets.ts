import { db } from "@/db";
import { pets, species } from "@/db/schema/pets";
import { and, ne, SQL } from "drizzle-orm";

export const checkExistingPets = async () => {};
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
