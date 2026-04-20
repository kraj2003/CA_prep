import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { RevisionPackage } from "@/lib/types";

// Register fonts for premium look
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Inter",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#0052CC",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0052CC",
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  metaContainer: {
    alignItems: "flex-end",
  },
  studentName: {
    fontSize: 11,
    fontWeight: 600,
    color: "#0f172a",
  },
  topicLabel: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  topic: {
    fontSize: 10,
    fontWeight: 600,
    color: "#0052CC",
    maxWidth: 200,
  },
  date: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 4,
  },
  // Section styles
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  sectionNumber: {
    width: 24,
    height: 24,
    backgroundColor: "#0052CC",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  sectionNumberText: {
    fontSize: 10,
    fontWeight: 700,
    color: "#ffffff",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Content styles
  content: {
    lineHeight: 1.5,
    textAlign: "justify",
  },
  // Revision notes specific
  heading: {
    fontSize: 10,
    fontWeight: 700,
    color: "#0f172a",
    marginTop: 10,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 9,
    fontWeight: 600,
    color: "#334155",
    marginTop: 8,
    marginBottom: 3,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 10,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0052CC",
    marginTop: 4,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#334155",
  },
  // MCQ styles
  mcqContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#0052CC",
  },
  mcqQuestion: {
    fontSize: 9,
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: 6,
  },
  option: {
    fontSize: 8,
    color: "#475569",
    marginBottom: 2,
    paddingLeft: 5,
  },
  correctOption: {
    fontSize: 8,
    fontWeight: 600,
    color: "#059669",
    marginBottom: 2,
    paddingLeft: 5,
  },
  explanation: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 6,
    fontStyle: "italic",
  },
  scenarioText: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 4,
    fontStyle: "italic",
  },
  subSection: {
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 9,
    fontWeight: 600,
    color: "#0052CC",
    marginBottom: 3,
  },
  bulletPoint: {
    fontSize: 9,
    color: "#334155",
    marginBottom: 2,
    paddingLeft: 5,
  },
  codeText: {
    fontSize: 8,
    fontFamily: "Courier",
    color: "#334155",
    backgroundColor: "#f1f5f9",
    padding: 6,
    borderRadius: 3,
  },
  openingLine: {
    fontSize: 9,
    fontWeight: 600,
    color: "#7c3aed",
    marginBottom: 4,
  },
  hints: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 4,
    fontStyle: "italic",
  },
  mistakeContainer: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#fef2f2",
    borderRadius: 4,
  },
  mistakeText: {
    fontSize: 9,
    color: "#dc2626",
    marginBottom: 3,
  },
  correctionText: {
    fontSize: 9,
    color: "#059669",
    marginBottom: 3,
  },
  marksLost: {
    fontSize: 8,
    color: "#d97706",
  },
  relevanceSubtext: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  // Descriptive questions
  descQuestion: {
    fontSize: 10,
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#fef3c7",
    borderRadius: 4,
  },
  modelAnswer: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.6,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  // Common mistakes
  mistake: {
    fontSize: 8,
    color: "#dc2626",
    marginBottom: 4,
    padding: 6,
    backgroundColor: "#fef2f2",
    borderRadius: 4,
  },
  // Quick pointers
  pointer: {
    flexDirection: "row",
    marginBottom: 4,
    padding: 6,
    backgroundColor: "#f0fdf4",
    borderRadius: 4,
  },
  pointerIcon: {
    fontSize: 10,
    marginRight: 6,
  },
  pointerText: {
    flex: 1,
    fontSize: 8,
    color: "#166534",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
  footerBrand: {
    fontSize: 8,
    fontWeight: 600,
    color: "#0052CC",
  },
  // Exam relevance highlight
  relevanceBox: {
    padding: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    marginBottom: 12,
  },
  relevanceText: {
    fontSize: 9,
    color: "#1e40af",
    fontWeight: 600,
  },
  // Summary box
  summaryBox: {
    padding: 12,
    backgroundColor: "#faf5ff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e9d5ff",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 9,
    color: "#6b21a8",
    fontStyle: "italic",
  },
});

type PdfDocumentProps = {
  topic: string;
  studentName: string;
  generatedOn: string;
  pkg: RevisionPackage;
};

export function PdfDocument({ topic, studentName, generatedOn, pkg }: PdfDocumentProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderRevisionNotes = (text: string) => {
    const sections = text.split("## ");
    return sections.map((section, idx) => {
      if (!section.trim()) return null;
      const [heading, ...contentParts] = section.split("\n");
      const content = contentParts.join("\n");
      
      return (
        <View key={idx} style={styles.section}>
          <Text style={styles.heading}>{heading.trim()}</Text>
          <Text style={styles.content}>{content.trim()}</Text>
        </View>
      );
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandContainer}>
              <Text style={styles.brandName}>ReviseCA</Text>
            </View>
            <Text style={styles.brandTagline}>India's #1 CA Exam Revision Engine</Text>
          </View>
          <View style={styles.metaContainer}>
            <Text style={styles.studentName}>{studentName}</Text>
            <Text style={styles.topicLabel}>Topic:</Text>
            <Text style={styles.topic}>{topic}</Text>
            <Text style={styles.date}>Generated on {formatDate(generatedOn)}</Text>
          </View>
        </View>

        {/* Personal Note */}
        {pkg.personalNote && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>💌 {pkg.personalNote}</Text>
          </View>
        )}

        {/* Exam Relevance */}
        {pkg.examRelevance && (
          <View style={styles.relevanceBox}>
            <Text style={styles.relevanceText}>🎯 {pkg.examRelevance.prediction} | {pkg.examRelevance.typicalMarks}</Text>
            <Text style={styles.relevanceSubtext}>Last appeared: {pkg.examRelevance.lastAppeared}</Text>
          </View>
        )}

        {/* Section 1: Revision Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Revision Notes</Text>
          </View>
          {pkg.revisionNotes.coreConcept && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Core Concept</Text>
              <Text style={styles.content}>{pkg.revisionNotes.coreConcept}</Text>
            </View>
          )}
          {pkg.revisionNotes.mustKnowDefinition && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Must-Know Definition</Text>
              <Text style={styles.content}>{pkg.revisionNotes.mustKnowDefinition}</Text>
            </View>
          )}
          {pkg.revisionNotes.recognitionCriteria.length > 0 && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Recognition Criteria</Text>
              {pkg.revisionNotes.recognitionCriteria.map((c, i) => (
                <Text key={i} style={styles.bulletPoint}>• {c}</Text>
              ))}
            </View>
          )}
          {pkg.revisionNotes.measurementRule && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Measurement Rule</Text>
              <Text style={styles.content}>{pkg.revisionNotes.measurementRule}</Text>
            </View>
          )}
          {pkg.revisionNotes.workedExample && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Worked Example</Text>
              <Text style={styles.codeText}>{pkg.revisionNotes.workedExample}</Text>
            </View>
          )}
        </View>

        {/* Section 2: MCQs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>ICAI-Style MCQs ({pkg.mcqs.length})</Text>
          </View>
          {pkg.mcqs.map((item, idx) => (
            <View key={idx} style={styles.mcqContainer}>
              {item.scenario && (
                <Text style={styles.scenarioText}>📋 {item.scenario}</Text>
              )}
              <Text style={styles.mcqQuestion}>Q{idx + 1}. {item.question}</Text>
              {item.options.map((option, optIdx) => (
                <Text 
                  key={optIdx} 
                  style={item.correctAnswer?.includes(String.fromCharCode(65 + optIdx)) ? styles.correctOption : styles.option}
                >
                  {String.fromCharCode(65 + optIdx)}. {option}
                </Text>
              ))}
              <Text style={styles.explanation}>💡 {item.whyCorrect}</Text>
            </View>
          ))}
        </View>

        {/* Section 3: Descriptive Questions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Descriptive Questions ({pkg.descriptiveQuestions.length})</Text>
          </View>
          {pkg.descriptiveQuestions.map((item, idx) => (
            <View key={idx} style={{ marginBottom: 12 }}>
              <Text style={styles.descQuestion}>Q{idx + 1}. {item.exactQuestion} ({item.marks} Marks)</Text>
              {item.openingLineToWrite && (
                <Text style={styles.openingLine}>💎 Opening: {item.openingLineToWrite}</Text>
              )}
              <Text style={styles.modelAnswer}>{item.modelAnswer}</Text>
              {item.markingSchemeHints && (
                <Text style={styles.hints}>📝 Marking: {item.markingSchemeHints}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Section 4: Common Mistakes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>Common Mistakes & Mark Loss Traps ({pkg.commonMistakes.length})</Text>
          </View>
          {pkg.commonMistakes.map((item, idx) => (
            <View key={idx} style={styles.mistakeContainer}>
              <Text style={styles.mistakeText}>❌ {item.mistake}</Text>
              <Text style={styles.correctionText}>✓ {item.correction}</Text>
              {item.marksLost && <Text style={styles.marksLost}>⚠️ {item.marksLost}</Text>}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Page 1</Text>
          <Text style={styles.footerBrand}>ReviseCA — Exam-Ready Package</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Section 5: Answer Writing Approach */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>5</Text>
            </View>
            <Text style={styles.sectionTitle}>Answer Writing Approach</Text>
          </View>
          {pkg.answerWritingApproach.openingFormula && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Opening Formula</Text>
              <Text style={styles.codeText}>{pkg.answerWritingApproach.openingFormula}</Text>
            </View>
          )}
          {pkg.answerWritingApproach.structureToFollow && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Structure to Follow</Text>
              <Text style={styles.content}>{pkg.answerWritingApproach.structureToFollow}</Text>
            </View>
          )}
          {pkg.answerWritingApproach.whatCheckerLooksFor && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>What Checker Looks For</Text>
              <Text style={styles.content}>{pkg.answerWritingApproach.whatCheckerLooksFor}</Text>
            </View>
          )}
        </View>

        {/* Section 6: How It's Tested */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>6</Text>
            </View>
            <Text style={styles.sectionTitle}>How This Topic is Typically Tested</Text>
          </View>
          {pkg.howTopicIsTested.pastPaperPattern && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Past Paper Pattern</Text>
              <Text style={styles.content}>{pkg.howTopicIsTested.pastPaperPattern}</Text>
            </View>
          )}
          {pkg.howTopicIsTested.angleAlwaysTaken && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Angle Always Taken</Text>
              <Text style={styles.content}>{pkg.howTopicIsTested.angleAlwaysTaken}</Text>
            </View>
          )}
          {pkg.howTopicIsTested.trickInQuestion && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Trick in Question</Text>
              <Text style={styles.content}>{pkg.howTopicIsTested.trickInQuestion}</Text>
            </View>
          )}
        </View>

        {/* Section 7: Key Focus Areas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>7</Text>
            </View>
            <Text style={styles.sectionTitle}>Key Focus Areas for Scoring</Text>
          </View>
          {(() => {
            const highYieldItems = Array.isArray(pkg.keyFocusAreas.highYield) 
              ? pkg.keyFocusAreas.highYield 
              : (pkg.keyFocusAreas.highYield ? [pkg.keyFocusAreas.highYield] : []);
            return highYieldItems.length > 0 ? (
              <View style={styles.subSection}>
                <Text style={styles.subHeading}>High-Yield Areas</Text>
                {highYieldItems.map((h: string, i: number) => (
                  <Text key={i} style={styles.bulletPoint}>• {h}</Text>
                ))}
              </View>
            ) : null;
          })()}
          {pkg.keyFocusAreas.numericalVsTheory && (
            <View style={styles.subSection}>
              <Text style={styles.subHeading}>Numerical vs Theory</Text>
              <Text style={styles.content}>{pkg.keyFocusAreas.numericalVsTheory}</Text>
            </View>
          )}
        </View>

        {/* Section 8: Quick Revision Pointers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>8</Text>
            </View>
            <Text style={styles.sectionTitle}>Quick Revision Pointers ({pkg.quickRevisionPointers.length})</Text>
          </View>
          {pkg.quickRevisionPointers.map((item, idx) => (
            <View key={idx} style={styles.pointer}>
              <Text style={styles.pointerIcon}>🔑</Text>
              <Text style={styles.pointerText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Section 9: Formula Sheet */}
        {pkg.formulaSheet && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>9</Text>
              </View>
              <Text style={styles.sectionTitle}>Formula Sheet</Text>
            </View>
            <Text style={styles.content}>{pkg.formulaSheet}</Text>
          </View>
        )}

        {/* Section 10: Last Minute Tips */}
        {pkg.lastMinuteTips.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>10</Text>
              </View>
              <Text style={styles.sectionTitle}>Last Minute Tips</Text>
            </View>
            {pkg.lastMinuteTips.map((tip, idx) => (
              <Text key={idx} style={styles.bulletPoint}>💡 {tip}</Text>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Page 2</Text>
          <Text style={styles.footerBrand}>ReviseCA — Exam-Ready Package</Text>
        </View>
      </Page>
    </Document>
  );
}
