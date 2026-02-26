"use client";

import { Table, Checkbox, Group, Text } from "@mantine/core";
import CopyButton from "@/components/common/CopyButton";
import CurrencyFormatter from "@/lib/CurrencyFormatter";
import PetServiceMerged from "@/types/PetsServiceMerged";

interface PetRowProps {
    pet: PetServiceMerged; // Replace with your Pet type
    selectedRows: any[];
    setSelectedRows: (rows: any[]) => void;
}

export function PetRow({ pet, selectedRows, setSelectedRows }: PetRowProps) {
    const isSelected = selectedRows.some((row) => row.id === pet.id);

    const handleCheckboxChange = (checked: boolean) => {
        setSelectedRows(
            checked
                ? [...selectedRows, pet]
                : selectedRows.filter((row) => row.id !== pet.id)
        );
    };

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
            <Table.Td>{pet.title}</Table.Td>

            <Table.Td>{CurrencyFormatter(pet.priceAtBooking)}</Table.Td>
        </Table.Tr>
    );
}
