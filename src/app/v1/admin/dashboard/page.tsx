import { Divider, Group, Paper } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";

export default function Dashboard() {
    return (
        <div className="w-full h-screen p-16 bg-gray-50 ">
            <section className=" grid h-full  gap-8 grid-cols-3 grid-rows-4">
                <Paper withBorder className="p-4  col-span-3">
                    <Group align="start">
                        <div className="flex-2 ">
                            <h1 className="text-md text-gray-400 font-medium">
                                Todays appointments
                            </h1>
                            <h1 className="text-6xl font-bold ">10</h1>

                            <Group align="flex-end" mt={25} mb={12}>
                                <h1 className="text-gray-500">Total: </h1>
                                <h1>2101</h1>
                            </Group>
                        </div>
                        <Divider orientation="vertical" />
                        <div className="flex-2">
                            <h1 className=" text-gray-400">
                                Current Apppintment
                            </h1>
                            <Group align="flex-end" mt={40}>
                                <div>
                                    <h1>Service Type:</h1>
                                    <div className="flex   items-baseline  gap-4">
                                        <h1 className="text-3xl font-bold">
                                            Check up
                                        </h1>
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
                        <div className="flex-2">
                            <h1 className=" text-gray-400">Next Apppintment</h1>
                            <Group align="flex-end" mt={40}>
                                <div>
                                    <h1>Service Type:</h1>
                                    <div className="flex   items-baseline  gap-4">
                                        <h1 className="text-3xl font-bold">
                                            Grooming
                                        </h1>
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

                        <div className="text-right">
                            <h1>November 15 2025</h1>
                            <h1>10:25 AM</h1>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder className="p-4 row-span-2">
                    <Group justify="space-between">
                        <div className="w-full h-full">
                            <h1 className="text-md text-gray-400 font-medium">
                                Today New Users
                            </h1>
                            <h1 className="text-6xl font-bold">8</h1>
                        </div>

                        <Divider my={10} className="w-full" />

                        <div className="w-full h-full">
                            <h1 className="text-md text-gray-400  font-medium">
                                This month
                            </h1>
                            <div className="flex ">
                                <h1 className="text-6xl font-bold">200</h1>
                                <IconArrowUpRight color="red" />
                            </div>
                        </div>
                        <Divider my={10} className="w-full" />

                        <div className="w-full h-full">
                            <h1 className="text-md text-gray-400  font-medium">
                                Total users
                            </h1>

                            <h1 className="text-6xl font-bold">899</h1>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder className="p-4 row-span-2">
                    <Group justify="space-between">
                        <div className="w-full h-full">
                            <h1 className="text-md text-gray-400 font-medium">
                                Today's Pets
                            </h1>
                            <h1 className="text-6xl font-bold">8</h1>
                        </div>

                        <Divider my={10} className="w-full" />

                        <div className="w-full h-full">
                            <h1 className="text-md text-gray-400  font-medium">
                                This month
                            </h1>
                            <div className="flex ">
                                <h1 className="text-6xl font-bold">87</h1>
                                <IconArrowUpRight color="red" />
                            </div>
                        </div>
                        <Divider my={10} className="w-full" />

                        <div className="w-full h-full">
                            <h1 className="text-md text-gray-400  font-medium">
                                Total pets
                            </h1>

                            <h1 className="text-6xl font-bold">1092</h1>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder className="p-4 row-span-3">
                    <h1 className="text-md text-gray-400 font-medium">
                        Active Personel
                    </h1>
                    <Paper withBorder className="p-2 mt-2">
                        <div className="flex justify-between">
                            <h1 className="text-blue-400">Venus Angela</h1>
                            <h1 className="text-sm text-gray-400">
                                until 12:00 PM
                            </h1>
                        </div>
                        <h1 className="text-sm ">Staff</h1>
                    </Paper>
                    <Paper withBorder className="p-2 mt-2">
                        <div className="flex justify-between">
                            <h1 className="text-blue-400">Abegail Paral</h1>
                            <h1 className="text-sm text-gray-400">
                                until 11:00 AM
                            </h1>
                        </div>
                        <h1 className="text-sm ">Veterinarian</h1>
                    </Paper>
                </Paper>
            </section>
        </div>
    );
}
