"use client";

import {
    Card,
    Stack,
    Title,
    Group,
    BackgroundImage,
    ThemeIcon,
} from "@mantine/core";
import { IconCat, IconCalendarCheck, IconCalendarX } from "@tabler/icons-react";

export default function DashboardOverview() {
    return (
        <div className="h-full w-full relative">
            <BackgroundImage src="/overviewbg2.jpg" h={"100%"} p={"md"}>
                <Stack h={"100%"} align="start" justify="start">
                    <h1 className="text-sm text-white">Overview</h1>
                    <Group>
                        <ThemeIcon
                            bg={"gray.1"}
                            c={"dimmed"}
                            variant="transparent"
                            radius={"sm"}
                            size={"lg"}
                        >
                            <IconCat stroke={1.5} size={20} />
                        </ThemeIcon>
                        <Title order={4} c={"white"}>
                            Total Pets: 5
                        </Title>
                    </Group>
                    <Group>
                        <ThemeIcon
                            bg={"gray.1"}
                            c={"dimmed"}
                            variant="transparent"
                            radius={"sm"}
                            size={"lg"}
                        >
                            <IconCalendarCheck stroke={1.5} size={20} />
                        </ThemeIcon>
                        <Title order={4} c={"white"}>
                            Total Appointment: 10
                        </Title>
                    </Group>
                    <Group>
                        <ThemeIcon
                            bg={"gray.1"}
                            c={"dimmed"}
                            variant="transparent"
                            radius={"sm"}
                            size={"lg"}
                        >
                            <IconCalendarX stroke={1.5} size={20} />
                        </ThemeIcon>
                        <Title order={4} c={"white"}>
                            Missed Appointment: 1
                        </Title>
                    </Group>
                </Stack>
            </BackgroundImage>
        </div>
    );
}
