"use client";

import { Button, Paper, SimpleGrid } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { AreaChart, PieChart } from "@mantine/charts";
import usePetsAdmin from "@/lib/hooks/usePetsAdmin";
import { useMemo } from "react";
// export const data = [
//     {
//         date: "Mar 22",
//         Dogs: 2890,
//         Cats: 2338,
//         Tomatoes: 2452,
//     },
//     {
//         date: "Mar 23",
//         Dogs: 2756,
//         Cats: 2103,
//         Tomatoes: 2402,
//     },
//     {
//         date: "Mar 24",
//         Dogs: 3322,
//         Cats: 986,
//         Tomatoes: 1821,
//     },
//     {
//         date: "Mar 25",
//         Dogs: 3470,
//         Cats: 2108,
//         Tomatoes: 2809,
//     },
//     {
//         date: "Mar 26",
//         Dogs: 3129,
//         Cats: 1726,
//         Tomatoes: 2290,
//     },
// ];

export default function PetPanels({ detailed }: { detailed?: boolean }) {
    const { data } = usePetsAdmin();
    const pieData = useMemo(() => {
        if (!data) return [];

        const counts: Record<string, number> = {};

        data.forEach((pet) => {
            // Normalize species (e.g., 'dog' -> 'dog')
            const key = pet.species?.toLowerCase() || "unknown";
            counts[key] = (counts[key] || 0) + 1;
        });

        // Define your mapping for colors and names
        const speciesConfig: Record<string, { label: string; color: string }> =
            {
                dog: { label: "Dogs", color: "indigo.6" },
                cat: { label: "Cats", color: "cyan.6" },
                bird: { label: "Birds", color: "orange.6" },
                unknown: { label: "Other", color: "gray.6" },
            };

        return Object.entries(counts).map(([key, value]) => ({
            name: speciesConfig[key]?.label || key,
            value: value,
            color: speciesConfig[key]?.color || "blue.6",
        }));
    }, [data]);
    return (
        <Paper withBorder className="w-full flex p-4 col-span-1 row-span-1">
            <SimpleGrid
                cols={3}
                className="flex-1 flex flex-col justify-between h-full"
            >
                <div className="flex h-full  flex-col gap-6 flex-1">
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            TOTAL PETS
                        </h1>
                        <h1 className="text-5xl font-bold text-blue-500">
                            {data?.length ? data.length : 0}
                        </h1>
                    </div>
                    {/* <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            LAST MONTH
                        </h1>
                        <h1 className="text-xl font-bold ">82</h1>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            THIS MONTH
                        </h1>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold ">22</h1>
                            <IconArrowUpRight color="red" />
                        </div>
                    </div> */}
                </div>
                <div className="flex  col-span-2 items-end   h-full">
                    <PieChart
                        data={pieData}
                        withTooltip
                        withLabelsLine
                        labelsPosition="outside"
                        labelsType="percent"
                        withLabels
                        tooltipDataSource="segment"
                    />
                </div>
            </SimpleGrid>
        </Paper>
    );
}
