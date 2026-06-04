import AdminGreet from "@/components/admin/AdminGreeting";
import UsersPanels from "@/components/admin/UserPanel";
import PetPanels from "@/components/admin/PetPanel";
import AdminServiceOpertations from "@/components/admin/AdminServiceOperations";
import { getGrossRevenue, getSalesByService } from "@/lib/db/invoice";
import { Stack } from "@mantine/core";

export default async function Dashboard() {
    const gross = await getGrossRevenue();
    const sales = await getSalesByService();
    return (
        <Stack className=" min-h-screen     gap-8 p-10 " bg={"gray.0"}>
            <section className=" grid flex-wrap h-full grid-col-1  gap-4 lg:grid-cols-4 ">
                <AdminGreet gross={gross} sales={sales} />
                <AdminServiceOpertations />
                <UsersPanels />
                <PetPanels />
            </section>
        </Stack>
    );
}
