"use client";

import { Text, Title } from "@mantine/core";
import Lottie from "lottie-react";
import lottieData from "@/../public/lottie/Error.json";
import Link from "next/link";

export default function NotFoundComponent({
    backTo,
    link,
}: {
    backTo?: string;
    link: string;
}) {
    return (
        <div className="min-h-screen w-full items-center md:px-16 justify-center  flex gap-8 flex-col">
            <div className="w-full h-full max-w-7xl   items-center gap-8 flex flex-col">
                <div className="w-xs h-auto   max-w-sm">
                    <Lottie
                        animationData={lottieData}
                        loop={false}
                        initialSegment={[0, 185]}
                    />
                </div>
                <div className="flex gap-2 flex-col lg:text-center">
                    <Title>Page not found</Title>
                    <Text size="sm">
                        Sorry but the page you are looking for does not exist,
                        <br /> have been removed, name changed or its
                        temporarily unavailable.
                    </Text>
                </div>
                <Link href={link ?? "/v1"} replace={true}>
                    <Text c={"primary.9"} size="sm" td="underline">
                        {backTo ?? "Go back to home page "}
                    </Text>
                </Link>
            </div>
        </div>
    );
}
