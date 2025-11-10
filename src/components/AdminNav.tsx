"use client";

import Logo from "@/components/Logo";
import {
    IconCalendarSearch,
    IconCat,
    IconGauge,
    IconLogout2,
    IconUser,
    IconChevronLeft,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const data = [
    {
        link: "/v1/admin/dashboard",
        label: "Dashboard",
        icon: IconGauge,
    },
    {
        link: "/v1/admin/appointments",
        label: "Appointments",
        icon: IconCalendarSearch,
    },
    { link: "/v1/admin/accounts", label: "Accounts", icon: IconUser },
    { link: "/v1/admin/pets", label: "Pets", icon: IconCat },
];

export default function AdminNav() {
    const pathname = usePathname();
    const lastpath = pathname.split("/").pop()?.toLowerCase() ?? "dashboard";

    const [active, setActive] = useState(lastpath);

    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        localStorage.setItem(
            "sidebarCollapsed",

            isCollapsed.valueOf.toString()
        );
        setIsCollapsed(!isCollapsed);
    };

    const links = data.map((item) => (
        <a
            data-active={item.label.toLowerCase() === active || undefined}
            href={item.link}
            key={item.label}
            onClick={() => {
                setActive(item.label.toLowerCase());
            }}
            className={`
                ${
                    active === item.label.toLowerCase()
                        ? " bg-[var(--mantine-color-blue-light)] text-[var(--mantine-color-blue-light-color)] "
                        : " text-gray-500 hover:bg-gray-100 "
                } 
                ${isCollapsed ? " justify-center " : " p-4 "}
                transition-colors duration-200 ease-in-out 
                rounded flex gap-4 h-12 items-center  
            `}
        >
            <item.icon stroke={1.5} />
            {!isCollapsed && <span>{item.label}</span>}
        </a>
    ));
    useEffect(() => {
        const savedState = localStorage.getItem("sidebarCollapsed");
        if (savedState !== null) {
            setIsCollapsed(savedState === "true");
        }
    }, []);

    return (
        <nav
            className={`
                flex flex-col border-r border-gray-200 h-screen relative 
                ${isCollapsed ? " w-20 p-2 " : " min-w-sm p-4 "}
                transition-all duration-300 ease-in-out
            `}
        >
            <div
                className={`w-full flex items-center justify-start gap-6 border-b border-gray-200 ${isCollapsed ? " p-4 " : " p-4 "}`}
            >
                <Logo size="md" />
                {!isCollapsed && (
                    <h1 className="font-bold text-2xl text-[#043343]">
                        JOSEPH & MARY
                    </h1>
                )}
            </div>

            <div
                className={`flex flex-col flex-1 gap-2 w-full ${isCollapsed ? "p-2" : "p-4"}`}
            >
                {links}
            </div>

            <div
                className={`flex flex-col border-t border-gray-200 gap-4 w-full pt-4 ${isCollapsed ? "px-2" : "px-4"}`}
            >
                <LogoutButton
                    className="font-normal"
                    size="md"
                    variant="transparent"
                    color="gray"
                    leftSection={
                        <IconLogout2
                            size={isCollapsed ? 20 : 32}
                            stroke={1.5}
                        />
                    }
                >
                    {!isCollapsed && "Logout"}
                </LogoutButton>
            </div>

            <button
                className="
                    absolute top-1/2 -right-4 transform -translate-y-1/2 
                    bg-white border border-gray-300 p-1 rounded-full shadow-lg 
                    hover:bg-gray-100 z-10 
                    transition-all duration-300
                "
                onClick={toggleCollapse}
                aria-label="Toggle Sidebar"
            >
                <IconChevronLeft
                    className={`w-4 h-4 text-gray-700 transition-transform ${isCollapsed ? "rotate-180" : "rotate-0"}`}
                />
            </button>
        </nav>
    );
}
