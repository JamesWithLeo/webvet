"use client";

import {
    DataTable,
    DataTableColumn,
    useDataTableColumns,
} from "mantine-datatable";
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
    NativeSelect,
    TextInput,
} from "@mantine/core";
import {
    IconDog,
    IconDots,
    IconDotsVertical,
    IconEdit,
    IconSearch,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import { useMemo } from "react";
import useUserAdmin from "@/lib/hooks/useUserAdmin";
import {
    AdminUserSummary,
    Role,
    UserGender,
    userGenderValue,
} from "@/types/user";
import { role } from "@/db/schema/users";

export default function AccountTable() {
    const {
        data,
        isLoading,
        searchFirstName,
        setSearchFirstName,
        setSearchLastName,
        searchLastName,
        searchRole,
        setSearchRole,
        searchGender,
        setSearchGender,
    } = useUserAdmin();

    const columns = useMemo<DataTableColumn<AdminUserSummary>[]>(
        () => [
            {
                accessor: "firstName",
                title: "First name",
                width: "20%",
                resizable: true,
                toggleable: true,
                draggable: true,
                filter: (
                    <TextInput
                        label="First Name"
                        description="Show account whose first names include the specified text"
                        placeholder="Search account..."
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            <ActionIcon
                                size="sm"
                                variant="transparent"
                                c="dimmed"
                                onClick={() => setSearchFirstName("")}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        }
                        onChange={(e) => {
                            setSearchFirstName(e.target.value);
                        }}
                    />
                ),
                filtering: Boolean(searchFirstName),
            },
            {
                accessor: "lastName",
                title: "Last name",
                width: "20%",
                resizable: true,
                toggleable: true,
                draggable: true,
                filter: (
                    <TextInput
                        label="Last Name"
                        description="Show account whose last names include the specified text"
                        placeholder="Search account..."
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            <ActionIcon
                                size="sm"
                                variant="transparent"
                                c="dimmed"
                                onClick={() => setSearchLastName("")}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        }
                        onChange={(e) =>
                            setSearchLastName(e.currentTarget.value)
                        }
                    />
                ),
                filtering: searchLastName !== "",
            },
            {
                accessor: "dateOfBirth",
                title: "Date of Birth",
                resizable: true,
                ellipsis: true,
                width: "8%",
                toggleable: true,
                draggable: true,
            },
            {
                accessor: "contactNumber",
                title: "Contact Number",
                resizable: true,
                ellipsis: true,
                width: "10%",
                toggleable: true,
                draggable: true,
            },
            {
                accessor: "email",
                title: "Email",
                resizable: true,
                ellipsis: true,
                width: "10%",
                toggleable: true,
                draggable: true,
            },
            {
                accessor: "gender",
                title: "Gender",
                textAlign: "center",
                width: "8%",
                resizable: true,
                toggleable: true,
                defaultToggle: true,
                filter: (
                    <NativeSelect
                        data={["all"].concat(userGenderValue)}
                        label="Gender"
                        description="Show account whose gender match the selected."
                        defaultValue={searchGender}
                        onChange={(e) => {
                            console.log(e.currentTarget.value);
                            setSearchGender(
                                e.currentTarget.value as "all" | UserGender
                            );
                        }}
                    />
                ),
            },
            {
                accessor: "role",
                title: "Role",
                textAlign: "center",
                filter: (
                    <NativeSelect
                        data={["all"].concat(role.enumValues)}
                        label="Roles"
                        description="Show account whose role match the selected."
                        defaultValue={searchRole}
                        onChange={(e) => {
                            setSearchRole(
                                e.currentTarget.value as "all" | Role
                            );
                        }}
                    />
                ),
                filtering: searchRole !== "all",
                width: "8%",
                resizable: true,
                toggleable: true,
            },
            {
                accessor: "id",
                title: "Actions",
                resizable: true,
                textAlign: "right",
                width: "8%",
                render: (data) => (
                    <Group justify="right">
                        <ActionIcon
                            variant="transparent"
                            size={"sm"}
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("Hello");
                            }}
                        >
                            <IconDots stroke={1.5} />
                        </ActionIcon>
                    </Group>
                ),
            },
        ],
        []
    );
    const key = `admin-user-table`;
    const {
        effectiveColumns,
        resetColumnsOrder,
        resetColumnsWidth,
        resetColumnsToggle,
    } = useDataTableColumns<AdminUserSummary>({
        key,
        columns: columns,
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
                pinLastColumn={true}
                highlightOnHover={true}
                verticalSpacing="xs"
                borderRadius="sm"
                records={data}
                totalRecords={1500}
                storeColumnsKey={key}
                fetching={isLoading}
                minHeight={250}
                page={1}
                recordsPerPage={10}
                onPageChange={() => {}}
                columns={effectiveColumns}
                // selectedRecords={selectedRecords}
                // onSelectedRecordsChange={SetSelectedRecords}
            />
        </Stack>
    );
}
