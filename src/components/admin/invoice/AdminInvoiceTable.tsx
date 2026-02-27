"use client";

import { InvoiceTypeModel } from "@/db/schema/invoice";
import useInvoiceAdmin from "@/lib/hooks/useInvoiceAdmin";
import { Button, Group, Stack } from "@mantine/core";
import { IconPointerCode } from "@tabler/icons-react";
import {
    DataTable,
    DataTableColumn,
    useDataTableColumns,
} from "mantine-datatable";
import { useMemo } from "react";

export default function AdminInvoiceTable() {
    const { data, isPending } = useInvoiceAdmin();
    const columns = useMemo<DataTableColumn<InvoiceTypeModel>[]>(
        () => [
            { accessor: "id", title: "ID" },
            { accessor: "userId", title: "User ID" },
            { accessor: "status", title: "Payment Status" },
            { accessor: "totalAmount", title: "Total Amount" },
            {
                accessor: "createdAt",
                title: "Created At",
                render: (record) => new Date(record.createdAt).toLocaleString(),
            },

            {
                accessor: "action",
                title: (
                    <Group justify="center" wrap="nowrap">
                        <IconPointerCode size={16} />
                    </Group>
                ),
                render: (record) => (
                    <Group justify="center" w={"100%"}>
                        {record.status !== "PAID" ? (
                            <Button size="xs" variant="default">
                                Update Payment
                            </Button>
                        ) : (
                            <Button size="xs" variant="default">
                                Void Payment
                            </Button>
                        )}
                    </Group>
                ),
            },
        ],
        []
    );
    const key = `admin-invoice-table`;
    const { effectiveColumns } = useDataTableColumns({ key, columns: columns });
    return (
        <Stack>
            <DataTable
                minHeight={200}
                withTableBorder={false}
                striped
                columns={effectiveColumns}
                records={data}
                fetching={isPending}
            />
        </Stack>
    );
}
