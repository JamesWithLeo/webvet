"use client";

import {
    ActionIcon,
    Card,
    Stack,
    Title,
    Group,
    Text,
    Menu,
    Center,
    Image,
    Paper,
} from "@mantine/core";

import {
    IconArchive,
    IconArchiveOff,
    IconCat,
    IconDotsVertical,
    // IconHeart,
    // IconHeartFilled,
    IconPlus,
} from "@tabler/icons-react";
// import NextImage from "@nex"
import NextImage from "next/image";

import DogPlaceholder from "../common/DogPlaceholder";
import CatPlaceholder from "../common/CatPlaceholder";
import { PetTypeModelWithBreed } from "@/types/pets";
import { toTitleCase } from "@/lib/toTitleCase";
import calculatePetAge from "@/lib/calculatePetAge";
import { useRouter } from "next/navigation";
import { modals } from "@mantine/modals";
import { useUpdatePetArchive } from "@/lib/hooks/usePets";
import { useState } from "react";

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

    const { displayAge } = calculatePetAge(dateOfBirth);
    const router = useRouter();

    const [isError, setIsError] = useState(false);
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
            radius: "md",
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
            radius: "md",
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
        <Card
            withBorder
            className="group w-xs  h-110  flex flex-col overflow-hidden"
            radius={"md"}
            p="0" // Remove padding so Card.Section touches the borders
        >
            <Card.Section
                withBorder
                style={{
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                    paddingTop: "2rem",
                    paddingBottom: "1rem",
                }}
            >
                <Group justify="space-between" wrap="nowrap">
                    <Stack gap={0}>
                        <Title
                            c="primary"
                            order={1}
                            className="text-2xl font-bold "
                        >
                            {name ? toTitleCase(name) : "Unknown pet name"}
                        </Title>
                        <Title c={"dimmed"} order={6} className="font-bold ">
                            {breed
                                ? toTitleCase(breed)
                                : toTitleCase(
                                      breedSpecification ?? "Unknown breed"
                                  )}
                        </Title>
                    </Stack>

                    <Group gap={0}>
                        {/* <ActionIcon variant="transparent" size={"xl"}>
                            {heart ? (
                                <IconHeartFilled size={20} color="red" />
                            ) : (
                                <IconHeart size={20} />
                            )}
                        </ActionIcon> */}

                        <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                                <ActionIcon variant="transparent" size={"xl"}>
                                    <IconDotsVertical size={24} stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Pet Menu</Menu.Label>
                                <Menu.Item
                                    leftSection={
                                        <IconCat size={20} stroke={1.5} />
                                    }
                                    onClick={() =>
                                        router.push(`/v1/pets/${id}`)
                                    }
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
                                    onClick={() =>
                                        router.push("/v1/appointments/new")
                                    }
                                >
                                    New Appointment
                                </Menu.Item>

                                <Menu.Item
                                    color="orange"
                                    leftSection={
                                        archivedAt ? (
                                            <IconArchiveOff
                                                size={20}
                                                stroke={1.5}
                                            />
                                        ) : (
                                            <IconArchive
                                                size={20}
                                                stroke={1.5}
                                            />
                                        )
                                    }
                                    onClick={
                                        archivedAt
                                            ? handleUnarchive
                                            : handleArchieve
                                    }
                                >
                                    {archivedAt ? "Unarchive" : "Archive"}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>

                <Group gap={2} c={"dimmed"} mt={4}>
                    <Text size="xs" fw={700}>
                        {gender ? toTitleCase(gender) : "N/A"}
                    </Text>
                    <Text size="xs" c="gray.4">
                        •
                    </Text>
                    <Text size="xs" fw={700}>
                        {displayAge}
                    </Text>
                </Group>
            </Card.Section>

            <Card.Section
                withBorder
                component={"a"}
                href={`/v1/pets/${id}`}
                p={0}
            >
                <div className="flex flex-col items-center   justify-start w-full ">
                    <div className="relative group min-h-75 w-xs  aspect-square   overflow-hidden">
                        {!isError ? (
                            <NextImage
                                className=" z-0 relative  h-full   w-full object-cover  "
                                src={imageUrl}
                                loading="lazy"
                                fill={true}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                alt={""}
                                onError={() => {
                                    console.log("error");
                                    setIsError(true);
                                }}
                            />
                        ) : (
                            <Center h="100%" c={"gray.2"}>
                                {species?.toLowerCase() === "cat" ? (
                                    <CatPlaceholder />
                                ) : (
                                    <DogPlaceholder />
                                )}
                            </Center>
                        )}
                    </div>
                </div>
            </Card.Section>
        </Card>
    );
}
