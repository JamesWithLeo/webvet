"use client";

import { Group, Paper, Stack, Text } from "@mantine/core";
import StaticMiniCalendar from "../StaticMiniCalendar";
import Lottie from "lottie-react";
import animDate from "@/../public/lottie/Meeting.json";
import CurrencyFormatter from "@/lib/CurrencyFormatter";
import { toTitleCase } from "@/lib/toTitleCase";

type Props = {
    gross: number;
    sales: {
        serviceType: "CHECK_UP" | "GROOMING" | "VACCINATION" | "DEWORMING";
        revenue: string | null;
    }[];
};
export default function AdminGreet({ gross, sales }: Props) {
    return (
        <Paper
            withBorder
            className="w-full p-6 col-span-2 col-start-1 row-start-1"
            radius={"lg"}
        >
            <Group className="h-full">
                <div className="flex-1 relative flex flex-col justify-between h-full">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Hello again, Admin!
                        </h1>
                        <h1 className="text-sm">
                            Lot of things changed since your last active
                        </h1>
                    </div>
                    <Group>
                        <div className="flex-1 flex flex-col justify-between h-full">
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h1 className="font-bold text-sm text-gray-500">
                                        Sales
                                    </h1>
                                    <h1 className="text-2xl font-bold text-red-500">
                                        {CurrencyFormatter(gross)}
                                    </h1>
                                </div>

                                <Stack gap={0}>
                                    {sales.map((s) => (
                                        <Group key={s.serviceType}>
                                            <Text c={"dimmed"} size="sm">
                                                {toTitleCase(s.serviceType)}
                                            </Text>
                                            <Text>
                                                {CurrencyFormatter(s.revenue)}
                                            </Text>
                                        </Group>
                                    ))}
                                </Stack>
                                {/* <div>
                                    <h1 className="font-bold text-sm text-gray-500">
                                        ACCOMPLISHED
                                    </h1>
                                    <h1 className="text-2xl font-bold text-green-500">
                                        6
                                    </h1>
                                </div>
                                <div>
                                    <h1 className="font-bold text-sm text-gray-500">
                                        TODAY APPOINTMENTS
                                    </h1>
                                    <h1 className="text-2xl font-bold text-blue-500">
                                        14
                                    </h1>
                                </div> */}
                            </div>
                        </div>
                        {/* <Button.Group>
                            <Button
                                size="xs"
                                color="red"
                                variant="filled"
                                leftSection={<IconHeartbeat size={16} />}
                            >
                                Emergency
                            </Button>
                            <Button
                                size="xs"
                                variant="default"
                                leftSection={<IconWalk size={16} />}
                            >
                                Quick Walk-In
                            </Button>
                        </Button.Group>
                        <Button.Group>
                            <Button size="xs" variant="default">
                                Add Pet
                            </Button>
                            <Button size="xs" variant="default">
                                Verify Pet
                            </Button>
                        </Button.Group> */}
                    </Group>
                </div>

                {/* <div className="  w-72 h-72 ">
                    <Lottie animationData={animDate} />
                </div> */}
                {/* <Divider orientation="vertical" /> */}
                <div className="flex-1 flex justify-end  gap-4 h-full">
                    {/* <div className="flex items-end text-sm  flex-col">
                        <h1>{new Date().toTimeString()}</h1>
                    </div> */}
                    <StaticMiniCalendar />
                </div>
            </Group>
        </Paper>
    );
}
