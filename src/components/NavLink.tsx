"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function NavLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={clsx(
                "transition-colors",
                isActive
                    ? "underline decoration-1 underline-offset-4 text-[#043343]"
                    : "hover:underline decoration-1 underline-offset-4 text-gray-500 hover:text-[#043343]"
            )}
        >
            {children}
        </Link>
    );
}
