"use client";

import { role } from "@/db/schema/users";
import { Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

const NAV_ITEMS = [
    {
        label: "Dashboard",
        value: "/v1/dashboard",
    },
    {
        label: "Pets",
        value: "/v1/pets",
    },
    {
        label: "Appointments",
        value: "/v1/appointments",
    },
    {
        label: "About",
        value: "/v1/about",
    },
    {
        label: "Pricing",
        value: "/v1/pricing",
    },
    {
        label: "Clinic",
        value: "/v1/clinic",
        roles: ["admin", "vet", "staff"],
    },
];
type Props = {
    role: (typeof role.enumValues)[number] | undefined;
};

export default function HeaderBurger({ role }: Props) {
    const [opened, { toggle, close }] = useDisclosure();

    const visibleLinks = NAV_ITEMS.filter((item) =>
        item.roles ? (role ? item.roles.includes(role) : true) : true
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
                        {visibleLinks.map(({ label, value }) => (
                            <Link
                                key={value}
                                href={value}
                                onClick={close} // 3. Close menu on click
                                className="flex h-20 items-center justify-between px-8 text-lg text-gray-800 transition-colors hover:bg-gray-50 hover:text-[#14678f] md:px-16"
                            >
                                <span className="font-sans font-medium">
                                    {label}
                                </span>
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
}
