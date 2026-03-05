"use client";

import { invoiceStatus, paymentStatusType } from "@/db/schema/invoice";
import { InvoiceAdmin } from "@/types/invoice";
import { useQuery } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import { useMemo, useState } from "react";

export default function useInvoiceAdmin() {
    const [queryId, setQueryId] = useState<string>("");
    const [paymentStatus, setPaymentStatus] = useState<
        (typeof paymentStatusType.enumValues)[number] | "ALL"
    >("ALL");
    const [status, setStatus] = useState<
        (typeof invoiceStatus.enumValues)[number] | "ALL"
    >("ALL");

    const [sortStatus, setSortStatus] = useState<
        DataTableSortStatus<InvoiceAdmin>
    >({
        columnAccessor: "createdAt",
        direction: "desc",
    });
    const query = useQuery({
        queryKey: ["invoices", "admin"],

        queryFn: async () => {
            const res = await fetch("/api/admin/invoices", { method: "GET" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch invoices");
            }

            const data = await res.json();
            return data as InvoiceAdmin[];
        },
        staleTime: 1000 * 60 * 5,
    });
    const filteredData = useMemo(() => {
        if (!query.data) return [];

        const lowerQueryId = queryId.toLowerCase();
        const filtered = query.data.filter((inv) => {
            const matchQueryId =
                !queryId || inv.id.toLowerCase().includes(lowerQueryId);

            const matchesPaymentStatus =
                status === "ALL" ||
                inv.status?.toLowerCase() === status.toLowerCase();

            const matchesStatus =
                paymentStatus === "ALL" ||
                inv.paymentStatus?.toLowerCase() ===
                    paymentStatus.toLowerCase();
            return matchQueryId && matchesStatus && matchesPaymentStatus;
        });
        const sorted = sortBy(filtered, (item) => {
            const value = item[sortStatus.columnAccessor as keyof InvoiceAdmin];

            if (sortStatus.columnAccessor === "createdAt" && value) {
                return new Date(value as string).getTime();
            }

            if (typeof value === "string") return value.toLowerCase();

            if (sortStatus.columnAccessor === "totalAmount") {
                return Number(value) || 0;
            }
            return value;
        });

        return sortStatus.direction === "desc" ? sorted.reverse() : sorted;
    }, [query.data, queryId, paymentStatus, status, sortStatus, setSortStatus]);

    return {
        ...query,
        filteredData,
        status,
        setStatus,
        queryId,
        setQueryId,
        paymentStatus,
        setSortStatus,
        sortStatus,
        setPaymentStatus,
    };
}
