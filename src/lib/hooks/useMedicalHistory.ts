"use client";

import { MedicalLogsTypeModel } from "@/db/schema/medicalLogs";
import { ServiceTypeModel } from "@/db/schema/services";
import { useQuery } from "@tanstack/react-query";

type MedicalWithService = MedicalLogsTypeModel & { service: ServiceTypeModel };

const fetchMedicals = async (id: string | undefined) => {
    if (!id) return null;

    const response = await fetch(`/api/admin/pets/medical?petId=${id}`);

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export default function useMedicalHistory(id?: string | undefined) {
    return useQuery<MedicalWithService[]>({
        queryKey: ["pets", "admin", "history", id],
        queryFn: () => fetchMedicals(id),
        enabled: !!id,
    });
}
