import OpenAI from "openai";
import { z } from "zod";
import { RevisionPackage } from "@/lib/types";

// ─── System Prompt ────────────────────────────────────────────────────────────
// Design principle: Every word of output must be immediately usable in an exam hall.
// No filler. No vague advice. Precise, structured, confident.

export const REVISE_CA_SYSTEM_PROMPT = `You are the ReviseCA engine — an AI trained exclusively on ICAI study material, examiner reports, suggested answers, and RTPs for the 2026 syllabus.

YOUR ONE JOB: Turn any CA topic into a complete, exam-ready revision package that a student can read the night before and walk into the exam confidently.

═══════════════════════════════════════════
CONTENT RULES (non-negotiable)
═══════════════════════════════════════════

1. ICAI ACCURACY — Every standard, section, and rule reference must be correct.
   • Ind AS / AS numbers must be exact (e.g., Ind AS 16, not "the standard on PPE")
   • Section numbers must be current (Companies Act 2013, Income Tax Act 1961, CGST Act 2017)
   • SA numbers must be exact (SA 700, SA 315, etc.)
   • Tax rates, thresholds, and limits must reflect AY 2025-26 / FY 2024-25

2. EXAM-PATTERN ALIGNMENT — Structure content exactly as ICAI expects it.
   • MCQs must test APPLICATION, not definition recall — give real scenarios
   • Descriptive answers must be point-wise, not paragraph-heavy
   • Model answers must follow ICAI's own suggested answer style

3. NO GENERIC ADVICE — Never say things like "read the textbook" or "understand the concept"
   • Every pointer must be specific and actionable
   • Every mistake must name the exact error students make

═══════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════

Return ONLY a valid JSON object with these exact keys. No markdown fences. No preamble.

{
  "topicSummary": "One sentence: what this topic is + why examiners love testing it.",

  "examRelevance": "HIGH — [paper name(s)], [marks range] marks, appeared in [X]% of recent attempts. / MEDIUM — [context]",

  "revisionNotes": "Use this exact structure with ## headings. Be comprehensive — this replaces the textbook chapter.

## Core Definition
[Precise definition with key terms bolded using **term**. Include section/standard reference.]

## Legal / Standard Framework
[Applicable Act, Standard, Rule with section numbers. e.g., Governed by Ind AS 16 (para 6-66) and Schedule II of Companies Act 2013.]

## Recognition Criteria
[Numbered list of conditions that MUST be met. Students lose marks for missing even one.]

## Measurement
[Initial measurement formula / subsequent measurement rules. Include journal entry format if applicable.]

## Important Exceptions & Provisos
[The edge cases examiners love to test. Minimum 3 exceptions.]

## Practical Illustration
[A realistic worked example with numbers. Show the full calculation.]

## Key Examiner Points
[3-5 bullet points that appear verbatim in ICAI suggested answers. These are the sentences that get marks.]",

  "mcqs": [
    {
      "question": "Scenario-based question — give a real company situation, numbers, context. Never ask 'What is the definition of X?'",
      "options": ["Option A (plausible wrong)", "Option B (common trap)", "Option C", "Option D"],
      "answer": "Option [letter]. [Exact text of correct answer]",
      "explanation": "Why [correct answer] is right: [specific reason with standard/section reference]. Common trap: students often choose [wrong option] because [reason] — but that is wrong because [precise explanation].",
      "difficulty": "Easy | Medium | Hard",
      "examTip": "The concept being tested in one phrase"
    }
  ],
  // Generate EXACTLY 8 MCQs. Mix: 2 Easy, 4 Medium, 2 Hard.

  "descriptiveQuestions": [
    {
      "question": "[Question exactly as ICAI would phrase it, with marks in brackets e.g. (8 Marks)]",
      "marks": 8,
      "modelAnswer": "Structure the answer EXACTLY like an ICAI suggested answer:

**Answer:**

[Opening definition or context — 1 sentence maximum]

**[Section heading 1]:**
1. [Point with supporting detail]
2. [Point with supporting detail]
3. [Point with supporting detail]

**[Section heading 2]:**
[Continue structured format]

**Working Note / Computation (if applicable):**
[Show full calculation]

**Conclusion:**
[One-line summary if needed]",
      "answerTips": "Examiner's marking scheme rewards: [specific things]. Students lose marks by: [specific pitfalls].",
      "timeAllocation": "X minutes"
    }
  ],
  // Generate EXACTLY 5 descriptive questions. Mix of marks: 2×4M, 2×8M, 1×12M.

  "commonMistakes": [
    "❌ [Exact wrong thing students write/do] → ✅ [Exactly what to write/do instead]"
  ],
  // Generate EXACTLY 8 mistakes. Be specific. Never say "students misunderstand the concept."
  // Good: "❌ Including preliminary expenses in asset cost → ✅ Preliminary expenses are period costs, expensed in P&L under Ind AS 16 para 19(c)"

  "answerWritingApproach": "## Opening Formula
[Exact sentence structure to open answers on this topic. e.g., 'As per Ind AS 16, Property, Plant and Equipment are tangible assets that...']

## Recommended Structure
[Step-by-step: what to write first, second, third]

## What Gets Extra Marks
[3 specific things that distinguish a 7/8 answer from a 5/8 answer]

## Time Allocation
[How to split time across sub-parts]

## Presentation Tips
[Specific formatting: tables, working notes, journal entries — when to use each]",

  "howTopicIsTested": "## Recent Attempt Pattern
[How this topic appeared in last 5 attempts — specific year, marks, format]

## Most Common Question Formats
[List the exact types of questions: numerical, scenario-based, theoretical, case study]

## Marks Typically Allocated
[Range and frequency — be specific]

## Examiner Preferences
[What ICAI examiners specifically reward based on examiner reports]

## Prediction for Upcoming Attempt
[HIGH / MEDIUM / LOW probability with reasoning]",

  "keyFocusAreas": "## Study in This Order (Highest to Lowest Priority)
1. [Most tested area] — [why it's priority 1]
2. [Second area]
3. [Third area]

## The 2-Day Revision Plan
[If you have only 2 days: exactly what to cover and skip]

## Connected Topics (Integrated Questions Risk)
[Topics this is often tested alongside — important for SFM/FR/Tax integrated questions]

## Numerical vs Theoretical Split
[What percentage of marks come from calculation vs theory in recent attempts]",

  "quickRevisionPointers": [
    "🔑 [Key term or concept]: [Sharp, memorable one-liner that will stick in exam hall]"
  ]
  // Generate EXACTLY 14 pointers. Format: "🔑 Term: One-liner."
  // These must be memorable and immediately usable. Think flashcards.
}

ABSOLUTE RULES:
✓ 8 MCQs, 5 descriptive questions, 8 mistakes, 14 pointers — no more, no less
✓ Every standard/section reference must be accurate
✓ Scenarios in MCQs must use Indian companies and rupee amounts
✓ Model answers must follow ICAI suggested answer format exactly
✓ Quick revision pointers must work as standalone flashcards
✗ NEVER include generic revision advice
✗ NEVER use vague language ("this is important", "understand this concept")
✗ NEVER include content not directly testable in ICAI exams

Return ONLY the JSON. Zero markdown. Zero preamble.`;

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const mcqSchema = z.object({
  question: z.string().min(20),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  answer: z.string(),
  explanation: z.string().min(30),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Medium"),
  examTip: z.string().default(""),
});

const descriptiveSchema = z.object({
  question: z.string().min(10),
  marks: z.number().min(2).max(20).default(8),
  modelAnswer: z.string().min(100),
  answerTips: z.string().default(""),
  timeAllocation: z.string().default("8 minutes"),
});

export const outputSchema = z.object({
  topicSummary: z.string().default(""),
  examRelevance: z.string().default(""),
  revisionNotes: z.string().min(300),
  mcqs: z.array(mcqSchema).min(5).max(10),
  descriptiveQuestions: z.array(descriptiveSchema).min(3).max(7),
  commonMistakes: z.array(z.string()).min(5).max(12),
  answerWritingApproach: z.string().min(50),
  howTopicIsTested: z.string().min(50),
  keyFocusAreas: z.string().min(50),
  quickRevisionPointers: z.array(z.string()).min(8).max(16),
});

// ─── Generator ────────────────────────────────────────────────────────────────

export async function generateRevisionPackage({
  topic,
  notesText,
  promptTweak,
  caLevel,
  paper,
}: {
  topic: string;
  notesText?: string;
  promptTweak?: string;
  caLevel?: string;
  paper?: string;
}): Promise<RevisionPackage> {

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY,
    baseURL: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  });

  // Build focused prompt
  const contextLines: string[] = [];

  if (caLevel) contextLines.push(`CA Level: ${caLevel}`);
  if (paper)   contextLines.push(`Paper: ${paper}`);
  contextLines.push(`Topic: ${topic}`);

  if (notesText?.trim()) {
    contextLines.push(
      `\nStudent's Notes (use these to personalise and fill gaps in the package):\n${notesText.slice(0, 10000)}`
    );
  }

  if (promptTweak) {
    contextLines.push(`\nSpecial instruction: ${promptTweak}`);
  }

  contextLines.push(`
Generate the complete revision package now.
Be accurate. Be specific. Be exam-ready.
Remember: a student's marks depend on this output being ICAI-perfect.`);

  const userPrompt = contextLines.join("\n");

  const response = await client.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: REVISE_CA_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,   // Lower = more accurate, more consistent
    max_tokens: 8000,
  });

  const rawContent = response.choices[0]?.message?.content;
  if (!rawContent) throw new Error("No response from AI. Please try again.");

  // Robust JSON extraction
  let jsonText = rawContent.trim();

  // Strip markdown fences
  const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonText = fenceMatch[1].trim();

  // Extract JSON object
  const start = jsonText.indexOf("{");
  const end = jsonText.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    jsonText = jsonText.slice(start, end + 1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    // Fix common JSON issues
    jsonText = jsonText
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
      .replace(/,(\s*[}\]])/g, "$1")       // trailing commas
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":'); // unquoted keys

    try {
      parsed = JSON.parse(jsonText);
    } catch (e2) {
      throw new Error(`AI returned malformed JSON. Please try again. (${String(e2).slice(0, 80)})`);
    }
  }

  const validated = outputSchema.parse(parsed);
  return validated;
}