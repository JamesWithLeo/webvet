import AppointmentCard from "@/components/AppointmentCard";
import { Title } from "@mantine/core";

export default async function AppointmentPage() {
    return (
        <>
            <div className="flex  items-center gap-8 w-full h-screen  flex-col   ">
                <div className="min-h-screen w-full relative md:p-16 px-4 flex gap-8 flex-col">
                    {/* Dashed Bottom Fade Grid */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
                            backgroundSize: "20px 20px",
                            backgroundPosition: "0 0, 0 0",
                            maskImage: `
         repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
                            WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
                            maskComposite: "intersect",
                            WebkitMaskComposite: "source-in",
                        }}
                    />
                    <Title c={"dimmed"}>2025</Title>
                    <AppointmentCard
                        name="Jin"
                        service="Grooming"
                        species="DOG"
                        doctor="Dr. Han"
                        date={new Date("2025-11-23")}
                    />
                    <Title c={"dimmed"}>2024</Title>
                    <AppointmentCard
                        name="Kirby"
                        service="Check up"
                        species="CAT"
                        paid={true}
                        doctor="Dra. Carpio"
                        date={new Date("2024-04-13")}
                    />
                </div>
            </div>
        </>
    );
}
