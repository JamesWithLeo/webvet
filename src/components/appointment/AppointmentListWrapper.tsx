"use client";

import { JoinedAppointmentType } from "@/db/schema/appointments";
import { Group, Stack, Text, Title } from "@mantine/core";
import { IconAlertTriangleFilled, IconMoodSad } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import AppointmentCard from "./AppointmentCard";
import { notifications } from "@mantine/notifications";

export default function AppointmentListWrapper({
    data,
    error,
}: {
    data: JoinedAppointmentType[] | null;
    error: string | null;
}) {
    const groupedAppointments = useMemo(() => {
        if (!data) return null;

        return data.reduce<Record<number, JoinedAppointmentType[]>>(
            (acc, appt) => {
                const year = new Date(appt.event_datetime).getFullYear();
                if (!acc[year]) {
                    acc[year] = [];
                }
                acc[year].push(appt);
                return acc;
            },
            {}
        );
    }, [data]);

    const sortedYears = useMemo(() => {
        if (!groupedAppointments) return null;
        return Object.keys(groupedAppointments).sort(
            (a, b) => Number(b) - Number(a)
        );
    }, [groupedAppointments]);

    useEffect(() => {
        if (error) {
            notifications.show({
                message: error,
                icon: <IconAlertTriangleFilled size={20} />,
                color: "red",
                autoClose: 6000,
            });
        }
    }, [error]);

    return (
        <>
            {sortedYears && sortedYears?.length > 0 && groupedAppointments ? (
                sortedYears.map((year) => (
                    <Stack key={year}>
                        {" "}
                        <Title c={"dimmed"}>{year}</Title>
                        <Group>
                            {groupedAppointments[Number(year)].map((v) => (
                                <AppointmentCard key={v.id} {...v} />
                            ))}
                        </Group>
                    </Stack>
                ))
            ) : (
                <Stack align="center" h={"100%"} justify="center">
                    <IconMoodSad size={100} color="gray" />
                    <Text>No appointment yet</Text>
                </Stack>
            )}
        </>
    );
}
