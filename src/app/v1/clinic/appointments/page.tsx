import AdminAppointmentTable from "@/components/tables/AdminAppointmentTable";
import { getAllAppointmentsAdmin } from "@/lib/db/appointments";
import { Stack } from "@mantine/core";
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
        <Stack
            bg={"gray.0"}
            className="w-full h-auto min-h-dvh p-10 flex flex-col gap-4"
        >
            {" "}
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminAppointmentTable scope="all" />
            </HydrationBoundary>
        </Stack>
    );
}
