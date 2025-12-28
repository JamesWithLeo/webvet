import Link from "next/link";
import { LogoSvg } from "./LogoSvg";

export default function Logo({ size }: { size?: "lg" | "md" | "xs" | "sm" }) {
    let width, height;
    switch (size) {
        case "lg":
            width = 75;
            height = 75;
            break;
        case "md":
            width = 40;
            height = 40;
            break;
        case "sm":
            width = 35;
            height = 35;
            break;
        case "xs":
            width = 30;
            height = 30;
            break;
        default:
            width = 100;
            height = 100;
            break;
    }

    return (
        <Link href={"/v1/"}>
            <LogoSvg
                width={width}
                height={height}
                color="primary"
                className="text-[#14678f] "
            />
        </Link>
    );
}
