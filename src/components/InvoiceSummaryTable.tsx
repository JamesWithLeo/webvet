"use client";

import { Table, TableData } from "@mantine/core";

export default function InvoiceSummaryTable() {
    const data: TableData = {
        // caption: "Some elements from periodic table",
        head: ["Summary Item", "Amount", "Notes"],
        body: [
            ["Subtotal", "516.00", "Total of all line items"],
            [
                "Discount Applied",
                "59.10",
                "10% Loyalty Discount (Applied to Subtotal)",
            ],
            [
                "Taxable Subtotal",
                "0.00",
                "All items are assumed to be non-taxable services.",
            ],
            [
                "Sales Tax (0%)",
                "0.00",
                "Based on the assumption that services are tax-exempt",
            ],
            ["Total Invoice Amount", "456.90", "(516.00 - 59.10 + 0.00)"],
            ["Total Payment Received", "0.00", "Payment Method:"],
        ],
        foot: ["Balance Due", "456.90", "Invoice Not Paid"],
    };

    return <Table data={data} withTableBorder withRowBorders={false} />;
}
