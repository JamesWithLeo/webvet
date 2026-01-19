"use client";

import PetControllers from "./PetControllers";
import { useMemo, useReducer, useState } from "react";
import PetCard from "./PetCard";
import NewPetCard from "./NewPetCard";
import { useDebounce } from "use-debounce";
import { PetTypeModel } from "@/db/schema/pets";
import calculatePetAge from "@/lib/calculatePetAge";

export type FilterStateType = {
    species: "all" | "dog" | "cat";
    life: "all" | "alive" | "deceased";
    gender: "all" | "male" | "female";
};
export type FilterAction =
    | { type: "UPDATE_SPECIES"; species: "all" | "dog" | "cat" }
    | { type: "UPDATE_LIFE"; life: "all" | "alive" | "deceased" }
    | { type: "UPDATE_GENDER"; gender: "all" | "male" | "female" };

const filterInitialState: FilterStateType = {
    species: "all",
    life: "all",
    gender: "all",
};

function filterReducer(state: FilterStateType, action: FilterAction) {
    if (action.type === "UPDATE_SPECIES") {
        return {
            ...state,
            species: action.species,
        } as FilterStateType;
    } else if (action.type === "UPDATE_LIFE") {
        return {
            ...state,
            life: action.life,
        } as FilterStateType;
    } else if (action.type === "UPDATE_GENDER") {
        return {
            ...state,
            gender: action.gender,
        } as FilterStateType;
    } else {
        return filterInitialState;
    }
}

export type SortStateType = {
    sortBy: "DEFAULT" | "AGE" | "WEIGHT";
    order: "ASC" | "DESC";
};

const sortInitialState: SortStateType = {
    sortBy: "DEFAULT",
    order: "DESC",
};

export type SortAction =
    | { type: "SET_ORDER"; value: "ASC" | "DESC" }
    | { type: "RESET" }
    | { type: "SET_SORT"; sortBy: "DEFAULT" | "AGE" | "WEIGHT" };

function SortReducer(state: SortStateType, action: SortAction) {
    switch (action.type) {
        case "SET_ORDER":
            return {
                ...state,
                order:
                    state.order === "ASC"
                        ? ("DESC" as const)
                        : ("ASC" as const),
            };
        case "SET_SORT":
            return {
                ...state,
                sortBy: action.sortBy,
            };
        case "RESET":
            return sortInitialState;
    }
}
type petTypeWithSpecies = PetTypeModel & { species: string; breed: string };
type Props = {
    pets: petTypeWithSpecies[];
};

export default function PetWrapper({ pets }: Props) {
    const [filterState, filterDispatch] = useReducer(
        filterReducer,
        filterInitialState
    );
    const [sortState, sortDispatch] = useReducer(SortReducer, sortInitialState);

    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [search] = useDebounce(searchTerm, 2000);

    const sortedPet = useMemo(() => {
        if (search) {
            return pets.filter((v) =>
                v.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sortState.sortBy === "WEIGHT") {
            return pets.toSorted((a, b) =>
                sortState.order === "ASC"
                    ? (b.weight ?? 0) - (a.weight ?? 0)
                    : (a.weight ?? 0) - (b.weight ?? 0)
            );
        } else if (sortState.sortBy === "AGE") {
            return pets.toSorted((a, b) => {
                const petOneAge = calculatePetAge(a.dateOfBirth);
                const petTwoAge = calculatePetAge(b.dateOfBirth);
                return sortState.order === "ASC"
                    ? (petTwoAge.years ?? petTwoAge.months ?? 0) -
                          (petOneAge.years ?? petOneAge.months ?? 0)
                    : (petOneAge.years ?? petOneAge.months ?? 0) -
                          (petTwoAge.years ?? petTwoAge.months ?? 0);
            });
        } else {
            return pets.toSorted((a, b) =>
                sortState.order === "ASC"
                    ? a.createdAt.getTime() - b.createdAt.getTime()
                    : b.createdAt.getTime() - a.createdAt.getTime()
            );
        }
    }, [pets, sortState, search]);

    return (
        <>
            <PetControllers
                filterState={filterState}
                filterDispatch={filterDispatch}
                sortState={sortState}
                sortDispatch={sortDispatch}
                setSearch={setSearchTerm}
            />
            <section className="flex gap-4 w-full justify-center flex-wrap">
                {sortedPet.map((p, index) => {
                    if (
                        (filterState.life === "all" ||
                            filterState.life === p.life) &&
                        (filterState.gender === "all" ||
                            filterState.gender === p.gender) &&
                        (filterState.species === "all" ||
                            filterState.species === p.species)
                    )
                        return (
                            <PetCard
                                key={`${p.name}_${index}`}
                                name={p.name}
                                heart={p.isLike}
                                breed={p.breed}
                                breedSpecification={p.breedSpecification}
                                gender={p.gender}
                                imageUrl={p.photoUrl}
                                dateOfBirth={p.dateOfBirth}
                                life={p.life}
                                species={p.species}
                                id={p.id}
                            />
                        );
                })}
                <NewPetCard />
            </section>
        </>
    );
}
