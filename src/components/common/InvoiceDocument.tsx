import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";

Font.register({
    family: "Baskervville SC",
    src: "/fonts/BaskervvilleSC-Regular.ttf",
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: "#FFFFFF",
        fontSize: 10,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        // This keeps the "Invoice" title on one side and the logo on the other
        // If you want BOTH on the right, change this to 'flex-end' and add gap
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 40,
    },
    brandSection: {
        flexDirection: "column",
        // This ensures "Official Receipt" aligns to the right edge of the logo text
        alignItems: "flex-end",
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    logoImage: {
        width: 20,
        height: 20,
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
    },
    subtitle: {
        fontSize: 10,
        color: "#868e96",
        marginTop: 2, // Small gap below the logo row
        marginLeft: 25,
        letterSpacing: 0.5,
    },
    logoText: {
        fontFamily: "Baskervville SC",
        fontSize: 18,
        color: "#004a7c",
    },
    title: { fontSize: 16, color: "#4dabf7" },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#868e96",
        marginBottom: 12,
        marginTop: 24,
    },
    detailsText: { marginBottom: 4, color: "#212529" },

    table: { marginTop: 10 },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#dee2e6",
        paddingVertical: 8,
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#dee2e6",
        paddingVertical: 10,
    },

    colId: { width: "40%" },
    colPet: { width: "15%" },
    colService: { width: "30%" },
    colPrice: { width: "15%", textAlign: "right" },

    totalRow: { flexDirection: "row", paddingVertical: 12 },
    statusContainer: { marginTop: 40, alignItems: "flex-end" },
    statusLabel: {
        fontSize: 9,
        color: "#adb5bd",
        textTransform: "uppercase",
        marginBottom: 2,
    },
    statusPaid: { fontSize: 22, color: "#4dabf7", fontWeight: "bold" },
});

export const InvoiceDocument = ({
    data,
    fullName,
}: {
    data: any;
    fullName: string;
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.brandSection}>
                <View style={styles.logoRow}>
                    <Image
                        src="/logo.png" // Path to your file in the public folder
                        style={styles.logoImage}
                    />

                    <Text style={styles.logoText}>Joseph & Mary</Text>
                </View>

                <Text style={styles.subtitle}>Official Reciept</Text>
            </View>

            {/* Billing Details */}
            <Text style={styles.sectionTitle}>Billing Details</Text>
            <View>
                <Text style={styles.detailsText}>Invoice Id: {data.id}</Text>
                <Text style={styles.detailsText}>
                    {new Date(data.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                    })}
                </Text>
                <Text style={styles.detailsText}>Client: {fullName}</Text>
            </View>

            {/* Table */}
            <Text style={styles.sectionTitle}>Billing Breakdown</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.colId}>Id</Text>
                    <Text style={styles.colPet}>Pet Id</Text>
                    <Text style={styles.colService}>service Id</Text>
                    <Text style={styles.colPrice}>Price</Text>
                </View>

                {data.items.map((item: any) => (
                    <View key={item.id} style={styles.tableRow}>
                        <Text style={styles.colId}>{item.id}</Text>
                        <Text style={styles.colPet}>
                            {item.petName || "N/A"}
                        </Text>
                        <Text style={styles.colService}>
                            {item.serviceTitle || "N/A"}
                        </Text>
                        <Text style={styles.colPrice}>
                            {parseFloat(item.priceAtInvoice).toFixed(2)}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Total Row */}
            <View style={styles.totalRow}>
                <Text style={{ width: "85%", fontWeight: "bold" }}>Total</Text>
                <Text
                    style={{
                        width: "15%",
                        textAlign: "right",
                        fontWeight: "bold",
                    }}
                >
                    P{parseFloat(data.totalAmount).toFixed(2)}
                </Text>
            </View>

            {/* Status */}
            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Payment status</Text>
                <Text style={styles.statusPaid}>{data.paymentStatus}</Text>
            </View>
        </Page>
    </Document>
);
export default InvoiceDocument;
