"use client";

import { ServiceTypeModel } from "@/db/schema/services";
import {
    ActionIcon,
    Group,
    MantineTheme,
    Stack,
    Text,
    ThemeIcon,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconDatabaseOff,
    IconEdit,
    IconPlus,
    IconRefresh,
    IconTrash,
} from "@tabler/icons-react";
import { DataTable, useDataTableColumns } from "mantine-datatable";
import AddServiceModal from "../services/AddServiceModal";
import useServiceVariant from "@/lib/hooks/useServiceVariant";
import { useState, useTransition } from "react";
import AddVariantModal from "../services/AddVariantModal";
import { DeleteVariant } from "@/actions/deleteVariant";

type Props = {
    records: ServiceTypeModel[];
};

function VariantTable({
    serviceId,
    openModal,
}: {
    serviceId: string;
    openModal: () => void;
}) {
    const { isPending, variants } = useServiceVariant({ id: serviceId });

    return (
        <div className="ml-16 w-auto">
            <DataTable
                withColumnBorders
                withTableBorder
                withRowBorders
                pinLastColumn
                columns={[
                    {
                        accessor: "id",
                        title: "id",
                        noWrap: false,
                        visibleMediaQuery: aboveSm,
                        render: (rowData) => (
                            <p className="line-clamp-2">{rowData.id}</p>
                        ),
                    },
                    {
                        accessor: "variant",
                        title: "variant",
                    },
                    {
                        accessor: "price",
                        title: "price",
                    },
                    {
                        accessor: "action",
                        title: "actions",
                        width: "100%",
                        render: (rowData) => (
                            <Group wrap="nowrap" gap={"xs"}>
                                <Tooltip
                                    label="Edit Variant"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // todo
                                    }}
                                >
                                    <ActionIcon
                                        variant="transparent"
                                        size={"sm"}
                                    >
                                        <IconEdit size={16} stroke={1.5} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip
                                    label="Delete Variant"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        DeleteVariant(rowData.id);
                                    }}
                                >
                                    <ActionIcon
                                        variant="transparent"
                                        size={"sm"}
                                        c={"red"}
                                    >
                                        <IconTrash size={16} stroke={1.5} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        ),
                    },
                ]}
                records={variants}
                fetching={isPending}
                minHeight={150}
                loaderBackgroundBlur={1}
                // minHeight={variants.length > 0 ? "1rem" : 150}
                emptyState={
                    <Stack align="center" gap="xs">
                        <ThemeIcon radius={"xl"} size={"xl"} bg={"gray"}>
                            <IconDatabaseOff />
                        </ThemeIcon>
                        <Text c="dimmed" size="sm">
                            No variants available for this service
                        </Text>
                    </Stack>
                }
            />
        </div>
    );
}
const aboveSm = (theme: MantineTheme) => `(min-width: ${theme.breakpoints.sm})`;

export default function ServicesTable({ records }: Props) {
    const [opened, { open, close }] = useDisclosure(false);
    const [
        openedVariantModal,
        { open: openVariantModal, close: closeVariantModal },
    ] = useDisclosure(false);

    const [selectedService, setSelectedService] = useState<string>("");

    const key = "draggable-example";
    const { effectiveColumns } = useDataTableColumns<ServiceTypeModel>({
        key,
        columns: [
            {
                accessor: "id",
                title: "id",
                noWrap: false,
                draggable: true,
                visibleMediaQuery: aboveSm,
                render: (rowData) => (
                    <p className="line-clamp-2">{rowData.id}</p>
                ),
            },
            {
                accessor: "title",
                title: "title",
                draggable: true,
                width: 10,
            },
            {
                accessor: "type",
                title: "type",
                draggable: true,
                width: 10,
            },
            {
                accessor: "description",
                title: "description",
                draggable: true,
                width: 10,
                visibleMediaQuery: aboveSm,
                render: (rowData) => (
                    <p className="line-clamp-2">{rowData.description}</p>
                ),
            },
            {
                accessor: "reminder",
                title: "reminder",
                draggable: true,
                visibleMediaQuery: aboveSm,
                render: (rowData) => (
                    <p className="line-clamp-2">{rowData.reminder}</p>
                ),
            },
            {
                accessor: "inclusions",
                title: "inclusions",
                draggable: true,
                visibleMediaQuery: aboveSm,
                render: (rowData) => (
                    <p className="line-clamp-2">{rowData.inclusions}</p>
                ),
            },
            {
                // draggable: true,
                accessor: "actions",
                title: "Actions",
                textAlign: "right",
                render: (service) => (
                    <Group wrap="nowrap" gap={"xs"}>
                        <Tooltip
                            label="Add variant"
                            onClick={(e) => {
                                e.stopPropagation();
                                openVariantModal();
                                setSelectedService(service.id);
                            }}
                        >
                            <ActionIcon
                                variant="transparent"
                                size={"sm"}
                                c={"green"}
                            >
                                <IconPlus size={16} stroke={1.5} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip
                            label="Edit service"
                            onClick={(e) => {
                                e.stopPropagation();
                                // todo
                            }}
                        >
                            <ActionIcon variant="transparent" size={"sm"}>
                                <IconEdit size={16} stroke={1.5} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip
                            label="Delete service"
                            onClick={(e) => {
                                e.stopPropagation();
                                // todo
                            }}
                        >
                            <ActionIcon
                                variant="transparent"
                                size={"sm"}
                                c={"red"}
                            >
                                <IconTrash size={16} stroke={1.5} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                ),
            },
        ],
    });
    return (
        <>
            <Stack>
                <Group justify="end">
                    <ActionIcon
                        size={"input-sm"}
                        onClick={() => {
                            window.location.reload();
                        }}
                        variant="default"
                    >
                        <IconRefresh stroke={1.5} size={16} />
                    </ActionIcon>
                    <ActionIcon
                        size={"input-sm"}
                        variant="default"
                        onClick={open}
                    >
                        <IconPlus stroke={1.5} size={16} />
                    </ActionIcon>
                </Group>
                <DataTable
                    minHeight={records.length > 0 ? 100 : 200}
                    scrollAreaProps={{ type: "never" }}
                    withColumnBorders
                    pinLastColumn
                    withTableBorder
                    verticalSpacing="xs"
                    borderRadius="sm"
                    withRowBorders
                    columns={effectiveColumns}
                    records={records}
                    totalRecords={1500}
                    storeColumnsKey={key}
                    page={1}
                    recordsPerPage={10}
                    onPageChange={() => {}}
                    rowExpansion={{
                        content: ({ record }) => (
                            <VariantTable
                                serviceId={record.id}
                                openModal={() => {
                                    openVariantModal();
                                    setSelectedService(record.id);
                                }}
                            />
                        ),
                    }}
                />
            </Stack>
            <AddServiceModal opened={opened} close={close} />
            <AddVariantModal
                opened={openedVariantModal}
                close={closeVariantModal}
                serviceId={selectedService}
            />
        </>
    );
}
