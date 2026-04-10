import {
    IconHeartCheck,
    IconPill,
    IconShieldCheckFilled,
    IconZoomCheckFilled,
} from "@tabler/icons-react";
import { Stack } from "@mantine/core";
import { getServiceByType } from "@/lib/db/services";
import PricingCarousel from "@/components/pricing/PricingCarousel";

export default async function Pricing() {
    const checkups = await getServiceByType("CHECK_UP");
    const grooming = await getServiceByType("GROOMING");
    const vaccines = await getServiceByType("VACCINATION");
    const dewormming = await getServiceByType("DEWORMING");
    return (
        <Stack
            className="w-full min-h-screen h-auto     gap-8 p-10 "
            bg={"gray.0"}
        >
            <PricingCarousel
                title="Check up"
                carouselData={checkups}
                icon={<IconZoomCheckFilled stroke={1.5} size={20} />}
            />
            <PricingCarousel
                title="Dewormming"
                carouselData={dewormming}
                icon={<IconPill stroke={1.5} size={20} />}
            />
            <PricingCarousel
                title="Vaccines"
                carouselData={vaccines}
                icon={<IconShieldCheckFilled stroke={1.5} size={20} />}
            />
            <PricingCarousel
                title="Grooming"
                carouselData={grooming}
                icon={<IconHeartCheck stroke={1.5} size={20} />}
            />
        </Stack>
    );
}
