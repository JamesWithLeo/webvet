"use client";

import { DataTable, useDataTableColumns } from "mantine-datatable";
import { ActionIcon } from "@mantine/core";
import { Group, Box, Button } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";

interface IAccount {
    id: number;
    Firstname: string;
    Lastname: string;
    // Note: The 'actions' field is NOT in this data type
}
const records: IAccount[] = [
    {
        id: 1,
        Firstname: "Ethan",
        Lastname: "Hayes",
    },
    {
        id: 2,
        Firstname: "Olivia",
        Lastname: "Bennett",
    },
    {
        id: 3,
        Firstname: "Liam",
        Lastname: "Russell",
    },
    {
        id: 4,
        Firstname: "Ava",
        Lastname: "Chen",
    },
    {
        id: 5,
        Firstname: "Noah",
        Lastname: "Rodriguez",
    },
    {
        id: 6,
        Firstname: "Isabella",
        Lastname: "Foster",
    },
    {
        id: 7,
        Firstname: "Lucas",
        Lastname: "Morgan",
    },
    {
        id: 8,
        Firstname: "Mia",
        Lastname: "Sullivan",
    },
    {
        id: 9,
        Firstname: "Alexander",
        Lastname: "Reed",
    },
    {
        id: 10,
        Firstname: "Charlotte",
        Lastname: "Ward",
    },
    {
        id: 11,
        Firstname: "William",
        Lastname: "Gray",
    },
    {
        id: 12,
        Firstname: "Amelia",
        Lastname: "Stone",
    },
    {
        id: 13,
        Firstname: "James",
        Lastname: "Porter",
    },
    {
        id: 14,
        Firstname: "Sophia",
        Lastname: "Brooks",
    },
    {
        id: 15,
        Firstname: "Benjamin",
        Lastname: "King",
    },
    {
        id: 16,
        Firstname: "Evelyn",
        Lastname: "Dixon",
    },
    {
        id: 17,
        Firstname: "Henry",
        Lastname: "Myers",
    },
    {
        id: 18,
        Firstname: "Abigail",
        Lastname: "Carter",
    },
    {
        id: 19,
        Firstname: "Daniel",
        Lastname: "Nelson",
    },
    {
        id: 20,
        Firstname: "Emily",
        Lastname: "Fisher",
    },
];
export default function AccountTable() {
    const key = "draggable-example";
    const { effectiveColumns, resetColumnsOrder } =
        useDataTableColumns<IAccount>({
            key,
            columns: [
                {
                    accessor: "id",
                    title: "id",
                    textAlign: "right",
                    sortable: true,
                    width: "10%",
                },
                {
                    accessor: "Firstname",
                    title: "First name",

                    resizable: true,
                    draggable: true,
                },
                {
                    accessor: "Lastname",
                    title: "Last name",
                    resizable: true,
                    draggable: true,
                },
                {
                    accessor: "actions",
                    title: <Box mr={6}>Row actions</Box>,

                    sortable: false,
                    textAlign: "right",
                    width: "10%",
                    render: (company) => (
                        <Group gap={4} justify="right" wrap="nowrap">
                            <ActionIcon size="sm" variant="subtle" color="blue">
                                <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon size="sm" variant="subtle" color="red">
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Group>
                    ),
                },
            ],
        });
    return (
        <DataTable
            withTableBorder
            // withColumnBorders
            // withRowBorders
            striped
            pinLastColumn={true}
            highlightOnHover={true}
            verticalSpacing="md"
            borderRadius="sm"
            records={records}
            totalRecords={1500}
            storeColumnsKey={key}
            page={1}
            recordsPerPage={20}
            onPageChange={() => {}}
            columns={effectiveColumns}
            rowExpansion={{
                allowMultiple: false,
                content: (content) => (
                    <DataTable
                        noHeader
                        verticalSpacing="xs"
                        horizontalSpacing="xs"
                        columns={[
                            {
                                accessor: "nickname",
                                title: "nickname",
                                render: ({ nickname }) => (
                                    <Box component="span" ml={150}>
                                        {nickname}
                                    </Box>
                                ),
                            },
                            { accessor: "species", title: "species" },
                            { accessor: "breed", title: "breed" },
                            {
                                accessor: "id",
                                title: "id",
                                render: () => (
                                    <Box component="span">
                                        <Button
                                            className="group-hover:visible invisible"
                                            size="xs"
                                            variant="subtle"
                                        >
                                            view
                                        </Button>
                                    </Box>
                                ),
                            },
                        ]}
                        rowClassName={"group"}
                        records={[
                            {
                                id: 15,
                                name: "Simba",
                                nickname: "The King",
                                breed: "Shiba",
                                age: 11,
                                species: "dog",
                            },
                            {
                                id: 16,
                                name: "Zoe",
                                nickname: "Giggles",
                                breed: "Poodle",
                                age: 3,
                                species: "dog",
                            },
                        ]}
                    />
                ),
            }}
        />
    );
}
