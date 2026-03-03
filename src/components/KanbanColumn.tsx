"use client";

import { MarkAsComplete, MarkAsInProgressAction } from "@/actions/medical";
import { VetData } from "@/lib/db/invoice";
import { AppointedPet } from "@/types/pets";
import {
    Badge,
    Paper,
    Text,
    Group,
    Stack,
    Grid,
    Divider,
    Box,
    UnstyledButton,
    ColorSwatch,
    Button,
    Collapse,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect, useMemo } from "react";

type Props = {
    title: string;
    color: string;
    items: any[];
    active?: boolean;
    completed?: boolean;
    onMedicalClick: (
        pet: AppointedPet,
        apptId: string,
        invoiceId: string | null
    ) => void;
};

export default function KanbanColumn({
    title,
    color,
    items,
    active,
    completed,
    onMedicalClick,
}: Props) {
    return (
        <Grid.Col span={4}>
            <Paper
                withBorder
                p="sm"
                radius="md"
                style={{
                    flex: 1,
                    // minWidth: 300,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Stack gap="md">
                    {/* Column Header */}
                    <Group justify="apart" mb="xs">
                        <Group gap="xs">
                            <ColorSwatch color={color} size={10} />
                            <Text fw={700} size="sm" tt="uppercase" c="dimmed">
                                {title}
                            </Text>
                        </Group>
                        <Badge variant="light" color="gray">
                            {items.length}
                        </Badge>
                    </Group>

                    <Divider color={color} size="sm" />

                    <Stack gap="sm" style={{ flex: 1, overflowY: "auto" }}>
                        {items.length === 0 ? (
                            <Text
                                size="xs"
                                c="dimmed"
                                ta="center"
                                py="xl"
                                fs="italic"
                            >
                                No appointments in this stage
                            </Text>
                        ) : (
                            items.map((item) => (
                                <KanbanCard
                                    key={item.appointment.id}
                                    item={item}
                                    active={active}
                                    completed={completed}
                                    onMedicalClick={onMedicalClick}
                                />
                            ))
                        )}
                    </Stack>
                </Stack>
            </Paper>
        </Grid.Col>
    );
}

export interface CardProps {
    item: VetData;
    active?: boolean;
    completed?: boolean;
    onMedicalClick: (
        pet: AppointedPet,
        apptId: string,
        invoiceId: string | null
    ) => void;
}

function KanbanCard({ item, active, completed, onMedicalClick }: CardProps) {
    const queryClient = useQueryClient();
    const [opened, { toggle }] = useDisclosure(false);

    const [formState, formAction, isMarking] = useActionState(
        MarkAsInProgressAction,
        { success: false }
    );

    const [markAsCompleteState, markAsCompleteAction, isCompleting] =
        useActionState(MarkAsComplete, { success: false });

    const handleStart = () => {
        const invoiceId = item.invoice?.id;
        if (invoiceId && !isMarking) {
            startTransition(() => {
                formAction({ invoiceId });
            });
        }
    };

    const handleComplete = () => {
        const invoiceId = item.invoice?.id;
        if (invoiceId && !isCompleting) {
            startTransition(() => {
                markAsCompleteAction({ invoiceId });
            });
        }
    };

    const canFinishAndBill = useMemo(() => {
        if (!item.pets || item.pets.length === 0) return false;
        return item.pets.every(
            (p) =>
                p.hasLogs ||
                ["grooming", "vaccination"].includes(
                    p.serviceType?.toLowerCase() ?? ""
                )
        );
    }, [item.pets]);
    useEffect(() => {
        if (markAsCompleteState.success) {
            queryClient.invalidateQueries({ queryKey: ["medical", "admin"] });
        }
    }, [markAsCompleteState]);
    // ... Effects remain the same ...

    return (
        <Paper
            p="md"
            radius="md"
            withBorder
            style={{ opacity: completed ? 0.7 : 1 }}
        >
            <Stack gap="xs">
                {/* Owner Info Section */}
                <Box>
                    <Text size="xs" c="dimmed" fw={700}>
                        OWNER
                    </Text>
                    <Text fw={700} size="sm">
                        {item.user.firstName} {item.user.lastName}
                    </Text>
                </Box>

                <Divider variant="dashed" />

                <Box>
                    <UnstyledButton
                        onClick={toggle}
                        style={{ width: "100%" }}
                        mb={opened ? 6 : 0}
                    >
                        <Group justify="space-between">
                            <Group gap={6}>
                                <Text size="xs" c="dimmed" fw={700}>
                                    PATIENTS
                                </Text>
                                <Badge
                                    size="xs"
                                    variant="filled"
                                    color="gray.2"
                                    c="dark.4"
                                >
                                    {item.pets.length}
                                </Badge>
                            </Group>
                            {opened ? (
                                <IconChevronUp size={14} color="gray" />
                            ) : (
                                <IconChevronDown size={14} color="gray" />
                            )}
                        </Group>
                    </UnstyledButton>

                    <Collapse in={opened}>
                        <Stack gap={6} mt={6}>
                            {item.pets.map(
                                (
                                    pet // Fixed 'any' here
                                ) => (
                                    <Box
                                        key={pet.joinId}
                                        p={8}
                                        bg="white"
                                        style={{
                                            borderRadius: "6px",
                                            border: "1px solid #eee",
                                            borderLeft: pet.hasLogs
                                                ? "4px solid green"
                                                : "4px solid transparent",
                                        }}
                                    >
                                        <Group
                                            justify="space-between"
                                            wrap="nowrap"
                                        >
                                            <Stack gap={0}>
                                                <Text size="xs" fw={700}>
                                                    {pet.species?.toLowerCase() ===
                                                    "cat"
                                                        ? "🐱"
                                                        : "🐶"}{" "}
                                                    {pet.name}
                                                </Text>
                                                <Badge
                                                    size="xs"
                                                    variant="outline"
                                                    color="blue"
                                                >
                                                    {pet.serviceName}
                                                </Badge>
                                            </Stack>

                                            {active && (
                                                <Box>
                                                    {pet.hasLogs ? (
                                                        <Badge
                                                            variant="light"
                                                            color="green"
                                                            size="sm"
                                                        >
                                                            ✓ Done
                                                        </Badge>
                                                    ) : (
                                                        ![
                                                            "grooming",
                                                            "vaccination",
                                                        ].includes(
                                                            pet.serviceType?.toLowerCase() ??
                                                                ""
                                                        ) && (
                                                            <Button
                                                                variant="subtle"
                                                                size="compact-xs"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    // Fixed: item.invoice?.id instead of pet.invoice.id
                                                                    onMedicalClick(
                                                                        pet,
                                                                        item
                                                                            .appointment
                                                                            .id,
                                                                        item
                                                                            .invoice
                                                                            ?.id ??
                                                                            null
                                                                    );
                                                                }}
                                                            >
                                                                + Log
                                                            </Button>
                                                        )
                                                    )}
                                                </Box>
                                            )}
                                        </Group>
                                    </Box>
                                )
                            )}
                        </Stack>
                    </Collapse>
                </Box>

                <Box p={6} bg="gray.1" style={{ borderRadius: "4px" }}>
                    <Text size="xs" fw={700} c="gray.7">
                        REASON:
                    </Text>
                    <Text size="xs">{item.appointment.title}</Text>
                </Box>

                {!active && !completed && (
                    <Button
                        fullWidth
                        size="xs"
                        color="green"
                        variant="light"
                        loading={isMarking}
                        onClick={handleStart}
                    >
                        Start Exam
                    </Button>
                )}
                {active && (
                    <Button
                        fullWidth
                        size="xs"
                        color="blue"
                        loading={isCompleting}
                        disabled={!canFinishAndBill}
                        onClick={handleComplete}
                    >
                        Mark as complete
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}
