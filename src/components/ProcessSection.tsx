"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Group, Button } from "@mantine/core";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
    {
        title: "1. Set the Type",
        description1: "From wellness checks to urgent care needs,",
        description2:
            "this ensures the right care team is ready for your pet when you arrive.",
        imageSrc: "/Group3.svg",
    },
    {
        title: "2. Choose the Date",
        description1: "Select a date that fits your schedule.",
        description2:
            "We'll show you the next available appointments for the care type you selected.",
        imageSrc: "/Group2.svg",
    },
    {
        title: "3. Confirm the Time",
        description1: "Finalize your slot with a quick confirmation.",
        description2:
            "A reservation ensures no waiting when you arrive, letting you and your pet relax.",
        imageSrc: "/Group1.svg",
    },
];

export default function ProcessSection() {
    const processSectionRef = useRef(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const imageRefOne = useRef<HTMLDivElement>(null);
    const imageRefTwo = useRef<HTMLDivElement>(null);
    const imageRefThree = useRef<HTMLDivElement>(null);
    const textTitleRef = useRef<HTMLHeadingElement>(null);
    const textKeywordRef = useRef<HTMLSpanElement>(null);
    const textDesc1Ref = useRef<HTMLHeadingElement>(null);
    const textDesc2Ref = useRef<HTMLHeadingElement>(null);

    const thatsItRef = useRef<HTMLDivElement>(null);
    const transitionBlockRef = useRef<HTMLDivElement>(null);
    const mainProcessSectionRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery("(max-width: 64rem)");
    const router = useRouter();

    const imageRefs = [imageRefOne, imageRefTwo, imageRefThree];

    useGSAP(() => {
        const imageElements = imageRefs
            .map((ref) => ref.current)
            .filter(Boolean) as HTMLElement[];

        if (imageElements.length > 1) {
            gsap.set(imageElements.slice(1), { xPercent: 100 });
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: processSectionRef.current,
                pin: true,
                end: "+=3000",
                scrub: 1,
                start: "top top",
                // markers: true,
            },
        });

        tl.to(
            [transitionBlockRef.current],
            { height: "auto", paddingTop: "16px" },
            0
        );
        tl.to(
            [transitionBlockRef.current?.querySelector(".thatswhy")],
            {
                fontSize: isMobile ? "8rem" : "3rem",
            },
            0
        );
        tl.to(
            [
                transitionBlockRef.current?.querySelector(".threestep"),
                transitionBlockRef.current
                    ?.querySelector(".threestep")
                    ?.querySelector("span"),
            ],
            {
                fontSize: "1rem",
            },
            0
        );

        for (let i = 1; i < processSteps.length; i++) {
            const currentImage = imageElements[i];
            const currentStep = processSteps[i];
            const prevImage = imageElements[i - 1];

            const label = `step-${i + 1}`;

            tl.to(
                [
                    textTitleRef.current,
                    textKeywordRef.current,
                    textDesc1Ref.current,
                    textDesc2Ref.current,
                ],
                {
                    opacity: 0,
                    duration: 0.15,
                    ease: "none",
                },
                label
            )

                .set(textTitleRef.current, {
                    textContent: currentStep.title,
                })
                .set(textDesc1Ref.current, {
                    textContent: currentStep.description1,
                })
                .set(textDesc2Ref.current, {
                    textContent: currentStep.description2,
                })

                .to(
                    [
                        textTitleRef.current,
                        textKeywordRef.current,
                        textDesc1Ref.current,
                        textDesc2Ref.current,
                    ],
                    {
                        opacity: 1,
                        duration: 0.1,
                        ease: "none",
                    },
                    `+=${0.1}`
                );

            tl.to(
                currentImage,
                {
                    xPercent: 0,
                    ease: "power2.inOut",
                    zIndex: 40,
                    duration: 1.5,
                },
                label
            );

            tl.to(
                prevImage,
                {
                    scale: 0.7,
                    opacity: 0.8,
                    zIndex: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                },
                label
            );

            tl.to({}, { duration: 0.5 });
        }
        tl.to(
            transitionBlockRef.current,
            { height: "100vh" },
            imageRefs.length + 1
        );
        tl.to(
            [transitionBlockRef.current?.querySelector(".thatswhy")],
            {
                fontSize: isMobile ? "8rem" : "3rem",
            },
            imageRefs.length + 1
        );
        tl.to(
            [
                transitionBlockRef.current?.querySelector(".threestep"),
                transitionBlockRef.current
                    ?.querySelector(".threestep")
                    ?.querySelector("span"),
            ],
            {
                fontSize: "1.5rem",
            },
            imageRefs.length + 1
        );

        tl.to(
            processSectionRef.current,
            { opacity: 0.5, duration: 1 },
            imageRefs.length + 1
        );
        tl.to(
            thatsItRef.current,
            {
                scrollTrigger: {
                    trigger: processSectionRef.current,
                    start: "bottom bottom",
                    end: "+=2000",
                    scrub: 1,
                },

                backgroundColor: "#14678f",
                opacity: 1,
                ease: "power2.in",
            },
            imageRefs.length + 2
        );
    }, [processSectionRef]);

    return (
        <>
            <section ref={mainProcessSectionRef}>
                <section
                    className="flex flex-col  h-auto overflow-x-hidden items-center w-full"
                    ref={processSectionRef}
                >
                    <div
                        className="w-full h-screen flex items-center
                    justify-center flex-col"
                        ref={transitionBlockRef}
                    >
                        <h1
                            className={`thatswhy text-2xl font-bold text-[#14678f] lg:text-9xl`}
                        >
                            That&apos;s why
                        </h1>
                        <h1
                            className="threestep text-center lg:text-left mt-8 text-black lg:text-2xl font-semibold"
                            id="3steps"
                        >
                            we&apos;ve streamlined the entire booking process
                            into{" "}
                            <span className="lg:text-7xl font-extrabold text-amber-400">
                                3
                            </span>{" "}
                            easy steps.
                        </h1>
                    </div>
                    <section
                        className="lg:flex grid grid-cols-1 grid-rows-2  w-full lg:min-h-[80vh] px-28 items-center"
                        // ref={processSectionRef}
                    >
                        <div className="lg:w-1/2 w-full col-start-1 row-start-2">
                            {/* The text content uses refs for dynamic updates */}
                            <h1
                                ref={textTitleRef}
                                className="font-bold items-center flex gap-2 text-2xl lg:text-5xl  mt-8 text-nowrap"
                            >
                                {processSteps[0].title}
                            </h1>
                            <h1
                                ref={textDesc1Ref}
                                className="lg:text-2xl mt-2 text-gray-600"
                            >
                                {processSteps[0].description1}
                            </h1>

                            <h1
                                ref={textDesc2Ref}
                                className="lg:text-2xl mt-2 text-gray-600"
                            >
                                {processSteps[0].description2}
                            </h1>
                        </div>

                        <div
                            ref={imageContainerRef}
                            className="relative flex-1 col-start-1 row-start-1 h-min lg:h-full w-full lg:w-1/2 grid items-center pt-10 md:order-2 order-1"
                        >
                            <div className="w-full flex items-center justify-center h-80 lg:h-125 relative">
                                <div
                                    ref={imageRefOne}
                                    className="absolute w-full top-0 left-0"
                                    style={{ zIndex: 30 }}
                                >
                                    <Image
                                        src={processSteps[0].imageSrc}
                                        height={1000}
                                        width={1000}
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                        }}
                                        alt="Booking step: Set the Type"
                                    />
                                </div>

                                <div
                                    ref={imageRefTwo}
                                    className="absolute w-full top-0 left-0"
                                    style={{ zIndex: 20 }}
                                >
                                    <Image
                                        src={processSteps[1].imageSrc}
                                        height={1000}
                                        width={1000}
                                        alt="Booking step: Set the Date"
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                        }}
                                    />
                                </div>

                                <div
                                    ref={imageRefThree}
                                    className="absolute w-full top-0 left-0"
                                    style={{ zIndex: 10 }}
                                >
                                    <Image
                                        src={processSteps[2].imageSrc}
                                        height={1000}
                                        width={1000}
                                        alt="Booking step: Set the Time"
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
                <div
                    ref={thatsItRef}
                    className="flex w-full h-screen gap-8 flex-col bg-[url('/pattern.svg')] 
                bg-[#14678f]

                 px-10  items-center justify-center "
                >
                    <h1 className="lg:text-9xl text-5xl font-extrabold  text-white">
                        THAT&apos;S IT!
                    </h1>
                    <Group>
                        <Button
                            variant="outline"
                            radius={"xl"}
                            color="white"
                            px={"xl"}
                            onClick={() => router.push("/v1/pricing")}
                        >
                            Pricing
                        </Button>
                        <Button
                            variant="outline"
                            radius={"xl"}
                            color="white"
                            px={"xl"}
                            onClick={() => router.push("/v1/about")}
                        >
                            About
                        </Button>
                    </Group>
                    <Button
                        variant="transparent"
                        color="white"
                        onClick={() => {
                            window.scrollTo({ top: 0 });
                        }}
                    >
                        Back to top
                    </Button>
                </div>
            </section>
        </>
    );
}
