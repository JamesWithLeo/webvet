"use client";

import { BookingSourceType } from "@/db/schema/appointments";
import { ServiceMergePriceType } from "@/db/schema/services";
import { toTitleCase } from "@/lib/toTitleCase";
import { Button, Checkbox, Group, Stack, Table, Text } from "@mantine/core";
import { IconInvoice } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { PetRow } from "./PetRow";
import PetsSelectModal from "./PetsSelectModal";
import { useDisclosure } from "@mantine/hooks";
import { PetTypeModel } from "@/types/pets";

type Props = {
    pets: {
        id: string;
        petId: string;
        name: string;
        photoUrl: string | null;
        species: "dog" | "cat";
        serviceName: string;
        priceAtBooking: number;
        weight: number;
        source: BookingSourceType;
    }[];
    allPets: PetTypeModel[];
    services: ServiceMergePriceType[];
    appointmentId: string;
};
export default function AdminCreateInvoiceTable({
    pets,
    services,
    allPets,
    appointmentId,
}: Props) {
    const [selectedRows, setSelectedRows] = useState<
        {
            id: string;
            petId: string;
            name: string;
            photoUrl: string | null;
            species: "dog" | "cat";
            serviceName: string;
            priceAtBooking: number;
            weight: number;
            source: BookingSourceType;
        }[]
    >([]);
    const [opened, { close, open }] = useDisclosure();

    const handleIssueInvoice = () => {
        console.log(selectedRows);
    };

    const noWeightPets = useMemo(() => {
        return pets
            .filter((p) => !p.weight)
            .map((pets) => toTitleCase(pets.name));
    }, [pets]);

    const sum = useMemo(() => {
        return selectedRows.reduce((acc, row) => {
            const price = Number(row.priceAtBooking) || 0;
            return acc + price;
        }, 0);
    }, [selectedRows]);

    const rows = pets.map((pet) => (
        <PetRow
            key={pet.id}
            pet={pet}
            services={services}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
        />
    ));

    return (
        <>
            <Stack>
                <Table
                    withRowBorders
                    withTableBorder={false}
                    withColumnBorders
                    striped
                    tabularNums
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Td>
                                <Checkbox
                                    aria-label="Select all row"
                                    onClick={(event) => {
                                        if (event.currentTarget.checked)
                                            setSelectedRows(pets);
                                        else {
                                            setSelectedRows([]);
                                        }
                                    }}
                                />
                            </Table.Td>
                            <Table.Th>Pet</Table.Th>
                            <Table.Th>Source</Table.Th>
                            <Table.Th>Service</Table.Th>
                            <Table.Th>Price at booking</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows}
                        <Table.Tr>
                            <Table.Td colSpan={4} align="right" fw={"bold"}>
                                Total
                            </Table.Td>
                            <Table.Td colSpan={2} fw={"bold"}>
                                {new Intl.NumberFormat("en-PH", {
                                    style: "currency",
                                    currency: "PHP",
                                    minimumFractionDigits: 2,
                                }).format(sum)}
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
                <Group justify="space-between">
                    <Button variant="default" onClick={open}>
                        Add pet
                    </Button>
                    <Button
                        leftSection={<IconInvoice size={20} />}
                        disabled={noWeightPets.length > 0}
                        onClick={handleIssueInvoice}
                    >
                        Issue Invoice
                    </Button>
                </Group>
            </Stack>
            <PetsSelectModal
                appointmentId={appointmentId}
                services={services}
                onClose={close}
                opened={opened}
                allPets={allPets}
            />
        </>
    );
}
