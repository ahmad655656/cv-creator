'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica'
  },
  header: {
    textAlign: 'center',
    marginBottom: 20
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  job: {
    fontSize: 14,
    marginBottom: 6
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  small: {
    fontSize: 10,
    color: 'gray'
  }
});

export default function CVDocument({ data }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {data.personalInfo.fullName}
          </Text>

          <Text style={styles.job}>
            {data.personalInfo.jobTitle}
          </Text>

          {data.personalInfo.email && (
            <Text>{data.personalInfo.email}</Text>
          )}

          {data.personalInfo.phone && (
            <Text>{data.personalInfo.phone}</Text>
          )}
        </View>

        {/* Summary */}
        {data.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>نبذة عني</Text>
            <Text>{data.personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الخبرات المهنية</Text>

            {data.experiences.map((exp: any) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>
                  {exp.position}
                </Text>

                <Text style={styles.small}>
                  {exp.company} - {exp.startDate} {exp.current ? 'حالياً' : exp.endDate}
                </Text>

                {exp.description?.map((d: string, i: number) => (
                  <Text key={i}>• {d}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المؤهلات التعليمية</Text>

            {data.education.map((edu: any) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <Text style={styles.itemTitle}>
                  {edu.degree} {edu.field && `في ${edu.field}`}
                </Text>
                <Text style={styles.small}>
                  {edu.institution} - {edu.startDate} {edu.current ? 'حالياً' : edu.endDate}
                </Text>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}