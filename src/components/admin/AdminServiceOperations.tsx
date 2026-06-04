"use client";

import useServiceUptakeAdmin from "@/lib/hooks/useServiceUptakeAdmin";
import { AreaChart } from "@mantine/charts";
import { Paper, Space } from "@mantine/core";
import { useMemo } from "react";

export default function AdminServiceOpertations() {
    const { data } = useServiceUptakeAdmin();

    const series = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Get all unique keys across all data points, excluding 'date'
        const allKeys = new Set<string>();
        data.forEach((item: any) => {
            Object.keys(item).forEach((key) => {
                if (key !== "date") allKeys.add(key);
            });
        });

        const colors = ["indigo", "cyan", "teal", "orange", "pink", "grape"];

        return Array.from(allKeys).map((key, index) => ({
            name: key,
            label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize label
            color: `${colors[index % colors.length]}.6`, // Rotate through Mantine colors
        }));
    }, [data]);

    return (
        <Paper withBorder radius={"lg"} className="w-full flex p-6 col-span-2 ">
            <div className="flex flex-col justify-between gap-10 ">
                <h1 className="font-bold text-sm text-gray-500">
                    SERVICE UPTAKE
                </h1>
                <Space h={"md"} />

                <AreaChart
                    h="300px"
                    w={"100%"}
                    data={data ?? []}
                    dataKey="date"
                    series={series}
                    type="stacked"
                    curveType="monotone"
                    withLegend
                    legendProps={{
                        verticalAlign: "top",
                        fontSize: "10px",
                        iconSize: 8,
                    }}
                    withTooltip
                    // CHANGE: Simple integer formatting instead of Currency
                    valueFormatter={(value) => `${value} units`}
                    gridAxis="xy"
                />
            </div>
        </Paper>
    );
}
