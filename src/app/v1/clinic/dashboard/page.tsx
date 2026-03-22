import AdminGreet from "@/components/admin/AdminGreeting";
import UsersPanels from "@/components/admin/UserPanel";
import AppointmentPanels from "@/components/admin/AppointmentPanels";
import PetPanels from "@/components/admin/PetPanel";
import AdminServiceOpertations from "@/components/admin/AdminServiceOperations";
import { getGrossRevenue, getSalesByService } from "@/lib/db/invoice";
import { Stack } from "@mantine/core";

export default async function Dashboard() {
    const gross = await getGrossRevenue();
    const sales = await getSalesByService();
    return (
        <Stack className=" min-h-screen     gap-8 p-10 " bg={"gray.0"}>
            <section className=" grid flex-wrap h-full  gap-4 grid-cols-4 grid-rows-3">
                <AdminGreet gross={gross} sales={sales} />
                <AdminServiceOpertations />
                <UsersPanels />
                <PetPanels />
                {/* <AppointmentPanels /> */}
            </section>
        </Stack>
    );
}
