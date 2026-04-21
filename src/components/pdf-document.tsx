// Server-only component — NO "use client", NO hooks, NO event handlers
// Used only in /api/export-pdf/route.tsx via renderToBuffer()

import {
  Document, Page, Text, View, StyleSheet, Font
} from "@react-pdf/renderer";
import { RevisionPackage } from "@/lib/types";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 44,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
  },

  // ── Header ──
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a5f",
    borderBottomStyle: "solid",
  },
  headerBrand: {
    fontSize: 8,
    color: "#64748b",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 4,
    lineHeight: 1.2,
  },
  headerSummary: {
    fontSize: 9.5,
    color: "#475569",
    lineHeight: 1.4,
    fontStyle: "italic",
  },
  relevanceBadge: {
    marginTop: 8,
    backgroundColor: "#fef3c7",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  relevanceText: {
    fontSize: 8,
    color: "#92400e",
    fontFamily: "Helvetica-Bold",
  },

  // ── Stats row ──
  statsRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "solid",
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 7,
    color: "#94a3b8",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // ── Section ──
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    borderBottomStyle: "solid",
  },
  sectionNumber: {
    width: 18,
    height: 18,
    backgroundColor: "#1e3a5f",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },
  sectionNumberText: {
    fontSize: 7,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    flex: 1,
  },
  sectionBadge: {
    fontSize: 7,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // ── Revision Notes ──
  notesSubheading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#bfdbfe",
    borderBottomStyle: "solid",
  },
  notesParagraph: {
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.55,
    marginBottom: 4,
  },
  notesBullet: {
    flexDirection: "row",
    marginBottom: 2.5,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 12,
    fontSize: 9.5,
    color: "#3b82f6",
    marginTop: 0.5,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.5,
  },
  notesNumbered: {
    flexDirection: "row",
    marginBottom: 2.5,
    paddingLeft: 4,
  },
  numberedIndex: {
    width: 14,
    fontSize: 9.5,
    color: "#3b82f6",
    fontFamily: "Helvetica-Bold",
    marginTop: 0.5,
  },
  numberedText: {
    flex: 1,
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.5,
  },

  // ── MCQ ──
  mcqItem: {
    marginBottom: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "solid",
  },
  mcqHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
    gap: 6,
  },
  mcqNumBadge: {
    width: 16,
    height: 16,
    backgroundColor: "#7c3aed",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  mcqNumText: {
    fontSize: 7,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
  },
  mcqDiffBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
    marginTop: 1,
    flexShrink: 0,
  },
  mcqDiffText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  mcqQuestion: {
    flex: 1,
    fontSize: 9.5,
    color: "#0f172a",
    lineHeight: 1.45,
    fontFamily: "Helvetica-Bold",
  },
  mcqOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 5,
  },
  mcqOption: {
    width: "48%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    padding: 5,
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
    borderStyle: "solid",
  },
  mcqOptionLetter: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    width: 10,
    flexShrink: 0,
  },
  mcqOptionText: {
    flex: 1,
    fontSize: 8.5,
    color: "#475569",
    lineHeight: 1.35,
  },
  mcqAnswer: {
    backgroundColor: "#f0fdf4",
    borderRadius: 4,
    padding: 6,
    borderWidth: 0.5,
    borderColor: "#86efac",
    borderStyle: "solid",
  },
  mcqAnswerLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#166534",
    marginBottom: 2,
  },
  mcqAnswerText: {
    fontSize: 8.5,
    color: "#374151",
    lineHeight: 1.4,
  },

  // ── Descriptive ──
  descItem: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "solid",
    borderRadius: 6,
    overflow: "hidden",
  },
  descHeader: {
    backgroundColor: "#eff6ff",
    padding: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  descNumBadge: {
    width: 16,
    height: 16,
    backgroundColor: "#1e40af",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  descMarksBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
    flexShrink: 0,
    marginTop: 1,
  },
  descMarksText: {
    fontSize: 7,
    color: "#1e40af",
    fontFamily: "Helvetica-Bold",
  },
  descQuestion: {
    flex: 1,
    fontSize: 9.5,
    color: "#0f172a",
    lineHeight: 1.45,
    fontFamily: "Helvetica-Bold",
  },
  descAnswerBlock: {
    padding: 8,
  },
  descAnswerLabel: {
    fontSize: 7,
    color: "#1e40af",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  descAnswerText: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.55,
  },
  descTip: {
    backgroundColor: "#fffbeb",
    borderTopWidth: 0.5,
    borderTopColor: "#fde68a",
    borderTopStyle: "solid",
    padding: 6,
  },
  descTipText: {
    fontSize: 8,
    color: "#92400e",
    lineHeight: 1.4,
    fontStyle: "italic",
  },

  // ── Mistakes ──
  mistakeItem: {
    marginBottom: 6,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#fca5a5",
    borderStyle: "solid",
  },
  mistakeWrong: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 6,
    backgroundColor: "#fef2f2",
    gap: 5,
  },
  mistakeIcon: {
    fontSize: 9,
    color: "#ef4444",
    width: 12,
    flexShrink: 0,
  },
  mistakeWrongText: {
    flex: 1,
    fontSize: 9,
    color: "#991b1b",
    lineHeight: 1.4,
  },
  mistakeRight: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 6,
    backgroundColor: "#f0fdf4",
    gap: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#bbf7d0",
    borderTopStyle: "solid",
  },
  mistakeRightText: {
    flex: 1,
    fontSize: 9,
    color: "#166534",
    lineHeight: 1.4,
  },

  // ── Pointers ──
  pointersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  pointerItem: {
    width: "48%",
    backgroundColor: "#fffbeb",
    borderRadius: 5,
    padding: 6,
    borderWidth: 0.5,
    borderColor: "#fde68a",
    borderStyle: "solid",
    flexDirection: "row",
    gap: 4,
  },
  pointerNum: {
    width: 14,
    height: 14,
    backgroundColor: "#f59e0b",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pointerNumText: {
    fontSize: 6.5,
    color: "#000",
    fontFamily: "Helvetica-Bold",
  },
  pointerKey: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#78350f",
    marginBottom: 1.5,
  },
  pointerDesc: {
    fontSize: 8,
    color: "#6b7280",
    lineHeight: 1.35,
  },

  // ── Generic text section ──
  textBlock: {
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.55,
    marginBottom: 4,
  },
  textSubheading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 3,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 20,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    borderTopStyle: "solid",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: "#94a3b8",
  },
  footerPage: {
    fontSize: 7,
    color: "#94a3b8",
  },
});

// ─── Helper: Strip markdown syntax for PDF plain text ─────────────────────────

function stripMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^#{1,3}\s+/gm, "");
}

// ─── Helper: Normalize text that may have escaped newlines ───────────────────

function normalizeText(text: string): string {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, " ")
    .trim();
}

// ─── Helper: Parse notes text into sections ───────────────────────────────────

interface NotesSection {
  heading: string;
  lines: { type: "bullet" | "numbered" | "text"; content: string; index?: number }[];
}

function parseNotesSections(raw: string): NotesSection[] {
  const text = normalizeText(raw);
  const sections: NotesSection[] = [];
  let current: NotesSection = { heading: "", lines: [] };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;

    if (line.startsWith("## ")) {
      if (current.lines.length || current.heading) sections.push(current);
      current = { heading: line.slice(3).trim(), lines: [] };
    } else if (line.match(/^[•\-]\s/)) {
      current.lines.push({ type: "bullet", content: stripMd(line.slice(2)) });
    } else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.+)/);
      if (m) current.lines.push({ type: "numbered", content: stripMd(m[2]), index: parseInt(m[1]) });
    } else {
      current.lines.push({ type: "text", content: stripMd(line) });
    }
  }
  if (current.lines.length || current.heading) sections.push(current);
  return sections;
}

// ─── Helper: Parse generic structured text ───────────────────────────────────

function parseTextSections(raw: string): { heading: string; body: string }[] {
  const text = normalizeText(raw);
  const sections: { heading: string; body: string }[] = [];
  let current = { heading: "", body: "" };

  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      if (current.body.trim() || current.heading) sections.push({ ...current });
      current = { heading: line.slice(3).trim(), body: "" };
    } else {
      current.body += line + "\n";
    }
  }
  if (current.body.trim() || current.heading) sections.push(current);

  if (!sections.length) {
    return [{ heading: "", body: stripMd(text) }];
  }
  return sections;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeaderView({ num, title, badge }: { num: number; title: string; badge: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionNumber}>
        <Text style={styles.sectionNumberText}>{String(num).padStart(2, "0")}</Text>
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBadge}>{badge}</Text>
    </View>
  );
}

function RevisionNotesView({ text }: { text: string }) {
  const sections = parseNotesSections(text);
  return (
    <View>
      {sections.map((sec, si) => (
        <View key={si}>
          {sec.heading ? <Text style={styles.notesSubheading}>{sec.heading}</Text> : null}
          {sec.lines.map((line, li) => {
            if (line.type === "bullet") {
              return (
                <View key={li} style={styles.notesBullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{line.content}</Text>
                </View>
              );
            }
            if (line.type === "numbered") {
              return (
                <View key={li} style={styles.notesNumbered}>
                  <Text style={styles.numberedIndex}>{line.index}.</Text>
                  <Text style={styles.numberedText}>{line.content}</Text>
                </View>
              );
            }
            return <Text key={li} style={styles.notesParagraph}>{line.content}</Text>;
          })}
        </View>
      ))}
    </View>
  );
}

function McqView({ mcqs }: { mcqs: RevisionPackage["mcqs"] }) {
  const diffColors: Record<string, { bg: string; text: string }> = {
    Easy: { bg: "#f0fdf4", text: "#166534" },
    Medium: { bg: "#fffbeb", text: "#92400e" },
    Hard: { bg: "#fef2f2", text: "#991b1b" },
  };

  return (
    <View>
      {mcqs.map((q, i) => {
        const diff = diffColors[q.difficulty ?? "Medium"] ?? diffColors.Medium;
        return (
          <View key={i} style={styles.mcqItem} wrap={false}>
            <View style={styles.mcqHeader}>
              <View style={styles.mcqNumBadge}>
                <Text style={styles.mcqNumText}>{i + 1}</Text>
              </View>
              <View style={[styles.mcqDiffBadge, { backgroundColor: diff.bg }]}>
                <Text style={[styles.mcqDiffText, { color: diff.text }]}>{q.difficulty ?? "Medium"}</Text>
              </View>
              <Text style={styles.mcqQuestion}>{q.question}</Text>
            </View>
            <View style={styles.mcqOptionsGrid}>
              {q.options.map((opt, j) => (
                <View key={j} style={styles.mcqOption}>
                  <Text style={styles.mcqOptionLetter}>{String.fromCharCode(65 + j)}.</Text>
                  <Text style={styles.mcqOptionText}>{opt}</Text>
                </View>
              ))}
            </View>
            <View style={styles.mcqAnswer}>
              <Text style={styles.mcqAnswerLabel}>✓ Answer: {q.answer}</Text>
              <Text style={styles.mcqAnswerText}>{q.explanation}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function DescriptiveView({ questions }: { questions: RevisionPackage["descriptiveQuestions"] }) {
  return (
    <View>
      {questions.map((q, i) => (
        <View key={i} style={styles.descItem} wrap={false}>
          <View style={styles.descHeader}>
            <View style={styles.descNumBadge}>
              <Text style={styles.sectionNumberText}>{i + 1}</Text>
            </View>
            <View style={styles.descMarksBadge}>
              <Text style={styles.descMarksText}>{q.marks}M</Text>
            </View>
            <Text style={styles.descQuestion}>{q.question}</Text>
          </View>
          <View style={styles.descAnswerBlock}>
            <Text style={styles.descAnswerLabel}>Model Answer</Text>
            <Text style={styles.descAnswerText}>{stripMd(normalizeText(q.modelAnswer))}</Text>
          </View>
          {q.answerTips ? (
            <View style={styles.descTip}>
              <Text style={styles.descTipText}>Examiner tip: {q.answerTips}</Text>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function MistakesView({ mistakes }: { mistakes: string[] }) {
  return (
    <View>
      {mistakes.map((m, i) => {
        const parts = m.split("→");
        const wrong = stripMd(parts[0]?.replace(/^[✗❌\s]+/, "").trim() ?? m);
        const right = parts[1] ? stripMd(parts[1].replace(/^[✓✅\s]+/, "").trim()) : null;
        return (
          <View key={i} style={styles.mistakeItem} wrap={false}>
            <View style={styles.mistakeWrong}>
              <Text style={styles.mistakeIcon}>✗</Text>
              <Text style={styles.mistakeWrongText}>{wrong}</Text>
            </View>
            {right ? (
              <View style={styles.mistakeRight}>
                <Text style={[styles.mistakeIcon, { color: "#16a34a" }]}>✓</Text>
                <Text style={styles.mistakeRightText}>{right}</Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function PointersView({ pointers }: { pointers: string[] }) {
  return (
    <View style={styles.pointersGrid}>
      {pointers.map((p, i) => {
        const clean = p.replace(/^🔑\s*/, "");
        const colonIdx = clean.indexOf(":");
        const key = colonIdx > 0 ? clean.slice(0, colonIdx).trim() : clean;
        const desc = colonIdx > 0 ? clean.slice(colonIdx + 1).trim() : "";
        return (
          <View key={i} style={styles.pointerItem} wrap={false}>
            <View style={styles.pointerNum}>
              <Text style={styles.pointerNumText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pointerKey}>{key}</Text>
              {desc ? <Text style={styles.pointerDesc}>{desc}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function GenericTextView({ text }: { text: string }) {
  const sections = parseTextSections(text);
  return (
    <View>
      {sections.map((sec, i) => (
        <View key={i}>
          {sec.heading ? <Text style={styles.textSubheading}>{sec.heading}</Text> : null}
          {sec.body.split("\n").filter(l => l.trim()).map((line, li) => {
            if (line.match(/^[•\-]\s/)) {
              return (
                <View key={li} style={styles.notesBullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{stripMd(line.slice(2))}</Text>
                </View>
              );
            }
            if (/^\d+\.\s/.test(line)) {
              const m = line.match(/^(\d+)\.\s(.+)/);
              if (m) return (
                <View key={li} style={styles.notesNumbered}>
                  <Text style={styles.numberedIndex}>{m[1]}.</Text>
                  <Text style={styles.numberedText}>{stripMd(m[2])}</Text>
                </View>
              );
            }
            return <Text key={li} style={styles.textBlock}>{stripMd(line)}</Text>;
          })}
        </View>
      ))}
    </View>
  );
}

// ─── Main PDF Document ────────────────────────────────────────────────────────

type PdfDocumentProps = {
  topic: string;
  studentName: string;
  generatedOn: string;
  pkg: RevisionPackage;
};

const SECTIONS = [
  { key: "revisionNotes",         label: "Revision Notes",          badge: "Core Theory",   num: 1 },
  { key: "mcqs",                  label: "ICAI-Style MCQs",          badge: "Practice",      num: 2 },
  { key: "descriptiveQuestions",  label: "Model Answers",            badge: "Marks",         num: 3 },
  { key: "commonMistakes",        label: "Mark-Loss Traps",          badge: "Critical",      num: 4 },
  { key: "answerWritingApproach", label: "Answer Writing Strategy",  badge: "Strategy",      num: 5 },
  { key: "howTopicIsTested",      label: "How This Topic is Tested", badge: "Pattern",       num: 6 },
  { key: "keyFocusAreas",         label: "Key Focus Areas",          badge: "Priority",      num: 7 },
  { key: "quickRevisionPointers", label: "Quick Revision Pointers",  badge: "Last-Day",      num: 8 },
];

export function PdfDocument({ topic, studentName, generatedOn, pkg }: PdfDocumentProps) {
  const isHigh = pkg.examRelevance?.toLowerCase().includes("high");

  return (
    <Document
      title={`ReviseCA — ${topic}`}
      author="ReviseCA"
      subject="CA Exam Revision Package"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerBrand}>ReviseCA · ICAI 2026 · Exam Revision Package</Text>
          <Text style={styles.headerTitle}>{topic}</Text>
          {pkg.topicSummary ? (
            <Text style={styles.headerSummary}>{pkg.topicSummary}</Text>
          ) : null}
          {pkg.examRelevance ? (
            <View style={[styles.relevanceBadge, { backgroundColor: isHigh ? "#fef3c7" : "#eff6ff" }]}>
              <Text style={[styles.relevanceText, { color: isHigh ? "#92400e" : "#1e40af" }]}>
                {isHigh ? "🔥 " : ""}{pkg.examRelevance}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { n: pkg.mcqs?.length ?? 0,                       l: "MCQs" },
            { n: pkg.descriptiveQuestions?.length ?? 0,       l: "Questions" },
            { n: pkg.quickRevisionPointers?.length ?? 0,      l: "Pointers" },
            { n: pkg.commonMistakes?.length ?? 0,             l: "Traps" },
          ].map(({ n, l }) => (
            <View key={l} style={styles.statBox}>
              <Text style={styles.statNumber}>{n}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Section 1: Revision Notes */}
        <View style={styles.section}>
          <SectionHeaderView num={1} title="Revision Notes" badge="Core Theory" />
          <RevisionNotesView text={pkg.revisionNotes ?? ""} />
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>ReviseCA · {topic} · Generated {generatedOn}</Text>
          <Text style={styles.footerPage} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* Section 2: MCQs */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionHeaderView num={2} title="ICAI-Style MCQs" badge="Practice" />
          <McqView mcqs={pkg.mcqs ?? []} />
        </View>
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>ReviseCA · {topic}</Text>
          <Text style={styles.footerPage} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* Section 3: Descriptive + Mistakes */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionHeaderView num={3} title="Model Answers" badge="Marks" />
          <DescriptiveView questions={pkg.descriptiveQuestions ?? []} />
        </View>
        <View style={styles.section}>
          <SectionHeaderView num={4} title="Mark-Loss Traps" badge="Critical" />
          <MistakesView mistakes={pkg.commonMistakes ?? []} />
        </View>
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>ReviseCA · {topic}</Text>
          <Text style={styles.footerPage} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* Sections 5-8 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionHeaderView num={5} title="Answer Writing Strategy" badge="Strategy" />
          <GenericTextView text={pkg.answerWritingApproach ?? ""} />
        </View>
        <View style={styles.section}>
          <SectionHeaderView num={6} title="How This Topic is Tested" badge="Pattern" />
          <GenericTextView text={pkg.howTopicIsTested ?? ""} />
        </View>
        <View style={styles.section}>
          <SectionHeaderView num={7} title="Key Focus Areas" badge="Priority" />
          <GenericTextView text={pkg.keyFocusAreas ?? ""} />
        </View>
        <View style={styles.section}>
          <SectionHeaderView num={8} title="Quick Revision Pointers" badge="Last-Day" />
          <PointersView pointers={pkg.quickRevisionPointers ?? []} />
        </View>
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>ReviseCA · {studentName} · {generatedOn}</Text>
          <Text style={styles.footerPage} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}