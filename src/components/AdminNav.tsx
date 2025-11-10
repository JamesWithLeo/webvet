"use client";

import Logo from "@/components/Logo";
import {
    IconCalendarSearch,
    IconCat,
    IconGauge,
    IconLogout2,
    IconUser,
    IconChevronLeft,
    Icon,
    IconListSearch,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
import {
    Box,
    Collapse,
    Group,
    Button,
    Text,
    UnstyledButton,
} from "@mantine/core";

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
        sublinks: [
            {
                link: "/v1/admin/appointments/calendar",
                label: "upcoming",
            },
            {
                link: "/v1/admin/appointments/list",
                label: "past dates",
            },
        ],
    },
    {
        link: "/v1/admin/accounts",
        label: "Accounts",
        icon: <IconUser stroke={1.5} />,
    },
    { link: "/v1/admin/pets", label: "Pets", icon: <IconCat /> },
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
    if (Array.isArray(subLinks) && subLinks.length) {
        return (
            <>
                <button
                    className={`
                ${
                    isActive
                        ? " bg-[var(--mantine-color-blue-light)] text-[var(--mantine-color-blue-light-color)] "
                        : " text-gray-500 hover:bg-gray-100 "
                }
                ${isCollapsed ? " justify-center " : " p-4 "}
                transition-colors duration-200 ease-in-out mt-2 
                rounded flex gap-4 h-12 items-center  `}
                    onClick={() => {
                        setOpened(!opened);
                        onClick();
                        router.replace(link);
                    }}
                >
                    {icon}
                    {!isCollapsed && <span>{label}</span>}
                </button>
                {!isCollapsed && (
                    <Collapse in={opened} className="ml-8 ">
                        {subLinks.map((link, index) => (
                            <Box<"a">
                                key={index}
                                className="border-l h-12 hover:bg-gray-100 text-gray-500 flex items-center px-4 border-gray-200"
                            >
                                {link.label}
                            </Box>
                        ))}
                    </Collapse>
                )}
            </>
        );
    } else
        return (
            <UnstyledButton>
                <a
                    data-active={isActive || undefined}
                    href={link}
                    key={label}
                    onClick={onClick}
                    className={`
                ${
                    isActive
                        ? " bg-[var(--mantine-color-blue-light)] text-[var(--mantine-color-blue-light-color)] "
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
            subLinks={item.sublinks}
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
                className={`flex flex-col flex-1 w-full ${isCollapsed ? "p-2" : "p-4"}`}
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
