import { Carousel, CarouselSlide } from "@mantine/carousel";
import TodaysAppointment from "@/components/dashboard/TodaysAppointment";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import classes from "@/components/css/Carousel.module.css";

export default function Page() {
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
            slideGap={{ base: 0, sm: "md" }}
        >
            <CarouselSlide>
                <TodaysAppointment />
            </CarouselSlide>
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
