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

    const { displayAge } = calculatePetAge(dateOfBirth);
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
            className="group w-80 h-100 flex flex-col overflow-hidden"
            radius={"md"}
            p="0" // Remove padding so Card.Section touches the borders
        >
            {/* Header Section */}
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
                    <Stack gap={1}>
                        <Title
                            c="primary"
                            order={1}
                            className="text-2xl font-bold line-clamp-1"
                        >
                            {name ? toTitleCase(name) : "Unknown pet name"}
                        </Title>
                        <Title
                            c={"dimmed"}
                            order={6}
                            className="font-bold line-clamp-1"
                        >
                            {breed
                                ? toTitleCase(breed)
                                : (breedSpecification ?? "Unknown breed")}
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

                <Group gap={4} c={"dimmed"} mt={4}>
                    <Text size="xs" fw={700}>
                        {gender ? toTitleCase(gender) : "N/A"}
                    </Text>
                    <Text size="xs" c="gray.4">
                        •
                    </Text>
                    <Text size="xs" fw={700}>
                        {displayAge}
                        {/* {years} {years === 1 ? "year" : "years"} old */}
                    </Text>
                </Group>
            </Card.Section>

            {/* Image Section - Expands to fill the rest of h-120 */}
            <Card.Section className="relative flex-1 bg-gray-50 overflow-hidden">
                {imageUrl ? (
                    <>
                        <Image
                            src={imageUrl}
                            alt=""
                            h="100%"
                            w="100%"
                            fit="cover"
                            // Apply a heavy blur and darken it slightly
                            style={{
                                filter: "blur(20px) brightness(0.7)",
                                transform: "scale(1.1)", // Prevents white edges from the blur
                            }}
                            className="absolute inset-0"
                        />

                        <Image
                            src={imageUrl}
                            alt={name}
                            h="100%"
                            w="100%"
                            fit="contain" // Ensures the whole pet is visible
                            className="relative z-10 transition-transform duration-700 group-hover:scale-105"
                        />
                    </>
                ) : (
                    <Center h="100%" c={"gray.3"}>
                        {species?.toLowerCase() === "cat" ? (
                            <CatPlaceholder />
                        ) : (
                            <DogPlaceholder />
                        )}
                    </Center>
                )}
            </Card.Section>
        </Card>
    );
}
