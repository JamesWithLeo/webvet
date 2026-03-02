"use client";

import { MarkAsPaidInvoiceAdmin } from "@/actions/invoice";
import {
    InvoiceTypeModel,
    paymentStatusTypeValues,
    paymentStatusType,
} from "@/db/schema/invoice";
import CurrencyFormatter from "@/lib/CurrencyFormatter";
import useInvoiceAdmin from "@/lib/hooks/useInvoiceAdmin";
import useInvoiceItemAdmin from "@/lib/hooks/useInvoiceItemAdmin";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    Button,
    Divider,
    Group,
    Loader,
    Modal,
    NativeSelect,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPointerCode, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import {
    DataTable,
    DataTableColumn,
    useDataTableColumns,
} from "mantine-datatable";
import { useRouter } from "next/navigation";
import {
    startTransition,
    useActionState,
    useEffect,
    useMemo,
    useState,
} from "react";

type FilterStatus = "all" | (typeof paymentStatusType.enumValues)[number];

export default function AdminInvoiceTable() {
    const [
        openedUpdatePayment,
        { open: openUpdatePayment, close: closeUpdatePayment },
    ] = useDisclosure();
    const router = useRouter();

    const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const markAsPaid = MarkAsPaidInvoiceAdmin.bind(null);
    const [formState, formAction, isMarkingAsPaid] = useActionState(
        markAsPaid,
        { success: false, id: null, error: "", status: null }
    );

    const handleMarkAsPaid = () => {
        startTransition(() => {
            formAction(selectedInvoice);
        });
    };

    const {
        data,
        isPending,
        setQueryId,
        queryId,
        paymentStatus,
        setPaymentStatus,
    } = useInvoiceAdmin();
    const columns = useMemo<DataTableColumn<InvoiceTypeModel>[]>(
        () => [
            {
                accessor: "id",
                title: "ID",
                width: "10%",
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
            },
            {
                accessor: "userId",
                title: "User ID",
                width: "10%",
                ellipsis: true,
            },
            {
                accessor: "status",
                title: "Status",
                width: "10%",
            },
            {
                accessor: "paymentStatus",
                title: "Payment Status",
                width: "10%",
                filter: () => (
                    <NativeSelect
                        label="Seach by payment Status"
                        data={["all", ...paymentStatusTypeValues].map((v) => ({
                            label: toTitleCase(v),
                            value: v,
                        }))}
                        defaultValue={paymentStatus}
                        onChange={(e) =>
                            setPaymentStatus(
                                e.currentTarget.value as FilterStatus
                            )
                        }
                    />
                ),
                filtering: paymentStatus !== "all",
            },
            {
                accessor: "totalAmount",
                width: "10%",
                title: "Total Amount",
                textAlign: "center",
                render: (record) => (
                    <Group justify="right">
                        <Text>{CurrencyFormatter(record.totalAmount)}</Text>
                    </Group>
                ),
            },
            {
                accessor: "createdAt",
                title: "Created At",
                width: "10%",
                render: (record) => new Date(record.createdAt).toLocaleString(),
            },

            {
                accessor: "action",
                width: "10%",
                title: (
                    <Group justify="center" wrap="nowrap">
                        <IconPointerCode size={16} />
                    </Group>
                ),
                render: (record) => (
                    <Group justify="center" w={"100%"}>
                        {record.paymentStatus !== "PAID" && (
                            <Button
                                size="xs"
                                variant="default"
                                radius={"md"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInvoice(record.id);
                                    openUpdatePayment();
                                }}
                            >
                                Update Payment
                            </Button>
                        )}
                        {record.paymentStatus === "PAID" && (
                            <>
                                <Button
                                    size="xs"
                                    variant="default"
                                    radius={"md"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(
                                            `/v1/admin/invoice/${record.id}`
                                        );
                                    }}
                                >
                                    View Invoice
                                </Button>
                            </>
                        )}
                    </Group>
                ),
            },
        ],
        []
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

    useEffect(() => {
        if (formState.success && formState.id && formState.status) {
            setSelectedInvoice(null);
            closeUpdatePayment();

            queryClient.invalidateQueries({ queryKey: ["invoices", "admin"] });
            notifications.show({
                title: "Invoice payment status updated",
                message: `Invoice Id: ${formState.id} is now ${formState.status?.toLowerCase()}.`,
                color: "teal",
                autoClose: 6000,
                icon: <IconCheck size={18} />,
            });
        }

        if (formState.error) {
            notifications.show({
                title: "Invoice payment status update failed",
                message: `${formState.error}`,
                color: "red",
                autoClose: false,
                icon: <IconX size={18} />,
            });
        }
    }, [formState]);
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
                withTableBorder={false}
                withColumnBorders
                striped
                columns={effectiveColumns}
                records={data}
                fetching={isPending}
                rowExpansion={{
                    allowMultiple: false,
                    content: ({ record }) => (
                        <AdminInvoiceItemTable id={record.id} />
                    ),
                }}
                borderRadius={"md"}
            />

            <Modal
                centered
                withCloseButton
                opened={openedUpdatePayment}
                onClose={closeUpdatePayment}
                title="Update Settled Payment"
                radius={"lg"}
            >
                <Stack gap="md">
                    <Text size="sm">
                        Update the status for this transaction. This will update
                        the invoice balance accordingly.
                    </Text>

                    <Group grow>
                        <Button
                            color="red"
                            onClick={() => handleMarkAsPaid()}
                            loading={isMarkingAsPaid}
                            disabled={isMarkingAsPaid || formState.success}
                        >
                            Mark as Paid
                        </Button>

                        <Button
                            color="red"
                            variant="outline"
                            onClick={() => {
                                setSelectedInvoice(null);
                                closeUpdatePayment();
                            }}
                        >
                            Cancel Payment
                        </Button>
                    </Group>

                    {/* <Divider
                        label="Additional Actions"
                        labelPosition="center"
                    />

                    <Button
                        variant="subtle"
                        color="gray"
                        // onClick={() => handleAdjustAmount(paymentId)}
                    >
                        Edit Amount
                    </Button> */}
                </Stack>
            </Modal>
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
                                Pet Id{" "}
                            </Text>
                            <Text>{item.petId}</Text>
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
