"use client";

import Link from "next/link";
import { LogoSvg } from "./LogoSvg";
import { Baskervville_SC } from "next/font/google";
const baskerville = Baskervville_SC({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["500"],
});

export default function LogoWithText({ href }: { href?: string }) {
    return (
        <Link
            href={href ?? "/v1/dashboard"}
            className=" flex gap-2 md:gap-4  text-[#14678f] text-xl lg:text-2xl"
        >
            <LogoSvg className="text-xl fill-current lg:max-h-8 h-full max-w-7 max-h-7 lg:max-w-8 w-full  min-w-10" />
            <h1 className={`${baskerville.className} text-nowrap `}>
                Joseph & Mary
            </h1>
        </Link>
    );
}
