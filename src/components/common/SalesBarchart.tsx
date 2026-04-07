"use client";

import CurrencyFormatter from "@/lib/CurrencyFormatter";
import { BarChart } from "@mantine/charts";
import { Button, ColorSwatch, Group, Paper, Text } from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import { IconX } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface ChartTooltipProps {
    label: React.ReactNode;
    payload: readonly any[];
}

function ChartTooltip({ label, payload }: ChartTooltipProps) {
    if (!payload) return null;

    return (
        <Paper px="md" py="sm" withBorder shadow="md" radius="md">
            <Text fw={500} mb={5}>
                {label}
            </Text>
            {/* <Indicator offset={0} size={16} /> */}
            {payload.map((item) => (
                <Group gap={"md"} key={item.name}>
                    <ColorSwatch size={16} color={item.color} />
                    <Text fz="sm">{item.name}:</Text>
                    <Text fz={"sm"}>{CurrencyFormatter(item.value)}</Text>
                    <Text fz={"sm"}>
                        Quantity: {item.payload[`${item.name}_qty`] || 0}
                    </Text>
                </Group>
            ))}
        </Paper>
    );
}

export default function SalesBarChart({
    data,
    keys,
}: {
    data: Record<string, any>[];
    keys: string[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const series = keys.map((serviceName, index) => ({
        name: serviceName, // This MUST match the key in your data object
        label: serviceName, // This is what shows in the legend
        color: ["blue.6", "teal.6", "grape.6", "orange.6", "pink.6"][index % 5],
    }));
    const [value, setValue] = useState<[string | null, string | null]>([
        null,
        null,
    ]);

    const handleFilter = () => {
        // 1. Capture current params so we don't lose other filters
        const params = new URLSearchParams(searchParams.toString());

        const [start, end] = value;

        if (start) {
            params.set("from", new Date(start).toISOString().split("T")[0]);
        } else {
            params.delete("from"); // Clear if no date
        }

        if (end) {
            params.set("to", new Date(end).toISOString().split("T")[0]);
        } else {
            params.delete("to"); // Clear if no date
        }

        router.push(`?${params.toString()}`);
    };

    const handleRemoveParams = () => {
        const params = new URLSearchParams();
        setValue([null, null]);
        params.delete("from");
        params.delete("to");
        router.push(`?${params.toString()}`);
    };
    return (
        <>
            <Group align="end" justify="end">
                <DatePickerInput
                    type="range"
                    size="sm"
                    w={"300px"}
                    label="Filter by Date"
                    placeholder="Pick date range"
                    value={value}
                    onChange={setValue}
                    rightSection={
                        value ? (
                            <IconX
                                size={16}
                                onClick={() => handleRemoveParams()}
                            />
                        ) : undefined
                    }
                />

                {value.length && value[0] && value[1] && (
                    <Button onClick={handleFilter} size="sm" variant="filled">
                        Apply Filter
                    </Button>
                )}
            </Group>
            <div>
                <BarChart
                    h={500}
                    data={data}
                    withBarValueLabel
                    valueFormatter={(value) =>
                        new Intl.NumberFormat("en-US").format(value)
                    }
                    tooltipProps={{
                        content: ({ label, payload }) => (
                            <ChartTooltip label={label} payload={payload} />
                        ),
                    }}
                    legendProps={{ verticalAlign: "bottom", height: 50 }}
                    dataKey="month"
                    series={series}
                    withLegend
                    tickLine="xy"
                    gridAxis="xy"
                />
            </div>
        </>
    );
}
