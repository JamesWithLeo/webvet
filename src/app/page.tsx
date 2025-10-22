import { Alex_Brush } from "next/font/google";
const alexBrush = Alex_Brush({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["400"],
});
import { authOptions } from "@/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@mantine/core";

export default async function AppPage() {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        redirect("/v1/dashboard");
    }

    return (
        <div className="items-center justify-center  min-h-dvh flex flex-col py-8 px-16 ">
            <section id="hero" className="w-full">
                <div className="bg-[url('/pexels-gustavo.jpg')] top-0 left-0 bg-local bg-cover w-full bg-center fixed h-screen -z-10"></div>
                <div className="w-full py-8 flex items-center flex-col z-10">
                    {/* text-[#252728] */}
                    <h1
                        className={`${alexBrush.className} text-white text-5xl sm:text-7xl lg:text-9xl `}
                    >
                        Joseph & Mary
                    </h1>
                    <h1 className="text-3xl lg:text-7xl font-black sm:text-5xl text-[#0b6088] ">
                        Veterinary Clinic
                    </h1>
                </div>
                <div className="w-full flex items-center flex-col">
                    <Button
                        className="w-min mt-4 text-[#043343]"
                        color="#043343"
                    >
                        <Link href={"/v1/signup"}>Get started</Link>
                    </Button>
                </div>

                <div className="bg-gradient-to-t from-gray-700 from-80% absolute top-0 left-0 w-full h-screen opacity-45 -z-10 "></div>
            </section>
        </div>
    );
}
