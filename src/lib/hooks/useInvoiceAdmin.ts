"use client";

import { InvoiceTypeModel, paymentStatusType } from "@/db/schema/invoice";
import { InvoiceTypeModelWithTotal } from "@/types/invoice";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useInvoiceAdmin() {
    const [queryId, setQueryId] = useState<string>("");
    const [paymentStatus, setPaymentStatus] = useState<
        (typeof paymentStatusType.enumValues)[number] | "all"
    >("all");

    const query = useQuery<InvoiceTypeModelWithTotal[], Error>({
        queryKey: ["invoices", "admin"],

        queryFn: async () => {
            const res = await fetch("/api/admin/invoices", { method: "GET" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch invoices");
            }

            const data = await res.json();
            return data as InvoiceTypeModelWithTotal[];
        },
        staleTime: 1000 * 60 * 5,

        select: (data) => {
            const lowerQueryId = queryId.toLowerCase();

            let filtered = data;
            filtered = data.filter((inv) => {
                const matchQueryId =
                    !queryId || inv.id.toLowerCase().includes(lowerQueryId);

                const matchesStatus =
                    paymentStatus === "all" ||
                    inv.status?.toLowerCase() === paymentStatus.toLowerCase();

                return matchQueryId && matchesStatus;
            });

            return filtered;
        },
    });

    return { ...query, queryId, setQueryId, paymentStatus, setPaymentStatus };
}
