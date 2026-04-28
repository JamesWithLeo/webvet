"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminUserSummary, Role } from "@/types/user";
import { useMemo, useState } from "react";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";

export default function useUserAdmin() {
    const [sortStatus, setSortStatus] = useState<
        DataTableSortStatus<AdminUserSummary>
    >({
        columnAccessor: "role",
        direction: "desc",
    });
    const [searchFirstName, setSearchFirstName] = useState("");
    const [searchLastName, setSearchLastName] = useState("");
    const [searchRole, setSearchRole] = useState<"all" | Role>("all");

    const query = useQuery<AdminUserSummary[], Error>({
        queryKey: ["user", "admin"],
        queryFn: async () => {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
        staleTime: 1000 * 60 * 5,
    });

    const records = useMemo(() => {
        if (!query.data) return [];

        const fSearch = searchFirstName.toLowerCase();
        const lSearch = searchLastName.toLowerCase();

        const filtered = query.data.filter((user) => {
            const matchesFirst =
                !fSearch || user.firstName?.toLowerCase().includes(fSearch);
            const matchesLast =
                !lSearch || user.lastName?.toLowerCase().includes(lSearch);
            const matchesRole =
                searchRole === "all" || user.role === searchRole;
            return matchesFirst && matchesLast && matchesRole;
        });

        const sorted = sortBy(filtered, (item) => {
            const value =
                item[sortStatus.columnAccessor as keyof AdminUserSummary];
            if (sortStatus.columnAccessor === "dateOfBirth" && value) {
                return new Date(value as string).getTime();
            }
            return typeof value === "string" ? value.toLowerCase() : value;
        });

        return sortStatus.direction === "desc" ? sorted.reverse() : sorted;
    }, [query.data, sortStatus, searchFirstName, searchLastName, searchRole]);
    return {
        ...query,
        records,
        sortStatus,
        setSortStatus,
        searchFirstName,
        setSearchFirstName,
        searchLastName,
        setSearchLastName,
        searchRole,
        setSearchRole,
    };
}
