import ScrollVelocity from "@/components/common/ScrollVelocity";
import HeroSection from "@/components/common/HeroSection";
import TimeSection from "@/components/TimeSection";
import ProcessSection from "@/components/ProcessSection";
import BottomPattern from "@/components/common/BottomPattern";

export default function AppPage() {
    return (
        <div
            className="items-center justify-center
         bg-[#043343]
          min-h-dvh flex flex-col  "
        >
            <HeroSection />
            <section className={`h-min z-10  w-full  `}>
                <ScrollVelocity
                    texts={[
                        "JOSEPH & MARY  · VETERINARY CLINIC  ·",
                        "  GROOMING ·  VACCINATION  ·  DEWORMMING ·  CHECK UP ·",
                    ]}
                    velocity={50}
                    className="custom-scroll-text select-none text-md    text-white "
                />
            </section>
            <section className="relative z-0 w-full  bg-white ">
                <TimeSection />
                <ProcessSection />
            </section>
        </div>
    );
}
