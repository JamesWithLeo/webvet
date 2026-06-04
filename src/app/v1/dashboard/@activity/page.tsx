import { Carousel, CarouselSlide } from "@mantine/carousel";
import TodaysAppointment from "@/components/dashboard/TodaysAppointment";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import classes from "@/components/css/Carousel.module.css";
import { getNearestAppointment } from "@/lib/db/appointments";
import { unauthorized } from "next/navigation";
import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();
    if (!session) unauthorized();
    const nearestAppointment = await getNearestAppointment({
        id: session.user.id,
    });
    return (
        <Carousel
            classNames={classes}
            withControls
            withIndicators
            height={250}
            emblaOptions={{
                loop: true,
                dragFree: true,
                align: "start",
            }}
            slideSize={{
                base: "100%",
                md: "50%",
                xl: "33.33333333%",
            }}
            slideGap={{ base: "xs", sm: "md" }}
        >
            {nearestAppointment && (
                <CarouselSlide>
                    <TodaysAppointment data={nearestAppointment} />
                </CarouselSlide>
            )}
            <CarouselSlide>
                <DashboardOverview />
            </CarouselSlide>
            <CarouselSlide>
                <div className="bg-gray-200 h-full w-full rounded "></div>
            </CarouselSlide>
            <CarouselSlide>
                <div className="bg-gray-200 h-full w-full rounded "></div>
            </CarouselSlide>
        </Carousel>
    );
}
