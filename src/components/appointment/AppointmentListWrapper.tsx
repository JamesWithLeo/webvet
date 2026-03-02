"use client";

import { JoinedAppointmentType } from "@/db/schema/appointments";
import { Group, Stack, Text, Title } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { useMemo } from "react";
import AppointmentCard from "./AppointmentCard";
import useApointmentsClient from "@/lib/hooks/useAppointmentsClient";
import { AppointmentWithInvoice } from "@/types/appointments";

export default function AppointmentListWrapper({ id }: { id: string }) {
    const { data } = useApointmentsClient(id);
    const groupedAppointments = useMemo(() => {
        if (!data) return null;

        return data.reduce<Record<number, AppointmentWithInvoice[]>>(
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
