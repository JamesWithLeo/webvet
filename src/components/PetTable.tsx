"use client";

import { DataTable, useDataTableColumns } from "mantine-datatable";
import {
    ActionIcon,
    Group,
    Stack,
    Button,
    TextInput,
    NativeSelect,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useMemo } from "react";
import usePetsAdmin from "@/lib/hooks/usePetsAdmin";
import { AdminPetsSummary } from "@/types/pets";
import { toTitleCase } from "@/lib/toTitleCase";

export default function PetTable() {
    const key = "draggable-example";

    const { data, isLoading } = usePetsAdmin();
    const allBreed = useMemo(() => {
        return new Set(data?.map((pet) => pet.breedSpecification));
    }, [data]);

    const {
        effectiveColumns,
        resetColumnsOrder,
        resetColumnsWidth,
        resetColumnsToggle,
    } = useDataTableColumns<AdminPetsSummary>({
        key,
        columns: [
            {
                accessor: "id",
                title: "id",
                width: "6%",
                toggleable: true,
                ellipsis: true,
            },
            {
                accessor: "name",
                title: "Name",
                draggable: true,
                width: "20%",
                resizable: true,
                render: (record) => `${toTitleCase(record.name)}`,
                filter: ({ close }) => (
                    <TextInput
                        label="Name"
                        description="Show name whose names include the specified text"
                        placeholder="Search name..."
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            <ActionIcon
                                size="sm"
                                variant="transparent"
                                c="dimmed"
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        }
                    />
                ),
            },
            {
                accessor: "species",
                title: "Species",
                width: "20%",
                textAlign: "left",
                render: (record) => `${toTitleCase(record.species)}`,
            },
            {
                accessor: "breedSpecification",
                title: "Breed",
                width: "20%",
                ellipsis: true,
                textAlign: "left",
                render: (record) => `${toTitleCase(record.breedSpecification)}`,
                filter: (
                    <NativeSelect
                        label="Breed"
                        description="Shows all pets that  matches the filter"
                        data={["all"].concat([...allBreed]).map((value) => ({
                            label: toTitleCase(value),
                            value: value,
                        }))}
                    />
                ),
            },
            {
                accessor: "dateOfBirth",
                title: "Date of birth",
                width: "8%",
                textAlign: "center",
                sortable: true,
            },
            {
                accessor: "life",
                title: "Is alived?",
                width: "8%",
                textAlign: "center",
                render: (record) => `${record.life}`,
            },
            {
                accessor: "weight",
                title: "Weight",
                textAlign: "center",
                width: "8%",
                sortable: true,
            },
            {
                accessor: "reproductiveStatus",
                title: "Reproductive Status",
                textAlign: "center",
                width: "8%",
            },
            {
                accessor: "ownershipStatus",
                title: "Ownership status",
                textAlign: "center",
                width: "8%",
            },
        ],
    });

    return (
        <Stack>
            <Group justify="flex-end">
                <Button
                    size="xs"
                    onClick={resetColumnsToggle}
                    variant="default"
                >
                    Reset column Toggle
                </Button>

                <Button size="xs" onClick={resetColumnsOrder} variant="default">
                    Reset Column Order
                </Button>
                <Button size="xs" onClick={resetColumnsWidth} variant="default">
                    Reset Column Width
                </Button>
            </Group>
            <DataTable
                withTableBorder={false}
                withColumnBorders
                withRowBorders
                striped
                pinLastColumn
                highlightOnHover
                verticalSpacing="sm"
                borderRadius="sm"
                records={data}
                totalRecords={1500}
                storeColumnsKey={key}
                page={1}
                minHeight={200}
                fetching={isLoading}
                recordsPerPage={20}
                onPageChange={() => {}}
                columns={effectiveColumns}
                rowExpansion={{
                    allowMultiple: true,
                    content: ({ record }) => (
                        <Stack p="xs" gap={6}>
                            <Group gap={6} ml={"200"}>
                                <Image
                                    className="rounded shadow"
                                    alt="dog"
                                    src={record.photoUrl}
                                    height={200}
                                    quality={100}
                                    priority
                                    width={200}
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                    }}
                                />
                                <Stack>
                                    <div className="text-sm">
                                        <h1>Next Appointment: No record</h1>
                                        <h1>Grooming: 4</h1>
                                        <h1>Check up: 4</h1>
                                        <h1>Neuter: True</h1>
                                    </div>
                                    <Button size="sm">Modify Record</Button>
                                    <Button size="sm">View full record</Button>
                                </Stack>
                            </Group>
                        </Stack>
                    ),
                    collapseProps: {
                        transitionDuration: 500,
                        animateOpacity: false,
                        transitionTimingFunction: "ease-out",
                    },
                }}
            />
        </Stack>
    );
}
