"use client";

import { toTitleCase } from "@/lib/toTitleCase";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Button, Card, Spoiler, Text, ThemeIcon, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
    IconArrowRight,
    IconHeartCheck,
    IconShieldCheckFilled,
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
        requirement:
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
        requirement: "At least 6 weeks old, dewormed, and in good health.",
    },
    {
        title: "Anti-Rabies Vaccine",
        description:
            "A legally required, life-saving vaccination that protects your pet and your family from the fatal Rabies virus.",
        inclusion: ["Rabies Virus"],
        priceLabel: "350 per pet",
        price: 350,
        serviceType: "vaccination",
        requirement: "At least 3 months old with no health concerns.",
    },
    {
        title: "Kennel Cough Vaccine",
        description:
            "Prevents infectious tracheobronchitis, a highly contagious respiratory disease common in social dogs and boarding facilities.",
        inclusion: ["Bordetella Bronchiseptica"],
        priceLabel: "600 per dog (vaccine)",
        price: 600,
        serviceType: "vaccination",
        requirement:
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
        requirement: "Must be dewormed and with no health concerns.",
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
        requirement: "Available for all ages; strictly by appointment.",
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
        priceLabel: "₱500 - ₱1,500",
        pricesBySize: {
            small: 500,
            medium: 600,
            large: 1500,
        },
        serviceType: "grooming",
        requirement: "At least 6 months old; strictly by appointment.",
        status: "large_unavailable", // UX Note: Disable 'Large' selection in UI
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
        priceLabel: "₱600 - ₱1,700",
        pricesBySize: {
            small: 600, // Semi-kalbo small (500) + 100
            medium: 700, // Semi-kalbo medium (600) + 100
            large: 1700,
        },
        serviceType: "grooming",
        requirement:
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
        requirement: "Must be healthy; strictly by appointment.",
        status: "available",
    },
];

export default function Page() {
    const isMobile = useMediaQuery("(max-width: 64rem)");
    return (
        <div className="h-full  flex-col min-h-dvh md:px-16 px-8 py-8 pb-16 gap-16 w-full flex">
            <div className="flex flex-col  gap-4 md:gap-8">
                <Title c={"dimmed"} fz={isMobile ? "h3" : "h1"}>
                    #Vaccines
                </Title>
                <Carousel
                    slideGap="md"
                    controlSize={26}
                    withControls
                    withIndicators={false}
                    emblaOptions={{
                        loop: false,
                        dragFree: true,
                        align: isMobile ? "start" : "center",
                    }}
                    slideSize={{
                        base: "100%",
                        sm: "50%",
                        md: "33%",
                        xl: "25%",
                    }}
                >
                    {vaccinePrices.map((v, index) => (
                        <CarouselSlide>
                            <Card
                                withBorder
                                p={isMobile ? "md" : "lg"}
                                miw={"350px"}
                                maw={"100%"}
                                key={`${v.title}-${index}`}
                                mih={"500px"}
                                radius={"lg"}
                            >
                                <Text
                                    c={"primary"}
                                    fw={"bold"}
                                    fz={isMobile ? "h3" : "h2"}
                                    style={{ userSelect: "none" }}
                                >
                                    {toTitleCase(v.title)}
                                </Text>
                                <Text
                                    mb={"md"}
                                    fz={isMobile ? "h5" : "h4"}
                                    fw={500}
                                    style={{ userSelect: "none" }}
                                >
                                    {v.priceLabel}
                                </Text>
                                {v.inclusion
                                    ? v.inclusion.map((i, inclusionIndex) => (
                                          <div
                                              key={`${i}-${inclusionIndex}`}
                                              className="items-center flex gap-1.5"
                                          >
                                              <ThemeIcon
                                                  variant="transparent"
                                                  c={"dimmed"}
                                              >
                                                  <IconShieldCheckFilled
                                                      size={isMobile ? 16 : 20}
                                                      stroke={1.5}
                                                  />
                                              </ThemeIcon>
                                              <Text size="sm">{i}</Text>
                                          </div>
                                      ))
                                    : null}
                                <Text size="sm" mt={"sm"}>
                                    {v.description}
                                </Text>
                                <div className="grow flex-col flex-wrap mt-8 text-wrap flex justify-end gap-4 h-full ">
                                    <Text c={"dimmed"} size="xs">
                                        {v.requirement}
                                    </Text>
                                    <Button size="sm" radius={"md"}>
                                        Book appointment
                                    </Button>
                                    {/* <Button variant="light" size="sm" radius={"md"}>
                                More info
                            </Button> */}
                                </div>
                            </Card>
                        </CarouselSlide>
                    ))}
                </Carousel>
            </div>
            <div className="flex flex-col  gap-4 md:gap-8">
                <Title c={"dimmed"} fz={isMobile ? "h3" : "h1"}>
                    #Grooming
                </Title>
                <Carousel
                    slideGap="md"
                    controlsOffset="sm"
                    controlSize={26}
                    withControls
                    withIndicators={false}
                    emblaOptions={{
                        loop: false,
                        dragFree: true,
                        align: isMobile ? "start" : "center",
                    }}
                    slideSize={{
                        base: "100%",
                        sm: "50%",
                        md: "33%",
                        xl: "25%",
                    }}
                >
                    {groomingPrices.map((v, index) => (
                        <CarouselSlide>
                            <Card
                                withBorder
                                p={"lg"}
                                miw={"350px"}
                                maw={"100%"}
                                key={`${v.title}-${index}`}
                                mih={"500px"}
                                radius={"lg"}
                            >
                                <Text
                                    c={"primary"}
                                    fw={"bold"}
                                    fz={isMobile ? "h3" : "h2"}
                                    style={{ userSelect: "none" }}
                                >
                                    {toTitleCase(v.title)}
                                </Text>
                                <Text
                                    mb={"md"}
                                    fz={isMobile ? "h5" : "h4"}
                                    fw={500}
                                    style={{ userSelect: "none" }}
                                >
                                    {v.priceLabel}
                                </Text>
                                {v.inclusion
                                    ? v.inclusion.map((i, inclusionIndex) => (
                                          <div
                                              key={`${i}-${inclusionIndex}`}
                                              className="items-center flex gap-1.5"
                                          >
                                              <ThemeIcon
                                                  variant="transparent"
                                                  c={"dimmed"}
                                              >
                                                  <IconHeartCheck
                                                      size={isMobile ? 16 : 20}
                                                      stroke={1.5}
                                                  />
                                              </ThemeIcon>
                                              <Text size="sm">{i}</Text>
                                          </div>
                                      ))
                                    : null}
                                <Text size="sm" mt={"sm"}>
                                    {v.description}
                                </Text>
                                <div className="grow flex-col flex-wrap mt-8 text-wrap flex justify-end gap-4 h-full ">
                                    <Text c={"dimmed"} size="xs">
                                        {v.requirement}
                                    </Text>
                                    <Button size="sm" radius={"md"}>
                                        Book appointment
                                    </Button>
                                    {/* <Button variant="light" size="sm" radius={"md"}>
                                More info
                            </Button> */}
                                </div>
                            </Card>
                        </CarouselSlide>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}
