"use client";

import { InvoiceItemsTypeModel } from "@/db/schema/invoice";
import { useQuery } from "@tanstack/react-query";

export default function useInvoiceItemAdmin(id: string) {
    return useQuery<InvoiceItemsTypeModel[]>({
        queryKey: ["invoices", "admin", id],
        queryFn: async () => {
            if (!id) throw new Error("No Invoice ID provided");

            const res = await fetch(`/api/admin/invoices/item?id=${id}`, {
                method: "GET",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData.error || "Failed to fetch invoice item."
                );
            }

            const data = await res.json();
            return data as InvoiceItemsTypeModel[];
        },
        staleTime: 1000 * 60 * 5,
    });
}
