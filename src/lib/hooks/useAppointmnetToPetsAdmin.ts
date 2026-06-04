"use client";

import PetServiceMerged from "@/types/PetsServiceMerged";
import { useQuery } from "@tanstack/react-query";

export default function useAppointmentToPets(id: string | null) {
    return useQuery<{ pets: PetServiceMerged[] }>({
        queryKey: ["appointments", id],
        queryFn: async () => {
            if (!id) throw new Error("No Appointment ID provided");

            const res = await fetch(
                `/api/admin/appointments/appointmentToPets?id=${id}`,
                { method: "GET" }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch");
            }

            const data = await res.json();
            return data as { pets: PetServiceMerged[] };
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}
