import AdminAppointmentTable from "@/components/tables/AdminAppointmentTable";
import { getAllAppointmentsAdmin } from "@/lib/db/appointments";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

export default function Page() {
    const queryClient = new QueryClient();
    queryClient.prefetchQuery({
        queryKey: ["appointments", "admin", "all"],
        queryFn: () => getAllAppointmentsAdmin("all"),
    });
    return (
        <div className="w-full h-screen p-8 flex flex-col gap-4">
            {" "}
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminAppointmentTable scope="all" />
            </HydrationBoundary>
        </div>
    );
}
