"use client";
import { Group, Flex, Paper } from "@mantine/core";
import Logo from "@/components/Logo";
import ThemeModeButton from "@/components/ThemeModeButton";
import { ActionIcon } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            <Paper
                withBorder
                style={{ borderTop: 0, borderLeft: 0, borderRight: 0 }}
                className="h-16  z-20 sticky top-0 "
            >
                <Group
                    className="w-full md:px-20 px-10    h-full  "
                    grow
                    justify="space-between"
                    h={"100%"}
                    w={"100%"}
                    align="flex-end"
                >
                    <Group h={"100%"} w={"100%"}>
                        <Flex
                            align="center"
                            direction="row"
                            wrap="nowrap"
                            w={"100%"}
                            gap={"md"}
                        >
                            <Logo size="md" />
                            <h1 className="font-bold  text-xl md:text-2xl text-[#14678f] dark:text-[#50bce9]">
                                JOSEPH & MARY
                            </h1>
                        </Flex>
                    </Group>
                    <Group visibleFrom="md" h={"100%"}>
                        <Flex
                            justify="center"
                            align="center"
                            direction="row"
                            w={"100%"}
                        >
                            <a
                                href="/v1/dashboard"
                                className=" hover:bg-gray-50 p-4"
                            >
                                Home
                            </a>
                            <a href="/v1/pets" className="p-4 hover:bg-gray-50">
                                Pets
                            </a>
                            <a
                                href="/v1/appointments"
                                className=" hover:bg-gray-50 p-4"
                            >
                                Appointments
                            </a>
                        </Flex>
                    </Group>
                    <Group h={"100%"}>
                        <Flex
                            h={"100%"}
                            w={"100%"}
                            gap="md"
                            justify="flex-end"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <ActionIcon
                                component="a"
                                href="/v1/profile"
                                variant="default"
                                size={"lg"}
                                visibleFrom="md"
                            >
                                <IconUser size={20} fill="none" stroke={1.5} />
                            </ActionIcon>
                            <ThemeModeButton visibleFrom="md" />
                        </Flex>
                    </Group>
                </Group>
            </Paper>
            {children} {/* This renders your actual page content */}
        </main>
    );
}
