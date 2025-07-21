import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20 },
  row: { flexDirection: 'row', marginBottom: 6 },
  cell: { flex: 1, fontSize: 10 },
  header: { fontWeight: 'bold', marginBottom: 8 },
});

const EnrollmentPDF = ({ enrollments }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.row}>
        <Text style={{ ...styles.cell, ...styles.header }}>Student</Text>
        <Text style={{ ...styles.cell, ...styles.header }}>Course</Text>
        <Text style={{ ...styles.cell, ...styles.header }}>Status</Text>
      </View>


      {enrollments.map((e, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.cell}>{e.user?.name || 'N/A'}</Text>
          <Text style={styles.cell}>{e.course?.title || 'N/A'}</Text>
          <Text style={styles.cell}>{e.status}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default EnrollmentPDF;
