"use client";

import useServiceUptakeAdmin from "@/lib/hooks/useServiceUptakeAdmin";
import { RadarChart } from "@mantine/charts";
import { Paper, Space, Stack } from "@mantine/core";
import { useEffect } from "react";

export const datar = [
    {
        service: "Grooming",
        "2024": 90,
        "2025": 30,
    },
    {
        service: "Check up",
        "2024": 52,
        "2025": 80,
    },
    {
        service: "Vaccination",
        "2024": 70,
        "2025": 80,
    },
    {
        service: "De-worming",
        "2024": 99,
        "2025": 80,
    },
    {
        service: "Consultation",
        "2024": 80,
        "2025": 90,
    },
    {
        service: "Neuturing",
        "2024": 30,
        "2025": 5,
    },
];
export default function AdminServiceOpertations() {
    const { data } = useServiceUptakeAdmin();
    useEffect(() => {
        console.log(data);
    }, [data]);
    return (
        <Paper withBorder className="w-full flex p-4 col-span-1 row-span-2">
            <h1 className="font-bold text-sm text-gray-500">SERVICE UPTAKE</h1>
            <Space h={"md"} />

            <Stack h={"100%"}>
                <RadarChart
                    h={380}
                    data={
                        data
                            ? data?.map((v) => ({
                                  service: v.service,
                                  staff: v.staff,
                                  admin: v.admin,
                                  client: v.client,
                              }))
                            : []
                    }
                    dataKey="service"
                    withDots
                    withTooltip
                    withPolarRadiusAxis
                    series={[
                        { name: "staff", color: "dark.2", opacity: 0.2 },
                        { name: "client", color: "blue.6", opacity: 0.7 },
                        { name: "admin", color: "blue.6", opacity: 0.3 },
                    ]}
                    withLegend
                />
            </Stack>
        </Paper>
    );
}
