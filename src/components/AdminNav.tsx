"use client";

import Logo from "@/components/Logo";
import {
    IconCalendarSearch,
    IconCat,
    IconGauge,
    IconLogout2,
    IconUser,
    IconChevronLeft,
    IconListSearch,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { Indicator, UnstyledButton } from "@mantine/core";

const data = [
    {
        link: "/v1/admin/dashboard",
        label: "Dashboard",
        icon: <IconGauge stroke={1.5} />,
    },
    {
        link: "/v1/admin/calendar",
        label: "Calendar",
        icon: <IconCalendarSearch stroke={1.5} />,
    },
    {
        link: "/v1/admin/appointments",
        label: "Appointments",
        icon: <IconListSearch stroke={1.5} />,
    },
    {
        link: "/v1/admin/accounts",
        label: "Accounts",
        icon: <IconUser stroke={1.5} />,
    },
    { link: "/v1/admin/pets", label: "Pets", icon: <IconCat stroke={1.5} /> },
];
const NavLink = ({
    isActive,
    isCollapsed,
    link,
    label,
    icon,
    onClick,
    subLinks,
}: {
    isActive: boolean;
    isCollapsed: boolean;
    link: string;
    label: string;
    icon: ReactNode;
    onClick: () => void;
    subLinks?: { link: string; label: string }[];
}) => {
    const [opened, setOpened] = useState(false);
    const router = useRouter();
    if (label === "Appointments")
        return (
            <Indicator offset={5} label={"10+"} inline size={"lg"} color="red">
                <UnstyledButton w={"100%"}>
                    <a
                        data-active={isActive || undefined}
                        href={link}
                        key={label}
                        onClick={onClick}
                        className={`
                ${
                    isActive
                        ? " bg-(--mantine-color-blue-light) text-(--mantine-color-blue-light-color) "
                        : " text-gray-500 hover:bg-gray-100 "
                } 
                ${isCollapsed ? " justify-center " : " p-4 "}
                transition-colors duration-200 ease-in-out mt-2 
                rounded flex gap-4 h-12 items-center  
            `}
                    >
                        {icon}
                        {!isCollapsed && <span>{label}</span>}
                    </a>
                </UnstyledButton>
            </Indicator>
        );
    else
        return (
            <UnstyledButton w={"100%"}>
                <a
                    data-active={isActive || undefined}
                    href={link}
                    key={label}
                    onClick={onClick}
                    className={`
                ${
                    isActive
                        ? " bg-(--mantine-color-blue-light) text-(--mantine-color-blue-light-color) "
                        : " text-gray-500 hover:bg-gray-100 "
                } 
                ${isCollapsed ? " justify-center " : " p-4 "}
                transition-colors duration-200 ease-in-out mt-2 
                rounded flex gap-4 h-12 items-center  
            `}
                >
                    {icon}
                    {!isCollapsed && <span>{label}</span>}
                </a>
            </UnstyledButton>
        );
};

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
        <NavLink
            key={item.label}
            icon={item.icon}
            isActive={item.label.toLowerCase() === active}
            link={item.link}
            label={item.label}
            isCollapsed={isCollapsed}
            onClick={() => {
                setActive(lastpath);
            }}
        />
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
                flex flex-col border-r     border-gray-200 h-screen relative 
                ${isCollapsed ? " w-20 p-2 " : " min-w-sm p-4 "}
                transition-all duration-300 ease-in-out
            `}
        >
            <div
                className={`w-full flex items-center justify-start  gap-6 border-b   ${isCollapsed ? " p-4 " : " p-4 "}`}
            >
                <Logo size="md" />
                {!isCollapsed && (
                    <h1 className="font-bold text-2xl text-[#14678f] dark:text-[#50bce9]">
                        JOSEPH & MARY
                    </h1>
                )}
            </div>

            <div
                className={`flex flex-col flex-1 w-full ${isCollapsed ? "p-2" : "p-4"}`}
            >
                {links}
            </div>

            <div
                className={`flex flex-col border-t  gap-4 w-full pt-4 ${isCollapsed ? "px-2" : "px-4"}`}
            >
                <LogoutButton
                    className="font-normal"
                    size="md"
                    variant="transparent"
                    label="Logout"
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

            {/* <ThemeModeButton /> */}
            <button
                className="
                    absolute top-1/2 -right-4 transform -translate-y-1/2 
                    light:bg-white  border  p-1 rounded-full shadow-lg 
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
