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
    Center,
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

import DogPlaceholder from "../common/DogPlaceholder";
import CatPlaceholder from "../common/CatPlaceholder";
import { LifeStatus, PetGender } from "@/db/schema/pets";
import { toTitleCase } from "@/lib/toTitleCase";
import calculatePetAge from "@/lib/calculatePetAge";

type Props = {
    // Pet props
    name: string;
    breed: string;
    gender: PetGender;
    heart: boolean | null;
    imageUrl: string | null;
    dateOfBirth: string;
    species: string;
    life: LifeStatus;
    breedSpecification: string;
};
export default function PetCard({
    name,
    breed,
    heart,
    gender,
    imageUrl,
    dateOfBirth,
    species,
    breedSpecification,
}: Props) {
    const { years } = calculatePetAge(dateOfBirth);

    return (
        <Card withBorder className="group w-96 h-125" radius={"md"}>
            <Card.Section withBorder p={"sm"}>
                <Group justify="space-between">
                    <Stack gap={1}>
                        <Title
                            c="primary"
                            order={1}
                            className="text-2xl font-bold"
                        >
                            {name ? toTitleCase(name) : "Unknown pet name"}
                        </Title>
                        <Title c={"dimmed"} order={6} className=" font-bold">
                            {breed
                                ? toTitleCase(breed)
                                : (breedSpecification ?? "Unknown breed")}
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
                        {gender[0].toUpperCase()} / {years} years old
                    </Title>
                </Group>
            </Card.Section>
            <Card.Section className="relative">
                {imageUrl ? (
                    <BackgroundImage
                        className="ease-in-out duration-300s delay-200"
                        src={imageUrl}
                        mah={"200"}
                        mih={"300"}
                    ></BackgroundImage>
                ) : (
                    <Center mah={"200"} bg={"gray.0"} c={"gray.3"} mih={"300"}>
                        {species === "cat" ? (
                            <CatPlaceholder />
                        ) : (
                            <DogPlaceholder />
                        )}
                    </Center>
                )}
            </Card.Section>
            <Card.Section withBorder p={"sm"}>
                <Text c={"dimmed"}>Next Appointment: None</Text>
                <Text c={"dimmed"}>Last Appointment: Nov 10, 2025</Text>
            </Card.Section>
        </Card>
    );
}
