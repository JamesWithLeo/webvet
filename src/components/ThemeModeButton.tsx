"use client";

import {
    ActionIcon,
    MantineBreakpoint,
    useMantineColorScheme,
} from "@mantine/core";
import { IconSunFilled, IconMoon } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function ThemeModeButton({
    visibleFrom,
}: {
    visibleFrom: MantineBreakpoint;
}) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const icon =
        colorScheme === "light" ? (
            <IconMoon size={20} fill="none" stroke={1.5} />
        ) : (
            <IconSunFilled size={20} fill="currentColor" stroke={1.5} />
        );

    return (
        <ActionIcon
            visibleFrom={visibleFrom}
            variant="default"
            size="lg"
            onClick={toggleColorScheme}
            title="Toggle color scheme"
        >
            {mounted && icon}
        </ActionIcon>
    );
}
