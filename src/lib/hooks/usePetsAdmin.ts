import { AdminPetsSummary } from "@/types/pets";
import { useQuery } from "@tanstack/react-query";

export default function usePetsAdmin() {
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
    });
    return { ...query };
}
