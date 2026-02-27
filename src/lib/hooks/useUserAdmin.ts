"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminUserSummary, Role, UserGender } from "@/types/user";
import { useState } from "react";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";

export default function useUserAdmin() {
    const [sortStatus, setSortStatus] = useState<
        DataTableSortStatus<AdminUserSummary>
    >({
        columnAccessor: "role",
        direction: "desc",
    });
    const [searchFirstName, setSearchFirstName] = useState<string>("");
    const [searchLastName, setSearchLastName] = useState<string>("");
    const [searchRole, setSearchRole] = useState<"all" | Role>("all");
    const [searchGender, setSearchGender] = useState<"all" | UserGender>("all");

    const query = useQuery<AdminUserSummary[], Error>({
        queryKey: ["user", "admin"],

        queryFn: async () => {
            const res = await fetch("/api/admin/users", { method: "GET" });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch users");
            }

            const data = await res.json();
            return data as AdminUserSummary[];
        },
        staleTime: 1000 * 60 * 5,
        select: (data) => {
            const fSearch = searchFirstName?.toLowerCase();
            const lSearch = searchLastName?.toLowerCase();

            const filtered = data.filter((user) => {
                const matchesFirst = fSearch
                    ? user.firstName?.toLowerCase().includes(fSearch)
                    : true;
                const matchesLast = lSearch
                    ? user.lastName?.toLowerCase().includes(lSearch)
                    : true;

                const matchesRole =
                    searchRole === "all"
                        ? true
                        : user.role?.toLowerCase() === searchRole.toLowerCase();
                const matchesGender =
                    searchGender === "all"
                        ? true
                        : user.gender?.toLowerCase() ===
                          searchGender.toLowerCase();

                return (
                    matchesFirst && matchesLast && matchesRole && matchesGender
                );
            });

            const sorted = sortBy(filtered, sortStatus.columnAccessor);
            return sortStatus.direction === "desc" ? sorted.reverse() : sorted;
        },
    });
    return {
        ...query,
        searchFirstName,
        setSearchFirstName,
        searchLastName,
        setSearchLastName,
        searchRole,
        setSearchRole,
        searchGender,
        setSearchGender,
    };
}
