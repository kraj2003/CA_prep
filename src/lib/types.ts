// ─── Primitive building blocks ────────────────────────────────────────────────
// These types mirror the Zod schemas in src/lib/ai.ts (outputSchema,
// mcqSchema, descriptiveSchema) exactly.  Every component that reads
// a RevisionPackage uses the field names defined here, so keep them
// in sync with the AI prompt output.

export type Mcq = {
  question: string;
  options: [string, string, string, string];
  answer: string;       // e.g. "A. ₹48.55 lakhs"
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  examTip: string;
};

export type DescriptiveQuestion = {
  question: string;
  marks: number;
  modelAnswer: string;
  answerTips: string;
  timeAllocation: string;
};

// ─── Top-level package ────────────────────────────────────────────────────────

export type RevisionPackage = {
  topicSummary: string;
  examRelevance: string;
  revisionNotes: string;
  mcqs: Mcq[];
  descriptiveQuestions: DescriptiveQuestion[];
  commonMistakes: string[];          // "❌ wrong → ✅ right" strings
  answerWritingApproach: string;
  howTopicIsTested: string;
  keyFocusAreas: string;
  quickRevisionPointers: string[];   // "🔑 Key: Description" strings
};

// ─── Database record ──────────────────────────────────────────────────────────

export type RevisionRecord = {
  id: string;
  user_id: string;
  topic: string;
  source_text: string | null;
  package_json: RevisionPackage;
  created_at: string;
  is_revised: boolean;
};

// ─── API response shapes ──────────────────────────────────────────────────────

export type GenerateResponse = {
  revisionId: string | null;
  data: RevisionPackage;
  topic: string;
  warning?: string;
};