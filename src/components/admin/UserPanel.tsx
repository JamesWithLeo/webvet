"use client";

import { Paper, SimpleGrid } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Sparkline } from "@mantine/charts";
import useUserAdmin from "@/lib/hooks/useUserAdmin";
import { useMemo } from "react";
import dayjs from "dayjs";

export default function UserPanel() {
    const { data } = useUserAdmin();
    const analytics = useMemo(() => {
        const monthsTemplate = [
            { name: "Jan", total: 0 },
            { name: "Feb", total: 0 },
            { name: "Mar", total: 0 },
            { name: "Apr", total: 0 },
            { name: "May", total: 0 },
            { name: "Jun", total: 0 },
            { name: "Jul", total: 0 },
            { name: "Aug", total: 0 },
            { name: "Sep", total: 0 },
            { name: "Oct", total: 0 },
            { name: "Nov", total: 0 },
            { name: "Dec", total: 0 },
        ];

        const result = {
            chartData: monthsTemplate.map((m) => ({ ...m })), // Deep copy
            thisMonth: 0,
            lastMonth: 0,
            diff: "0",
        };

        if (!data) return result;

        const now = dayjs();
        const currentYear = now.year();
        const startOfThisMonth = now.startOf("month");
        const startOfLastMonth = now.subtract(1, "month").startOf("month");
        const endOfLastMonth = now.subtract(1, "month").endOf("month");

        // 2. Single Loop Logic
        data.forEach((user) => {
            const created = dayjs(user.created_at);

            // Logic for Chart (Current Year Only)
            if (created.year() === currentYear) {
                const monthIndex = created.month();
                result.chartData[monthIndex].total += 1;
            }

            // Logic for Stats (This Month vs Last Month)
            if (created.isAfter(startOfThisMonth)) {
                result.thisMonth++;
            } else if (
                created.isAfter(startOfLastMonth) &&
                created.isBefore(endOfLastMonth)
            ) {
                result.lastMonth++;
            }
        });

        // 3. Final Calculation
        const diffValue =
            result.lastMonth === 0
                ? result.thisMonth * 100
                : ((result.thisMonth - result.lastMonth) / result.lastMonth) *
                  100;

        result.diff = diffValue.toFixed(0);

        return result;
    }, [data]);
    return (
        <Paper withBorder className="w-full flex p-4 col-span-1 row-span-1">
            <SimpleGrid
                cols={3}
                spacing={0}
                className="flex-1 flex flex-col justify-between h-full"
            >
                <div className="flex h-full  flex-col gap-6 ">
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            TOTAL USERS
                        </h1>
                        <h1 className="text-5xl font-bold text-blue-500">
                            {data?.length}
                        </h1>
                    </div>
                    <div>
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
                                {analytics.thisMonth}
                            </h1>
                            <IconArrowUpRight color="green" />
                        </div>
                    </div>
                </div>
                <div className="w-full col-span-2  flex items-end  h-full">
                    <Sparkline
                        h={"200px"}
                        w={"200px"}
                        data={analytics.chartData.map((v) => v.total)}
                        curveType="bump"
                        withGradient
                        color="blue"
                        fillOpacity={0.6}
                        strokeWidth={2}
                    />
                </div>
            </SimpleGrid>
        </Paper>
    );
}
