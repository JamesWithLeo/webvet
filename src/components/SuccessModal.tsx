"use client";

import { Modal } from "@mantine/core";
import { useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import successAnim from "@/../public/lottie/Success-Animation.json";

export default function SuccessModal({
    opened,
    timeOut,
    onClose,
    title,
    body,
}: {
    opened: boolean;
    onClose: () => void;
    timeOut: number;
    title: string;
    body?: string;
}) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const textTransitionClass = opened
        ? "opacity-100 transition-opacity duration-800 delay-400"
        : "opacity-0"; // Starts invisible when closed

    useEffect(() => {
        if (!opened) return;

        const timer = setTimeout(() => {
            onClose();
        }, timeOut);

        return () => clearTimeout(timer);
    }, [opened, timeOut]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 4,
            }}
            styles={{
                content: {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                },
                body: {
                    backgroundColor: "transparent",
                    padding: 0,
                },
                header: {
                    backgroundColor: "transparent",
                },
            }}
        >
            <div className="flex select-none  flex-col gap-4 justify-center items-center overflow-hidden text-center">
                <div className="w-sm h-auto   max-w-md">
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={successAnim}
                        loop={false}
                        // initialSegment={[0, 60]}
                    />
                </div>

                <h1 className={`text-2xl text-white ${textTransitionClass}`}>
                    {title}
                </h1>
                {body && (
                    <h1 className={`text-lg ${textTransitionClass}`}>{body}</h1>
                )}
            </div>
        </Modal>
    );
}
