"use client";

import { Paper, SimpleGrid, Stack } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { AreaChart, Sparkline } from "@mantine/charts";
import useUserAdmin from "@/lib/hooks/useUserAdmin";
import { useEffect, useMemo } from "react";

export default function UserPanel() {
    const { data } = useUserAdmin();
    const chartData = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        const groups: Record<string, any> = {};

        data.forEach((user) => {
            // 1. Parse the ISO string
            const dateObj = new Date(user.created_at);

            // 2. Format to "YYYY-MM-DD" for grouping (removes the time portion)
            const dateLabel = dateObj.toISOString().split("T")[0];

            // 3. Normalize role to lowercase (e.g., "CLIENT" -> "client")
            const role = user.role?.toLowerCase() || "unknown";

            if (!groups[dateLabel]) {
                groups[dateLabel] = {
                    date: dateLabel,
                    sortKey: dateObj.getTime(),
                    // Initialize all known roles to 0 to avoid "jumps" in the area chart
                    admin: 0,
                    client: 0,
                    staff: 0,
                    vet: 0,
                };
            }

            // 4. Increment the count for that role on that specific day
            if (role in groups[dateLabel]) {
                groups[dateLabel][role] += 1;
            } else {
                groups[dateLabel].unknown =
                    (groups[dateLabel].unknown || 0) + 1;
            }
        });

        // 5. Sort chronologically (Oldest to Newest)
        return Object.values(groups).sort((a, b) => a.sortKey - b.sortKey);
    }, [data]);

    const series = [
        { name: "client", label: "Clients", color: "blue.6" },
        { name: "staff", label: "Staff", color: "teal.6" },
        { name: "admin", label: "Admins", color: "grape.6" },
        { name: "vet", label: "Vets", color: "orange.6" },
    ];

    return (
        <Paper
            withBorder
            radius={"lg"}
            className="w-full flex p-6 col-span-2 row-span-1"
        >
            <div className="flex flex-col justify-between gap-10 ">
                <div className="flex h-full  flex-col gap-6 ">
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            TOTAL USERS
                        </h1>
                        <h1 className="text-5xl font-bold text-blue-500">
                            {data?.length}
                        </h1>
                    </div>
                    {/* <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            LAST MONTH
                        </h1>
                        <h1 className="text-xl font-bold ">
                            {analytics.lastMonth}
                        </h1>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            THIS MONTH
                        </h1>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold ">
                                {" "}
                                {analytics.thisMonth}
                            </h1>
                            <IconArrowUpRight color="green" />
                        </div>
                    </div> */}
                </div>
                <div className="w-full col-span-2  flex items-end  h-full">
                    <AreaChart
                        h={"300px"}
                        w={"100%"}
                        data={chartData}
                        dataKey="date"
                        valueFormatter={(value) => `${value} users`}
                        series={series}
                        withGradient
                        color="blue"
                        type="stacked"
                        curveType="monotone"
                        // fillOpacity={0.6}
                        // strokeWidth={2}
                        withLegend
                        withTooltip
                    />
                </div>
            </div>
        </Paper>
    );
}
