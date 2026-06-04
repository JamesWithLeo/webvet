import { AdminPetsSummary } from "@/types/pets";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function usePetsAdmin(
    page: number | null,
    pageSize: number,
    highlight?: string | null
) {
    const [queryId, setQueryId] = useState<string>("");

    const query = useQuery({
        queryKey: ["pets", "admin", page, pageSize, highlight],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const res = await fetch(
                `/api/admin/pets?pageSize=${pageSize}&page=${page}&highlight=${highlight ?? ""}`
            );
            if (!res.ok) throw new Error("Failed to fetch pets");

            const result = await res.json();
            return result as {
                data: AdminPetsSummary[];
                totalCount: number;
                currentPage: number;
                error: string | null;
            };
        },
        select: (data) => {
            if (!queryId) return data;

            const lowerQueryId = queryId.toLowerCase();
            const filtered = data.data.filter(
                (pet) =>
                    pet.id.startsWith(lowerQueryId) ||
                    pet.id.endsWith(lowerQueryId) ||
                    pet.id === lowerQueryId
            );

            return {
                ...data,
                data: filtered,
            };
        },
    });

    // Use optional chaining since query.data is undefined while loading
    return {
        ...query,
        data: query.data?.data ?? [],
        totalCount: query.data?.totalCount ?? 0,
        currentPage: query.data?.currentPage ?? 1,
        queryId,
        setQueryId,
    };
}
