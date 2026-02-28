import AdminGreet from "@/components/admin/AdminGreeting";
import UsersPanels from "@/components/admin/UserPanel";
import AppointmentPanels from "@/components/admin/AppointmentPanels";
import PetPanels from "@/components/admin/PetPanel";
import AdminServiceOpertations from "@/components/admin/AdminServiceOperations";
import { getGrossRevenue, getSalesByService } from "@/lib/db/invoice";
// import AdminNotificatons from "@/components/admin/AdminNotifications";

export default async function Dashboard() {
    const gross = await getGrossRevenue();
    const sales = await getSalesByService();
    return (
        <div className="w-full h-screen p-16 ">
            <section className=" grid h-full  gap-4 grid-cols-3 grid-rows-3">
                <AdminGreet gross={gross} sales={sales} />
                <AdminServiceOpertations />
                {/* <AdminNotificatons /> */}
                <UsersPanels />
                <PetPanels />
                <AppointmentPanels />

                {/* <Paper withBorder className="p-4 row-span-2 ">
                    <h1 className="text-md text-gray-400 font-medium">
                        Active Personel
                    </h1>
                    <Paper withBorder className="p-2 mt-2">
                        <div className="flex justify-between">
                            <h1 className="text-blue-400">Venus Angela</h1>
                            <h1 className="text-sm text-gray-400">
                                until 12:00 PM
                            </h1>
                        </div>
                        <h1 className="text-sm ">Staff</h1>
                    </Paper>
                    <Paper withBorder className="p-2 mt-2">
                        <div className="flex justify-between">
                            <h1 className="text-blue-400">Abegail Paral</h1>
                            <h1 className="text-sm text-gray-400">
                                until 11:00 AM
                            </h1>
                        </div>
                        <h1 className="text-sm ">Veterinarian</h1>
                    </Paper>
                </Paper> */}
            </section>
        </div>
    );
}
