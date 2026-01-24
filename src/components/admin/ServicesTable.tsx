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
    IconCheck,
    IconDatabaseOff,
    IconEdit,
    IconPlus,
    IconRefresh,
    IconTrash,
} from "@tabler/icons-react";
import {
    DataTable,
    DataTableColumn,
    useDataTableColumns,
} from "mantine-datatable";
import AddServiceModal from "../services/AddServiceModal";
import useServiceVariant from "@/lib/hooks/useServiceVariant";
import { useMemo, useState, useTransition } from "react";
import AddVariantModal from "../services/AddVariantModal";
import { DeleteVariant } from "@/actions/deleteVariant";
import { DeleteService } from "@/actions/deleteService";
import ConfirmationModal from "../common/ConfirmationModal";
import { notifications } from "@mantine/notifications";

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
    const [selectedVariantId, setSelectedVariantId] = useState<string>("");
    const [
        openedVariantDeleteModal,
        { open: openVariantDeleteModal, close: closeVariantDeleteModal },
    ] = useDisclosure(false);

    const [isPendingDeleteVariant, startDeleteVariantTransition] =
        useTransition();

    const handleDeleteVariant = () => {
        startDeleteVariantTransition(async () => {
            const result = await DeleteVariant(selectedVariantId);
            setSelectedVariantId("");
            if (result.succesful && result.data) {
                notifications.show({
                    title: "Variant deleted!",
                    message: `The variant with ${result.data?.id} ID is now deleted.`,
                    color: "teal",
                    icon: <IconCheck size={20} />,
                });
                closeVariantDeleteModal();
            }
        });
    };
    return (
        <>
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
                                            setSelectedVariantId(rowData.id);
                                            openVariantDeleteModal();
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
            <ConfirmationModal
                title="Delete variant"
                message="Are you sure to delete the selected variant?"
                isPending={isPendingDeleteVariant}
                opened={openedVariantDeleteModal}
                close={closeVariantDeleteModal}
                onConfirm={handleDeleteVariant}
            />
        </>
    );
}
const aboveSm = (theme: MantineTheme) => `(min-width: ${theme.breakpoints.sm})`;

export default function ServicesTable({ records }: Props) {
    const [opened, { open, close }] = useDisclosure(false);
    const [
        openedVariantModal,
        { open: openVariantModal, close: closeVariantModal },
    ] = useDisclosure(false);

    const [
        openedDeleteService,
        { open: openDeleteService, close: closeDeleteService },
    ] = useDisclosure(false);

    const [isPendingDelete, startDeleteTransition] = useTransition();

    const [selectedService, setSelectedService] = useState<string>("");

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const result = await DeleteService(selectedService);
            if (result.succesful && result.data) {
                closeDeleteService();
                notifications.show({
                    title: "Service deleted!",
                    message: `The service with ${result.data.id} ID is now deleted.`,
                    color: "teal",
                    icon: <IconCheck size={20} />,
                });
            }

            if (!result.succesful) {
                notifications.show({
                    title: "Service failed to deleted!",
                    message: result.error,
                    color: "teal",
                    icon: <IconCheck size={20} />,
                });
            }
        });
    };

    const columns = useMemo<DataTableColumn<ServiceTypeModel>[]>(
        () => [
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
                render: (rowData) => (
                    <Group wrap="nowrap" gap={"xs"}>
                        <Tooltip
                            label="Add variant"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedService(rowData.id);
                                openVariantModal();
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
                                setSelectedService(rowData.id);
                                openDeleteService();
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
        []
    );
    const key = "draggable-example";
    const { effectiveColumns } = useDataTableColumns<ServiceTypeModel>({
        key,
        columns: columns,
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
            <ConfirmationModal
                isPending={isPendingDelete}
                onConfirm={handleDelete}
                title="Delete service"
                message="Are you sure to delete the selected service?"
                opened={openedDeleteService}
                close={closeDeleteService}
            />
            <AddVariantModal
                opened={openedVariantModal}
                close={closeVariantModal}
                serviceId={selectedService}
            />
        </>
    );
}
