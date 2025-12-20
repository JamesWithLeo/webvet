"use client";

import {
    ActionIcon,
    Box,
    Button,
    Group,
    MultiSelect,
    Stack,
    TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import {
    IconCancel,
    IconCheck,
    IconEdit,
    IconPointer,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";

const records = [
    {
        id: 1,
        Firstname: "Ethan",
        Lastname: "Hayes",
        service: "CHECK_UP",
        ScheduledDate: "12/09/2025",
    },
    {
        id: 2,
        Firstname: "Olivia",
        Lastname: "Bennett",
        service: "CHECK_UP",
        ScheduledDate: "01/14/2026",
    },
    {
        id: 3,
        Firstname: "Liam",
        Lastname: "Russell",
        service: "CHECK_UP",
        ScheduledDate: "01/21/2026",
    },
    {
        id: 4,
        Firstname: "Ava",
        Lastname: "Chen",
        service: "CONSULTATION",
        ScheduledDate: "03/03/2026",
    },
    {
        id: 5,
        Firstname: "Noah",
        Lastname: "Rodriguez",
        service: "VACCINATION",
        ScheduledDate: "02/17/2026",
    },
    {
        id: 6,
        Firstname: "Isabella",
        Lastname: "Foster",
        service: "GROOMING",
        ScheduledDate: "02/16/2026",
    },
    {
        id: 7,
        Firstname: "Lucas",
        Lastname: "Morgan",
        service: "GROOMING",
        ScheduledDate: "12/20/2025",
    },
    {
        id: 8,
        Firstname: "Mia",
        Lastname: "Sullivan",
        service: "NEUTURING",
        ScheduledDate: "01/07/2026",
    },
    {
        id: 9,
        Firstname: "Alexander",
        Lastname: "Reed",
        service: "CHECK_UP",
        ScheduledDate: "02/15/2026",
    },
    {
        id: 10,
        Firstname: "Charlotte",
        Lastname: "Ward",
        service: "CONSULTATION",
        ScheduledDate: "01/29/2026",
    },
    {
        id: 11,
        Firstname: "William",
        Lastname: "Gray",
        service: "CHECK_UP",
        ScheduledDate: "02/14/2026",
    },
    {
        id: 12,
        Firstname: "Amelia",
        Lastname: "Stone",
        service: "VACCINATION",
        ScheduledDate: "12/20/2025",
    },
    {
        id: 13,
        Firstname: "James",
        Lastname: "Porter",
        service: "CHECK_UP",
        ScheduledDate: "01/10/2026",
    },
    {
        id: 14,
        Firstname: "Sophia",
        Lastname: "Brooks",
        service: "VACCINATION",
        ScheduledDate: "01/06/2026",
    },
    {
        id: 15,
        Firstname: "Benjamin",
        Lastname: "King",
        service: "VACCINATION",
        ScheduledDate: "12/07/2025",
    },
    {
        id: 16,
        Firstname: "Evelyn",
        Lastname: "Dixon",
        service: "VACCINATION",
        ScheduledDate: "12/19/2025",
    },
    {
        id: 17,
        Firstname: "Henry",
        Lastname: "Myers",
        service: "VACCINATION",
        ScheduledDate: "12/11/2025",
    },
    {
        id: 18,
        Firstname: "Abigail",
        Lastname: "Carter",
        service: "VACCINATION",
        ScheduledDate: "02/19/2026",
    },
    // {
    //     id: 19,
    //     Firstname: "Daniel",
    //     Lastname: "Nelson",
    //     service: "VACCINATION",
    //     ScheduledDate: "12/26/2025",
    // },
    // {
    //     id: 20,
    //     Firstname: "Emily",
    //     Lastname: "Fisher",
    //     service: "CONSULTATION",
    //     ScheduledDate: "02/25/2026",
    // },
];
export default function AdminAppointmentTable() {
    return (
        <Stack>
            <DataTable
                withTableBorder
                withRowBorders
                verticalSpacing="xs"
                borderRadius="sm"
                striped
                pinFirstColumn
                highlightOnHover={true}
                columns={[
                    {
                        accessor: "id",
                        title: "Action",
                        render: () => (
                            <Group gap={4} justify="left" wrap="nowrap">
                                <Button size="compact-xs">Approve</Button>
                                <Button size="compact-xs" color="red.5">
                                    cancel
                                </Button>
                                {/* <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="green"
                            >
                                <IconCheck size={16} />
                            </ActionIcon> */}
                                {/* <ActionIcon size="sm" variant="subtle" color="blue">
                                <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon size="sm" variant="subtle" color="red">
                                <IconCancel size={16} />
                            </ActionIcon> */}
                            </Group>
                        ),
                    },
                    {
                        accessor: "id",
                        title: "Id",
                        sortable: true,

                        filter: ({ close }) => (
                            <TextInput
                                label="Employees"
                                description="Show employees whose names include the specified text"
                                placeholder="Search employees..."
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
                        accessor: "service",
                        title: "Service",
                        // filtering: false,
                        filter: (
                            <MultiSelect
                                label="Departments"
                                description="Show all employees working at the selected departments"
                                data={[
                                    "CHECK_UP",
                                    "CONSULTATION",
                                    "GROOMING",
                                    "NEUTURING",
                                    "DE-WORMING",
                                ]}
                                placeholder="Search departments…"
                                leftSection={<IconSearch size={16} />}
                                comboboxProps={{ withinPortal: false }}
                                clearable
                                searchable
                            />
                        ),
                    },
                    {
                        accessor: "ScheduledDate",
                        title: "Scheduled Date",
                        sortable: true,
                        filter: ({ close }) => (
                            <Stack>
                                <DatePicker type="range" />
                                <Button variant="light">Clear</Button>
                            </Stack>
                        ),
                    },
                    {
                        accessor: "FirstName",
                        title: "Fullname",
                        render(record, index) {
                            return `${record.Firstname} ${record.Lastname}`;
                        },
                    },
                ]}
                // rowExpansion={{
                //     allowMultiple: false,
                //     content: () => (
                //         <Stack bg={"gray.1"} gap={6} m={0} p="xs">
                //             <h1>Hello</h1>
                //         </Stack>
                //     ),
                // }}
                records={records}
                totalRecords={1500}
                page={1}
                onPageChange={() => {}}
                recordsPerPage={10}
            />
            <Group justify="flex-end">
                <Button
                    size="xs"
                    // onClick={resetColumnsToggle}
                >
                    Reset Toggled Columns
                </Button>
                <Button
                    size="xs"
                    //  onClick={resetColumnsOrder}
                >
                    Reset Column Order
                </Button>
            </Group>
        </Stack>
    );
}
