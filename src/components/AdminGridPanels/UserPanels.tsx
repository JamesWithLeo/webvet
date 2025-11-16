"use client";

import { Paper } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Sparkline } from "@mantine/charts";
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
                            TOTAL USERS
                        </h1>
                        <h1 className="text-5xl font-bold text-blue-500">
                            844
                        </h1>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            LAST MONTH
                        </h1>
                        <h1 className="text-xl font-bold ">12</h1>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            THIS MONTH
                        </h1>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold ">20</h1>
                            <IconArrowUpRight color="green" />
                        </div>
                    </div>
                </div>
                <div className="flex  items-end   h-full">
                    <Sparkline
                        w={"100%"}
                        h={200}
                        data={[10, 20, 40, 20, 40, 10, 50]}
                        // curveType="bump"
                        withGradient
                        color="blue"
                        fillOpacity={0.6}
                        strokeWidth={2}
                    />
                </div>
            </div>
        </Paper>
    );
}
