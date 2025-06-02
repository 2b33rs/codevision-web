import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import type { Position } from "@/models/order";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  heading: { fontSize: 20, marginBottom: 20 },
});

export const DeliveryNotePDF = ({ position }: { position: Position }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>Lieferschein</Text>
      <Text style={styles.section}>Position: {position.pos_number}</Text>
      <Text style={styles.section}>Produkt: {position.name}</Text>
      <Text style={styles.section}>Menge: {position.amount}</Text>
      <Text style={styles.section}>Farbe: {position.color}</Text>
      <Text style={styles.section}>Größe: {position.shirtSize}</Text>
      <Text style={styles.section}>Design: {position.design}</Text>
      <Text style={styles.section}>Status: {position.Status}</Text>
    </Page>
  </Document>
);
