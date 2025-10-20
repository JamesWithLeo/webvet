import { authOptions } from "@/authOptions";
import Logo from "@/components/Logo";
// import { Button } from "@/components/ui/button";
import { Button } from "@mantine/core";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/");
    }
    return (
        <div className="flex items-center  flex-col h-screen md:px-16 px-4">
            <section className="w-full h-screen grid grid-cols-[1fr_3fr_1fr] gap-3">
                <div className="bg-[url('/paw-prints.svg')]  h-full w-full bg-repeat bg-[length:80px_80px]  bg-center"></div>
                <div className="border-x p-3  min-h-full flex gap-4 flex-col">
                    <section className="border  bg-linear-to-br  from-cyan-100 to-blue-500 p-8 rounded h-60  w-full">
                        <h1 className="text-sm text-gray-700">
                            Nearest schedule:
                        </h1>
                        <h1 className="text-4xl font-bold">Jins Grooming</h1>
                        <h1 className="text-lg">October 25, 2025 - 8:30 AM</h1>
                        <h1 className="text-lg"></h1>
                    </section>

                    <section className="border-t py-4 flex gap-2 flex-col">
                        <div className="h-40 w-full bg-gray-100  p-8 rounded-md">
                            <h1>Ara Deworming</h1>
                        </div>

                        <div className="h-40 w-full bg-gray-100  p-8 rounded-md">
                            <h1>Chloe Check up</h1>
                        </div>
                        <div className="flex items-end flex-col w-full">
                            <Button className="w-min " variant={"outline"}>
                                See more
                                {/* <ArrowRight /> */}
                            </Button>
                        </div>
                    </section>
                </div>

                <div className="bg-[url('/paw-prints.svg')]  h-full w-full bg-repeat bg-[length:80px_80px]  bg-center"></div>
            </section>
            <footer className="border-t border-gray-300 h-16 w-full"></footer>
        </div>
    );
}
