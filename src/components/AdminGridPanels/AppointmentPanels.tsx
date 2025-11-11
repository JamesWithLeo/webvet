"use client";

import { Divider, Group, Paper } from "@mantine/core";
import { LineChart, BarChart } from "@mantine/charts";
export const data = [
    { month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
    { month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
    { month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
    { month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
    { month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
    { month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
];
export default function AppointmentPanels() {
    return (
        <Paper withBorder className="w-full p-4 col-span-3">
            <Group className="h-full">
                <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                        <h1 className="font-bold text-sm text-gray-500">
                            TOTAL APPOINTMENTS
                        </h1>
                        <h1 className="text-5xl font-bold text-blue-500">
                            1452
                        </h1>
                    </div>
                    <div className="flex justify-end  ">
                        <BarChart
                            h={100}
                            data={data}
                            dataKey="month"
                            series={[
                                { name: "Smartphones", color: "blue.6" },
                                { name: "Laptops", color: "blue.1" },
                                { name: "Tablets", color: "teal.6" },
                            ]}
                            tickLine="none"
                            gridAxis="xy"
                            withXAxis={false}
                            withYAxis={false}
                        />
                    </div>
                </div>
                <Divider orientation="vertical" />
                <div className="flex-1">
                    <h1 className=" text-red-400 font-bold text-sm">
                        Current Appointment
                    </h1>
                    <Group align="flex-end" mt={40}>
                        <div>
                            <h1 className="font-bold text-gray-500 text-sm">
                                SERVICE TYPE:
                            </h1>
                            <div className="flex   items-baseline  gap-4">
                                <h1 className="text-3xl font-bold">Check up</h1>
                                <h1 className="h-min text-blue-300 font-bold">
                                    / 10:00 AM
                                </h1>
                            </div>
                        </div>
                    </Group>
                    <Group>
                        <div>
                            <h1>James Ocampo - Cat</h1>
                            <h1>Assigned doctor: Dra. Aba</h1>
                        </div>
                    </Group>
                </div>
                <Divider orientation="vertical" />
                <div className="flex-1">
                    <h1 className=" text-gray-400 font-bold text-sm">
                        Next Appointment
                    </h1>
                    <Group align="flex-end" mt={40}>
                        <div>
                            <h1 className="font-bold text-gray-500 text-sm">
                                SERVICE TYPE:
                            </h1>
                            <div className="flex   items-baseline  gap-4">
                                <h1 className="text-3xl font-bold">Grooming</h1>
                                <h1 className="h-min text-blue-300 font-bold">
                                    / 10:30 AM
                                </h1>
                            </div>
                        </div>
                    </Group>
                    <Group>
                        <div>
                            <h1>John Darrelle Laizon - Dog</h1>
                            <h1>Assigned doctor: Dra. Abe</h1>
                        </div>
                    </Group>
                </div>
            </Group>
        </Paper>
    );
}
