"use client";

import {
    Table,
    Checkbox,
    Group,
    Menu,
    ActionIcon,
    Stack,
    Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import CopyButton from "@/components/common/CopyButton";
import { getSizeByWeight } from "@/lib/getSizeByWeight";
import GetIcon from "@/components/common/GetIcon";

interface PetRowProps {
    pet: any; // Replace with your Pet type
    selectedRows: any[];
    setSelectedRows: (rows: any[]) => void;
    services: any[];
}

export function PetRow({
    pet,
    selectedRows,
    setSelectedRows,
    services,
}: PetRowProps) {
    const isSelected = selectedRows.some((row) => row.id === pet.id);

    const handleCheckboxChange = (checked: boolean) => {
        setSelectedRows(
            checked
                ? [...selectedRows, pet]
                : selectedRows.filter((row) => row.id !== pet.id)
        );
    };

    const currencyFormatter = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    });

    return (
        <Table.Tr
            key={pet.id}
            bg={isSelected ? "var(--mantine-color-blue-light)" : undefined}
        >
            <Table.Td align="center">
                <Checkbox
                    checked={isSelected}
                    aria-label="Select row"
                    onChange={(event) =>
                        handleCheckboxChange(event.currentTarget.checked)
                    }
                />
            </Table.Td>

            <Table.Td>
                <Group justify="space-between" className="group" wrap="nowrap">
                    <Text truncate>{pet.name}</Text>
                    <CopyButton value={pet.petId} />
                </Group>
            </Table.Td>

            <Table.Td>{pet.source}</Table.Td>
            <Table.Td>{pet.serviceName}</Table.Td>

            <Table.Td>
                {currencyFormatter.format(Number(pet.priceAtBooking))}
            </Table.Td>
        </Table.Tr>
    );
}
