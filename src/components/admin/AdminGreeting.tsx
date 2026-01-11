"use client";

import { Button, Divider, Group, Paper, Space } from "@mantine/core";
import { IconHeartbeat, IconWalk } from "@tabler/icons-react";
import StaticMiniCalendar from "../StaticMiniCalendar";
import Lottie from "lottie-react";
import animDate from "@/../public/lottie/Meeting.json";
export default function AdminGreet() {
    return (
        <Paper withBorder className="w-full p-4 col-span-3">
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
                        <Button.Group>
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
                        </Button.Group>
                    </Group>
                    <div className="absolute w-72 h-72 left-[700px] -top-7">
                        <Lottie animationData={animDate} />
                    </div>
                </div>

                <Divider orientation="vertical" />
                <div className="flex-1 flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="font-bold text-sm text-gray-500">
                                PENDING
                            </h1>
                            <h1 className="text-2xl font-bold text-red-500">
                                8
                            </h1>
                        </div>
                        <div>
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
                        </div>
                    </div>
                </div>
                {/* <Divider orientation="vertical" /> */}
                <div className="flex-1 flex justify-end gap-4 h-full">
                    <div className="flex items-end text-sm flex-col">
                        <h1>10:23:32 AM</h1>
                    </div>
                    <StaticMiniCalendar />
                </div>
            </Group>
        </Paper>
    );
}
