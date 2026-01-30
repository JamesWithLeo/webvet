"use client";

import NewAppointmentButton from "../common/NewAppointmentButton";
import { Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import PopoverViewSchedule from "../common/PopoverViewSchedule";

export default function AppointmentController() {
    const isMobile = useMediaQuery("(max-width: 64rem)");
    return (
        <Group align="center" justify="space-between">
            {/* <PopoverViewSchedule isMobile={isMobile} /> */}
            <NewAppointmentButton size={isMobile ? "xs" : "sm"} />
        </Group>
    );
}
