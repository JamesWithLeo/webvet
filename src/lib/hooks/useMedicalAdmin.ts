import { useQuery } from "@tanstack/react-query";
import { VetData } from "../db/invoice";

interface DateRange {
    from?: string | null;
    to?: string | null;
}

const fetchMedicals = async (range?: DateRange): Promise<VetData[]> => {
    const params = new URLSearchParams();
    if (range?.from) params.append("from", range.from);
    if (range?.to) params.append("to", range.to);

    const response = await fetch(`/api/admin/medical?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export default function useMedicalAdmin(range?: DateRange) {
    return useQuery({
        // Include range in the queryKey so it refetches on date change
        queryKey: ["medical", "admin", range],
        queryFn: () => fetchMedicals(range),
    });
}
