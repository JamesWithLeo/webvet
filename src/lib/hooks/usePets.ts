import { PetTypeModelWithBreed } from "@/db/schema/pets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchPets = async (
    ownerId: string,
    scope: "all" | "archived"
): Promise<PetTypeModelWithBreed[]> => {
    const response = await fetch(`/api/pets?id=${ownerId}&scope=${scope}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export default function usePets(id: string, scope: "all" | "archived") {
    return useQuery({
        queryKey: ["pets", id, scope],
        queryFn: () => fetchPets(id, scope),
    });
}

export function useUpdatePetArchive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            isArchived,
        }: {
            id: string;
            isArchived: boolean;
        }) => {
            const res = await fetch(`/api/pets/${id}/archive`, {
                method: "PATCH",
                body: JSON.stringify({ isArchived }),
            });
            if (!res.ok) throw new Error("Update failed");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] });
        },
    });
}
