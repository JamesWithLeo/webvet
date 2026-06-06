"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Group, Button, Stack } from "@mantine/core";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);
import bg from "@/../public/bg.svg";
import paw from "@/../public/paw.svg";

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
    const processSectionRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const imageRefOne = useRef<HTMLDivElement>(null);
    const imageRefTwo = useRef<HTMLDivElement>(null);
    const imageRefThree = useRef<HTMLDivElement>(null);
    const textTitleRef = useRef<HTMLHeadingElement>(null);
    const textDesc1Ref = useRef<HTMLHeadingElement>(null);
    const textDesc2Ref = useRef<HTMLHeadingElement>(null);

    const thatsItRef = useRef<HTMLDivElement>(null);
    const thatsItTitleRef = useRef<HTMLHeadingElement>(null);
    const thatsItActionsRef = useRef<HTMLDivElement>(null);
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

        // Initialize Call-to-Action states
        gsap.set(thatsItTitleRef.current, { scale: 0.3, opacity: 0 });
        gsap.set(thatsItActionsRef.current, { y: 50, opacity: 0 });
        gsap.set(thatsItRef.current, { pointerEvents: "none" });

        // FIX: Initialize the mask size to 0% so the blue screen is completely hidden at first
        gsap.set(thatsItRef.current, {
            maskImage: `url(${paw.src})`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "0%",
            WebkitMaskImage: `url(${paw.src})`,
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "0%",
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: processSectionRef.current,
                pin: true,
                end: "+=4000",
                scrub: 1,
                start: "top top",
                invalidateOnRefresh: true,
            },
        });

        // 1. Entrance Intro Text Animation
        tl.to(
            transitionBlockRef.current,
            { height: "auto", paddingTop: "16px" },
            0
        );
        if (transitionBlockRef.current)
            tl.to(
                transitionBlockRef.current?.querySelector(".thatswhy"),
                { fontSize: isMobile ? "4rem" : "3rem" },
                0
            );
        tl.to(
            [
                transitionBlockRef.current?.querySelector(".threestep"),
                transitionBlockRef.current?.querySelector(".threestep span"),
            ],
            { fontSize: "1.1rem" },
            0
        );

        // 2. Core 3-Step Image Panels Progression
        for (let i = 1; i < processSteps.length; i++) {
            const currentImage = imageElements[i];
            const currentStep = processSteps[i];
            const prevImage = imageElements[i - 1];
            const label = `step-${i + 1}`;

            tl.to(
                [
                    textTitleRef.current,
                    textDesc1Ref.current,
                    textDesc2Ref.current,
                ],
                { opacity: 0, duration: 0.15, ease: "none" },
                label
            )
                .set(textTitleRef.current, { textContent: currentStep.title })
                .set(textDesc1Ref.current, {
                    textContent: currentStep.description1,
                })
                .set(textDesc2Ref.current, {
                    textContent: currentStep.description2,
                })
                .to(
                    [
                        textTitleRef.current,
                        textDesc1Ref.current,
                        textDesc2Ref.current,
                    ],
                    { opacity: 1, duration: 0.1, ease: "none" },
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
                    opacity: 0,
                    zIndex: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                },
                label
            );
            tl.to({}, { duration: 0.5 });
        }

        // 3. The "THAT'S IT!" Grand Finale Integration
        const finalLabel = "conclusion";
        tl.addLabel(finalLabel);

        tl.to(
            transitionBlockRef.current,
            { opacity: 0, duration: 2, ease: "power2.inOut" },
            finalLabel
        );
        tl.to(
            imageContainerRef.current,
            { opacity: 0, duration: 2 },
            finalLabel
        );
        tl.to(
            [textTitleRef.current, textDesc1Ref.current, textDesc2Ref.current],
            { opacity: 0, duration: 1.5 },
            finalLabel
        );

        tl.set(thatsItRef.current, { pointerEvents: "all" }, finalLabel);

        // FIX: Scale the mask properties directly via standard percentage values.
        // Moving from 0% up to 700% guarantees the paw swells up big enough to show the full screen.
        tl.to(
            thatsItRef.current,
            {
                maskSize: "3500%", // Boosted from 700% to 3500% to handle ultrawide / tall monitors
                WebkitMaskSize: "3500%",
                duration: 2.5,
                ease: "power3.inOut",
            },
            finalLabel
        );

        // Explode the Headline Text size out cleanly
        tl.to(
            thatsItTitleRef.current,
            { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.7)" },
            `${finalLabel}+=1`
        );

        // Cascade the action interaction elements upwards
        tl.to(
            thatsItActionsRef.current,
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
            `${finalLabel}+=1.8`
        );
    }, [processSectionRef]);

    return (
        <>
            <section ref={mainProcessSectionRef} className="relative bg-white">
                <section
                    className="flex flex-col h-auto overflow-hidden items-center w-full relative"
                    ref={processSectionRef}
                >
                    {/* Header Transition Block */}
                    <div
                        className="w-full h-screen flex items-center justify-center flex-col z-10"
                        ref={transitionBlockRef}
                    >
                        <h1 className="thatswhy text-5xl font-extrabold text-[#14678f] lg:text-9xl tracking-tight">
                            That&apos;s why
                        </h1>
                        <h1
                            className="threestep lg:text-nowrap text-center lg:text-left mt-6 text-slate-800 lg:text-4xl font-semibold"
                            id="3steps"
                        >
                            we&apos;ve streamlined the entire booking process
                            into{" "}
                            <span className="lg:text-7xl text-4xl font-black text-amber-500 drop-shadow-sm">
                                3
                            </span>{" "}
                            easy steps.
                        </h1>
                    </div>

                    {/* Step Graphics and Copy Layout */}
                    <section className="lg:flex pt-40 place-content-center grid grid-cols-1 grid-rows-2 w-full lg:min-h-[60vh] px-6 lg:px-28 items-center bottom-12 z-10">
                        <div className="lg:w-1/2 w-full col-start-1 row-start-2">
                            <h2
                                ref={textTitleRef}
                                className="font-bold text-3xl lg:text-5xl mt-4 text-slate-900 tracking-tight"
                            >
                                {processSteps[0].title}
                            </h2>
                            <p
                                ref={textDesc1Ref}
                                className="lg:text-xl text-lg mt-3 text-slate-600 font-medium"
                            >
                                {processSteps[0].description1}
                            </p>
                            <p
                                ref={textDesc2Ref}
                                className="lg:text-xl text-lg mt-1 text-slate-500"
                            >
                                {processSteps[0].description2}
                            </p>
                        </div>

                        <div
                            ref={imageContainerRef}
                            className="relative col-start-1 row-start-1 w-full lg:w-1/2 grid items-center pt-4"
                        >
                            <div className="w-full flex items-center justify-center h-64 lg:h-125 relative">
                                {imageRefs.map((ref, idx) => (
                                    <div
                                        key={idx}
                                        ref={ref}
                                        className="absolute w-full top-0 left-0 flex justify-center"
                                    >
                                        <Image
                                            src={processSteps[idx].imageSrc}
                                            height={600}
                                            width={600}
                                            style={{
                                                maxWidth: "85%",
                                                height: "auto",
                                            }}
                                            alt={`Booking step artwork`}
                                            priority={idx === 0}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </section>
            </section>

            {/* Target Final UI Wrapper Panel */}
            <div
                ref={thatsItRef}
                className="fixed inset-0 w-screen h-screen flex flex-col gap-8 items-center justify-center bg-[#14678f] z-9999 bg-cover"
                style={{
                    backgroundImage: `url(${bg.src})`,
                }}
            >
                <Stack align="center" gap="xl">
                    <h1
                        ref={thatsItTitleRef}
                        className="lg:text-[10rem] text-5xl font-black text-white tracking-tight drop-shadow-md text-center selection:bg-amber-400"
                    >
                        THAT&apos;S IT!
                    </h1>

                    <Stack align="center" gap="md" ref={thatsItActionsRef}>
                        <Group gap="md">
                            <Button
                                variant="white"
                                radius="xl"
                                size="lg"
                                color="#14678f"
                                px="xl"
                                className="hover:scale-105 transition-transform font-bold"
                                onClick={() => router.push("/v1/pricing")}
                            >
                                View Pricing
                            </Button>
                            <Button
                                variant="outline"
                                radius="xl"
                                size="lg"
                                color="white"
                                px="xl"
                                className="hover:bg-white/10 transition-colors"
                                onClick={() => router.push("/v1/about")}
                            >
                                About Us
                            </Button>
                        </Group>
                        <Button
                            variant="transparent"
                            color="white"
                            size="sm"
                            mt="xl"
                            className="opacity-80 hover:opacity-100 underline decoration-dotted"
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                        >
                            Back to top ↑
                        </Button>
                    </Stack>
                </Stack>
            </div>
        </>
    );
}
