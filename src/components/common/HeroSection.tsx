"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Alex_Brush } from "next/font/google";
import Link from "next/link";
import { Button } from "@mantine/core";
import Image from "next/image";

const alexBrush = Alex_Brush({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["400"],
});

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const pinWrapper = useRef<HTMLDivElement | null>(null);
    const imageContainer = useRef<HTMLDivElement | null>(null);
    const textContent = useRef<HTMLDivElement | null>(null); // Parent container for scroll-out
    const titleText = useRef<HTMLHeadingElement | null>(null); // Child for intro entrance
    const subtitleText = useRef<HTMLHeadingElement | null>(null); // Child for intro entrance
    const buttonGroup = useRef<HTMLDivElement | null>(null); // Child for intro entrance

    useGSAP(
        () => {
            // 1. INTRO ENTRANCE ANIMATION (Targets individual elements on load)
            const introTL = gsap.timeline();

            introTL.fromTo(
                [titleText.current, subtitleText.current],
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                }
            );

            introTL.fromTo(
                buttonGroup.current,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                },
                "-=0.5"
            );

            // 2. SCROLL ANIMATION (Targets the parent container to avoid style conflicts)
            const heroTL = gsap.timeline({
                scrollTrigger: {
                    trigger: pinWrapper.current,
                    pin: true,
                    start: "top top",
                    end: "+=800",
                    scrub: 1,
                    markers: false,
                },
            });

            // Shrink the background image
            heroTL.to(
                imageContainer.current,
                {
                    scale: 0.85,
                    borderRadius: "20px",
                    ease: "power1.inOut",
                },
                0
            );

            // Fade and slide out the entire text block safely
            heroTL.to(
                textContent.current,
                {
                    y: -60,
                    opacity: 0,
                    ease: "power1.in",
                },
                0
            );
        },
        { scope: pinWrapper }
    );

    return (
        <>
            <section
                id="hero-pin-wrapper"
                ref={pinWrapper}
                className="w-full relative min-h-dvh flex items-center justify-center overflow-hidden"
            >
                {/* Background Image */}
                <div
                    ref={imageContainer}
                    className="w-full h-full absolute top-0 left-0 overflow-hidden"
                >
                    <Image
                        src="/pexels-gustavo.jpg"
                        alt="Happy dog getting a checkup at the vet clinic"
                        quality={100}
                        priority={true}
                        fill
                        sizes="100vw"
                        style={{
                            objectFit: "cover",
                        }}
                    />
                    <div className="bg-linear-to-t from-gray-700 from-80% absolute top-0 left-0 w-full h-full opacity-45 z-10 "></div>
                </div>

                {/* Main Content Wrapper (Controlled by ScrollTrigger) */}
                <div
                    ref={textContent}
                    className="w-full h-full flex items-center flex-col justify-center relative z-20 px-4 will-change-transform"
                >
                    <div className="w-full py-8 flex items-center flex-col text-center">
                        <h1
                            ref={titleText}
                            className={`${alexBrush.className} text-white text-5xl sm:text-7xl lg:text-9xl`}
                        >
                            Joseph & Mary
                        </h1>
                        <h1
                            ref={subtitleText}
                            className="text-3xl lg:text-7xl tracking-tight font-black sm:text-5xl text-[#0b6088]"
                        >
                            Veterinary Clinic
                        </h1>
                    </div>

                    {/* Buttons (Controlled by Intro Animation) */}
                    <div
                        ref={buttonGroup}
                        className="w-full flex justify-center gap-8"
                    >
                        <Button
                            className="w-min mt-4"
                            variant="outline"
                            color="white"
                            px="xl"
                            radius="xl"
                            size="md"
                            component={Link}
                            href="/v1/auth/login"
                        >
                            Login
                        </Button>
                        <Button
                            className="w-min mt-4"
                            px="xl"
                            radius="xl"
                            size="md"
                            variant="gradient"
                            component={Link}
                            href="/v1/auth/signup"
                        >
                            Sign up
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
