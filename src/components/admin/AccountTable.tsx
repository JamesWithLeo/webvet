"use client";

import {
    DataTable,
    DataTableColumn,
    useDataTableColumns,
} from "mantine-datatable";
import {
    ActionIcon,
    Stack,
    Group,
    Button,
    NativeSelect,
    TextInput,
    Title,
    Text,
    Box,
    Paper,
    Menu,
    Drawer,
    Grid,
    Badge,
    Alert,
} from "@mantine/core";
import {
    IconDots,
    IconEdit,
    IconInfoCircle,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import useUserAdmin from "@/lib/hooks/useUserAdmin";
import {
    AdminUserSummary,
    Role,
    UserGender,
    userGenderValue,
} from "@/types/user";
import { role, userGender } from "@/db/schema/users";
import AdminAccountPetTable from "./AdminAccountTablePet";
import { DatePickerInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
    AccountUpdateFormInput,
    accountUpdateSchemaAdmin,
} from "@/lib/validators/usersZodSchema";
import { updateAccountAction } from "@/actions/accounts";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { toTitleCase } from "@/lib/toTitleCase";

export default function AccountTable() {
    const {
        records,
        isLoading,
        searchFirstName,
        setSearchFirstName,
        setSearchLastName,
        searchLastName,
        searchRole,
        setSearchRole,
        searchGender,
        setSearchGender,
        setSortStatus,
        sortStatus,
    } = useUserAdmin();
    const queryClient = useQueryClient();
    const [isPendingUpdate, startTransition] = useTransition();

    const [editingAccount, setEditingAccount] =
        useState<AdminUserSummary | null>(null);

    const form = useForm<AccountUpdateFormInput>({
        mode: "controlled",
        initialValues: {
            firstName: editingAccount?.firstName ?? "",
            lastName: editingAccount?.lastName ?? "",
            gender: editingAccount?.gender ?? "other",
            dateOfBirth: editingAccount?.dateOfBirth ?? "",
            contactNumber: editingAccount?.contactNumber ?? "",
            role: editingAccount?.role ?? "client",
        },
        validate: zod4Resolver(accountUpdateSchemaAdmin),
        // validateInputOnBlur: true,
        // validateInputOnChange: true,
    });

    const columns = useMemo<DataTableColumn<AdminUserSummary>[]>(
        () => [
            {
                accessor: "firstName",
                title: "First name",
                width: "10%",
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
                width: "10%",
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
                sortable: true,
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
                filtering: searchGender !== "all",
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
                render: (record) => (
                    <Text className=" select-none" size="sm">
                        {record.role}
                    </Text>
                ),
            },
            {
                accessor: "id",
                title: "Actions",
                resizable: true,
                textAlign: "right",
                width: "5%",
                render: (data) => (
                    <Group justify="center">
                        <Menu
                            width={200}
                            position="left"
                            withArrow
                            shadow="xl"
                            radius={"md"}
                        >
                            <Menu.Target>
                                <ActionIcon
                                    variant="transparent"
                                    size={"sm"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <IconDots stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    rightSection={
                                        <IconEdit size={16} color="gray" />
                                    }
                                    onClick={() => {
                                        // openDrawer();
                                        setEditingAccount(data);
                                    }}
                                >
                                    Edit account
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                ),
            },
        ],
        [searchFirstName, searchGender, searchLastName, searchRole, sortStatus]
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

    const handleSave = () => {
        const dirtyFields = (
            Object.keys(form.values) as Array<keyof typeof form.values>
        ).filter((key) => form.isDirty(key));
        modals.openConfirmModal({
            withCloseButton: false,
            centered: true,
            radius: "md",
            size: "lg",
            confirmProps: {
                color: "red",
                radius: "md",
                loading: isPendingUpdate,
            },
            cancelProps: { radius: "md" },
            labels: { confirm: "Save changes", cancel: "Discard changes" },
            onCancel: () => {
                setEditingAccount(null);
            },
            onConfirm: () => {
                form.validate();
                const currentValues = form.getValues();

                const dirtyKeys = (
                    Object.keys(currentValues) as Array<
                        keyof typeof currentValues
                    >
                ).filter((key) => form.isDirty(key));

                const payload = dirtyKeys.reduce((acc, key) => {
                    (acc as any)[key] = currentValues[key];
                    return acc;
                }, {} as Partial<AccountUpdateFormInput>);

                if (!editingAccount?.id) {
                    form.reset(); // Clears dirty state
                    setEditingAccount(null); // Closes the Drawer
                    modals.closeAll(); // Closes the Confirmation Modal
                    return;
                }
                startTransition(async () => {
                    const result = await updateAccountAction({
                        userId: editingAccount?.id,
                        rawData: payload,
                    });
                    if (result.success) {
                        notifications.show({
                            title: "Account Updated",
                            message: "Changes have been saved successfully.",
                            color: "teal",
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["user", "admin"],
                        });

                        form.reset();
                        setEditingAccount(null);
                        modals.closeAll();
                    } else {
                        notifications.show({
                            title: "Update Failed",
                            message:
                                result.message ||
                                "An unexpected error occurred.",
                            color: "red",
                        });
                    }
                });
            },
            children: (
                <Stack gap="sm">
                    <Stack gap={0}>
                        <Text size="sm" c="dimmed">
                            You are about to update the details for{" "}
                            <b>{editingAccount?.email}</b>.
                        </Text>
                        <Text size="sm" c="dimmed">
                            Please review the changes below:
                        </Text>
                    </Stack>

                    <Paper
                        withBorder
                        p="xs"
                        radius="sm"
                        bg="var(--mantine-color-gray-0)"
                    >
                        <Grid gutter="xs">
                            {dirtyFields.map((field) => {
                                // TypeScript now knows 'field' is a valid key, so these lookups work:
                                const oldValue = form.getInitialValues()[field];
                                const newValue = form.values[field];

                                return (
                                    <React.Fragment key={field}>
                                        <Grid.Col span={5}>
                                            <Text fw={600} size="sm">
                                                {field.replace(
                                                    /([A-Z])/g,
                                                    " $1"
                                                )}
                                                :
                                            </Text>
                                        </Grid.Col>
                                        <Grid.Col span={7}>
                                            <Group gap={4} wrap="nowrap">
                                                <Text
                                                    size="sm"
                                                    c="dimmed"
                                                    td="line-through"
                                                >
                                                    {String(oldValue)}
                                                </Text>
                                                <Text
                                                    size="sm"
                                                    fw={700}
                                                    c="blue"
                                                >
                                                    → {String(newValue)}
                                                </Text>
                                            </Group>
                                        </Grid.Col>
                                    </React.Fragment>
                                );
                            })}
                        </Grid>
                    </Paper>

                    <Alert
                        color="red"
                        variant="light"
                        icon={<IconInfoCircle />}
                        py="xs"
                    >
                        This action will take effect immediately and cannot be
                        revertable.
                    </Alert>
                </Stack>
            ),
        });
    };
    useEffect(() => {
        if (editingAccount) {
            form.setValues({
                firstName: editingAccount.firstName ?? "",
                lastName: editingAccount.lastName ?? "",
                gender: editingAccount.gender ?? "other",
                dateOfBirth: editingAccount.dateOfBirth ?? "",
                contactNumber: editingAccount.contactNumber ?? "",
                role: editingAccount.role ?? "client",
            });
            form.resetDirty();
        }
    }, [editingAccount]);

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
                withTableBorder={true}
                withColumnBorders
                withRowBorders
                // striped
                pinLastColumn={true}
                highlightOnHover={true}
                verticalSpacing="xs"
                borderRadius="md"
                records={records}
                totalRecords={1500}
                storeColumnsKey={key}
                fetching={isLoading}
                minHeight={250}
                page={1}
                recordsPerPage={10}
                onPageChange={() => {}}
                columns={effectiveColumns}
                rowExpansion={{
                    allowMultiple: false,
                    content: ({ record }) => (
                        <AdminAccountPetTable ownerId={record.id} />
                    ),
                }}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
            />
            <Drawer
                opened={Boolean(editingAccount)}
                onClose={() => {
                    setEditingAccount(null);
                }}
                title={toTitleCase(
                    `${editingAccount?.firstName} ${editingAccount?.lastName}`
                )}
                position="right"
                radius={"md"}
                offset={"8"}
            >
                <Stack>
                    <Group>
                        <TextInput
                            label="Id"
                            flex={1}
                            readOnly
                            defaultValue={editingAccount?.id}
                        />
                    </Group>
                    <Group>
                        <TextInput
                            label="Email"
                            flex={1}
                            readOnly
                            defaultValue={editingAccount?.email ?? undefined}
                        />
                    </Group>
                    <Group>
                        <TextInput
                            label="First name"
                            {...form.getInputProps("firstName")}
                        />
                        <TextInput
                            label="Last name"
                            {...form.getInputProps("lastName")}
                        />
                    </Group>
                    <Group>
                        <DatePickerInput
                            label="Date of birth"
                            flex={1}
                            {...form.getInputProps("dateOfBirth")}
                        />
                    </Group>
                    <Group>
                        <NativeSelect
                            label="Gender"
                            flex={1}
                            data={userGender.enumValues}
                            {...form.getInputProps("gender")}
                        />
                    </Group>
                    <Group>
                        <NativeSelect
                            label="Role"
                            flex={1}
                            data={role.enumValues}
                            {...form.getInputProps("role")}
                        />
                    </Group>
                    <Group justify="end">
                        <Button
                            variant="default"
                            radius={"md"}
                            onClick={() => setEditingAccount(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            radius={"md"}
                            onClick={handleSave}
                            disabled={!form.isDirty() || !form.isValid()}
                            loading={isPendingUpdate}
                        >
                            Save
                        </Button>
                    </Group>
                </Stack>
            </Drawer>
        </Stack>
    );
}
