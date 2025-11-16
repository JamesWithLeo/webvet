"use client";

import {
    ActionIcon,
    BackgroundImage,
    Card,
    Stack,
    Title,
    Group,
    Checkbox,
    Text,
    Menu,
} from "@mantine/core";
import {
    IconCat,
    IconDotsVertical,
    IconHeart,
    IconHeartFilled,
    IconLogs,
    IconPlus,
    IconTrash,
} from "@tabler/icons-react";

export default function PetCard({
    name,
    breed,
    heart,
    gender,
    imageUrl,
    age,
}: {
    name: string;
    breed: string;
    gender: "Male" | "Female";
    heart?: boolean;
    imageUrl: string;
    age: number;
}) {
    return (
        <Card
            withBorder
            // bg={"primary"}
            className="group w-96 h-[500px]   "
            // p={"xl"}
            radius={"md"}
        >
            <Card.Section withBorder p={"sm"}>
                <Group justify="space-between">
                    <Stack gap={1}>
                        <Title
                            c="primary"
                            order={1}
                            className="text-2xl font-bold"
                        >
                            {name}
                        </Title>
                        <Title c={"dimmed"} order={6} className=" font-bold">
                            {breed}
                        </Title>
                    </Stack>
                    <Group justify="center" gap={0}>
                        <ActionIcon variant="transparent" size={"xl"}>
                            {heart ? (
                                <IconHeartFilled size={20} />
                            ) : (
                                <IconHeart size={20} />
                            )}
                        </ActionIcon>
                        <ActionIcon variant="transparent" size={"xl"}>
                            <Menu
                                shadow="md"
                                width={200}
                                position="bottom-start"
                            >
                                <Menu.Target>
                                    <IconDotsVertical size={24} stroke={1.5} />
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Pet Menu</Menu.Label>
                                    <Menu.Item
                                        leftSection={
                                            <IconCat size={20} stroke={1.5} />
                                        }
                                    >
                                        Profile
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={
                                            <IconLogs size={20} stroke={1.5} />
                                        }
                                    >
                                        History
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Label>Action</Menu.Label>
                                    <Menu.Item
                                        color="primary"
                                        leftSection={
                                            <IconPlus size={20} stroke={1.5} />
                                        }
                                    >
                                        New Appointment
                                    </Menu.Item>
                                    <Menu.Item
                                        color="red"
                                        leftSection={
                                            <IconTrash size={20} stroke={1.5} />
                                        }
                                    >
                                        Delete
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </ActionIcon>
                    </Group>
                </Group>

                <Group gap={1} c={"dimmed"}>
                    <Title order={6}>
                        {gender === "Male" ? "M" : "F"} / {age} years old
                    </Title>
                </Group>
            </Card.Section>
            <Card.Section className="relative">
                <Group
                    justify="space-between"
                    className="absolute top-2 "
                    px={"sm"}
                >
                    <Checkbox />
                </Group>
                {/* <div className="w-full absolute flex items-end justify-end p-2">
                    <ActionIcon variant="transparent" size={"xl"}>
                        {heart ? (
                            <IconHeartFilled size={20} />
                        ) : (
                            <IconHeart size={20} />
                        )}
                    </ActionIcon>
                </div> */}
                {imageUrl ? (
                    <BackgroundImage
                        className="ease-in-out duration-300s delay-200"
                        src={imageUrl}
                        mah={"200"}
                        mih={"300"}
                    >
                        {/* <Overlay
                        gradient="linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 100%)"
                        opacity={0.45}
                    /> */}
                    </BackgroundImage>
                ) : (
                    <BackgroundImage
                        className="ease-in-out duration-300s delay-200"
                        color="primary"
                        src={"/dogPlaceholder.svg"}
                        mah={"200"}
                        mih={"300"}
                    ></BackgroundImage>
                )}
            </Card.Section>
            <Card.Section withBorder p={"sm"}>
                <Text c={"dimmed"}>Next Appointment: None</Text>
                <Text c={"dimmed"}>Last Appointment: Nov 10, 2025</Text>
            </Card.Section>
        </Card>
    );
}
