import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { Position } from "@/models/order.ts";
import shirtIcon from "@/assets/shirt.png";
import { cmykToRgb } from "@/lib/utils.ts"

interface InvoicePDFProps {
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
    marginBottom:10,
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
  companySlogan: {
    fontSize: 10,
    color: "#555",
  },
  invoiceInfo: {
    marginBottom: 30,
  },
  invoiceRow: {
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
    marginTop: 5,
    fontSize: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    fontWeight: "bold",
  },


});

const InvoicePDF = ({ positions, orderNumber }: InvoicePDFProps) => {
  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const unitPrice = 10; // 🔶 hier später durch echten Preis ersetzen
  const totalSum = positions.reduce((acc, pos) => acc + (pos.amount || 0) * unitPrice, 0);

  return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* HEADER */}
          <View style={styles.header}>
            <Image src={shirtIcon} style={styles.logo} />
            <Text style={styles.companyName}>YourShirt GmbH</Text>
            <Text style={styles.companySlogan}>Individuelle Kleidung für Dich</Text>
          </View>

          {/* RECHNUNGSINFO */}
          <View style={styles.invoiceInfo}>
            <View style={styles.invoiceRow}>
              <View>
                <Text>RECHNUNG AN:</Text>
                <Text>Max Mustermann</Text>
                <Text>Musterstraße 1</Text>
                <Text>12345 Musterstadt</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text>Rechnung Nr. {orderNumber}</Text>
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
              <Text style={styles.cell}>€/Stk.</Text>
              <Text style={styles.cell}>Summe</Text>
            </View>

            {positions.map((pos, idx) => {
              const posNumber = pos.pos_number?.toString() || "";
              const amount = pos.amount || 0;
              const color = pos.color || "";
              const shirtSize = pos.shirtSize || "";
              const [r, g, b] = cmykToRgb(color);
              const sum = amount * unitPrice;

              return (
                  <View key={idx} style={styles.row}>
                    <Text style={styles.cell}>{posNumber}</Text>
                    <Text style={styles.cell}>{amount}</Text>
                    <View style={[styles.cell, { flexDirection: "row", alignItems: "center" }]}>
                    {color ? (
                          <View
                              style={[
                                styles.colorBox,
                                { backgroundColor: `rgb(${r}, ${g}, ${b})` },
                              ]}
                          />
                      ) : null}
                    </View>
                    <Text style={styles.cell}>{shirtSize}</Text>
                    <Text style={styles.cell}>
                      {unitPrice} € {/*  Hier später den echten Preis pro Stück einsetzen */}
                    </Text>
                    <Text style={styles.cell}>
                      {sum.toFixed(2)} €
                    </Text>
                  </View>
              );
            })}
          </View>





          {/* FOOTER */}
          <View style={styles.footer}>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginRight: 43, paddingBottom:30 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                Gesamtsumme: {totalSum.toFixed(2)} €
              </Text>
            </View>

            <Text>Zahlungsempfänger: YourShirt GmbH</Text>
            <Text>IBAN: DE01234567890123456789 · BIC: TESTBICXXX</Text>
            <Text>Bank: Musterbank</Text>
          </View>
        </Page>
      </Document>
  );
};

export default InvoicePDF;
