"use client";

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
import { ReactNode } from "react";

type carouselDataType = {
    title: string;
    reminder: string;
    price?: number;
    priceLabel: string;
    inclusion: string[];
    description: string;
    pricesBySize?: {
        small: number;
        medium: number;
        large: number;
    };
};

export default function PricingCarousel({
    title,
    carouselData,
    icon,
}: {
    title: string;
    carouselData: carouselDataType[];
    icon: ReactNode;
}) {
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
                                mb={v.pricesBySize ?? "md"}
                                fz={isMobile ? "h5" : "h4"}
                                fw={500}
                                style={{ userSelect: "none" }}
                            >
                                {v.priceLabel}
                            </Text>
                            {v.pricesBySize && (
                                <NativeSelect
                                    mb="md"
                                    size="sm"
                                    maw={"150px"}
                                    radius={"xl"}
                                    data={Object.entries(v.pricesBySize).map(
                                        (p) => ({
                                            label: `${toTitleCase(p[0])}-${p[1]}`,
                                            value: [1].toString(),
                                        })
                                    )}
                                />
                            )}
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
                                <Button size="sm" variant="light" radius={"md"}>
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
    );
}
