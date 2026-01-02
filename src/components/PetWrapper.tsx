"use client";

import PetControllers from "./PetControllers";
import { useMemo, useReducer, useState } from "react";
import PetCard from "./PetCard";
import NewPetCard from "./NewPetCard";
import { useDebounce } from "use-debounce";

const myPets: {
    gender: "Male" | "Female";
    name: string;
    heart: boolean;
    breed: string;
    imageUrl: string;
    age: number;
    species: "CAT" | "DOG";
    life: "ALIVE" | "DECEASED";
    weight: number;
    createdAt: Date;
}[] = [
    {
        name: "Thunder",
        heart: false,
        gender: "Male",
        breed: "Aspin",
        imageUrl: "",
        age: 5,
        species: "DOG",
        life: "ALIVE",
        weight: 15.1,
        createdAt: new Date("2025-06-22T14:15:00Z"), // Most Recent (June)
    },
    {
        name: "Howl",
        heart: false,
        gender: "Male",
        breed: "Dachshund",
        imageUrl: "/dachshund.jpg",
        age: 3,
        species: "DOG",
        life: "ALIVE",
        weight: 9.2,
        createdAt: new Date("2025-03-10T10:30:00Z"), // (March)
    },
    {
        name: "Ara",
        heart: true,
        breed: "Golden Retriever",
        gender: "Female",
        imageUrl: "/goldenr.jpg",
        age: 8,
        species: "DOG",
        life: "ALIVE",
        weight: 25.4,
        createdAt: new Date("2025-01-15T08:00:00Z"), // (January)
    },
    {
        name: "Kirby",
        heart: false,
        gender: "Female",
        breed: "Persian",
        imageUrl: "/persian.jpg",
        age: 2,
        species: "CAT",
        life: "DECEASED",
        weight: 4.5,
        createdAt: new Date("2024-12-01T09:00:00Z"), // Oldest (Dec 2024)
    },
];
export type FilterStateType = {
    species: "ALL" | "DOG" | "CAT";
    life: "ALL" | "ALIVE" | "DECEASED";
    gender: "All" | "Male" | "Female";
};
export type FilterAction =
    | { type: "UPDATE_SPECIES"; species: "ALL" | "DOG" | "CAT" }
    | { type: "UPDATE_LIFE"; life: "ALL" | "ALIVE" | "DECEASED" }
    | { type: "UPDATE_GENDER"; gender: "All" | "Male" | "Female" };

const filterInitialState: FilterStateType = {
    species: "ALL",
    life: "ALL",
    gender: "All",
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

export default function PetWrapper() {
    const [filterState, filterDispatch] = useReducer(
        filterReducer,
        filterInitialState
    );
    const [sortState, sortDispatch] = useReducer(SortReducer, sortInitialState);

    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [search] = useDebounce(searchTerm, 2000);

    const sortedPet = useMemo(() => {
        if (search) {
            return myPets.filter((v) =>
                v.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (sortState.sortBy === "WEIGHT") {
            return myPets.toSorted((a, b) =>
                sortState.order === "ASC"
                    ? b.weight - a.weight
                    : a.weight - b.weight
            );
        } else if (sortState.sortBy === "AGE") {
            return myPets.toSorted((a, b) =>
                sortState.order === "ASC" ? b.age - a.age : a.age - b.age
            );
        } else {
            return myPets.toSorted((a, b) =>
                sortState.order === "ASC"
                    ? a.createdAt.getTime() - b.createdAt.getTime()
                    : b.createdAt.getTime() - a.createdAt.getTime()
            );
        }
    }, [myPets, sortState, search]);

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
                        (filterState.life === "ALL" ||
                            filterState.life === p.life) &&
                        (filterState.gender === "All" ||
                            filterState.gender === p.gender) &&
                        (filterState.species === "ALL" ||
                            filterState.species === p.species)
                    )
                        return (
                            <PetCard
                                key={`${p.name}_${index}`}
                                name={p.name}
                                heart={p.heart}
                                breed={p.breed}
                                gender={p.gender}
                                imageUrl={p.imageUrl}
                                age={p.age}
                                species={p.species}
                                life={p.life}
                            />
                        );
                })}
                <NewPetCard />
            </section>
        </>
    );
}
