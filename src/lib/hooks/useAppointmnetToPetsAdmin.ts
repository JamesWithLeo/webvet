"use client";

import { useQuery } from "@tanstack/react-query";

type Return = {
    pets: {
        id: string;
        name: string;
        photoUrl: string | null;
        serviceName: string;
    }[];
};
export default function useAppointmentToPets(id: string) {
    return useQuery<Return>({
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
            return data as Return;
        },
        staleTime: 1000 * 60 * 5,
    });
}
