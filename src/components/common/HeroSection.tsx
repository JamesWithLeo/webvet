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
    const pinWrapper = useRef(null);
    const imageContainer = useRef(null);
    const textContent = useRef(null);

    useGSAP(
        () => {
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

            heroTL.to(
                imageContainer.current,
                {
                    scale: 0.85,
                    borderRadius: "20px",
                    ease: "power1.inOut",
                },
                0
            );

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
    );

    return (
        <>
            <section
                id="hero-pin-wrapper"
                ref={pinWrapper}
                className="w-full relative min-h-dvh"
            >
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
                            className="w-min mt-4 "
                            color="#043343"
                            component={Link}
                            href={"/v1/auth/signup"}
                        >
                            Get started
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
