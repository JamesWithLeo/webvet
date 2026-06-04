import { AppointmentWithInvoice } from "@/types/appointments";
import { useQuery } from "@tanstack/react-query";

const fetchAppointments = async (
    id: string
): Promise<AppointmentWithInvoice[]> => {
    const res = await fetch(`/api/appointments?id=${id}`);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    return res.json();
};

export default function useApointmentsClient(id: string) {
    return useQuery({
        queryKey: ["appointments", id],
        queryFn: () => fetchAppointments(id),
    });
}
