"use client";
import Logo from "@/components/Logo";
import { Button, Card, Group, Text } from "@mantine/core";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import lottieData from "@/../public/lottie/Email.json";
import { useRef } from "react";
import { Baskervville_SC } from "next/font/google";
const baskerville = Baskervville_SC({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["500"],
});

export default function Page() {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    return (
        <div className="flex bg-gray-50 min-h-dvh gap-8 flex-col items-center  p-16">
            <Group>
                <Logo size="sm" />
                <h1
                    className={`${baskerville.className} text-[#14678f]  text-4xl`}
                >
                    Joseph & Mary
                </h1>
            </Group>
            <Card withBorder>
                <div className="py-12 px-8 flex  flex-col ">
                    <h1 className="font-bold text-xl">
                        Please verify your email
                    </h1>
                    <Text>We send an email to the address you provided</Text>
                    <div className="w-full flex flex-col items-center">
                        <div className="w-40   h-auto min-w-40  min-h-40">
                            <Lottie
                                animationData={lottieData}
                                lottieRef={lottieRef}
                                loop={false}
                                height={75}
                                width={75}
                            />
                        </div>
                    </div>
                    <Text mt={"md"} c={"dimmed"} size="sm">
                        Didn't receive the email? Check your spam folder. Still
                        can't find it?
                    </Text>
                    <Button mt={"md"} variant="light">
                        Resend verification
                    </Button>
                </div>
            </Card>
        </div>
    );
}
