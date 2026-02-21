import AdminAppointmentTable from "@/components/tables/AdminAppointmentTable";
import { getAllAppointmentsAdmin } from "@/lib/db/appointments";
import { Tabs, TabsList, TabsPanel, TabsTab, Title } from "@mantine/core";
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
        <div className="w-full h-screen p-16 flex flex-col gap-4">
            {" "}
            <Title>Appointment</Title>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Tabs defaultValue={"incoming"}>
                    <TabsList grow>
                        <TabsTab value="all">All</TabsTab>
                        <TabsTab value="incoming">Incoming</TabsTab>
                        <TabsTab value="past">Past Dates</TabsTab>
                    </TabsList>

                    <TabsPanel value="all">
                        <AdminAppointmentTable scope="all" />
                    </TabsPanel>
                    <TabsPanel value="incoming">
                        <AdminAppointmentTable scope="incoming" />
                    </TabsPanel>
                    <TabsPanel value="past">
                        <AdminAppointmentTable scope="past" />
                    </TabsPanel>
                </Tabs>
            </HydrationBoundary>
        </div>
    );
}
