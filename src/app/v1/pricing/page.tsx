import PricingCarousel from "@/components/pricing/PricingCarousel";
import { getServiceByType } from "@/lib/db/services";
import {
    IconHeartCheck,
    IconPill,
    IconShieldCheckFilled,
    IconZoomCheckFilled,
} from "@tabler/icons-react";

const vaccinePrices = [
    {
        title: "5-in-1 Vaccine",
        description:
            "A core multi-protection shot that safeguards your dog against five highly contagious and potentially fatal viral diseases.",
        inclusion: [
            "Parvovirus",
            "Distemper",
            "Hepatitis",
            "Parainfluenza",
            "Leptospirosis",
        ],
        priceLabel: "600-700 per dog (vaccine)",
        price: 700,
        serviceType: "vaccination",
        reminder:
            "At least 6 weeks old, dewormed, and in good health (no fever/diarrhea).",
    },
    {
        title: "6-in-1 Vaccine",
        description:
            "Comprehensive protection similar to the 5-in-1, with an added defense against Canine Coronavirus which affects the gastrointestinal tract.",
        inclusion: [
            "Parvovirus",
            "Distemper",
            "Hepatitis",
            "Parainfluenza",
            "Leptospirosis",
            "Coronavirus",
        ],
        priceLabel: "600-700 per dog (vaccine)",
        price: 700,
        serviceType: "vaccination",
        reminder: "At least 6 weeks old, dewormed, and in good health.",
    },
    {
        title: "Anti-Rabies Vaccine",
        description:
            "A legally required, life-saving vaccination that protects your pet and your family from the fatal Rabies virus.",
        inclusion: ["Rabies Virus"],
        priceLabel: "350 per pet",
        price: 350,
        serviceType: "vaccination",
        reminder: "At least 3 months old with no health concerns.",
    },
    {
        title: "Kennel Cough Vaccine",
        description:
            "Prevents infectious tracheobronchitis, a highly contagious respiratory disease common in social dogs and boarding facilities.",
        inclusion: ["Bordetella Bronchiseptica"],
        priceLabel: "600 per dog (vaccine)",
        price: 600,
        serviceType: "vaccination",
        reminder:
            "Recommended for dogs that frequently interact with other pets.",
    },
    {
        title: "Cat Vaccine",
        description:
            "Also known as the FVRCP vaccine, it protects cats against major respiratory infections and feline distemper.",
        inclusion: [
            "Feline Panleukopenia",
            "Calicivirus",
            "Rhinotracheitis",
            "Chlamydia",
        ],
        priceLabel: "1,200 per cat",
        price: 1200,
        serviceType: "vaccination",
        reminder: "Must be dewormed and with no health concerns.",
    },
];

const groomingPrices = [
    {
        title: "Dog Sanitary Grooming",
        description:
            "Focuses on essential hygiene areas: paw pads, belly, and sanitary areas. Ideal for maintenance between full grooms.",
        inclusion: ["Paw pad trimming", "Sanitary trim", "Nail clipping"],
        priceLabel: "₱400 - ₱800 depending on size",
        pricesBySize: {
            small: 400,
            medium: 500,
            large: 800,
        },
        serviceType: "grooming",
        reminder: "Available for all ages; strictly by appointment.",
        status: "available",
    },
    {
        title: "Dog Full Grooming (Semi-Kalbo)",
        description:
            "A complete shave-down for comfort and hygiene. Best for managing thick coats or heat regulation.",
        inclusion: [
            "Full body shave",
            "Bath & Blow dry",
            "Nail cut",
            "Ear cleaning",
        ],
        priceLabel: "₱500 - ₱1,500 depending on size",
        pricesBySize: {
            small: 500,
            medium: 600,
            large: 1500,
        },
        serviceType: "grooming",
        reminder: "At least 6 months old; strictly by appointment.",
        status: "large_unavailable",
    },
    {
        title: "Dog Styled Cut (Puppy/Summer Cut)",
        description:
            "A more aesthetic trim. Requires a well-maintained coat without tangles (mats).",
        inclusion: [
            "Scissor styling",
            "Bath & Blow dry",
            "Nail cut",
            "Ear cleaning",
        ],
        priceLabel: "₱600 - ₱1,700 depending on size",
        pricesBySize: {
            small: 600, // Semi-kalbo small (500) + 100
            medium: 700, // Semi-kalbo medium (600) + 100
            large: 1700,
        },
        serviceType: "grooming",
        reminder:
            "Must be 6 months old; no mats or tangles; strictly by appointment.",
        status: "large_unavailable",
    },
    {
        title: "Cat Sanitary Grooming",
        description: "Gentle hygiene trimming specifically for feline needs.",
        inclusion: ["Sanitary trim", "Nail clipping"],
        priceLabel: "₱400 per cat",
        price: 400,
        serviceType: "grooming",
        reminder: "Must be healthy; strictly by appointment.",
        status: "available",
    },
];
const wellnessPrices = [
    {
        title: "Pet Wellness & Consultation",
        price: 250,
        priceLabel: "₱250 per pet",
        description:
            "A mandatory physical assessment required before any vaccination or procedure to ensure your pet is fit and healthy.",
        inclusion: [
            "Weight & Temperature Check",
            "Physical Exam (Eyes, Ears, Mouth)",
            "Heart & Lung Auscultation",
            "Assessment of Appetite & Activity levels",
        ],
        reminder:
            "If the pet is found to have a fever, lethargy, or diarrhea, vaccination will be postponed for the pet's safety.",
    },
];
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
