import Link from "next/link";
import { LogoSvg } from "./LogoSvg";

export default function Logo({ size }: { size?: "lg" | "md" | "sx" }) {
    let width, height;
    switch (size) {
        case "md":
            width = 40;
            height = 40;
            break;
        case "sx":
            width = 25;
            height = 25;
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
