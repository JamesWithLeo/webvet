"use client";

import {
    prices,
    ServiceMergePriceType,
    ServicePriceTypeModel,
    servicePriceVariant,
    ServiceTypeModel,
} from "@/db/schema/services";
import { toTitleCase } from "@/lib/toTitleCase";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import {
    Button,
    Card,
    NativeSelect,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const getPriceDisplay = (prices: ServicePriceTypeModel[]) => {
    if (prices.length === 0) return "Inquire for pricing";

    // Check if it's a Flat Rate
    const flatPrice = prices.find((p) => p.variant === "FLAT");
    if (flatPrice) {
        return `₱${flatPrice.price}`;
    }

    // Handle tiered pricing (Small/Medium/Large)
    const numericPrices = prices.map((p) => parseFloat(p.price));
    const min = Math.min(...numericPrices);
    const max = Math.max(...numericPrices);

    return `₱${min} - ₱${max}`;
};
const isFLat = (prices: ServicePriceTypeModel[]) => {
    const flatPrice = prices.find((p) => p.variant === "FLAT");
    if (flatPrice) return true;
    else false;
};

export default function PricingCarousel({
    title,
    carouselData,
    icon,
}: {
    title: string;
    carouselData: ServiceMergePriceType[];
    icon: ReactNode;
}) {
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 64rem)");
    return (
        <div className="flex flex-col  gap-4 md:gap-8">
            <Title c={"dimmed"} fz={isMobile ? "h3" : "h1"}>
                # {title}
            </Title>
            <Carousel
                slideGap="md"
                controlSize={26}
                withControls={carouselData.length > 1}
                withIndicators={false}
                emblaOptions={{
                    loop: true,
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
                {carouselData.map((v, index) => (
                    <CarouselSlide key={`${v.title}-${index}`}>
                        <Card
                            withBorder
                            p={isMobile ? "md" : "lg"}
                            miw={"350px"}
                            maw={"100%"}
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
                                mb={v.variants.length > 0 ? "md" : undefined}
                                fz={isMobile ? "h5" : "h4"}
                                fw={500}
                                style={{ userSelect: "none" }}
                            >
                                {getPriceDisplay(v.variants)}
                            </Text>
                            {!isFLat(v.variants) && v.variants.length > 0 && (
                                <NativeSelect
                                    mb="md"
                                    size="sm"
                                    maw={"150px"}
                                    radius={"xl"}
                                    data={v.variants.map((p) => ({
                                        label: `${toTitleCase(p.variant)}-${p.price}`,
                                        value: p.id,
                                    }))}
                                />
                            )}
                            {v.inclusions
                                ? v.inclusions.map((i, inclusionIndex) => (
                                      <div
                                          key={`${i}-${inclusionIndex}`}
                                          className="items-center flex gap-1.5"
                                      >
                                          <ThemeIcon
                                              variant="transparent"
                                              c={"dimmed"}
                                          >
                                              {icon}
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
                                    {v.reminder}
                                </Text>
                                <Button
                                    size="sm"
                                    variant="light"
                                    radius={"md"}
                                    onClick={() => {
                                        router.push("/v1/appointments/new");
                                    }}
                                >
                                    Book appointment
                                </Button>
                            </div>
                        </Card>
                    </CarouselSlide>
                ))}
            </Carousel>
        </div>
    );
}
