import AdminAppointmentTable from "@/components/tables/AdminAppointmentTable";
import { Tabs, TabsList, TabsPanel, TabsTab, Title } from "@mantine/core";

export default function IncomingPage() {
    return (
        <div className="w-full h-screen p-16 flex flex-col gap-4">
            <Title>Appointment</Title>

            <Tabs defaultValue={"incoming"}>
                <TabsList grow>
                    <TabsTab value="incoming">Incoming</TabsTab>
                    <TabsTab value="past">Past Dates</TabsTab>
                    <TabsTab value="master">All</TabsTab>
                </TabsList>

                <TabsPanel value="master">
                    <h1>All</h1>
                </TabsPanel>
                <TabsPanel value="incoming" mt={"md"}>
                    <AdminAppointmentTable />
                </TabsPanel>
                <TabsPanel value="past">
                    <h1>past</h1>
                </TabsPanel>
            </Tabs>
        </div>
    );
}
