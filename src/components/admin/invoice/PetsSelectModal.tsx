"use client";

import { InsertAppointmentToPetsAdmin } from "@/actions/appointmentToPets";
import GetIcon from "@/components/common/GetIcon";
import { ServiceMergePriceType } from "@/db/schema/services";
import { getSizeByWeight } from "@/lib/getSizeByWeight";
import { toTitleCase } from "@/lib/toTitleCase";
import { PetTypeModel } from "@/types/pets";
import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Divider,
    Group,
    Loader,
    Menu,
    Modal,
    Stack,
    Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { startTransition, useActionState, useEffect } from "react";
import { Fragment } from "react/jsx-runtime";

type Props = {
    opened: boolean;
    onClose: () => void;
    allPets: PetTypeModel[];
    services: ServiceMergePriceType[];
    appointmentId: string | null;
};

export default function PetsSelectModal({
    opened,
    onClose,
    allPets,
    services,
    appointmentId,
}: Props) {
    const [formState, formAction, isPending] = useActionState(
        InsertAppointmentToPetsAdmin,
        null
    );
    const currencyFormatter = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    });
    useEffect(() => {
        console.log(formState);
        if (formState?.error) {
            notifications.show({
                message: formState.error,
                icon: <IconX size={20} />,
                color: "red",
                title: "Could Not Add Service",
            });
        }
    }, [formState]);
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            withCloseButton={false}
            size={"lg"}
            radius={"lg"}
        >
            <Stack p={"sm"} gap={0}>
                <Group justify="space-between" align="anchor-center">
                    <Text fw={"bold"} mb={"md"}>
                        Select Pets
                    </Text>
                    <ActionIcon
                        onClick={onClose}
                        size="input-xs"
                        variant="transparent"
                        c={"black"}
                    >
                        <IconX size={20} />
                    </ActionIcon>
                </Group>

                {allPets.map((pet, index) => (
                    <Fragment key={pet.id}>
                        <Menu withArrow trigger="click">
                            <Menu.Target>
                                <Stack
                                    p={"md"}
                                    className="hover:bg-gray-100 cursor-pointer transition-colors rounded-md"
                                >
                                    <Group
                                        align="center"
                                        gap={"lg"}
                                        wrap="nowrap"
                                    >
                                        <Avatar src={pet.photoUrl}>
                                            {pet.name[0]}
                                        </Avatar>
                                        <Stack gap={0} style={{ flex: 1 }}>
                                            <Text>{toTitleCase(pet.name)}</Text>
                                            <Text c={"dimmed"} size="xs">
                                                {pet.id}
                                            </Text>
                                        </Stack>
                                        {(!pet.weight || pet.weight === 0) && (
                                            <Text c="red" size="xs" fw={700}>
                                                WEIGHT: 0
                                            </Text>
                                        )}

                                        <Badge
                                            ml={"lg"}
                                            size="md"
                                            variant="light"
                                        >
                                            {pet.species}
                                        </Badge>
                                    </Group>
                                </Stack>
                            </Menu.Target>

                            <Menu.Dropdown>
                                {services
                                    .filter(
                                        (s) =>
                                            s.species === null ||
                                            s.species === pet.species
                                    )
                                    .map((service) => {
                                        // 1. Check if weight is valid
                                        const hasWeight =
                                            typeof pet.weight === "number" &&
                                            pet.weight > 0;

                                        // 2. Safely get the size for TS
                                        const petSize = hasWeight
                                            ? getSizeByWeight(
                                                  pet.weight as number
                                              )
                                            : null;

                                        // 3. Find the variant
                                        const matchingVariant =
                                            service.variants.find(
                                                (v: any) =>
                                                    v.variant === "FLAT" ||
                                                    (petSize &&
                                                        v.variant === petSize)
                                            );

                                        if (!matchingVariant && !hasWeight) {
                                            return (
                                                <Menu.Item
                                                    key={service.id}
                                                    leftSection={GetIcon(
                                                        service.type
                                                    )}
                                                    disabled
                                                >
                                                    <Group
                                                        justify="space-between"
                                                        gap="xl"
                                                        wrap="nowrap"
                                                    >
                                                        <Stack gap={0}>
                                                            <Text
                                                                size="sm"
                                                                fw={500}
                                                            >
                                                                {service.title}
                                                            </Text>
                                                            <Text
                                                                size="xs"
                                                                c="red"
                                                            >
                                                                Weight required
                                                                for pricing
                                                            </Text>
                                                        </Stack>
                                                        {/* Instead of a price, show a warning icon or label */}
                                                        <Text
                                                            size="xs"
                                                            fw={700}
                                                            c="red"
                                                            style={{
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            Weight 0
                                                        </Text>
                                                    </Group>
                                                </Menu.Item>
                                            );
                                        }

                                        if (!matchingVariant) return null;

                                        return (
                                            <Menu.Item
                                                key={service.id}
                                                leftSection={GetIcon(
                                                    service.type
                                                )}
                                                // rightSection={
                                                //     isPending ? (
                                                //         <Loader />
                                                //     ) : undefined }
                                                onClick={() => {
                                                    if (!appointmentId) return;
                                                    const body = {
                                                        appointmentId,
                                                        serviceId:
                                                            matchingVariant.serviceId,
                                                        priceAtBooking:
                                                            matchingVariant.price,
                                                        petId: pet.id,
                                                        source: "admin" as const,
                                                    };
                                                    startTransition(
                                                        async () => {
                                                            formAction(body);
                                                        }
                                                    );
                                                }}
                                                disabled={isPending}
                                            >
                                                <Group
                                                    justify="space-between"
                                                    gap="xl"
                                                    wrap="nowrap"
                                                >
                                                    <Stack gap={0}>
                                                        <Text
                                                            size="sm"
                                                            fw={500}
                                                        >
                                                            {service.title}
                                                        </Text>
                                                        <Text
                                                            size="xs"
                                                            c="dimmed"
                                                        >
                                                            {matchingVariant.variant ===
                                                            "FLAT"
                                                                ? "Standard"
                                                                : matchingVariant.variant}
                                                        </Text>
                                                    </Stack>
                                                    <Text size="sm" fw={700}>
                                                        {currencyFormatter.format(
                                                            Number(
                                                                matchingVariant.price
                                                            )
                                                        )}
                                                    </Text>
                                                </Group>
                                            </Menu.Item>
                                        );
                                    })}
                            </Menu.Dropdown>
                        </Menu>
                        {index !== allPets.length - 1 && <Divider />}
                    </Fragment>
                ))}
            </Stack>
        </Modal>
    );
}
