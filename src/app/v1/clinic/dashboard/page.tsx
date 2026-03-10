import AdminGreet from "@/components/admin/AdminGreeting";
import UsersPanels from "@/components/admin/UserPanel";
import AppointmentPanels from "@/components/admin/AppointmentPanels";
import PetPanels from "@/components/admin/PetPanel";
import AdminServiceOpertations from "@/components/admin/AdminServiceOperations";
import { getGrossRevenue, getSalesByService } from "@/lib/db/invoice";

export default async function Dashboard() {
    const gross = await getGrossRevenue();
    const sales = await getSalesByService();
    return (
        <div className="w-full h-screen p-16 ">
            <section className=" grid h-full  gap-4 grid-cols-3 grid-rows-3">
                <AdminGreet gross={gross} sales={sales} />
                <AdminServiceOpertations />
                <UsersPanels />
                <PetPanels />
                <AppointmentPanels />
            </section>
        </div>
    );
}
