import { authOptions } from "@/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ScrollVelocity from "@/components/ScrollVelocity";
import HeroSection from "@/components/HeroSection";
import { Alex_Brush } from "next/font/google";
import TimeSection from "@/components/TimeSection";
import TransitionBlock from "@/components/TransitionBlock";
import ProcessSection from "@/components/ProcessSection";

// Font setup
const alexBrush = Alex_Brush({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["400"],
});

export default async function AppPage() {
    const session = await getServerSession(authOptions);
    if (session?.user.id) {
        redirect("/v1");
    }

    return (
        <div className="items-center justify-center bg-[#043343] min-h-dvh flex flex-col  ">
            <HeroSection />
            <section className="h-min  w-full   z-10">
                <ScrollVelocity
                    texts={[
                        "JOSEPH & MARY  · VETERINARY CLINIC  ·",
                        "  GROOMING ·  VACCINATION  ·  EMERGENCY ·  CHECK UP ·",
                    ]}
                    velocity={50}
                    className="custom-scroll-text select-none text-md    text-white "
                />
            </section>
            <section className="z-10 bg-white w-full  ">
                <TimeSection />
                <TransitionBlock />
                <ProcessSection />
            </section>
        </div>
    );
}
