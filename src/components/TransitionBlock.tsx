"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function TransitionBlock() {
    const transitionBlockRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const keyPhraseRef = useRef<HTMLHeadingElement>(null);
    const keyPhraseTwoRef = useRef<HTMLHeadingElement>(null);

    useGSAP(
        () => {
            if (
                !transitionBlockRef.current ||
                !overlayRef.current ||
                !keyPhraseRef.current ||
                !keyPhraseTwoRef.current
            )
                return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    toggleActions: "restart pause reverse pause",
                    trigger: transitionBlockRef.current,
                    pin: false,
                    scrub: 1, // Changed to 0.5 for smoother linkage
                    start: "top bottom",
                    markers: false,
                    // pinSpacing: false,
                },
            });

            tl.fromTo(
                keyPhraseRef.current,
                { opacity: 0 }, // Start state
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                },
                0.1 // Start slightly after background begins
            );

            tl.fromTo(
                keyPhraseTwoRef.current,
                { opacity: 0, scale: 0.8 }, // Start state
                {
                    opacity: 1,
                    scale: 1,
                    // y: -100,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                },
                0.2
            );
        },
        { scope: transitionBlockRef }
    );

    return (
        <section
            ref={transitionBlockRef}
            className="w-full h-screen relative flex-col my-10  gap-0
               flex justify-center items-center"
        >
            <div
                id="bg-overlay"
                ref={overlayRef}
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: "transparent" }}
            ></div>

            <div
                className="relative z-20 flex w-max rounded" // Added z-20
                ref={keyPhraseRef}
            >
                <h1 className={`font-bold text-[#14678f] text-9xl`}>
                    That&apos;s why
                </h1>
            </div>
            <div
                className="relative z-20 mt-4 flex w-max rounded" // Added z-20
                ref={keyPhraseTwoRef}
            >
                <h1 className="text-black text-2xl font-semibold">
                    we&apos;ve streamlined the entire booking process into{" "}
                    <span className="text-7xl font-extrabold text-amber-400">
                        3
                    </span>{" "}
                    easy steps.
                </h1>
            </div>
        </section>
    );
}
