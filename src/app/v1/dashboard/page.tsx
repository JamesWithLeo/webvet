import { authOptions } from "@/authOptions";
import CalendarList from "@/components/CalendarList";
import checkSetup from "@/lib/checkSetup";
import { Button, Stack } from "@mantine/core";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const session = await getServerSession(authOptions);
    checkSetup(session);
    if (!session?.user) redirect("/");
    return (
        <div className="flex items-center w-full h-screen  flex-col   md:px-16 px-4">
            <Stack className=" border-x p-4 w-full h-full  min-h-full flex flex-col gap-2  ">
                <section className=" h-min bg-linear-to-br  from-cyan-100 to-blue-500 p-8 rounded   w-full">
                    <h1 className="text-sm text-gray-700">Nearest schedule:</h1>
                    <h1 className="text-4xl font-bold">
                        Ara&apos;s Vaccination
                    </h1>
                    <h1 className="text-lg">November 21, 2025 - 8:30 AM</h1>
                    <h1 className="text-lg"></h1>
                    <Button>see details</Button>
                </section>

                <div className="w-full  min-h-full">
                    <CalendarList />
                </div>
            </Stack>
        </div>
    );
}
