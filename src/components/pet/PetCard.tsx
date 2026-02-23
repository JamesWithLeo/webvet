"use client";

import {
    ActionIcon,
    BackgroundImage,
    Card,
    Stack,
    Title,
    Group,
    Text,
    Menu,
    Center,
} from "@mantine/core";

import {
    IconArchive,
    IconArchiveOff,
    IconCat,
    IconDotsVertical,
    IconHeart,
    IconHeartFilled,
    IconPlus,
} from "@tabler/icons-react";

import DogPlaceholder from "../common/DogPlaceholder";
import CatPlaceholder from "../common/CatPlaceholder";
import { PetTypeModelWithBreed } from "@/types/pets";
import { toTitleCase } from "@/lib/toTitleCase";
import calculatePetAge from "@/lib/calculatePetAge";
import { useRouter } from "next/navigation";
import { modals } from "@mantine/modals";
import { useUpdatePetArchive } from "@/lib/hooks/usePets";

type Props = {
    pet: PetTypeModelWithBreed;
};
export default function PetCard({ pet }: Props) {
    const {
        dateOfBirth,
        name,
        id,
        breed,
        species,
        breedSpecification,
        gender,
        photoUrl: imageUrl,
        isLike: heart,
        archivedAt,
    } = pet;

    const { years } = calculatePetAge(dateOfBirth);
    const router = useRouter();

    const { mutateAsync: updateArchive, isPending } = useUpdatePetArchive();

    const handleArchieve = () => {
        modals.openConfirmModal({
            title: `Archive ${name}?`,
            children: (
                <Text size="sm">
                    Are you sure you want to archive this pet? It will no longer
                    appear in your active list.
                </Text>
            ),
            labels: { confirm: "Archive", cancel: "Cancel" },
            confirmProps: {
                color: "orange",
                loading: isPending,
            },
            size: "lg",
            centered: true,
            onConfirm: async () => {
                if (isPending) return;
                updateArchive({ id, isArchived: !archivedAt });
            },
        });
    };
    const handleUnarchive = () => {
        modals.openConfirmModal({
            title: `Unarchive ${name}?`,
            children: (
                <Text size="sm">
                    Are you sure you want to unarchive this pet?
                </Text>
            ),
            labels: { confirm: "confirm", cancel: "Cancel" },
            confirmProps: {
                color: "orange",
                loading: isPending,
            },
            size: "lg",
            centered: true,
            onConfirm: async () => {
                if (isPending) return;
                updateArchive({ id, isArchived: !archivedAt });
            },
        });
    };
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
                                        onClick={() => {
                                            router.push(`/v1/pets/${id}`);
                                        }}
                                    >
                                        Profile
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Label>Action</Menu.Label>
                                    <Menu.Item
                                        color="primary"
                                        leftSection={
                                            <IconPlus size={20} stroke={1.5} />
                                        }
                                        onClick={() => {
                                            router.push("/v1/appointments/new");
                                        }}
                                    >
                                        New Appointment
                                    </Menu.Item>
                                    {!archivedAt ? (
                                        <Menu.Item
                                            color="orange"
                                            leftSection={
                                                <IconArchive
                                                    size={20}
                                                    stroke={1.5}
                                                />
                                            }
                                            onClick={handleArchieve}
                                        >
                                            Archieve
                                        </Menu.Item>
                                    ) : (
                                        <Menu.Item
                                            color="orange"
                                            leftSection={
                                                <IconArchiveOff
                                                    size={20}
                                                    stroke={1.5}
                                                />
                                            }
                                            onClick={handleUnarchive}
                                        >
                                            Unarchive
                                        </Menu.Item>
                                    )}
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
