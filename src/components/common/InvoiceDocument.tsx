import CurrencyFormatter from "@/lib/CurrencyFormatter";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";

// Register Font
Font.register({
    family: "Baskervville SC",
    src: "/fonts/BaskervvilleSC-Regular.ttf",
});

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
        borderBottom: 1,
        borderColor: "#e5e7eb",
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
        fontFamily: "Baskervville SC",
        fontSize: 20,
        color: "#0f172a",
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

    // --- Info Grid (Bill To / Date) ---
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
        fontWeight: "medium",
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
        borderBottom: 1,
        borderColor: "#e2e8f0",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: 0.5,
        borderColor: "#f1f5f9",
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
        width: "40%",
        borderTop: 1,
        borderColor: "#0f172a",
        paddingTop: 8,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    totalLabel: { fontSize: 12, fontWeight: "bold", color: "#0f172a" },
    totalAmount: { fontSize: 14, fontWeight: "bold", color: "#004a7c" },

    // --- Status Badge ---
    statusWrapper: {
        marginTop: 40,
        padding: 10,
        backgroundColor: "#f0f9ff",
        borderRadius: 4,
        alignSelf: "flex-start",
    },
    statusText: {
        fontSize: 10,
        color: "#0369a1",
        fontWeight: "bold",
        textTransform: "uppercase",
    },
});

export const InvoiceDocument = ({
    data,
    totalAmount,
    fullName,
    id,
}: {
    data: any;
    id: string;
    fullName: string;
    totalAmount: number;
}) => {
    const formattedDate = new Date(data.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.brandContainer}>
                        <Image src="/logo.png" style={styles.logoImage} />
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
                        <Text style={styles.infoValue}>{`${fullName}`}</Text>
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
                            Amount
                        </Text>
                    </View>

                    {data.items.map((item: any) => (
                        <View key={item.id} style={styles.tableRow}>
                            <View style={styles.colDescription}>
                                <Text style={styles.itemTitle}>
                                    {item.serviceTitle || "General Service"}
                                </Text>
                                <Text style={styles.itemSub}>
                                    Item ID: {item.id}
                                </Text>
                            </View>
                            <Text style={[styles.infoValue, styles.colPet]}>
                                {item.petName || "—"}
                            </Text>
                            <Text style={[styles.infoValue, styles.colPrice]}>
                                {parseFloat(item.priceAtInvoice).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 }
                                )}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles}>Total Amount</Text>

                            <Text>
                                P
                                {parseFloat(data.totalAmount).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 }
                                )}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Status Badge */}
                {/* <View style={styles.statusWrapper}>
                    <Text style={styles.statusText}>
                        Status: {data.paymentStatus}
                    </Text>
                </View> */}
            </Page>
        </Document>
    );
};

export default InvoiceDocument;
