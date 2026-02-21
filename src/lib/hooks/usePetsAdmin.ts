import { AdminPetsSummary } from "@/types/pets";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function usePetsAdmin() {
    const [queryId, setQueryId] = useState<string>("");

    const query = useQuery<AdminPetsSummary[], Error>({
        queryKey: ["pets", "admin"],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const res = await fetch("/api/admin/pets", { method: "GET" });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch pets");
            }

            const data = await res.json();
            return data as AdminPetsSummary[];
        },
        select: (data) => {
            if (!queryId) return data;

            const lowerQueryId = queryId.toLowerCase();
            let filtered = data;
            filtered = data.filter(
                (pet) =>
                    pet.id.startsWith(lowerQueryId) ||
                    pet.id.endsWith(lowerQueryId) ||
                    pet.id === lowerQueryId
            );
            return filtered;
        },
    });
    return { ...query, queryId, setQueryId };
}
