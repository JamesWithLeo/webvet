"use client";

import { Table } from "@mantine/core";
const elements = [
    // {
    //     code: "EXAM01",
    //     description: "Annual Wellness Examination (Mandatory Professional Fee)",
    //     category: "Professional Fee",
    //     quantity: 0,
    //     unitPrice: 75,
    //     total: 0,
    // },
    {
        code: "VACC-R",
        description: "Rabies Vaccine (3-Year)",
        category: "Vaccine",
        quantity: 1,
        unitPrice: 200,
        total: 200,
    },
    {
        code: "VACC-DHP",
        description: "DA2PP/DHPP Vaccine",
        category: "Vaccine",
        quantity: 1,
        unitPrice: 300,
        total: 300,
    },
    {
        code: "SUPP-D",
        description: "Medical Waste/Sharps Disposal Fee",
        category: "Ancillary Fee",
        quantity: 2,
        unitPrice: 8,
        total: 16,
    },
];
export default function InvoiceTable() {
    const rows = elements.map((element) => (
        <Table.Tr key={element.code}>
            <Table.Td>{element.code}</Table.Td>
            <Table.Td>{element.description}</Table.Td>
            <Table.Td>{element.quantity}</Table.Td>
            <Table.Td>{element.category}</Table.Td>
            <Table.Td>{element.unitPrice}</Table.Td>
            <Table.Td>{element.total}</Table.Td>
        </Table.Tr>
    ));

    const ths = (
        <Table.Tr>
            <Table.Th>Subtotal</Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>516.00</Table.Th>
        </Table.Tr>
    );
    return (
        <Table highlightOnHover withTableBorder stickyHeader>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Item Code</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Unit Price</Table.Th>
                    <Table.Th>Total</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
            <Table.Tfoot>{ths}</Table.Tfoot>
        </Table>
    );
}
