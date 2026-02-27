"use client";

import { InvoiceTypeModel } from "@/db/schema/invoice";
import { useQuery } from "@tanstack/react-query";

export default function useInvoiceAdmin() {
    const query = useQuery<InvoiceTypeModel[], Error>({
        queryKey: ["invoices", "admin"],

        queryFn: async () => {
            const res = await fetch("/api/admin/invoices", { method: "GET" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch invoices");
            }

            const data = await res.json();
            return data as InvoiceTypeModel[];
        },
        staleTime: 1000 * 60 * 5,
    });

    return { ...query };
}
