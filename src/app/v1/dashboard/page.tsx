import { auth } from "@/auth";
import CalendarList from "@/components/appointment/CalendarList";
import checkSetup from "@/lib/checkSetup";
import { getAppointments } from "@/lib/db/appointments";
import { ActionIcon, Button, Group, Paper, Stack, Title } from "@mantine/core";
import {
    IconCalendarCancel,
    IconCalendarCheck,
    IconCat,
} from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const session = await auth();
    checkSetup(session);
    if (!session?.user) redirect("/");
    const appointments = await getAppointments({ id: session.user.id });
    return (
        <div className="flex items-center w-full h-screen  flex-col   md:px-16 px-4">
            <Stack className=" border-x p-4 w-full h-full  min-h-full flex  gap-2  ">
                {/* <Group grow align="start">
                    <Paper
                        withBorder
                        p={"md"}
                        px={"xl"}
                        w={310}
                        h={180}
                        bg={"gray.2"}
                    >
                        <Stack align="start" gap={2}>
                            <h1 className="text-sm text-gray-700">
                                Nearest schedule:
                            </h1>
                            <h1 className="text-2xl font-bold">
                                Ara&apos;s Vaccination
                            </h1>
                            <h1 className="text-lg">
                                November 21, 2025 - 8:30 AM
                            </h1>
                            <h1 className="text-lg"></h1>
                            <Button variant="subtle">see details</Button>
                        </Stack>
                    </Paper>
                    <Paper
                        h={180}
                        w={310}
                        withBorder
                        p={"md"}
                        px={"xl"}
                        // bg={"gray.3"}
                        // className="bg-linear-to-br from-gray-100 to-blue-300 "
                    >
                        <Stack h={"100%"} align="center" justify="center">
                            <ActionIcon
                                c={"white"}
                                variant="transparent"
                                bg={"blue"}
                                radius={"xl"}
                                size={"xl"}
                            >
                                <IconCat />
                            </ActionIcon>
                            <Title order={3}>Total Pets: 5</Title>
                        </Stack>
                    </Paper>
                    <Paper
                        h={180}
                        w={310}
                        withBorder
                        p={"md"}
                        px={"xl"}
                        // bg={"gray.4"}
                    >
                        <Stack h={"100%"} align="center" justify="center">
                            <ActionIcon
                                c={"white"}
                                variant="transparent"
                                bg={"blue"}
                                radius={"xl"}
                                size={"xl"}
                            >
                                <IconCalendarCheck />
                            </ActionIcon>
                            <Title order={4}>Total Appointment: 10</Title>
                        </Stack>
                    </Paper>
                    <Paper
                        h={180}
                        w={310}
                        withBorder
                        p={"md"}
                        px={"xl"}
                        bg={"red.1"}
                    >
                        <Stack h={"100%"} align="center" justify="center">
                            <ActionIcon
                                c={"white"}
                                variant="transparent"
                                bg={"red"}
                                radius={"xl"}
                                size={"xl"}
                            >
                                <IconCalendarCancel />
                            </ActionIcon>
                            <Title order={4}>Missed Appointment: 1</Title>
                        </Stack>
                    </Paper>
                </Group> */}

                <div className="w-full gap-4 flex-col h-ful min-h-min flex">
                    <CalendarList appointments={appointments} />
                </div>
            </Stack>
        </div>
    );
}
