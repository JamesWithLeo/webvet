"use client";

import { Group, Paper } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { AreaChart } from "@mantine/charts";
export const data = [
    {
        date: "Mar 22",
        Apples: 2890,
        Oranges: 2338,
        Tomatoes: 2452,
    },
    {
        date: "Mar 23",
        Apples: 2756,
        Oranges: 2103,
        Tomatoes: 2402,
    },
    {
        date: "Mar 24",
        Apples: 3322,
        Oranges: 986,
        Tomatoes: 1821,
    },
    {
        date: "Mar 25",
        Apples: 3470,
        Oranges: 2108,
        Tomatoes: 2809,
    },
    {
        date: "Mar 26",
        Apples: 3129,
        Oranges: 1726,
        Tomatoes: 2290,
    },
];

export default function PetPanels() {
    return (
        <Paper withBorder className="w-full flex p-4 col-span-1 row-span-2">
            <div className="flex-1 flex flex-col justify-between h-full">
                <div className="flex h-full  flex-col gap-6 flex-1">
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            TOTAL PETS
                        </h1>
                        <h1 className="text-5xl font-bold text-blue-500">
                            1092
                        </h1>
                    </div>
                    <div>
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
                    </div>
                </div>
                <div className="flex  items-end   h-full">
                    <AreaChart
                        h={200}
                        data={data}
                        dataKey="date"
                        series={[
                            { name: "Apples", color: "indigo.6" },
                            { name: "Oranges", color: "blue.6" },
                            { name: "Tomatoes", color: "teal.6" },
                        ]}
                        curveType="natural"
                        tickLine="none"
                        gridAxis={"y"}
                        withXAxis={false}
                        withYAxis={false}
                    />
                </div>
            </div>
        </Paper>
    );
}
