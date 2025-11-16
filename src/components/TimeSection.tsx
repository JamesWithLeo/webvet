"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function TimeSection() {
    const timeSectionRef = useRef<HTMLElement>(null);
    const frameRef = useRef(null);
    const imageContainer = useRef(null);
    useGSAP(
        () => {
            if (
                !timeSectionRef.current ||
                !imageContainer.current ||
                frameRef.current
            )
                return;
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: timeSectionRef.current,
                    toggleActions: "restart pause reverse pause",
                    pin: true,
                    scrub: 1,
                    start: "top center",
                    end: "+=500",
                    pinSpacing: false,
                    // markers: true,
                },
            });
            tl.from(
                frameRef.current, // ⬅️ TARGET THE OUTER FRAME
                {
                    opacity: 0,
                    ease: "power2.out",
                },
                0
            );

            tl.from(
                imageContainer.current,
                {
                    // Starts the element completely off the left edge (100% of its own width)
                    yPercent: -10,
                    skewX: 35,
                    xPercent: -200,
                    opacity: 0,
                    ease: "power2.out",
                },
                0 // Start at the beginning of the timeline
            );

            // Bonus: Animate the text slightly in the opposite direction for parallax
            // Text Fade-In (Optional: makes the text appear as the image slides)
            tl.from(
                timeSectionRef.current.querySelector("span"),
                {
                    opacity: 0,
                    x: 50,
                    ease: "power1.out",
                },
                0.2 // Start slightly after the image begins moving
            );

            tl.to(
                timeSectionRef.current.querySelector("span"),
                {
                    // opacity: 0.5,
                    scale: 0.85,
                    ease: "power1.out",
                },
                1
            );
            tl.to(
                imageContainer.current,
                {
                    // opacity: 0.5,
                    scale: 0.85,
                    ease: "power2.out",
                },
                1
            );
        },
        { scope: timeSectionRef }
    );
    return (
        <section
            ref={timeSectionRef}
            className="w-full flex bg-white justify-center py-10 items-center gap-4 "
        >
            <div
                className="
                p-6            
                bg-white       
                border-dashed
                border-2
                border-gray-200 
                rounded-lg      
                shadow-xl       
                relative                        z-10            
                flex-shrink-0   
            "
            >
                <div
                    className=" w-96 rounded-md shadow-lg  dark:bg-[#262626] overflow-hidden  h-96"
                    ref={imageContainer}
                >
                    <Image
                        src={"/maria-lin-kim-nb57WNnwDRc-unsplash.jpg"}
                        alt="cat with clock"
                        className="object-contain object-bottom"
                        fill={true}
                    />
                </div>
            </div>
            <span className="text-nowrap">
                <h1 className="text-5xl/tight mt-8 text-[#043343] font-bold">
                    We know your
                    <i className="text-6xl text-blue-500">
                        {" "}
                        'time is valuable'
                    </i>
                    ,
                </h1>
                <h1 className="text-4xl/tight  text-[#043343] font-bold">
                    and that scheduling pet care shouldn't be a chore.
                </h1>
            </span>
        </section>
    );
}
