"use client";

import ExcelJs from "exceljs";
import { Button } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import { saveAs } from "file-saver";
import { appointmentTypeValues } from "@/db/schema/enums";

type Props = {
    summaryData: {
        serviceName: string;
        type: (typeof appointmentTypeValues)[number];
        totalRevenue: number;
        totalQty: number;
    }[];

    transactionData: {
        date: Date;
        invoiceId: string;
        firstName: string | null;
        lastName: string | null;
        userId: string;
        serviceTitle: string;
        type: (typeof appointmentTypeValues)[number];
        price: string | number;
    }[];

    dateRange: {
        from: string | undefined;
        to: string | undefined;
    };
};

export default function ExportSales({
    summaryData: data,
    transactionData,
    dateRange,
}: Props) {
    const handleExport = async () => {
        const workbook = new ExcelJs.Workbook();
        const summaryWorkSheet = workbook.addWorksheet("Sales Summary");
        const transactionLogsWorkSheet =
            workbook.addWorksheet("Transaction logs");

        const displayFrom = dateRange.from ?? "Start";
        const displayTo = dateRange.to ?? "End";

        // Shared Style for Titles
        const titleStyle: Partial<ExcelJs.Style> = {
            font: {
                name: "Arial",
                size: 16,
                bold: true,
                color: { argb: "FFFFFFFF" },
            },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF2E5077" },
            },
            alignment: { horizontal: "center" },
        };

        // --- SHEET 1: SALES SUMMARY ---
        summaryWorkSheet.mergeCells("A1:D1");
        const titleCell = summaryWorkSheet.getCell("A1");
        titleCell.value = "JOSEPH AND MARY VET CLINIC - SUMMARY";
        Object.assign(titleCell, titleStyle);

        summaryWorkSheet.mergeCells("A2:D2");
        summaryWorkSheet.getCell("A2").value =
            `Period: ${displayFrom} to ${displayTo}`;
        summaryWorkSheet.getCell("A2").alignment = { horizontal: "center" };

        summaryWorkSheet.getRow(4).values = [
            "Service Name",
            "Category",
            "Quantity Sold",
            "Total Revenue",
        ];
        summaryWorkSheet.columns = [
            { key: "serviceName", width: 35 },
            { key: "type", width: 20 },
            { key: "totalQty", width: 15 },
            { key: "totalRevenue", width: 20 },
        ];
        summaryWorkSheet.getRow(4).font = { bold: true };

        data.forEach((item) => {
            const row = summaryWorkSheet.addRow(item);
            row.getCell("totalRevenue").numFmt = '"₱"#,##0.00';
        });

        const totalRevenueSummary = data.reduce(
            (sum, item) => sum + Number(item.totalRevenue),
            0
        );
        const totalSumRow = summaryWorkSheet.addRow([
            "",
            "GRAND TOTAL",
            "",
            totalRevenueSummary,
        ]);
        totalSumRow.font = { bold: true };
        totalSumRow.getCell(4).numFmt = '"₱"#,##0.00';

        // --- SHEET 2: TRANSACTION LOGS ---
        transactionLogsWorkSheet.mergeCells("A1:G1");
        const titleCellTL = transactionLogsWorkSheet.getCell("A1");
        titleCellTL.value = "JOSEPH AND MARY VET CLINIC - DETAILED LOGS";
        Object.assign(titleCellTL, titleStyle);

        transactionLogsWorkSheet.mergeCells("A2:G2");
        transactionLogsWorkSheet.getCell("A2").value =
            `Generated: ${new Date().toLocaleString()}`;
        transactionLogsWorkSheet.getCell("A2").alignment = {
            horizontal: "center",
        };

        // Define Columns with First and Last Name separated
        transactionLogsWorkSheet.getRow(4).values = [
            "Date",
            "Invoice ID",
            "First Name",
            "Last Name",
            "Service Title",
            "Category",
            "Price",
        ];

        transactionLogsWorkSheet.columns = [
            { key: "date", width: 15 },
            { key: "invoiceId", width: 15 },
            { key: "firstName", width: 15 },
            { key: "lastName", width: 15 },
            { key: "serviceTitle", width: 30 },
            { key: "type", width: 15 },
            { key: "price", width: 15 },
        ];
        transactionLogsWorkSheet.getRow(4).font = { bold: true };

        let totalRevenueLogs = 0;
        transactionData.forEach((item) => {
            const priceNum = Number(item.price);
            totalRevenueLogs += priceNum;

            const row = transactionLogsWorkSheet.addRow({
                date: new Date(item.date).toLocaleDateString(),
                invoiceId: item.invoiceId,
                firstName: item.firstName ?? "N/A",
                lastName: item.lastName ?? "N/A",
                serviceTitle: item.serviceTitle,
                type: item.type,
                price: priceNum,
            });
            row.getCell("price").numFmt = '"₱"#,##0.00';
        });

        // Add Total Row to Logs Sheet
        const totalLogRow = transactionLogsWorkSheet.addRow([
            "",
            "",
            "",
            "",
            "",
            "TOTAL SALES",
            totalRevenueLogs,
        ]);
        totalLogRow.font = { bold: true };
        totalLogRow.getCell(7).numFmt = '"₱"#,##0.00';
        // Add a top border to the total row to make it look distinct
        totalLogRow.getCell(6).border = { top: { style: "thin" } };
        totalLogRow.getCell(7).border = { top: { style: "thin" } };

        // --- DOWNLOAD ---
        const fileName =
            `Sales_Report_${displayFrom}_to_${displayTo}.xlsx`.replace(
                / /g,
                "_"
            );
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
    };

    return (
        <Button
            rightSection={<IconFileExcel stroke={1.5} size={16} />}
            variant="default"
            onClick={handleExport}
            radius={"md"}
        >
            Export sales report
        </Button>
    );
}
