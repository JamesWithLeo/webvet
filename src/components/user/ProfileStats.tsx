"use client";

import useAppointmentsClient from "@/lib/hooks/useAppointmentsClient";
import usePets from "@/lib/hooks/usePets";
import {
    SimpleGrid,
    Paper,
    Stack,
    Group,
    Text,
    Container,
    ThemeIcon,
    Divider,
} from "@mantine/core";
import {
    IconPawOff,
    IconPaw,
    IconPawFilled,
    IconCalendarEvent,
    IconCalendarCheck,
    IconCalendarX,
} from "@tabler/icons-react";
import { useMemo } from "react";

// Helper component for clean reuse
const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: any;
    label: string;
    value: number;
    color: string;
}) => (
    <Group wrap="nowrap" gap="sm">
        <ThemeIcon variant="light" color={color} size="lg" radius="md">
            <Icon size="1.2rem" stroke={1.5} />
        </ThemeIcon>
        <div>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                {label}
            </Text>
            <Text fw={700} size="xl">
                {value}
            </Text>
        </div>
    </Group>
);
export default function ProfileStats({ id }: { id: string }) {
    const { data: pets } = usePets(id, "all");

    const { alive, deceased } = useMemo(() => {
        let aliveCount = 0;
        let deceasedCount = 0;

        pets?.forEach((pet) => {
            if (pet.life === "alive") {
                aliveCount++;
            } else if (pet.life === "deceased") {
                deceasedCount++;
            }
        });

        return {
            alive: aliveCount,
            deceased: deceasedCount,
        };
    }, [pets]);

    const { data: appointments } = useAppointmentsClient(id);

    const { allVisit, allMissed, allPending } = useMemo(() => {
        let visit = 0;
        let missed = 0;
        let pending = 0;

        const now = new Date(); // Define "now" once for consistency

        appointments?.forEach((a) => {
            if (!!a.invoice) {
                visit++;
            } else {
                const eventDate = new Date(a.event_datetime);
                if (eventDate < now) {
                    missed++;
                } else {
                    pending++;
                }
            }
        });

        return { allVisit: visit, allMissed: missed, allPending: pending };
    }, [appointments]);
    return (
        <Container fluid w="100%" p={0}>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {/* Pet Summary Card */}
                <Paper withBorder p="md" radius="md" shadow="sm">
                    <Text fw={600} mb="xs" c="primary.7">
                        Pet Overview
                    </Text>
                    <Divider mb="md" />
                    <Stack gap="md">
                        <StatCard
                            icon={IconPawFilled}
                            label="Total Pets"
                            value={pets?.length ?? 0}
                            color="blue"
                        />
                        <Group grow>
                            <StatCard
                                icon={IconPaw}
                                label="Alive"
                                value={alive}
                                color="green"
                            />
                            <StatCard
                                icon={IconPawOff}
                                label="Deceased"
                                value={deceased}
                                color="red"
                            />
                        </Group>
                    </Stack>
                </Paper>

                {/* Appointment Summary Card */}
                <Paper withBorder p="md" radius="md" shadow="sm">
                    <Text fw={600} mb="xs" c="primary.7">
                        Appointment History
                    </Text>
                    <Divider mb="md" />
                    <Stack gap="md">
                        <StatCard
                            icon={IconCalendarCheck}
                            label="Total Complete"
                            value={allVisit}
                            color="grape"
                        />
                        <Group grow>
                            <StatCard
                                icon={IconCalendarEvent}
                                label="Pending"
                                value={allPending}
                                color="orange"
                            />
                            <StatCard
                                icon={IconCalendarX}
                                label="Missed"
                                value={allMissed}
                                color="gray"
                            />
                        </Group>
                    </Stack>
                </Paper>
            </SimpleGrid>
        </Container>
    );
}
