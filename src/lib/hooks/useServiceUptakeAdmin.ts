"use client";

import { useQuery } from "@tanstack/react-query";

export default function useServiceUptakeAdmin() {
    const query = useQuery({
        queryKey: ["uptake", "admin"],

        staleTime: 1000 * 60 * 5,

        queryFn: async () => {
            const res = await fetch("/api/service/uptake");
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch");
            }

            const data = await res.json();
            console.log();
            return data as any[];
        },
    });

    return {
        ...query,
    };
}
