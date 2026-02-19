"use client";

import {
    IconCalendarSearch,
    IconCat,
    IconGauge,
    IconLogout2,
    IconUser,
    IconChevronLeft,
    IconListSearch,
    IconCategory2,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "../common/LogoutButton";
import { UnstyledButton } from "@mantine/core";
import { Baskervville_SC } from "next/font/google";
import { LogoSvg } from "../common/LogoSvg";

const baskerville = Baskervville_SC({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["500"],
});

const data = [
    {
        link: "/v1/admin/dashboard",
        label: "Dashboard",
        icon: <IconGauge stroke={1.5} />,
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
    {
        link: "/v1/admin/calendar",
        label: "Calendar",
        icon: <IconCalendarSearch stroke={1.5} />,
    },
    {
        link: "/v1/admin/services",
        label: "Services",
        icon: <IconCategory2 stroke={1.5} />,
    },
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

    const key = "sidebarCollapsed";

    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => {
            const newState = !prev;
            localStorage.setItem(key, String(newState));
            return newState;
        });
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
        const saved = localStorage.getItem(key);
        if (saved !== null) {
            setIsCollapsed(saved === "true");
        }
    }, []);

    return (
        <nav
            className={`
                flex flex-col border-r  z-10 bg-white    border-gray-200 h-screen relative 
                ${isCollapsed ? " w-20 p-2 " : " min-w-sm p-4 "}
                transition-all duration-300 ease-in-out
            `}
        >
            <div
                className={`
                    flex gap-2 md:gap-4  text-[#14678f] text-xl lg:text-2xl w-full  items-center justify-start  border-b   ${isCollapsed ? " p-4 " : " p-4 "}`}
            >
                <LogoSvg className="text-xl fill-current lg:max-h-8 h-full max-w-7 max-h-7 lg:max-w-8 w-full  min-w-10" />
                {!isCollapsed && (
                    <h1 className={`${baskerville.className} text-nowrap `}>
                        Joseph & Mary
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
