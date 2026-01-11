"use  client";

import { RadarChart } from "@mantine/charts";
import { Paper, Space, Stack, Text } from "@mantine/core";

export const data = [
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
    return (
        <Paper withBorder className="w-full flex p-4 col-span-1 row-span-2">
            <h1 className="font-bold text-sm text-gray-500">SERVICE UPTAKE</h1>
            <Space h={"md"} />

            {/* <h1 className="font-bold text-sm text-gray-500">Key Changes</h1> */}
            <h1 className="font-bold text-sm ">
                Neuturing Sudden Decreases by 25%
            </h1>
            <h1 className="font-bold text-sm ">
                Check up Greatly Improved by 38%
            </h1>
            <Stack h={"100%"}>
                <RadarChart
                    h={380}
                    data={data}
                    dataKey="service"
                    withDots
                    withTooltip
                    withPolarRadiusAxis
                    series={[
                        { name: "2024", color: "dark.2", opacity: 0.2 },
                        { name: "2025", color: "blue.6", opacity: 0.3 },
                    ]}
                    withLegend
                />
            </Stack>
        </Paper>
    );
}
