"use client";

import { ActionIcon, Group, Popover, Stack, Text, Title } from "@mantine/core";
import NewAppointmentButton from "../common/NewAppointmentButton";
import { useMediaQuery } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

export default function AppointmentController() {
    const isMobile = useMediaQuery("(max-width: 64rem)");
    return (
        <Group align="center" justify="space-between">
            <Popover
                position="bottom-start"
                offset={{ mainAxis: 12, crossAxis: 0 }}
                shadow="md"
                withArrow
                withOverlay
                overlayProps={{ zIndex: 1000, blur: "1px" }}
                zIndex={10001}
            >
                <Popover.Target>
                    <ActionIcon
                        variant="default"
                        style={{ zIndex: 1001 }}
                        radius={"xl"}
                        size={isMobile ? "input-xs" : "input-sm"}
                    >
                        <IconInfoCircle stroke={1.5} />
                    </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown style={{ zIndex: 10001 }}>
                    <Stack>
                        <Group justify="space-between">
                            <Title order={5}>Grooming:</Title>
                            <Text>
                                Monday, Wednesday, Thursday, Friday, Saturday
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Title order={5}>Vaccination:</Title>
                            <Text>Tuesday, Wednesday, Friday, Saturday</Text>
                        </Group>
                        <Group justify="space-between">
                            <Title order={5}>Deworming:</Title>
                            <Text>Tuesday, Wednesday, Friday, Saturday</Text>
                        </Group>
                        <Group justify="space-between">
                            <Title order={5}>Check up:</Title>
                            <Text>Tuesday, Wednesday, Friday, Saturday</Text>
                        </Group>
                    </Stack>
                </Popover.Dropdown>
            </Popover>
            <NewAppointmentButton size={isMobile ? "xs" : "sm"} />
        </Group>
    );
}
