import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlockType } from "../generateBlockPayload";

export function useAddBlockDates() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            dates: string[];
            type: BlockType;
            reason: string;
        }) => {
            const res = await fetch("/api/blockdates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to block dates");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blockedDates"] });
        },
    });
}

export function useUpdateBlockDates() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { dates: string[] }) => {
            const res = await fetch("/api/blockdates", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to enable blocked dates");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blockedDates"] });
        },
    });
}
