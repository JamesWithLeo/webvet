"use client";

import {
    UpdateInvoiceItemStatus,
    UpdateInvoiceStatus,
} from "@/actions/medical";
import { invoiceStatus, itemStatusEnum } from "@/db/schema/invoice";
import { VetData } from "@/lib/db/invoice";
import { toTitleCase } from "@/lib/toTitleCase";
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
    ActionIcon,
    Tooltip,
    Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
    IconCheck,
    IconChevronDown,
    IconChevronUp,
    IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import CopyButton from "./common/CopyButton";

type Props = {
    title: string;
    color: string;
    items: any[];
    active?: boolean;
    completed?: boolean;
    onMedicalClick: (
        appointmentId: string,
        invoiceId: string,
        pet: AppointedPet
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
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Stack gap="md">
                    <Group justify="apart">
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
        appointmentId: string,
        invoiceId: string,
        pet: AppointedPet
    ) => void;
}

function KanbanCard({ item, active, completed, onMedicalClick }: CardProps) {
    const queryClient = useQueryClient();
    const [opened, { toggle }] = useDisclosure(false);

    const [updateInvoiceStatusState, updateInvoiceStatusAction, isMarking] =
        useActionState(UpdateInvoiceStatus, { success: false });

    const [
        updateInvoiceItemStatusState,
        updateInvoiceItemStatusAction,
        isPendingUpdateItemStatus,
    ] = useActionState(UpdateInvoiceItemStatus, { success: false });

    const handleUpdateInvoiceStatus = (
        status: (typeof invoiceStatus.enumValues)[number]
    ) => {
        const invoiceId = item.invoice?.id;
        if (invoiceId && !isMarking) {
            startTransition(() => {
                updateInvoiceStatusAction({ invoiceId, status: status });
            });
        }
    };

    const handleUpdateInvoiceItemstatus = (
        invoiceItemId: string,
        status: (typeof itemStatusEnum.enumValues)[number]
    ) => {
        if (isPendingUpdateItemStatus) return;
        startTransition(() => {
            updateInvoiceItemStatusAction({ invoiceItemId, status });
        });
    };

    const canFinishAndBill = useMemo(() => {
        if (!item.pets || item.pets.length === 0) return false;
        return item.pets.every((p) => p.itemStatus === "COMPLETED");
    }, [item.pets]);

    useEffect(() => {
        if (
            updateInvoiceStatusState.success &&
            updateInvoiceStatusState.updatedInvoiceId &&
            updateInvoiceStatusState.status
        ) {
            const { updatedInvoiceId, status } = updateInvoiceStatusState;
            queryClient.invalidateQueries({ queryKey: ["medical", "admin"] });
            notifications.show({
                title: "Appointment updated!",
                message: `Appointment with invoice of ${updatedInvoiceId} is successfully marked as ${status.toLowerCase()}.`,
                icon: <IconCheck />,
                color: "teal",
                autoClose: 6000,
                radius: "md",
            });
        }
    }, [updateInvoiceStatusState]);
    useEffect(() => {
        if (
            updateInvoiceItemStatusState.success &&
            updateInvoiceItemStatusState.updatedInvoiceId &&
            updateInvoiceItemStatusState.itemStatus
        ) {
            const { updatedInvoiceId, itemStatus } =
                updateInvoiceItemStatusState;
            queryClient.invalidateQueries({ queryKey: ["medical", "admin"] });
            notifications.show({
                title: "Invoice item updated!",
                message: `Invoice item with Id of ${updatedInvoiceId} is successfully marked as ${itemStatus.toLowerCase()}.`,
                icon: <IconCheck />,
                color: "teal",
                autoClose: 6000,
                radius: "md",
            });
        }
    }, [updateInvoiceItemStatusState]);

    return (
        <Paper
            p="md"
            radius="md"
            withBorder
            style={{ opacity: completed ? 0.7 : 1 }}
        >
            <Stack gap="xs">
                <Box>
                    <Text size="xs" c="dimmed" fw={700}>
                        OWNER
                    </Text>
                    <Text fw={700} size="sm">
                        {toTitleCase(
                            `${item.user?.firstName} ${item.user?.lastName}`
                        ).trim() ?? "Unknown client"}
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
                            {item.pets.map((pet) => (
                                <Box
                                    key={pet.invoiceItemId}
                                    bg="white"
                                    style={{
                                        padding: "10px",
                                        borderRadius: "6px",
                                        border: "1px solid #eee",

                                        borderLeft:
                                            pet.itemStatus === "COMPLETED"
                                                ? "5px solid green"
                                                : "1px solid #eee",
                                    }}
                                >
                                    <Group
                                        justify="space-between"
                                        wrap="nowrap"
                                    >
                                        <Stack gap={"sm"}>
                                            <Group className="group">
                                                <Avatar
                                                    src={pet.photoUrl}
                                                    size={"lg"}
                                                >
                                                    {pet.name[0].toUpperCase()}
                                                </Avatar>
                                                <Stack gap={0}>
                                                    <Group wrap="nowrap">
                                                        <Text fw={"bold"}>
                                                            {toTitleCase(
                                                                pet.name
                                                            )}
                                                        </Text>
                                                        <CopyButton
                                                            value={pet.id}
                                                        />
                                                    </Group>
                                                    <Text
                                                        size="xs"
                                                        c={"dimmed"}
                                                    >
                                                        {pet.id}
                                                    </Text>
                                                    <Group>
                                                        <Badge
                                                            variant="light"
                                                            size="lg"
                                                            leftSection={
                                                                pet.species ===
                                                                "cat"
                                                                    ? "🐱"
                                                                    : "🐶"
                                                            }
                                                        >
                                                            {toTitleCase(
                                                                pet.breedSpecification
                                                            )}
                                                        </Badge>
                                                    </Group>
                                                </Stack>
                                            </Group>
                                            <Badge
                                                size="sm"
                                                variant="outline"
                                                color="blue"
                                            >
                                                {pet.serviceName}
                                            </Badge>
                                        </Stack>

                                        {active && (
                                            <Box>
                                                <Group gap={"xs"}>
                                                    <Button
                                                        variant="subtle"
                                                        size="xs"
                                                        radius={"sm"}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            startTransition(
                                                                () => {
                                                                    onMedicalClick(
                                                                        item
                                                                            .appointment
                                                                            .id,
                                                                        item
                                                                            .invoice
                                                                            ?.id,
                                                                        pet
                                                                    );
                                                                    // item.invoice
                                                                    //     ?.id;
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {pet.log
                                                            ? "Edit log"
                                                            : "Add log"}
                                                        {/* Add log */}
                                                    </Button>
                                                    {pet.itemStatus ===
                                                    "COMPLETED" ? (
                                                        <>
                                                            {" "}
                                                            <Tooltip
                                                                label="Mark as completed"
                                                                position="right"
                                                                withArrow
                                                                offset={-1}
                                                                arrowSize={10}
                                                            >
                                                                <ActionIcon
                                                                    size="input-xs"
                                                                    radius={
                                                                        "md"
                                                                    }
                                                                    color="orange"
                                                                    loading={
                                                                        isPendingUpdateItemStatus
                                                                    }
                                                                    disabled={
                                                                        isPendingUpdateItemStatus
                                                                    }
                                                                    variant="light"
                                                                    onClick={() => {
                                                                        handleUpdateInvoiceItemstatus(
                                                                            pet.invoiceItemId,
                                                                            "PENDING"
                                                                        );
                                                                    }}
                                                                >
                                                                    <IconX
                                                                        size={
                                                                            16
                                                                        }
                                                                        stroke={
                                                                            1.5
                                                                        }
                                                                    />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Tooltip
                                                                label="Mark as completed"
                                                                position="right"
                                                                withArrow
                                                                offset={-1}
                                                                arrowSize={10}
                                                            >
                                                                <ActionIcon
                                                                    onClick={() => {
                                                                        handleUpdateInvoiceItemstatus(
                                                                            pet.invoiceItemId,
                                                                            "COMPLETED"
                                                                        );
                                                                    }}
                                                                    loading={
                                                                        isPendingUpdateItemStatus
                                                                    }
                                                                    size="input-xs"
                                                                    radius={
                                                                        "md"
                                                                    }
                                                                    variant="light"
                                                                >
                                                                    <IconCheck
                                                                        size={
                                                                            16
                                                                        }
                                                                        stroke={
                                                                            1.5
                                                                        }
                                                                    />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </Group>
                                            </Box>
                                        )}
                                    </Group>
                                </Box>
                            ))}
                        </Stack>
                    </Collapse>
                </Box>

                <Box p={6} bg="gray.1" style={{ borderRadius: "4px" }}>
                    <Text size="xs" fw={700} c="gray.7">
                        TItle / Reason:
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
                        onClick={() => handleUpdateInvoiceStatus("IN_PROGRESS")}
                    >
                        Start Exam
                    </Button>
                )}
                {active && (
                    <Button
                        fullWidth
                        size="xs"
                        color="blue"
                        loading={isMarking}
                        disabled={!canFinishAndBill}
                        onClick={() => handleUpdateInvoiceStatus("COMPLETED")}
                    >
                        Mark as complete
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}
