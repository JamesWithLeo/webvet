import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 48,
        backgroundColor: "#FFFFFF",
        fontSize: 10,
        fontFamily: "Helvetica",
        lineHeight: 1.5,
    },
    // --- Header Section ---
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        borderBottomStyle: "solid",
        paddingBottom: 20,
        marginBottom: 30,
    },
    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    logoImage: {
        width: 32,
        height: 32,
    },
    logoText: {
        fontFamily: "Times-Roman",
        fontSize: 20,
        color: "#14678f",
        letterSpacing: 0.5,
    },
    receiptType: {
        textAlign: "right",
    },
    receiptTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0f172a",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    receiptSubtitle: {
        fontSize: 9,
        color: "#64748b",
        marginTop: 2,
    },

    // --- Info Grid ---
    infoGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 40,
    },
    infoBlock: {
        flexDirection: "column",
    },
    infoLabel: {
        fontSize: 8,
        textTransform: "uppercase",
        color: "#94a3b8",
        marginBottom: 4,
        fontWeight: "bold",
    },
    infoValue: {
        fontSize: 10,
        color: "#1e293b",
    },

    // --- Table Styling ---
    table: {
        display: "flex",
        width: "auto",
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        borderBottomStyle: "solid",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#f1f5f9",
        borderBottomStyle: "solid",
        paddingVertical: 12,
        paddingHorizontal: 4,
        alignItems: "center",
    },
    tableHeaderText: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#64748b",
        textTransform: "uppercase",
    },

    // Column Widths
    colDescription: { width: "55%" },
    colPet: { width: "25%" },
    colPrice: { width: "20%", textAlign: "right" },

    itemTitle: { fontSize: 10, color: "#0f172a", fontWeight: "bold" },
    itemSub: { fontSize: 8, color: "#64748b", marginTop: 2 },

    // --- Summary Section ---
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    summaryBox: {
        width: "45%",
        borderTopWidth: 1,
        borderTopColor: "#0f172a",
        borderTopStyle: "solid",
        paddingTop: 8,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 3,
    },
    totalLabel: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
    refundLabel: { fontSize: 10, fontWeight: "bold", color: "#dc2626" },
    netTotalLabel: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#14678f",
        marginTop: 4,
    },
    totalValue: { fontSize: 10, textAlign: "right" },
    netTotalValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#14678f",
        textAlign: "right",
        marginTop: 4,
    },

    // --- Footer ---
    statusWrapper: {
        marginTop: 40,
        padding: 8,
        backgroundColor: "#f0f9ff",
        borderRadius: 4,
        alignSelf: "flex-start",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#bae6fd",
    },
    statusText: {
        fontSize: 9,
        color: "#0369a1",
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    refundReason: {
        fontSize: 8,
        color: "#64748b",
        fontStyle: "italic",
        marginTop: 4,
        textAlign: "right",
    },
});

export const InvoiceDocument = ({
    data,
    fullName,
}: {
    data: any;
    fullName: string;
}) => {
    const formattedDate = new Date(data.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatCurrency = (val: number | string) => {
        return parseFloat(val.toString()).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.brandContainer}>
                        <Image
                            src={`https://www.josephmary.me/logo.png`}
                            style={styles.logoImage}
                        />
                        <Text style={styles.logoText}>Joseph & Mary</Text>
                    </View>
                    <View style={styles.receiptType}>
                        <Text style={styles.receiptTitle}>
                            Official Receipt
                        </Text>
                        <Text style={styles.receiptSubtitle}>#{data.id}</Text>
                    </View>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>Billed To</Text>
                        <Text style={styles.infoValue}>{fullName}</Text>
                        <Text style={styles.itemSub}>
                            Client ID: {data.userId || "N/A"}
                        </Text>
                    </View>
                    <View style={[styles.infoBlock, { textAlign: "right" }]}>
                        <Text style={styles.infoLabel}>Date Issued</Text>
                        <Text style={styles.infoValue}>{formattedDate}</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text
                            style={[
                                styles.tableHeaderText,
                                styles.colDescription,
                            ]}
                        >
                            Service Details
                        </Text>
                        <Text style={[styles.tableHeaderText, styles.colPet]}>
                            Pet
                        </Text>
                        <Text style={[styles.tableHeaderText, styles.colPrice]}>
                            Amount (PHP)
                        </Text>
                    </View>

                    {data.items.map((item: any) => (
                        <View key={item.id} style={styles.tableRow}>
                            <View style={styles.colDescription}>
                                <Text style={styles.itemTitle}>
                                    {item.serviceTitle || "General Service"}
                                </Text>
                                <Text style={styles.itemSub}>
                                    ID: {item.id}
                                </Text>
                            </View>
                            <Text style={[styles.infoValue, styles.colPet]}>
                                {item.petName || "—"}
                            </Text>
                            <Text style={[styles.infoValue, styles.colPrice]}>
                                {formatCurrency(item.priceAtInvoice)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>
                                Php {formatCurrency(data.totalAmount)}
                            </Text>
                        </View>

                        {data.amountRefunded > 0 && (
                            <>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.refundLabel}>
                                        Refunded ({data.refundMethod})
                                    </Text>
                                    <Text
                                        style={[
                                            styles.totalValue,
                                            { color: "#dc2626" },
                                        ]}
                                    >
                                        - Php{" "}
                                        {formatCurrency(data.amountRefunded)}
                                    </Text>
                                </View>
                                <Text style={styles.refundReason}>
                                    Reason: {data.refundReason}
                                </Text>
                            </>
                        )}

                        <View
                            style={[
                                styles.summaryRow,
                                {
                                    borderTopWidth: 0.5,
                                    borderTopColor: "#e2e8f0",
                                    borderTopStyle: "solid",
                                    marginTop: 4,
                                    paddingTop: 4,
                                },
                            ]}
                        >
                            <Text style={styles.netTotalLabel}>Net Total</Text>
                            <Text style={styles.netTotalValue}>
                                Php {formatCurrency(data.netAmount)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.statusWrapper}>
                    <Text style={styles.statusText}>
                        Payment Status: {data.paymentStatus}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoiceDocument;
