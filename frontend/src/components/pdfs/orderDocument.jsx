import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    color: '#666',
  },
  value: {
    fontSize: 12,
  },
  table: {
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  col1: { width: '50%', fontSize: 11 },
  col2: { width: '20%', fontSize: 11, textAlign: 'center' },
  col3: { width: '30%', fontSize: 11, textAlign: 'right' },
  total: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

const OrderDocument = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Capçalera */}
      <Text style={styles.header}>Albarà #{order.id}</Text>

      {/* Dades client */}
      <View style={styles.section}>
        <Text style={styles.label}>Client</Text>
        <Text style={styles.value}>{order.client.nom}</Text>
        <Text style={styles.value}>{order.client.adreca}</Text>
        <Text style={styles.value}>{order.client.email}</Text>
      </View>

      {/* Data */}
      <View style={styles.section}>
        <Text style={styles.label}>Data</Text>
        <Text style={styles.value}>{order.data}</Text>
      </View>

      {/* Línies de comanda */}
      <View style={styles.table}>
        {/* Capçalera taula */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.col1}>Producte</Text>
          <Text style={styles.col2}>Quantitat</Text>
          <Text style={styles.col3}>Preu</Text>
        </View>

        {/* Files */}
        {order.linies.map((linia, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.col1}>{linia.producte}</Text>
            <Text style={styles.col2}>{linia.quantitat}</Text>
            <Text style={styles.col3}>{linia.preu.toFixed(2)} €</Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.total}>
        <Text>Total: {order.total.toFixed(2)} €</Text>
      </View>

    </Page>
  </Document>
);

export default OrderDocument;