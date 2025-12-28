import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ScrollVelocity from "@/components/ScrollVelocity";
import HeroSection from "@/components/HeroSection";
import TimeSection from "@/components/TimeSection";
import ProcessSection from "@/components/ProcessSection";

export default async function AppPage() {
    const session = await auth();
    if (session?.user.id) {
        redirect("/v1");
    }

    return (
        <div
            className="items-center justify-center
         bg-[#043343]
          min-h-dvh flex flex-col  "
        >
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
            <section className="z-10  w-full  bg-white ">
                <TimeSection />
                {/* <TransitionBlock /> */}
                <ProcessSection />
            </section>
        </div>
    );
}
