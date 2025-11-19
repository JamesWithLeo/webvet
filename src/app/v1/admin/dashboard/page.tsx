import { Paper } from "@mantine/core";
import AdminGreet from "@/components/AdminGridPanels/AdminGreeting";
import UsersPanels from "@/components/AdminGridPanels/UserPanels";
import AppointmentPanels from "@/components/AdminGridPanels/AppointmentPanels";
import PetPanels from "@/components/AdminGridPanels/PetPanel";
import AdminServiceOpertations from "@/components/AdminGridPanels/AdminServiceOperations";
import AdminNotificatons from "@/components/AdminNotifications";

export const donutData = [
    { name: "USA", value: 400, color: "indigo.6" },
    { name: "India", value: 300, color: "yellow.6" },
    { name: "Japan", value: 100, color: "teal.6" },
    { name: "Other", value: 200, color: "gray.6" },
];
export const data = [
    {
        date: "Mar 22",
        Apples: 2890,
        Oranges: 2338,
        Tomatoes: 2452,
    },
    {
        date: "Mar 23",
        Apples: 2756,
        Oranges: 2103,
        Tomatoes: 2402,
    },
    {
        date: "Mar 24",
        Apples: 3322,
        Oranges: 986,
        Tomatoes: 1821,
    },
    {
        date: "Mar 25",
        Apples: 3470,
        Oranges: 2108,
        Tomatoes: 2809,
    },
    {
        date: "Mar 26",
        Apples: 3129,
        Oranges: 1726,
        Tomatoes: 2290,
    },
];
export default function Dashboard() {
    return (
        <div className="w-full h-screen p-16 ">
            <section className=" grid h-full  gap-4 grid-cols-3 grid-rows-4">
                <AdminGreet />
                <AppointmentPanels />
                <AdminServiceOpertations />
                <AdminNotificatons />
                <UsersPanels />
                <PetPanels />

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
