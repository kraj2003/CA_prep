import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { RevisionPackage } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, color: "#1f2937" },
  title: { fontSize: 18, marginBottom: 6, color: "#0052CC" },
  subtitle: { fontSize: 10, marginBottom: 12 },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 12, marginBottom: 4, color: "#A17700" },
  bullet: { marginBottom: 2 },
  para: { lineHeight: 1.4 },
});

type PdfDocumentProps = {
  topic: string;
  studentName: string;
  generatedOn: string;
  pkg: RevisionPackage;
};

export function PdfDocument({ topic, studentName, generatedOn, pkg }: PdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ReviseCA Exam-Ready Package</Text>
        <Text style={styles.subtitle}>
          Student: {studentName} | Topic: {topic} | Date: {generatedOn}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revision Notes</Text>
          <Text style={styles.para}>{pkg.revisionNotes}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ICAI-Style MCQs</Text>
          {pkg.mcqs.map((item, idx) => (
            <View key={idx}>
              <Text style={styles.bullet}>Q{idx + 1}. {item.question}</Text>
              {item.options.map((option, optionIdx) => (
                <Text key={`${idx}-${optionIdx}`} style={styles.bullet}>
                  {String.fromCharCode(65 + optionIdx)}. {option}
                </Text>
              ))}
              <Text style={styles.bullet}>Answer: {item.answer}</Text>
              <Text style={styles.bullet}>Explanation: {item.explanation}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descriptive Questions</Text>
          {pkg.descriptiveQuestions.map((item, idx) => (
            <View key={idx}>
              <Text style={styles.bullet}>{idx + 1}. {item.question}</Text>
              <Text style={styles.bullet}>{item.modelAnswer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Mistakes & Mark Loss Traps</Text>
          {pkg.commonMistakes.map((item, idx) => (
            <Text key={idx} style={styles.bullet}>• {item}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Answer Writing Approach</Text>
          <Text style={styles.para}>{pkg.answerWritingApproach}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How This Topic is Typically Tested</Text>
          <Text style={styles.para}>{pkg.howTopicIsTested}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Focus Areas for Scoring</Text>
          <Text style={styles.para}>{pkg.keyFocusAreas}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Revision Pointers</Text>
          {pkg.quickRevisionPointers.map((item, idx) => (
            <Text key={idx} style={styles.bullet}>• {item}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
