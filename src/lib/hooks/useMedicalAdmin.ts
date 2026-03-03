import { useQuery } from "@tanstack/react-query";
import { VetData } from "../db/invoice";

const fetchMedicals = async (): Promise<VetData[]> => {
    const response = await fetch(`/api/admin/medical`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export default function useMedicalAdmin() {
    return useQuery({
        queryKey: ["medical", "admin"],
        queryFn: () => fetchMedicals(),
    });
}
