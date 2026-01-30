"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import {
    ActionIcon,
    Group,
    Popover,
    PopoverProps,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { AppointmentSchedulesTypeModel } from "@/db/schema/appointments";
import { toTitleCase } from "@/lib/toTitleCase";

const daysOfWeek: Record<number, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
} as const;

const getDayWord = (appointmentSchedules: number[]) => {
    daysOfWeek[1];
    return appointmentSchedules.map((d) => daysOfWeek[d]).join(", ");
};

type Props = PopoverProps & {
    isMobile: boolean;
    schedules: AppointmentSchedulesTypeModel[];
};

export default function PopoverViewSchedule({
    isMobile,
    schedules,
    ...props
}: Props) {
    return (
        <Popover
            position="bottom-start"
            offset={{ mainAxis: 12, crossAxis: 0 }}
            shadow="md"
            withArrow
            withOverlay
            overlayProps={{ zIndex: 10, blur: "1px" }}
            zIndex={11}
            {...props}
        >
            <Popover.Target>
                <ActionIcon
                    variant="default"
                    style={{ zIndex: 11 }}
                    size={isMobile ? "input-xs" : "input-sm"}
                >
                    <IconInfoCircle stroke={1.5} size={20} />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown style={{ zIndex: 10001 }}>
                <Stack>
                    {schedules.map((s) => (
                        <Group key={s.id} justify="space-between">
                            <Title order={5}>
                                {toTitleCase(s.appointmentType)}
                            </Title>
                            <Text>{getDayWord(s.availableDays)}</Text>
                        </Group>
                    ))}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
