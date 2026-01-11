"use client";

import { DataTable, useDataTableColumns } from "mantine-datatable";
import {
    ActionIcon,
    Flex,
    Stack,
    Text,
    Group,
    Box,
    Button,
    Menu,
    Kbd,
} from "@mantine/core";
import {
    IconDog,
    IconDotsVertical,
    IconEdit,
    IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

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
        Firstname: "Amelia",
        Lastname: "Stone",
    },
    {
        id: 16,
        Firstname: "James",
        Lastname: "Porter",
    },
    {
        id: 17,
        Firstname: "Sophia",
        Lastname: "Brooks",
    },
];
export default function AccountTable() {
    const key = "draggable-example";
    const [selectedRecords, SetSelectedRecords] = useState<IAccount[]>([]);
    const { effectiveColumns, resetColumnsOrder, resetColumnsToggle } =
        useDataTableColumns<IAccount>({
            key,
            columns: [
                {
                    accessor: "id",
                    title: "id",
                    textAlign: "right",
                    sortable: true,
                    width: 80,
                },
                {
                    accessor: "Firstname",
                    title: "First name",
                    resizable: true,
                    toggleable: true,
                    draggable: true,
                },
                {
                    accessor: "Lastname",
                    title: "Last name",
                    resizable: true,
                    toggleable: true,
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
        <Stack>
            <DataTable
                withTableBorder
                // withColumnBorders
                // withRowBorders
                striped={false}
                pinLastColumn={true}
                highlightOnHover={true}
                verticalSpacing="xs"
                borderRadius="sm"
                records={records}
                totalRecords={1500}
                storeColumnsKey={key}
                page={1}
                recordsPerPage={10}
                onPageChange={() => {}}
                columns={effectiveColumns}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={SetSelectedRecords}
                rowExpansion={{
                    allowMultiple: false,
                    content: (content) => (
                        <DataTable
                            noHeader
                            withRowBorders={false}
                            withTableBorder={false}
                            withColumnBorders={false}
                            verticalSpacing="xs"
                            horizontalSpacing="xs"
                            columns={[
                                {
                                    accessor: "species",
                                    title: "species",
                                    render: ({ species }) => (
                                        <Flex
                                            c="primary"
                                            gap={4}
                                            align={"center"}
                                            justify={"flex-end"}
                                        >
                                            <IconDog stroke="1.5" />
                                            <Text>{species}</Text>
                                        </Flex>
                                    ),
                                },
                                {
                                    accessor: "nickname",
                                    title: "nickname",
                                    render: ({ nickname }) => (
                                        <Box component="span">{nickname}</Box>
                                    ),
                                },
                                {
                                    accessor: "breed",
                                    title: "breed",
                                },
                                {
                                    accessor: "id",
                                    title: "id",
                                    render: () => (
                                        <Group gap={"sm"}>
                                            <Button
                                                size="compact-xs"
                                                variant="light"
                                            >
                                                view
                                            </Button>
                                            <Menu shadow="md" width={300}>
                                                <Menu.Target>
                                                    <ActionIcon
                                                        c={"dimmed"}
                                                        variant="transparent"
                                                    >
                                                        <IconDotsVertical />
                                                    </ActionIcon>
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Label>
                                                        Pets Action
                                                    </Menu.Label>
                                                    <Menu.Item
                                                        leftSection={
                                                            <IconEdit
                                                                size={14}
                                                            />
                                                        }
                                                        rightSection={
                                                            <div dir="ltr">
                                                                <Kbd>⌘</Kbd> +{" "}
                                                                <Kbd>Shift</Kbd>{" "}
                                                                + <Kbd>E</Kbd>
                                                            </div>
                                                        }
                                                    >
                                                        Edit
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={
                                                            <IconTrash
                                                                size={14}
                                                            />
                                                        }
                                                        rightSection={
                                                            <Kbd>DEL</Kbd>
                                                        }
                                                    >
                                                        Delete
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Group>
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
                                    species: "Dog",
                                },
                                {
                                    id: 16,
                                    name: "Zoe",
                                    nickname: "Giggles",
                                    breed: "Poodle",
                                    age: 3,
                                    species: "Dog",
                                },
                            ]}
                        />
                    ),
                }}
            />
            <Group justify="flex-end">
                <Button size="xs" onClick={resetColumnsToggle}>
                    Reset Toggled Columns
                </Button>
                <Button size="xs" onClick={resetColumnsOrder}>
                    Reset Column Order
                </Button>
                <Button
                    size="xs"
                    color="red"
                    leftSection={<IconTrash size={14} />}
                >
                    Delete
                </Button>
            </Group>
        </Stack>
    );
}
