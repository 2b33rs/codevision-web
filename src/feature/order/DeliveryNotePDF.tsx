import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { Position } from "@/models/order.ts";
import shirtIcon from "@/assets/shirt.png";
import { cmykToRgb } from "@/lib/utils.ts"




interface DeliveryNotePDFProps {
    positions: Position[];
    orderNumber: string;
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica",
        lineHeight: 1.5,
    },
    header: {
        alignItems: "center",
        marginBottom: 10,
    },
    logo: {
        width: 40,
        height: 40,
        marginBottom: 10,
    },
    companyName: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    deliveryInfo: {
        marginBottom: 30,
    },
    deliveryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        fontWeight: "bold",
        paddingBottom: 5,
        marginBottom: 5,
    },
    row: {
        flexDirection: "row",
        marginBottom: 5,
        alignItems: "center",
    },
    cell: {
        flex: 1,
        textAlign: "left",
        paddingRight: 4,
    },
    colorBox: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: "#000",
        marginRight: 4,
    },
    footer: {
        marginTop: 10,
        fontSize: 10,
    },
});

const DeliveryNotePDF = ({ positions, orderNumber }: DeliveryNotePDFProps) => {
    const today = new Date().toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Image src={shirtIcon} style={styles.logo} />
                    <Text style={styles.companyName}>YourShirt GmbH</Text>
                </View>

                <Text style={styles.title}>LIEFERSCHEIN</Text>

                {/* INFOS */}
                <View style={styles.deliveryInfo}>
                    <View style={styles.deliveryRow}>
                        <View>
                            <Text>Empfänger:</Text>
                            <Text>Max Mustermann</Text> {/* 🔧 später: Kunde */}
                            <Text>Musterstraße 1</Text>
                            <Text>12345 Musterstadt</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text>Lieferschein Nr. {orderNumber}</Text>
                            <Text>{today}</Text>
                        </View>
                    </View>
                </View>

                {/* TABELLE */}
                <View>
                    <View style={styles.tableHeader}>
                        <Text style={styles.cell}>Pos</Text>
                        <Text style={styles.cell}>Anzahl</Text>
                        <Text style={styles.cell}>Farbe</Text>
                        <Text style={styles.cell}>Größe</Text>
                    </View>

                    {positions.map((pos, idx) => {
                        const [r, g, b] = cmykToRgb(pos.color || "");
                        return (
                            <View key={idx} style={styles.row}>
                                <Text style={styles.cell}>{pos.pos_number}</Text>
                                <Text style={styles.cell}>{pos.amount}</Text>
                                <View style={[styles.cell, { flexDirection: "row", alignItems: "center" }]}>
                                    {pos.color && (
                                        <View
                                            style={[
                                                styles.colorBox,
                                                { backgroundColor: `rgb(${r}, ${g}, ${b})` },
                                            ]}
                                        />
                                    )}
                                </View>
                                <Text style={styles.cell}>{pos.shirtSize}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text>Vielen Dank für Ihre Bestellung!</Text>
                </View>
            </Page>
        </Document>
    );
};

export default DeliveryNotePDF;
