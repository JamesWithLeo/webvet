"use client";

import { AdminAppointment } from "@/db/schema/appointments";
import useAppointmentAdmin from "@/lib/hooks/useAppointmentAdmin";
import useAppointmentToPetsAdmin from "@/lib/hooks/useAppointmnetToPetsAdmin";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    ActionIcon,
    Avatar,
    Button,
    Group,
    Loader,
    LoadingOverlay,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { IconInvoice, IconSearch, IconX } from "@tabler/icons-react";
import { formatDistance, subDays } from "date-fns";
import {
    DataTable,
    DataTableColumn,
    useDataTableColumns,
} from "mantine-datatable";
import { useMemo } from "react";

export default function AdminAppointmentTable({
    scope,
}: {
    scope: "all" | "incoming" | "past";
}) {
    const {
        data,
        isLoading,
        setSortStatus,
        sortStatus,
        searchName,
        setSearchName,
    } = useAppointmentAdmin(scope);

    const columns = useMemo<DataTableColumn<AdminAppointment>[]>(
        () => [
            {
                accessor: "firstName", // Use dot notation for nested fields
                title: "Full name",

                render: (
                    { user } // Destructure user from the record
                ) => (
                    <Text>
                        {toTitleCase(user.firstName)}{" "}
                        {toTitleCase(user.lastName)}
                    </Text>
                ),
                filter: (
                    <TextInput
                        label="Clients"
                        description="Show client whose names include the specified text"
                        placeholder="Search client..."
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            <ActionIcon
                                size="sm"
                                variant="transparent"
                                c="dimmed"
                                onClick={() => setSearchName("")}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        }
                        defaultValue={searchName}
                        onChange={(e) => {
                            setSearchName(e.currentTarget.value);
                        }}
                    />
                ),
                filtering: searchName !== "",
            },
            { accessor: "title", title: "Title / Reason" },
            {
                accessor: "contactNumber",
                title: "contact no.",
                resizable: true,
                render: ({ user }) => (
                    <Text>{toTitleCase(user.contactNumber)}</Text>
                ),
            },
            {
                accessor: "event_datetime",
                title: "Event Date time",
                resizable: true,
                sortable: true,
                render: (data) => (
                    <Text>
                        {new Date(data.event_datetime).toLocaleString()}
                        {" -> "}
                        {formatDistance(
                            new Date(),
                            new Date(data.event_datetime)
                        )}
                    </Text>
                ),
            },
            {
                accessor: "created_at",
                title: "createdAt",
                resizable: true,
                sortable: true,
                render: (data) => (
                    <Text>
                        {new Date(data.created_at).toLocaleString()}
                        {" -> "}
                        {formatDistance(
                            subDays(new Date(), 0),
                            new Date(data.created_at),
                            { addSuffix: true }
                        )}
                    </Text>
                ),
            },
            {
                accessor: "user.id",
                title: "Action",
                textAlign: "right",
                render: (data) => (
                    <Group justify="right">
                        <Button size="xs" variant="default">
                            Invoice
                        </Button>
                    </Group>
                ),
            },
        ],
        []
    );

    const key = `admin-appointment-table-${scope}`;
    const { effectiveColumns } = useDataTableColumns<AdminAppointment>({
        key,
        columns: columns,
    });

    return (
        <Stack>
            <DataTable
                key={`${scope}-appointment-table`}
                idAccessor={"id"}
                withTableBorder={false}
                withColumnBorders={true}
                withRowBorders
                verticalSpacing={"xs"}
                horizontalSpacing={"xs"}
                borderRadius="xl"
                striped
                pinFirstColumn
                highlightOnHover={true}
                fetching={isLoading}
                minHeight={250}
                columns={effectiveColumns}
                pinLastColumn={true}
                rowExpansion={{
                    allowMultiple: true,
                    content: ({ record, index, collapse }) => (
                        <AppointmentToPetsTable id={record.id} />
                    ),
                }}
                records={data}
                totalRecords={data && data.length ? data.length : 0}
                page={1}
                onPageChange={() => {}}
                recordsPerPage={10}
                onSortStatusChange={setSortStatus}
                sortStatus={sortStatus}
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

const AppointmentToPetsTable = ({ id }: { id: string }) => {
    const { data } = useAppointmentToPetsAdmin(id);
    return (
        <Stack p={"md"}>
            {data && data.pets ? (
                data.pets.map((pet) => (
                    <Group key={`${id}-${pet.id}`} gap={"md"}>
                        <Avatar src={pet.photoUrl}>{pet.name[0]}</Avatar>
                        <Stack gap={0}>
                            <Text>{toTitleCase(pet.name)}</Text>
                            <Text size="xs" c={"dimmed"}>
                                {pet.id}
                            </Text>
                        </Stack>
                        <Stack gap={0}>
                            <Text size="xs" c={"blue.5"}>
                                Service
                            </Text>
                            <Text size="sm">{pet.serviceName}</Text>
                        </Stack>
                    </Group>
                ))
            ) : (
                <Loader />
            )}
        </Stack>
    );
};
