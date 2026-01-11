"use client";

import { Group, Title } from "@mantine/core";
import NewAppointmentButton from "../common/NewAppointmentButton";
import { useMediaQuery } from "@mantine/hooks";

export default function AppointmentController() {
    const isMobile = useMediaQuery("(max-width: 64rem)");
    return (
        <Group align="center" justify="end">
            <NewAppointmentButton size={isMobile ? "xs" : "sm"} />
        </Group>
    );
}
