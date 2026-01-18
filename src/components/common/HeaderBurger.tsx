"use client";

import { Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconCalendar,
    IconCurrencyPeso,
    IconDog,
    IconInfoSquare,
    IconLayoutDashboard,
} from "@tabler/icons-react";
import Link from "next/link";

const NAV_ITEMS = [
    {
        label: "Dashboard",
        value: "/v1/dashboard",
        icon: <IconLayoutDashboard stroke={1.5} />,
        protected: true,
    },
    {
        label: "Pets",
        value: "/v1/pets",
        icon: <IconDog stroke={1.5} />,
        protected: true,
    },
    {
        label: "Appointments",
        value: "/v1/appointments",
        icon: <IconCalendar stroke={1.5} />,
        protected: true,
    },
    {
        label: "About",
        value: "/v1/about",
        icon: <IconInfoSquare stroke={1.5} />,
        protected: false,
    },
    {
        label: "Pricing",
        value: "/v1/pricing",
        icon: <IconCurrencyPeso stroke={1.5} />,
        protected: false,
    },
];

export default function HeaderBurger({ auth }: { auth: boolean }) {
    const [opened, { toggle, close }] = useDisclosure();

    // 2. Filter links based on auth status
    const visibleLinks = NAV_ITEMS.filter((item) =>
        auth ? true : !item.protected
    );

    return (
        <>
            <Burger
                size="sm"
                aria-label="Toggle navigation"
                opened={opened}
                onClick={toggle}
                className="relative px-8 z-100" // Ensure burger stays on top
            />

            {opened && (
                <div className="fixed inset-0 top-16 z-90 w-full bg-white h-screen animate-in fade-in slide-in-from-top-2">
                    <nav className="flex flex-col">
                        {visibleLinks.map(({ label, value, icon }) => (
                            <Link
                                key={value}
                                href={value}
                                onClick={close} // 3. Close menu on click
                                className="flex h-20 items-center justify-between px-8 text-lg text-gray-800 transition-colors hover:bg-gray-50 hover:text-[#14678f] md:px-16"
                            >
                                <span className="font-sans font-medium">
                                    {label}
                                </span>
                                <span className="opacity-70">{icon}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
}
