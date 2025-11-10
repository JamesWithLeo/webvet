"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@mantine/core";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import confetti from "@/../public/lottie/confetti.json";

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
    const lottierRef = useRef<LottieRefCurrentProps>(null);
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

    const imageRefs = [imageRefOne, imageRefTwo, imageRefThree];

    useGSAP(
        () => {
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
                    markers: true,
                },
            });

            for (let i = 1; i < processSteps.length; i++) {
                const currentImage = imageElements[i];
                const currentStep = processSteps[i];
                const prevImage = imageElements[i - 1];

                const label = `step-${i}`;

                tl.to(
                    [
                        textTitleRef.current,
                        textKeywordRef.current,
                        textDesc1Ref.current,
                        textDesc2Ref.current,
                    ],
                    {
                        opacity: 0,
                        duration: 0.15, // Quick fade out
                        ease: "none",
                    },
                    label
                ) // Start at the label

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
                            duration: 0.1, // Quick fade in
                            ease: "none",
                        },
                        `+=${0.1}`
                    ); // Fade in just after the fade out/set completes

                tl.to(
                    currentImage,
                    {
                        xPercent: 0,
                        ease: "power2.inOut",
                        zIndex: 40,
                        duration: 1.5, // The duration of the slide relative to the timeline segment
                    },
                    label // Start this with the text update
                );

                // 3. Keep the Previous Image in the background (Optional: slight visual change)
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

                tl.to({}, { duration: 0.5 }); // Add 0.5 seconds of scrub time pause
            }

            tl.to(processSectionRef.current, { opacity: 0.5, duration: 1 });
            gsap.to(thatsItRef.current, {
                scrollTrigger: {
                    trigger: processSectionRef.current,
                    start: "bottom center",
                    end: "+=500",
                    scrub: 1,
                },

                backgroundColor: "#043343",
                opacity: 1,
                ease: "power2.in",
            });
        },
        { scope: processSectionRef }
    );

    return (
        <section className="grid grid-cols-1 overflow-x-hidden items-center w-full">
            <section
                className="flex min-h-[80vh] px-10 items-center"
                ref={processSectionRef}
            >
                <div className="w-1/2">
                    {/* The text content uses refs for dynamic updates */}
                    <h1
                        ref={textTitleRef}
                        className="font-bold items-center flex gap-2 text-7xl mt-8 text-nowrap"
                    >
                        {processSteps[0].title}
                    </h1>
                    <h1
                        ref={textDesc1Ref}
                        className="text-4xl mt-2 text-gray-600"
                    >
                        {processSteps[0].description1}
                    </h1>

                    <h1
                        ref={textDesc2Ref}
                        className="text-4xl mt-2 text-gray-600"
                    >
                        {processSteps[0].description2}
                    </h1>
                </div>

                <div
                    ref={imageContainerRef}
                    className="relative flex-1 h-full w-1/2 grid items-center pt-10 md:order-2 order-1"
                >
                    <div className="w-full h-[500px] relative">
                        <div
                            ref={imageRefOne}
                            className="absolute w-full top-0 left-0"
                            style={{ zIndex: 30 }} // Initial stack order
                        >
                            <Image
                                src={processSteps[0].imageSrc}
                                height={1000}
                                width={1000}
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
                            />
                        </div>
                    </div>
                </div>
            </section>
            <div
                ref={thatsItRef}
                className="flex h-screen gap-8 flex-col bg-[url('/pattern.svg')] bg-white px-10  items-center justify-center "
            >
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <Lottie
                        lottieRef={lottierRef}
                        animationData={confetti}
                        loop={false}
                        autoPlay={false}
                    />
                </div>
                <h1 className="text-9xl font-extrabold  text-white">
                    THAT'S IT!
                </h1>
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
    );
}
