"use client";

import { modals } from "@mantine/modals";
import { ServicePriceTypeModel, ServiceTypeModel } from "@/db/schema/services";
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
    IconX,
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
import { DeleteVariant } from "@/actions/variant";
import ConfirmationModal from "../common/ConfirmationModal";
import { notifications } from "@mantine/notifications";
import EditServiceModal from "../services/EditServiceModal";
import { ServiceFormEditOuput } from "@/lib/validators/serviceZodSchema";
import EditVariantModal from "../services/EditVariantModal";
import { useQuery } from "@tanstack/react-query";
import { useDeleteService } from "@/lib/hooks/useService";

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

    const [selectedEditVariant, setSelectedEditVariant] =
        useState<ServicePriceTypeModel | null>(null);
    const [
        openedVariantEditModal,
        { open: openVariantEditModal, close: closeVariantEditModal },
    ] = useDisclosure(false);

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
                            accessor: "isAvailable",
                            title: "Available",
                            render: (rowData) =>
                                rowData.isAvailable ? (
                                    <IconCheck size={16} stroke={1.5} />
                                ) : (
                                    <IconX size={16} stroke={1.5} />
                                ),
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
                                            setSelectedEditVariant(rowData);
                                            openVariantEditModal();
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

            <EditVariantModal
                initialData={selectedEditVariant}
                close={closeVariantEditModal}
                opened={openedVariantEditModal}
            />
        </>
    );
}
const aboveSm = (theme: MantineTheme) => `(min-width: ${theme.breakpoints.sm})`;

export default function ServicesTable() {
    const { data } = useQuery({
        queryKey: ["services"],
        queryFn: async (): Promise<ServiceTypeModel[]> => {
            const res = await fetch("/api/service");
            return res.json();
        },
    });

    const { mutate: DeleteService, isPending: isPendingDelete } =
        useDeleteService();

    const [opened, { open, close }] = useDisclosure(false);

    const [
        openedVariantModal,
        { open: openVariantModal, close: closeVariantModal },
    ] = useDisclosure(false);

    const [
        openedEditService,
        { open: openEditService, close: closeEditService },
    ] = useDisclosure(false);

    const [selectedService, setSelectedService] = useState<string | null>(null);

    const [selectedEditService, setSelectedEditService] =
        useState<ServiceFormEditOuput | null>(null);

    const openDeleteModal = (id: string) =>
        modals.openConfirmModal({
            title: "Delete Service",
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this service? This action is
                    unreversable.
                </Text>
            ),
            labels: { confirm: "Delete service", cancel: "No don't delete it" },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Cancel"),
            onConfirm: () => {
                DeleteService(id);
            },
        });

    const columns = useMemo<DataTableColumn<ServiceTypeModel>[]>(
        () => [
            {
                accessor: "id",
                title: "id",
                draggable: true,
                width: "10%",
                visibleMediaQuery: aboveSm,
                resizable: true,
                render: (rowData) => (
                    <p className="line-clamp-2">{rowData.id}</p>
                ),
            },
            {
                accessor: "title",
                title: "title",
                draggable: true,
                ellipsis: true,
                width: "20%",
                resizable: true,
                render: (rowData) => (
                    <p className="line-clamp-2">{rowData.title}</p>
                ),
            },
            {
                accessor: "type",
                title: "type",
                draggable: true,
                ellipsis: true,
                width: "20%",
                resizable: true,
                render: (rowData) => (
                    <p className="line-clamp-2">{rowData.type}</p>
                ),
            },
            {
                accessor: "gapInDays",
                title: "Gap in days",
                draggable: true,
                visibleMediaQuery: aboveSm,
            },
            {
                accessor: "annualInterval",
                title: "Annual Interval",
                draggable: true,
                visibleMediaQuery: aboveSm,
            },
            {
                accessor: "description",
                title: "description",
                draggable: true,
                width: "10%",
                visibleMediaQuery: aboveSm,
                resizable: true,
                render: (rowData) => (
                    <p className="line-clamp-2">{rowData.description}</p>
                ),
            },
            {
                accessor: "reminder",
                title: "reminder",
                draggable: true,
                width: "10%",
                resizable: true,
                visibleMediaQuery: aboveSm,
                render: (rowData) => (
                    <p className="line-clamp-2">{rowData.reminder}</p>
                ),
            },
            {
                accessor: "inclusions",
                title: "inclusions",
                draggable: true,
                width: "10%",
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
                                setSelectedEditService({
                                    title: rowData.title,
                                    description: rowData.description,
                                    reminder: rowData.reminder,
                                    annualInterval: rowData.annualInterval,
                                    gapInDays: rowData.gapInDays,
                                    inclusions: rowData.inclusions,
                                    id: rowData.id,
                                });
                                openEditService();
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
                                openDeleteModal(rowData.id);
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
                    // minHeight={records.length > 0 ? 100 : 200}
                    scrollAreaProps={{ type: "never" }}
                    withColumnBorders
                    pinLastColumn
                    withTableBorder
                    verticalSpacing="xs"
                    borderRadius="sm"
                    withRowBorders
                    columns={effectiveColumns}
                    records={data}
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

            <EditServiceModal
                opened={openedEditService}
                close={closeEditService}
                initialData={selectedEditService}
            />
        </>
    );
}
