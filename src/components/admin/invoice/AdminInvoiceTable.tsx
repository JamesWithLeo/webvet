"use client";

import {
    paymentStatusTypeValues,
    paymentStatusType,
    invoiceStatus,
} from "@/db/schema/invoice";
import CurrencyFormatter from "@/lib/CurrencyFormatter";
import useInvoiceAdmin from "@/lib/hooks/useInvoiceAdmin";
import useInvoiceItemAdmin from "@/lib/hooks/useInvoiceItemAdmin";
import { toTitleCase } from "@/lib/toTitleCase";
import { InvoiceAdmin } from "@/types/invoice";
import {
    ActionIcon,
    Button,
    Group,
    Loader,
    NativeSelect,
    Stack,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { IconEye, IconPointerCode, IconX } from "@tabler/icons-react";
import {
    DataTable,
    DataTableColumn,
    useDataTableColumns,
} from "mantine-datatable";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { DownloadInvoiceButton } from "./DownloadInvoiceButtonAsync";
import CopyButton from "@/components/common/CopyButton";

export default function AdminInvoiceTable() {
    const router = useRouter();

    const {
        filteredData,
        isPending,
        setQueryId,
        queryId,
        status,
        setStatus,
        paymentStatus,
        setPaymentStatus,
        sortStatus,
        setSortStatus,
    } = useInvoiceAdmin();
    const columns = useMemo<DataTableColumn<InvoiceAdmin>[]>(
        () => [
            {
                accessor: "id",
                title: "ID",
                resizable: true,
                width: "8%",
                ellipsis: true,
                filter: (record) => (
                    <TextInput
                        label="Invoice Id"
                        onChange={(e) => setQueryId(e.currentTarget.value)}
                        rightSection={
                            <IconX size={18} onClick={() => setQueryId("")} />
                        }
                    />
                ),
                filtering: queryId !== "",
                render: (record) => (
                    <Group
                        className="group"
                        wrap="nowrap"
                        justify="space-between"
                    >
                        <Text truncate="end">{record.id}</Text>
                        <CopyButton value={record.id} />
                    </Group>
                ),
            },
            {
                accessor: "userId",
                title: "User",
                width: "8%",
                resizable: true,
                ellipsis: true,
                render: (record) => (
                    <Group
                        className="group"
                        wrap="nowrap"
                        justify="space-between"
                    >
                        <Text truncate="end">
                            {toTitleCase(
                                `${record.firstName} ${record.lastName}`
                            )}
                        </Text>
                        <CopyButton
                            value={record.userId}
                            copylabel="Copy UID"
                        />
                    </Group>
                ),
            },
            {
                accessor: "status",
                title: "Status",
                width: "10%",
                filter: () => (
                    <NativeSelect
                        label="Seach by invoice status"
                        data={["ALL", ...invoiceStatus.enumValues].map((v) => ({
                            label: v.toUpperCase(),
                            value: v,
                        }))}
                        defaultValue={status}
                        onChange={(e) =>
                            setStatus(
                                e.currentTarget.value as
                                    | (typeof invoiceStatus.enumValues)[number]
                                    | "ALL"
                            )
                        }
                    />
                ),
                filtering: status !== "ALL",
            },
            {
                accessor: "paymentStatus",
                title: "Payment Status",
                width: "8%",

                filter: () => (
                    <NativeSelect
                        label="Seach by payment Status"
                        data={["ALL", ...paymentStatusTypeValues].map((v) => ({
                            label: v.toUpperCase(),
                            value: v,
                        }))}
                        defaultValue={paymentStatus}
                        onChange={(e) =>
                            setPaymentStatus(
                                e.currentTarget.value as
                                    | (typeof paymentStatusType.enumValues)[number]
                                    | "ALL"
                            )
                        }
                    />
                ),
                filtering: paymentStatus !== "ALL",
            },
            {
                accessor: "totalAmount",
                width: "8%",
                title: "Total Amount",
                sortable: true,
                textAlign: "center",
                render: (record) => (
                    <Group justify="right">
                        <Text size="sm">
                            {CurrencyFormatter(record.totalAmount)}
                        </Text>
                    </Group>
                ),
            },
            {
                accessor: "amountRefunded",
                width: "8%",
                title: "Refunded ammount",
                sortable: true,
                textAlign: "center",
                render: (record) => (
                    <Group justify="right">
                        <Text size="sm">
                            {CurrencyFormatter(record.amountRefunded)}
                        </Text>
                    </Group>
                ),
            },
            {
                accessor: "netAmount",
                width: "8%",
                title: "Net Ammount",
                sortable: true,
                textAlign: "center",
                render: (record) => (
                    <Group justify="right">
                        <Text size="sm">
                            {CurrencyFormatter(record.netAmount)}
                        </Text>
                    </Group>
                ),
            },
            {
                accessor: "createdAt",
                title: "Created At",
                width: "8%",
                sortable: true,
                render: (record) => new Date(record.createdAt).toLocaleString(),
            },

            {
                accessor: "action",
                width: "4%",
                title: (
                    <Group justify="center" wrap="nowrap">
                        <IconPointerCode size={16} />
                    </Group>
                ),
                render: (record) => (
                    <Group justify="left" gap={"xs"} w={"100%"} wrap="nowrap">
                        {record.status === "COMPLETED" ||
                        record.status === "ARRIVED" ? (
                            <Tooltip
                                label="View invoice"
                                position="left"
                                withArrow
                                offset={-1}
                                arrowSize={10}
                            >
                                <ActionIcon
                                    size="input-xs"
                                    variant="default"
                                    radius={"md"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(
                                            `/v1/clinic/invoice/${record.id}`
                                        );
                                    }}
                                >
                                    <IconEye size={16} />
                                </ActionIcon>
                            </Tooltip>
                        ) : null}
                        {record.totalAmount &&
                            record.status === "COMPLETED" &&
                            (record.paymentStatus === "PAID" ||
                                record.paymentStatus === "REFUNDED") && (
                                <DownloadInvoiceButton invoiceId={record.id} />
                            )}
                    </Group>
                ),
            },
        ],
        [paymentStatus, queryId, status]
    );
    const key = `admin-invoice-table`;
    const {
        effectiveColumns,
        resetColumnsOrder,
        resetColumnsToggle,
        resetColumnsWidth,
    } = useDataTableColumns({
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
                minHeight={400}
                withTableBorder={true}
                withColumnBorders
                highlightOnHover={true}
                columns={effectiveColumns}
                records={filteredData}
                fetching={isPending}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                rowExpansion={{
                    allowMultiple: false,
                    content: ({ record }) => (
                        <AdminInvoiceItemTable id={record.id} />
                    ),
                }}
                borderRadius={"md"}
            />
        </Stack>
    );
}

const AdminInvoiceItemTable = ({ id }: { id: string }) => {
    const { data, isPending } = useInvoiceItemAdmin(id);
    return (
        <Stack p={"xs"} gap={6}>
            <Text fw={"bold"} size="sm">
                Pricing Breakdown
            </Text>
            {isPending && (
                <Group justify="center">
                    <Loader />
                </Group>
            )}

            {!isPending &&
                data &&
                data.map((item) => (
                    <Group key={item.id} gap={"xl"} ml={"xl"}>
                        <Stack gap={0} w={"400px"}>
                            <Text size="xs" c={"blue.5"}>
                                Pet name {item.petName}
                            </Text>
                            <Text>{toTitleCase(item.petName)}</Text>
                        </Stack>
                        <Stack gap={0} w={"400px"}>
                            <Text size="xs" c={"blue.5"}>
                                Service Id{" "}
                            </Text>
                            <Text>{item.serviceId}</Text>
                        </Stack>
                        <Stack gap={0}>
                            <Text size="xs" c={"blue.5"}>
                                Price{" "}
                            </Text>
                            <Text>
                                {CurrencyFormatter(item.priceAtInvoice)}
                            </Text>
                        </Stack>
                    </Group>
                ))}
        </Stack>
    );
};
