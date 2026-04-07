import PricingCarousel from "@/components/pricing/PricingCarousel";
import { getServiceByType } from "@/lib/db/services";
import {
    IconHeartCheck,
    IconPill,
    IconShieldCheckFilled,
    IconZoomCheckFilled,
} from "@tabler/icons-react";

export default async function Page() {
    const checkups = await getServiceByType("CHECK_UP");
    const grooming = await getServiceByType("GROOMING");
    const vaccines = await getServiceByType("VACCINATION");
    const dewormming = await getServiceByType("DEWORMING");
    return (
        <div className="h-full  flex-col min-h-dvh md:px-16 px-8 py-8 pb-16 gap-16 w-full flex">
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
        </div>
    );
}
