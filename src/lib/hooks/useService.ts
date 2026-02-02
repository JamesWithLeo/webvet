import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceTypeModel } from "@/db/schema/services";
import { ServiceFormInput } from "../validators/serviceZodSchema";

export function useCreateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            serviceData: any;
            initailPrice: any;
        }) => {
            const res = await fetch("/api/service", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create service");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
}

export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/service/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete service");
            return res.json();
        },
        onSuccess: () => {
            // Sync: refresh the table data
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
}

export function useUpdateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedService: Partial<ServiceTypeModel>) => {
            const res = await fetch(`/api/service/${updatedService.id}`, {
                method: "PATCH",
                body: JSON.stringify(updatedService),
            });
            if (!res.ok) throw new Error("Update failed");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
}
