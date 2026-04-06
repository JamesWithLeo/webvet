import { useState } from "react";
import { ActionIcon, Tooltip, Loader } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import InvoiceDocument from "@/components/common/InvoiceDocument";
import { getInvoiceDownloadDataAction } from "@/actions/invoice";
import { toTitleCase } from "@/lib/toTitleCase";

export const DownloadInvoiceButton = ({ invoiceId }: { invoiceId: string }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row expansion/selection
        setIsGenerating(true);

        try {
            // 1. Fetch the aggregated data (joins: users, items, pets, services)
            const data = await getInvoiceDownloadDataAction(invoiceId);
            if (!data) {
                alert("Invoice data not found");
                return;
            }
            // 2. Generate the PDF Blob
            const doc = (
                <InvoiceDocument
                    fullName={toTitleCase(`${data.firstName} ${data.lastName}`)}
                    data={data}
                />
            );
            const blob = await pdf(doc).toBlob();

            saveAs(
                blob,
                `Invoice_${data.lastName || "Invoice"}_${invoiceId}.pdf`
            );
        } catch (error) {
            console.error("Download Error:", error);
            // Optional: add a toast notification here
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Tooltip
            label="Download invoice"
            position="left"
            withArrow
            offset={-1}
            arrowSize={10}
        >
            <ActionIcon
                size="input-xs"
                variant="default"
                radius={"md"}
                onClick={handleDownload}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <Loader size={12} />
                ) : (
                    <IconDownload size={16} />
                )}
            </ActionIcon>
        </Tooltip>
    );
};
