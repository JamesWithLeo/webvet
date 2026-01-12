"use client";
import lottieData from "@/../public/lottie/Email.json";
import Lottie, { LottieComponentProps } from "lottie-react";

export default function EmailAnimation() {
    return (
        <Lottie
            loop={false}
            height={75}
            width={75}
            animationData={lottieData}
        />
    );
}
