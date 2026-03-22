"use client";

import { Divider, Group, Paper } from "@mantine/core";
import { Heatmap } from "@mantine/charts";
import useAppointmentAdmin from "@/lib/hooks/useAppointmentAdmin";
import { useMemo } from "react";
import dayjs from "dayjs";

export default function AppointmentPanels() {
    const { data } = useAppointmentAdmin("all");
    const HeatMapData = useMemo((): Record<string, number> => {
        const counts: Record<string, number> = {};

        if (!data) return {};

        data.forEach((app) => {
            const date = app.event_datetime.split(" ")[0];

            counts[date] = (counts[date] || 0) + 1;
        });

        return counts;
    }, [data]);
    return (
        <Paper withBorder className="w-full p-4 col-span-1 row-start-3">
            <Group className="h-full">
                <div className="flex-1 flex flex-col justify-start gap-16 h-full">
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            TOTAL APPOINTMENTS
                        </h1>
                        <h1 className="text-5xl font-bold text-blue-500">
                            {data?.length ? data.length : 0}
                        </h1>
                    </div>
                    <div className="flex justify-start align-top   ">
                        <Heatmap
                            h={300}
                            data={HeatMapData}
                            startDate="2026-01-01"
                            endDate="2026-12-31"
                            colors={[
                                "var(--mantine-color-blue-4)",
                                "var(--mantine-color-blue-6)",
                                "var(--mantine-color-blue-7)",
                                "var(--mantine-color-blue-9)",
                            ]}
                            withMonthLabels
                            withOutsideDates={false}
                            domain={[1, 10]}
                            gap={3}
                            accumulate="sum"
                            withTooltip
                            getTooltipLabel={({ date, value }) =>
                                `${dayjs(date).format("DD MMM, YYYY")} – ${value === null || value === 0 ? "No appointments" : `${value} appointments${value > 1 ? "s" : ""}`}`
                            }
                        />
                    </div>
                </div>
                <Divider orientation="vertical" />
                <Divider orientation="vertical" />
                {/* 
                <Divider orientation="vertical" />
                <div className="flex-1">
                    <h1 className=" text-red-400 font-bold text-sm">
                        Current Appointment
                    </h1>
                    <Group align="flex-end" mt={40}>
                        <div>
                            <h1 className="font-bold text-gray-500 text-sm">
                                SERVICE TYPE:
                            </h1>
                            <div className="flex   items-baseline  gap-4">
                                <h1 className="text-3xl font-bold">Check up</h1>
                                <h1 className="h-min text-blue-300 font-bold">
                                    / 10:00 AM
                                </h1>
                            </div>
                        </div>
                    </Group>
                    <Group>
                        <div>
                            <h1>James Ocampo - Cat</h1>
                            <h1>Assigned doctor: Dra. Aba</h1>
                        </div>
                    </Group>
                </div>
                <Divider orientation="vertical" />
                <div className="flex-1">
                    <h1 className=" text-gray-400 font-bold text-sm">
                        Next Appointment
                    </h1>
                    <Group align="flex-end" mt={40}>
                        <div>
                            <h1 className="font-bold text-gray-500 text-sm">
                                SERVICE TYPE:
                            </h1>
                            <div className="flex   items-baseline  gap-4">
                                <h1 className="text-3xl font-bold">Grooming</h1>
                                <h1 className="h-min text-blue-300 font-bold">
                                    / 10:30 AM
                                </h1>
                            </div>
                        </div>
                    </Group>
                    <Group>
                        <div>
                            <h1>John Darrelle Laizon - Dog</h1>
                            <h1>Assigned doctor: Dra. Abe</h1>
                        </div>
                    </Group>
                </div> */}
            </Group>
        </Paper>
    );
}
