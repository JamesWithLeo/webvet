"use client";

import { AppointmentTypeModel } from "@/db/schema/appointments";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    Stack,
    Timeline,
    Title,
    Text,
    Group,
    Space,
    Divider,
    ActionIcon,
    Card,
    ThemeIcon,
} from "@mantine/core";
import {
    IconArrowBarToDownDashed,
    IconPillFilled,
    IconScissors,
    IconStethoscope,
    IconVaccine,
} from "@tabler/icons-react";
import { formatDistance } from "date-fns";
import Link from "next/link";

type Props = {
    data: AppointmentTypeModel[];
};

export default function PetProfileAppointment({ data }: Props) {
    const timelines = () =>
        data.map((v) => {
            let bulletIcon: React.ReactNode;
            switch (v.type) {
                case "GROOMING":
                    bulletIcon = <IconScissors size={20} stroke={2} />;
                    break;
                case "CHECK_UP":
                    bulletIcon = <IconStethoscope size={20} stroke={2} />;
                    break;
                case "CONSULTATION":
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
                    <Card withBorder radius={"md"}>
                        <Group justify="space-between">
                            <Stack gap={0}>
                                <Link
                                    className="font-semibold w-max text-sm hover:underline "
                                    href={`/v1/appointments/${v.id}`}
                                >
                                    {toTitleCase(v.type)}
                                </Link>
                                <Text size="sm" mt={4}>
                                    {new Date(v.event_datetime) > new Date()
                                        ? "Up next: "
                                        : ""}{" "}
                                    {new Date(v.event_datetime).toDateString()}{" "}
                                    {new Date(
                                        v.event_datetime
                                    ).toLocaleTimeString()}
                                </Text>
                            </Stack>
                        </Group>
                        {/* <Divider
                                my={"md"}
                                label={formatDistance(
                                    v.event_datetime,
                                    new Date(),
                                    { addSuffix: true }
                                )}
                                labelPosition="left"
                                orientation="horizontal"
                            /> */}
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
            <Divider
                my={"md"}
                label={"Present"}
                labelPosition="center"
                orientation="horizontal"
            />
            <Timeline
                className="col-span-2"
                active={2}
                bulletSize={24}
                lineWidth={2}
            >
                {timelines()}
            </Timeline>

            {/* <Space h={"md"} />
            <Button variant="default" fw={"500"} size="sm">
                Show more
            </Button> */}
        </div>
    );
}
