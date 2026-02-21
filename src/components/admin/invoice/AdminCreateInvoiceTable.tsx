"use client";

import CopyButton from "@/components/common/CopyButton";
import { AppointmentType } from "@/db/schema/appointments";
import { ServiceMergePriceType } from "@/db/schema/services";
import { getSizeByWeight } from "@/lib/getSizeByWeight";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    ActionIcon,
    Button,
    Checkbox,
    Group,
    Menu,
    Stack,
    Table,
    Text,
} from "@mantine/core";
import {
    IconInvoice,
    IconPill,
    IconPlus,
    IconScissors,
    IconVaccine,
    IconZoomCheck,
} from "@tabler/icons-react";
import { Fragment, useMemo, useState } from "react";

type Props = {
    pets: {
        id: string;
        name: string;
        photoUrl: string | null;
        species: "dog" | "cat";
        serviceName: string;
        priceAtBooking: string;
        weight: number;
    }[];
    services: ServiceMergePriceType[];
};
const getIcon = (type: AppointmentType) => {
    switch (type) {
        case "CHECK_UP":
            return <IconZoomCheck stroke={1.5} size={16} />;
        case "DEWORMING":
            return <IconPill stroke={1.5} size={16} />;
        case "GROOMING":
            return <IconScissors stroke={1.5} size={16} />;
        case "VACCINATION":
            return <IconVaccine stroke={1.5} size={16} />;
    }
};
export default function AdminCreateInvoiceTable({ pets, services }: Props) {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const noWeightPets = useMemo(() => {
        return pets
            .filter((p) => !p.weight)
            .map((pets) => toTitleCase(pets.name));
    }, [pets]);

    const rows = pets.map((pet) => (
        <Table.Tr
            key={pet.id}
            bg={
                selectedRows.includes(pet.id)
                    ? "var(--mantine-color-blue-light)"
                    : undefined
            }
        >
            <Table.Td align="center">
                <Checkbox
                    aria-label="Select row"
                    onChange={(event) =>
                        setSelectedRows(
                            event.currentTarget.checked
                                ? [...selectedRows, pet.id]
                                : selectedRows.filter((id) => id !== pet.id)
                        )
                    }
                />
            </Table.Td>
            <Table.Td>
                <Group>
                    {pet.id}
                    <CopyButton value={pet.id} />
                </Group>
            </Table.Td>
            <Table.Td>{pet.name}</Table.Td>
            <Table.Td>{pet.species}</Table.Td>
            <Table.Td>{pet.serviceName}</Table.Td>
            <Table.Td>{pet.priceAtBooking}</Table.Td>
            <Table.Td>
                <Menu shadow="md" width={"400"} withArrow>
                    <Menu.Target>
                        <ActionIcon size={"sm"} variant="subtle">
                            <IconPlus stroke={1.5} size={16} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {services
                            .filter(
                                (service) =>
                                    service.species === null ||
                                    service.species === pet.species
                            )
                            .map((service) => {
                                const petSize = getSizeByWeight(pet.weight);
                                const matchingVariant = service.variants.find(
                                    (v) =>
                                        v.variant === petSize ||
                                        v.variant === "FLAT"
                                );
                                // If this service doesn't have a variant for this pet's size, skip it
                                if (!matchingVariant) return null;

                                return (
                                    <Menu.Item
                                        key={service.id}
                                        leftSection={getIcon(service.type)}
                                        onClick={() => {
                                            console.log(
                                                `Selected: ${service.title} - ${matchingVariant.price}`
                                            );
                                        }}
                                    >
                                        <Group
                                            justify="space-between"
                                            gap="xl"
                                            wrap="nowrap"
                                        >
                                            <Stack gap={0}>
                                                <Text size="sm" fw={500}>
                                                    {service.title}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {matchingVariant.variant ===
                                                    "FLAT"
                                                        ? "Standard"
                                                        : matchingVariant.variant}
                                                </Text>
                                            </Stack>
                                            <Text size="sm" fw={700}>
                                                ₱{matchingVariant.price}
                                            </Text>
                                        </Group>
                                    </Menu.Item>
                                );
                            })}
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));
    return (
        <Stack>
            <Table
                withRowBorders
                // maw={"100px"}
                withTableBorder={false}
                withColumnBorders
                striped
                tabularNums
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Td>
                            <Checkbox aria-label="Select all row" />
                        </Table.Td>
                        <Table.Th>Id</Table.Th>
                        <Table.Th>Pet</Table.Th>
                        <Table.Th>Species</Table.Th>
                        <Table.Th>Service</Table.Th>
                        <Table.Th>Price at booking</Table.Th>
                        <Table.Td></Table.Td>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows}
                    <Table.Tr>
                        <Table.Td colSpan={5} align="right" fw={"bold"}>
                            Total
                        </Table.Td>
                        <Table.Td colSpan={2} fw={"bold"}>
                            {0}
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>

                {noWeightPets.length > 0 && (
                    <Table.Caption>
                        <Group>
                            <Text c={"red"} size="sm">
                                Warning: Pets with no weight (
                                {noWeightPets.join(", ")})
                            </Text>
                        </Group>
                    </Table.Caption>
                )}
            </Table>
            <Group justify="right">
                <Button leftSection={<IconInvoice size={20} />}>
                    Issue Invoice
                </Button>
            </Group>
        </Stack>
    );
}
