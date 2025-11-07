import { authOptions } from "@/authOptions";
import CalendarList from "@/components/CalendarList";
import checkSetup from "@/lib/checkSetup";
import { Button } from "@mantine/core";
import { getServerSession } from "next-auth";

export default async function dashboard() {
    const session = await getServerSession(authOptions);
    checkSetup(session);
    return (
        <div className="flex items-center w-full flex-col h-full max-h-full md:px-16 px-4">
            <section className="w-full h-screen flex flex-col grid-cols-[1fr_3fr_1fr]  gap-3">
                <div className="border-x p-3 col-start-2 bg-white  min-h-full flex gap-4 flex-col">
                    <section className="border  bg-linear-to-br  from-cyan-100 to-blue-500 p-8 rounded h-60  w-full">
                        <h1 className="text-sm text-gray-700">
                            Nearest schedule:
                        </h1>
                        <h1 className="text-4xl font-bold">Jins Grooming</h1>
                        <h1 className="text-lg">October 25, 2025 - 8:30 AM</h1>
                        <h1 className="text-lg"></h1>
                        <Button>view on calendar</Button>
                    </section>

                    <CalendarList />
                </div>
            </section>
        </div>
    );
}
