import { authOptions } from "@/authOptions";
import CalendarList from "@/components/CalendarList";
import checkSetup from "@/lib/checkSetup";
import {
    ActionIcon,
    Avatar,
    Button,
    Divider,
    Flex,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Title,
} from "@mantine/core";
import {
    IconCalendarCancel,
    IconCalendarCheck,
    IconCat,
} from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const session = await getServerSession(authOptions);
    checkSetup(session);
    if (!session?.user) redirect("/");
    return (
        <div className="flex items-center w-full h-screen  flex-col   md:px-16 px-4">
            <Stack className=" border-x p-4 w-full h-full  min-h-full flex  gap-2  ">
                {/* <section className=" h-min bg-linear-to-br  from-cyan-100 to-blue-500 p-8 rounded   w-full"> */}
                <Group grow align="start">
                    {/* <Paper withBorder p={"md"} px={"xl"}>
                        <Group>
                            <Avatar>JL</Avatar>
                            <Title order={4}>Juan Miguel Lopez</Title>
                        </Group>
                    </Paper> */}
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
                </Group>
                {/* </section> */}

                <div className="w-full  min-h-full">
                    <CalendarList />
                </div>
            </Stack>
        </div>
    );
}
