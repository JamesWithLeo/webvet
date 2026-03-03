"use client";

import { useState } from "react"; // Added for toggle state
import { toTitleCase } from "@/lib/toTitleCase";
import {
    Stack,
    Timeline,
    Title,
    Text,
    Group,
    Space,
    Divider,
    Card,
    ThemeIcon,
    Badge,
    Box,
    Collapse, // Added
    UnstyledButton, // Added for the toggle trigger
} from "@mantine/core";
import {
    IconChevronDown,
    IconChevronUp,
    IconPillFilled,
    IconScissors,
    IconStethoscope,
    IconVaccine,
} from "@tabler/icons-react";
import { formatDistance } from "date-fns";
import Link from "next/link";
import CurrencyFormatter from "@/lib/CurrencyFormatter";

type Props = {
    data: {
        serviceType: "GROOMING" | "CHECK_UP" | "DEWORMING" | "VACCINATION";
        serviceName: string;
        id: string;
        event_datetime: string;
        priceAtInvoice: string | null;
        medicalRecord: {
            weight: string | null;
            symptoms: string | null;
            diagnosis: string | null;
            prescription: string | null;
            notes: string | null;
            temperature: string | null;
        } | null;
    }[];
};

export default function PetProfileAppointment({ data }: Props) {
    // State to track which appointment's medical details are expanded
    const [openedId, setOpenedId] = useState<string | null>(null);

    const sortedData = [...data].sort(
        (a, b) =>
            new Date(b.event_datetime).getTime() -
            new Date(a.event_datetime).getTime()
    );
    const timelines = () =>
        sortedData.map((v) => {
            const itemKey = `${v.id}-${v.serviceType}`;
            const isOpened = openedId === itemKey;

            let bulletIcon: React.ReactNode;
            switch (v.serviceType) {
                case "GROOMING":
                    bulletIcon = <IconScissors size={20} stroke={2} />;
                    break;
                case "CHECK_UP":
                    bulletIcon = <IconStethoscope size={20} stroke={2} />;
                    break;
                case "DEWORMING":
                    bulletIcon = <IconPillFilled size={20} stroke={2} />;
                    break;
                case "VACCINATION":
                    bulletIcon = <IconVaccine size={20} stroke={2} />;
                    break;
            }

            return (
                <Timeline.Item
                    key={itemKey}
                    lineVariant={
                        new Date(v.event_datetime) > new Date()
                            ? "dashed"
                            : "solid"
                    }
                    bullet={
                        bulletIcon ? (
                            <ThemeIcon radius={"xl"} variant="white">
                                {bulletIcon}
                            </ThemeIcon>
                        ) : undefined
                    }
                >
                    <Text c={"dimmed"} size="xs" mb={"xs"}>
                        {formatDistance(v.event_datetime, new Date(), {
                            addSuffix: true,
                        })}
                    </Text>

                    <Card withBorder radius={"md"} shadow="sm" p={0}>
                        <Stack gap={0}>
                            {/* Main Content Area */}
                            <Box p="md">
                                <Stack gap="xs">
                                    <Group
                                        justify="space-between"
                                        align="flex-start"
                                    >
                                        <Stack gap={0}>
                                            <Link
                                                className="font-semibold hover:underline"
                                                href={`/v1/appointments/${v.id}`}
                                            >
                                                {toTitleCase(v.serviceType)}
                                            </Link>
                                            <Text size="xs" c="dimmed">
                                                {new Date(
                                                    v.event_datetime
                                                ).toLocaleString()}
                                            </Text>
                                        </Stack>

                                        {v.priceAtInvoice && (
                                            <Badge
                                                variant="light"
                                                color="teal"
                                                size="lg"
                                            >
                                                {CurrencyFormatter(
                                                    v.priceAtInvoice
                                                )}
                                            </Badge>
                                        )}
                                    </Group>

                                    {/* Clinical Basics (Weight/Temp) - Always Visible if record exists */}
                                    {v.medicalRecord && (
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {v.medicalRecord.weight && (
                                                <Text>
                                                    <b>Weight:</b>{" "}
                                                    {v.medicalRecord.weight}kg
                                                </Text>
                                            )}
                                            {v.medicalRecord.temperature && (
                                                <Text>
                                                    <b>Temp:</b>{" "}
                                                    {
                                                        v.medicalRecord
                                                            .temperature
                                                    }
                                                    °C
                                                </Text>
                                            )}
                                        </div>
                                    )}
                                </Stack>
                            </Box>

                            {/* Collapsible Medical Record Section */}
                            {v.medicalRecord && (
                                <>
                                    <Divider variant="dashed" />
                                    <UnstyledButton
                                        onClick={() =>
                                            setOpenedId(
                                                isOpened ? null : itemKey
                                            )
                                        }
                                        p="xs"
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <Group justify="center" gap={4}>
                                            <Text size="xs" fw={600} c="dimmed">
                                                {isOpened
                                                    ? "Hide Details"
                                                    : "View Symptoms & Notes"}
                                            </Text>
                                            {isOpened ? (
                                                <IconChevronUp size={14} />
                                            ) : (
                                                <IconChevronDown size={14} />
                                            )}
                                        </Group>
                                    </UnstyledButton>

                                    <Collapse in={isOpened}>
                                        <Stack p="md" pt={0} gap="sm">
                                            {v.medicalRecord.symptoms && (
                                                <Box>
                                                    <Text
                                                        size="xs"
                                                        fw={700}
                                                        c="dimmed"
                                                    >
                                                        SYMPTOMS
                                                    </Text>
                                                    <Text size="sm">
                                                        {
                                                            v.medicalRecord
                                                                .symptoms
                                                        }
                                                    </Text>
                                                </Box>
                                            )}

                                            {v.medicalRecord.diagnosis && (
                                                <Box>
                                                    <Text
                                                        size="xs"
                                                        fw={700}
                                                        c="dimmed"
                                                    >
                                                        DIAGNOSIS
                                                    </Text>
                                                    <Text size="sm">
                                                        {
                                                            v.medicalRecord
                                                                .diagnosis
                                                        }
                                                    </Text>
                                                </Box>
                                            )}

                                            {v.medicalRecord.notes && (
                                                <Box>
                                                    <Text
                                                        size="xs"
                                                        fw={700}
                                                        c="dimmed"
                                                    >
                                                        CLINICAL NOTES
                                                    </Text>
                                                    <Text size="sm" c="gray.7">
                                                        {v.medicalRecord.notes}
                                                    </Text>
                                                </Box>
                                            )}

                                            {v.medicalRecord.prescription && (
                                                <Box
                                                    bg="blue.0"
                                                    p="xs"
                                                    style={{
                                                        borderRadius: "4px",
                                                    }}
                                                >
                                                    <Text
                                                        size="xs"
                                                        fw={700}
                                                        c="blue"
                                                    >
                                                        Rx Prescription:
                                                    </Text>
                                                    <Text size="sm">
                                                        {
                                                            v.medicalRecord
                                                                .prescription
                                                        }
                                                    </Text>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Collapse>
                                </>
                            )}
                        </Stack>
                    </Card>
                </Timeline.Item>
            );
        });

    return (
        <div className="w-full">
            <Title c={"gray"} order={3}>
                Appointments
            </Title>
            <Space h={"sm"} />
            <Divider my={"md"} label={"History"} labelPosition="center" />
            <Timeline active={2} bulletSize={24} lineWidth={2}>
                {timelines()}
            </Timeline>
        </div>
    );
}
