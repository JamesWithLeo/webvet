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
    IconFileInvoice,
    IconChartHistogram,
    IconLayoutKanban,
    IconCurrencyPeso,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "../common/LogoutButton";
import { Divider, Tooltip, UnstyledButton } from "@mantine/core";
import { Baskervville_SC } from "next/font/google";
import { LogoSvg } from "../common/LogoSvg";
import { role } from "@/db/schema/users";
import Link from "next/link";

const baskerville = Baskervville_SC({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["500"],
});

const data = [
    {
        link: "/clinic/dashboard",
        label: "Dashboard",
        icon: <IconGauge stroke={1.5} />,
        roles: ["admin", "staff"],
    },
    {
        link: "/clinic/appointments",
        label: "Appointments",
        icon: <IconListSearch stroke={1.5} />,
        roles: ["admin", "staff"],
    },
    {
        link: "/clinic/invoice",
        label: "Invoice",
        icon: <IconFileInvoice stroke={1.5} />,
        roles: ["admin", "staff"],
    },
    {
        link: "/clinic/sales",
        label: "Sales",
        icon: <IconChartHistogram stroke={1.5} />,
        roles: ["admin", "staff"],
    },
    {
        link: "/clinic/treatment-board",
        label: "Treatment Board",
        icon: <IconLayoutKanban stroke={1.5} />,
        roles: ["admin", "vet"],
    },
    {
        link: "/clinic/accounts",
        label: "Accounts",
        icon: <IconUser stroke={1.5} />,
        roles: ["admin", "staff"],
    },
    {
        link: "/clinic/pets",
        label: "Pets",
        icon: <IconCat stroke={1.5} />,
        roles: ["admin", "staff", "vet"],
    },
    {
        link: "/clinic/calendar",
        label: "Calendar",
        icon: <IconCalendarSearch stroke={1.5} />,
        roles: ["admin"],
    },
    {
        link: "/clinic/services",
        label: "Services",
        icon: <IconCategory2 stroke={1.5} />,
        roles: ["admin"],
    },
    {
        label: "Pricing",
        icon: <IconCurrencyPeso stroke={1.5} />,
        roles: ["admin", "staff"],
        link: "/clinic/pricing",
    },
];
const NavLink = ({
    isActive,
    isCollapsed,
    link,
    label,
    icon,
}: {
    isCollapsed: boolean;
    link: string;
    label: string;
    icon: ReactNode;
    isActive: boolean;
}) => {
    return (
        <Tooltip label={label} position="right" withArrow>
            <UnstyledButton w={"100%"}>
                <a
                    data-active={isActive || undefined}
                    href={link}
                    key={label}
                    className={`
                {/* ${
                    isActive
                        ? " bg-(--mantine-color-blue-light) text-(--mantine-color-blue-light-color) "
                        : " text-gray-500 hover:bg-gray-100 "
                }  */}
                ${isCollapsed ? " justify-center " : " p-4 "}
                transition-colors duration-200 ease-in-out mt-2 
                rounded flex gap-4 h-12 items-center  
            `}
                >
                    {icon}
                    {!isCollapsed && <span>{label}</span>}
                </a>
            </UnstyledButton>
        </Tooltip>
    );
};

type Props = {
    role: (typeof role.enumValues)[number];
};
export default function AdminNav({ role }: Props) {
    const pathname = usePathname();
    const lastpath = pathname.split("/").pop()?.toLowerCase() ?? "";

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
    const filtered = data.filter((item) => item.roles.includes(role));

    const links = useMemo(
        () =>
            filtered.map((item) => (
                <NavLink
                    key={item.label}
                    icon={item.icon}
                    isActive={
                        item.label.toLowerCase() === active.split("-").join(" ")
                    }
                    link={`/v1${item.link}`}
                    label={item.label}
                    isCollapsed={isCollapsed}
                />
            )),
        [pathname, isCollapsed]
    );
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
                <Link href={"/v1/dashboard"} className="flex gap-2 md:gap-4">
                    <LogoSvg className="text-xl fill-current lg:max-h-8 h-full max-w-7 max-h-7 lg:max-w-8 w-full  min-w-10" />
                    {!isCollapsed && (
                        <h1 className={`${baskerville.className} text-nowrap `}>
                            Joseph & Mary
                        </h1>
                    )}
                </Link>
            </div>

            <div
                className={`flex flex-col flex-1 w-full ${isCollapsed ? "p-2" : "p-4"}`}
            >
                {links}
            </div>

            <div
                className={`flex flex-col gap-4 w-full pt-4 ${isCollapsed ? "px-2" : "px-4"}`}
            >
                <Divider />
                <LogoutButton
                    className="font-normal"
                    size="md"
                    variant="subtle"
                    label="Logout"
                    color="gray"
                    leftSection={
                        <IconLogout2
                            size={isCollapsed ? 20 : undefined}
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
