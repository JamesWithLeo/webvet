"use client";

import CurrencyFormatter from "@/lib/CurrencyFormatter";
import { toTitleCase } from "@/lib/toTitleCase";
import { Table } from "@mantine/core";
import { useMemo } from "react";

type Props = {
    items: {
        petName: string | null;
        serviceTitle: string | null;
        id?: string | undefined;
        invoiceId?: string | null | undefined;
        petId?: string | null | undefined;
        serviceId?: string | null | undefined;
        priceAtInvoice?: string | undefined;
    }[];
};
export default function InvoiceTable({ items }: Props) {
    const totalAmount = useMemo(() => {
        // 1. Ensure items exist
        if (!items.length) return 0;

        // 2. Sum up the prices
        return items.reduce((sum, item) => {
            // Convert string decimal to number safely
            const price = parseFloat(item.priceAtInvoice ?? "0");
            return sum + price;
        }, 0);
    }, [items]);
    const rows = items.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>{item.id}</Table.Td>
            <Table.Td>
                {item.petName ? toTitleCase(item.petName) : item.id}
            </Table.Td>
            <Table.Td>{item.serviceTitle}</Table.Td>
            <Table.Td>{item.priceAtInvoice}</Table.Td>
        </Table.Tr>
    ));

    const ths = (
        <Table.Tr key={"footer"}>
            <Table.Th>Total</Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>{CurrencyFormatter(totalAmount)}</Table.Th>
        </Table.Tr>
    );
    return (
        <Table highlightOnHover withTableBorder stickyHeader>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Id</Table.Th>
                    <Table.Th>Pet Id</Table.Th>
                    <Table.Th>service Id</Table.Th>
                    <Table.Th>Price</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows.concat(ths)}</Table.Tbody>
        </Table>
    );
}
