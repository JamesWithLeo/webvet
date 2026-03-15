"use client";

import { Table, Checkbox, Group, Text, Stack } from "@mantine/core";
import CopyButton from "@/components/common/CopyButton";
import CurrencyFormatter from "@/lib/CurrencyFormatter";
import PetServiceMerged from "@/types/PetsServiceMerged";
import { toTitleCase } from "@/lib/toTitleCase";

interface PetRowProps {
    pet: PetServiceMerged;
    selectedRows: any[];
    noWeight: boolean;
    priceAtInvoice: string;
    setSelectedRows: (rows: any[]) => void;
}

export function PetRow({
    pet,
    noWeight,
    selectedRows,
    setSelectedRows,
    priceAtInvoice,
}: PetRowProps) {
    const isSelected = selectedRows.some((row) => row.id === pet.id);

    const handleCheckboxChange = (checked: boolean) => {
        setSelectedRows(
            checked
                ? [...selectedRows, { ...pet, priceAtInvoice: priceAtInvoice }]
                : selectedRows.filter((row) => row.id !== pet.id)
        );
    };

    return (
        <Table.Tr
            key={`${pet.id}-${pet.serviceId}`}
            bg={
                noWeight
                    ? "var(--mantine-color-red-light)"
                    : isSelected
                      ? "var(--mantine-color-blue-light)"
                      : undefined
            }
        >
            <Table.Td>
                <Group justify="space-between" className="group" wrap="nowrap">
                    <Stack gap={0}>
                        {noWeight && (
                            <Text size="xs" c={"red"}>
                                (No weight)
                            </Text>
                        )}
                        <Text truncate>{toTitleCase(pet.name)}</Text>
                    </Stack>
                    <CopyButton value={pet.petId} />
                </Group>
            </Table.Td>

            <Table.Td>{pet.source}</Table.Td>
            <Table.Td>{pet.title}</Table.Td>

            <Table.Td>
                {noWeight ? (
                    <Text size="xs" c={"red"}>
                        set the weight first
                    </Text>
                ) : (
                    CurrencyFormatter(priceAtInvoice)
                )}
            </Table.Td>
            <Table.Td align="center">
                {" "}
                <Checkbox
                    disabled={noWeight}
                    checked={isSelected}
                    aria-label="Select row"
                    onChange={(event) =>
                        handleCheckboxChange(event.currentTarget.checked)
                    }
                />
            </Table.Td>
        </Table.Tr>
    );
}
