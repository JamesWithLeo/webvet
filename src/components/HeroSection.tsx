"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Alex_Brush } from "next/font/google";
import Link from "next/link";
import { Button } from "@mantine/core";
import Image from "next/image";

// Font setup
const alexBrush = Alex_Brush({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["400"],
});

// Register plugin once (for the client component context)
gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    // 1. Ref for the element to be PINNED (the wrapper)
    const pinWrapper = useRef(null);
    // 2. Ref for the Image element to be SCALED
    const imageContainer = useRef(null);
    // 3. Ref for the Text content to be FADED
    const textContent = useRef(null);

    useGSAP(
        () => {
            // 4. Create the ScrollTrigger Timeline
            const heroTL = gsap.timeline({
                scrollTrigger: {
                    trigger: pinWrapper.current, // Pin the outermost container
                    pin: true, // Enable pinning
                    start: "top top", // Start effect when top of hero hits top of viewport
                    end: "+=800", // The animation will last for 800px of scrolling
                    scrub: 1, // Smoothly link animation to scroll
                    markers: false,
                },
            });

            // 5. ANIMATIONS (All start at the same time: 0)

            // A. Scale the Image Container and darken its filter
            heroTL.to(
                imageContainer.current,
                {
                    scale: 0.85,
                    borderRadius: "20px",
                    ease: "power1.inOut",
                },
                0
            );

            // B. Fade and slide the Text/Button Content
            heroTL.to(
                textContent.current,
                {
                    scale: 0.75,
                    opacity: 0,
                    y: -20,
                    ease: "power1.inOut",
                },
                0
            );
        },
        { scope: pinWrapper }
    ); // Scope to the pinned wrapper

    return (
        <>
            {/* 1. OUTER WRAPPER (This is the element that will be PINNED) */}
            <section
                id="hero-pin-wrapper"
                ref={pinWrapper}
                className="w-full relative min-h-dvh"
            >
                {/* 2. IMAGE CONTAINER (This is the element that will be SCALED/SHRUNK) */}
                <div
                    ref={imageContainer}
                    className="w-full h-full absolute top-0 left-0 overflow-hidden"
                >
                    <Image
                        src="/pexels-gustavo.jpg"
                        alt="Happy dog getting a checkup at the vet clinic"
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                        priority={true}
                        // Added a filter style to ensure the GSAP animation works easily
                        // style={{ filter: "brightness(0.7)" }}
                    />
                    <div className="bg-gradient-to-t from-gray-700 from-80% absolute top-0 left-0 w-full h-full opacity-45 z-10 "></div>
                </div>

                {/* Overlay - Stays on top of the image container */}

                {/* 3. TEXT & BUTTON CONTAINER (This is the element that will be FADED) */}
                <div
                    ref={textContent}
                    className="w-full h-full flex items-center flex-col justify-center relative z-20"
                >
                    <div className="w-full py-8 flex items-center flex-col">
                        <h1
                            className={`${alexBrush.className} text-white text-5xl sm:text-7xl lg:text-9xl `}
                        >
                            Joseph & Mary
                        </h1>
                        <h1 className="text-3xl lg:text-7xl font-black sm:text-5xl text-[#0b6088] ">
                            Veterinary Clinic
                        </h1>
                    </div>
                    <div className="w-full flex items-center flex-col">
                        <Button
                            className="w-min mt-4 text-[#043343]"
                            color="#043343"
                        >
                            <Link href={"/v1/auth/signup"}>Get started</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
