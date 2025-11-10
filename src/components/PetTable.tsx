"use client";

import { DataTable, useDataTableColumns } from "mantine-datatable";
import { ActionIcon } from "@mantine/core";
import { Group, Box, Stack } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import Image from "next/image";

interface IPet {
    id: number;
    nickname: string;
    breed: string;
    name: string;
    age: number;
    owner: string;
}
const records: IPet[] = [
    {
        id: 1,
        name: "Rex",
        nickname: "Rocket",
        breed: "German Shepherd",
        age: 5,
        owner: "Ethan Hayes",
    },
    {
        id: 2,
        name: "Luna",
        nickname: "Muffin",
        breed: "Siamese",
        age: 2,
        owner: "Olivia Bennett",
    },
    {
        id: 3,
        name: "Jasper",
        nickname: "The Fluff",
        breed: "Maine Coon",
        age: 8,
        owner: "Liam Russell",
    },
    {
        id: 4,
        name: "Kiko",
        nickname: "Zoomie",
        breed: "Jack Russell Terrier",
        age: 1,
        owner: "Ava Chen",
    },
    {
        id: 5,
        name: "Apollo",
        nickname: "Big Guy",
        breed: "Great Dane",
        age: 6,
        owner: "Noah Rodriguez",
    },
    {
        id: 6,
        name: "Daisy",
        nickname: "Missy",
        breed: "Cocker Spaniel",
        age: 3,
        owner: "Isabella Foster",
    },
    {
        id: 7,
        name: "Ghost",
        nickname: "Shadow",
        breed: "Black Labrador",
        age: 7,
        owner: "Lucas Morgan",
    },
    {
        id: 8,
        name: "Penny",
        nickname: "Sweetheart",
        breed: "Golden Retriever",
        age: 4,
        owner: "Mia Sullivan",
    },
    {
        id: 9,
        name: "Tank",
        nickname: "Buster",
        breed: "Bulldog",
        age: 10,
        owner: "Alexander Reed",
    },
    {
        id: 10,
        name: "Pippin",
        nickname: "Tiny",
        breed: "Chihuahua",
        age: 1,
        owner: "Charlotte Ward",
    },
    {
        id: 11,
        name: "Marmalade",
        nickname: "Sir Purrsalot",
        breed: "Orange Tabby",
        age: 9,
        owner: "William Gray",
    },
    {
        id: 12,
        name: "Max",
        nickname: "Scout",
        breed: "Beagle",
        age: 2,
        owner: "Amelia Stone",
    },
    {
        id: 13,
        name: "Cleo",
        nickname: "Whiskers",
        breed: "Calico",
        age: 5,
        owner: "James Porter",
    },
    {
        id: 14,
        name: "Benny",
        nickname: "Floppy",
        breed: "Rabbit (Holland Lop)",
        age: 1,
        owner: "Sophia Brooks",
    },
    {
        id: 15,
        name: "Simba",
        nickname: "The King",
        breed: "African Lion (Joke/Fictional)",
        age: 11,
        owner: "Benjamin King",
    },
    {
        id: 16,
        name: "Zoe",
        nickname: "Giggles",
        breed: "Poodle",
        age: 3,
        owner: "Evelyn Dixon",
    },
    {
        id: 17,
        name: "Bandit",
        nickname: "Trouble",
        breed: "Raccoon (Joke/Fictional)",
        age: 6,
        owner: "Henry Myers",
    },
    {
        id: 18,
        name: "Ruby",
        nickname: "Cuddles",
        breed: "Border Collie",
        age: 4,
        owner: "Abigail Carter",
    },
    {
        id: 19,
        name: "Bolt",
        nickname: "Sparky",
        breed: "Greyhound",
        age: 7,
        owner: "Daniel Nelson",
    },
    {
        id: 20,
        name: "Smokey",
        nickname: "Grumpy",
        breed: "Persian Cat",
        age: 13,
        owner: "Emily Fisher",
    },
];
export default function PetTable() {
    const key = "draggable-example";
    const { effectiveColumns } = useDataTableColumns<IPet>({
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
                accessor: "name",
                title: "Name",
                draggable: true,
                width: "100%",
                resizable: true,
            },
            {
                accessor: "owner",
                title: "owner",
                draggable: true,
                width: "100%",
                resizable: true,
            },
            {
                accessor: "breed",
                title: "Breed",
                resizable: true,

                draggable: true,
            },

            {
                accessor: "nickname",
                title: "Nickname",
                resizable: true,
                draggable: true,
                width: "100%",
            },
            { accessor: "age", title: "Age", draggable: true },
            {
                accessor: "actions",
                title: <Box mr={6}>Row actions</Box>,
                textAlign: "right",
                width: "0%",
                sortable: false,

                render: (company) => (
                    <Group gap={4} justify="right" wrap="nowrap">
                        <ActionIcon size="sm" variant="subtle" color="green">
                            <IconEye size={16} />
                        </ActionIcon>
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
            withRowBorders
            striped
            pinLastColumn
            highlightOnHover
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
                content: ({ record }) => (
                    <Stack p="xs" gap={6}>
                        <Group gap={6}>
                            <Image
                                alt="dog"
                                src={"https://place.dog/300/200"}
                                height={500}
                                quality={100}
                                priority
                                width={500}
                            />
                            <div className="text-lg">
                                <h1>Next Appointment: No record</h1>
                                <h1>Grooming: 4</h1>
                                <h1>Check up: 4</h1>
                                <h1>Neuter: True</h1>
                            </div>
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
    );
}
