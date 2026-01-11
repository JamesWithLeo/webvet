"use client";

import { Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconCalendar,
    IconDog,
    IconLayoutDashboard,
} from "@tabler/icons-react";
import Link from "next/link";

const navlink = [
    {
        label: "Dashboard",
        value: "/v1/dashboard",
        icon: <IconLayoutDashboard stroke={1.5} />,
    },
    { label: "Pets", value: "/v1/pets", icon: <IconDog stroke={1.5} /> },
    {
        label: "Appointments",
        value: "/v1/appointments",
        icon: <IconCalendar stroke={1.5} />,
    },
];
export default function HeaderBurger() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <>
            <Burger
                size={"sm"}
                aria-label="Toggle navigation"
                opened={opened}
                onClick={toggle}
            />
            {opened && (
                <div className="top-16 -translate-x-1/2 left-1/2 fixed w-full bg-white h-full">
                    {navlink.map(({ label, value, icon }, index) => (
                        <Link
                            key={`${index}-${label}`}
                            href={value}
                            className="h-10 justify-between hover:shadow-xs hover:bg-gray-50 gap-8 px-20 flex items-center py-8 text-lg hover:text-[#14678f] text-gray-800 font-sans md:px-30"
                        >
                            <h1>{label}</h1>
                            {icon}
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
