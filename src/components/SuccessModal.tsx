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
    body: string;
}) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);

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
            size="lg"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <div className="flex select-none flex-col gap-4 items-center  p-4 text-center">
                <div className="w-md h-auto   max-w-md">
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={successAnim}
                        loop={false}
                        initialSegment={[0, 60]}
                    />
                </div>

                <h1 className="text-2xl">{title}</h1>
                <h1 className="text-lg">{body}</h1>
            </div>
        </Modal>
    );
}
