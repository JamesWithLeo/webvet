// components/RouterLoadingIndicator.tsx
"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import loadingAnim from "@/../public/lottie/loading-animation.json";

const POSSIBLE_DURATIONS = [1000, 2000, 3000, 4000];

const getRandomDuration = () => {
    const randomIndex = Math.floor(Math.random() * POSSIBLE_DURATIONS.length);
    return POSSIBLE_DURATIONS[randomIndex];
};
// todo: App useSettings
export default function RouterLoadingAnimation() {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsLoading(true);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setIsLoading(false);
        }, getRandomDuration());

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [pathname]);

    if (!isLoading) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xs">
            <div className="w-sm h-sm">
                <Lottie
                    animationData={loadingAnim}
                    loop={false}
                    autoplay={true}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </div>
    );

    // todo:
    // Fallback (simple spinner/loader if animation is disabled)
}
