"use client";

import PetControllers from "./PetControllers";
import { useMemo, useReducer, useState } from "react";
import PetCard from "./PetCard";
import NewPetCard from "./NewPetCard";
import { useDebounce } from "use-debounce";
import calculatePetAge from "@/lib/calculatePetAge";
import usePets from "@/lib/hooks/usePets";

export type FilterStateType = {
    species: "all" | "dog" | "cat";
    life: "all" | "alive" | "deceased";
    gender: "all" | "male" | "female";
    scope: "all" | "archived";
};
export type FilterAction =
    | { type: "UPDATE_SPECIES"; species: "all" | "dog" | "cat" }
    | { type: "UPDATE_LIFE"; life: "all" | "alive" | "deceased" }
    | { type: "UPDATE_GENDER"; gender: "all" | "male" | "female" }
    | { type: "UPDATE_SCOPE"; scope: "all" | "archived" };

const filterInitialState: FilterStateType = {
    species: "all",
    life: "all",
    gender: "all",
    scope: "all",
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
    } else if (action.type === "UPDATE_SCOPE") {
        return {
            ...state,
            scope: action.scope,
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

type Props = {
    id: string;
};

export default function PetWrapper({ id }: Props) {
    const [filterState, filterDispatch] = useReducer(
        filterReducer,
        filterInitialState
    );
    const { data: pets, isPending } = usePets(id, filterState.scope);

    const [sortState, sortDispatch] = useReducer(SortReducer, sortInitialState);

    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [search] = useDebounce(searchTerm, 2000);

    const sortedPet = useMemo(() => {
        if (!pets) return [];

        console.log("Memo recalculating. Pets count:", pets?.length);
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
            return [...pets].sort((a, b) => {
                const timeA = new Date(a.createdAt).getTime();
                const timeB = new Date(b.createdAt).getTime();

                return sortState.order === "ASC"
                    ? timeA - timeB
                    : timeB - timeA;
            });
        }
    }, [pets, search, sortState.order, sortState.sortBy, isPending]);

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
                        return <PetCard key={`${p.name}_${index}`} pet={p} />;
                })}
                <NewPetCard />
            </section>
        </>
    );
}
