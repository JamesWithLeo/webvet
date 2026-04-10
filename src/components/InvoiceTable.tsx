"use client";

import CurrencyFormatter from "@/lib/CurrencyFormatter";
import { toTitleCase } from "@/lib/toTitleCase";
import { InvoiceAdmin, InvoiceTypeModelWithItems } from "@/types/invoice";
import { Table } from "@mantine/core";

type Props = {
    data: InvoiceTypeModelWithItems;
};
export default function InvoiceTable({ data }: Props) {
    const rows = data.items.map((item) => (
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
            <Table.Th>{CurrencyFormatter(data.totalAmount)}</Table.Th>
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
