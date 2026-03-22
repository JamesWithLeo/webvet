"use client";

import { Button, Paper, SimpleGrid, Stack } from "@mantine/core";
import { AreaChart, PieChart } from "@mantine/charts";
import usePetsAdmin from "@/lib/hooks/usePetsAdmin";
import { useMemo } from "react";

export default function PetPanels({ detailed }: { detailed?: boolean }) {
    const { data } = usePetsAdmin(null, 0);
    const chartData = useMemo(() => {
        if (!data) return [];

        // 1. Group by a formatted date string
        const groups: Record<string, any> = {};

        data.forEach((pet) => {
            if (!pet.createdAt) return;

            // Format the date (e.g., "Oct 12") to use as the X-axis key
            const dateLabel = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
            }).format(new Date(pet.createdAt));

            const speciesKey = pet.species?.toLowerCase() || "unknown";

            if (!groups[dateLabel]) {
                groups[dateLabel] = {
                    date: dateLabel,
                    // Initialize all possible keys to 0 to avoid layout jumps
                    dog: 0,
                    cat: 0,

                    rawDate: new Date(pet.createdAt).getTime(),
                };
            }

            groups[dateLabel][speciesKey] =
                (groups[dateLabel][speciesKey] || 0) + 1;
        });

        // 2. Sort chronologically and return
        return Object.values(groups).sort((a, b) => a.rawDate - b.rawDate);
    }, [data]);
    // 3. Define the series configuration for the component
    const series = [
        { name: "dog", label: "Dogs", color: "indigo.7" },
        { name: "cat", label: "Cats", color: "cyan.7" },
    ];
    return (
        <Paper
            withBorder
            radius={"lg"}
            className="w-full flex p-6 col-span-2 row-start-2 row-span-1"
        >
            <div className="flex flex-col justify-between gap-10 ">
                <div className="flex h-full  gap-6 flex-1">
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            TOTAL PETS
                        </h1>
                        <h1 className="text-5xl font-bold text-blue-500">
                            {data?.length ? data.length : 0}
                        </h1>
                    </div>
                </div>

                <AreaChart
                    h={"300px"}
                    data={chartData}
                    dataKey="date"
                    series={series}
                    w={"100%"}
                    curveType="bump"
                    withDots
                    gridAxis="xy"
                    tickLine="xy"
                />
            </div>
        </Paper>
    );
}
