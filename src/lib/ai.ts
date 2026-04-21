import OpenAI from "openai";
import { z } from "zod";
import { RevisionPackage } from "@/lib/types";

// ─── PROMPT ───────────────────────────────────────────────────────────────────
// KEY FIX: All multi-line strings use actual \n characters in the JSON values,
// NOT escaped \\n — the renderer splits on \n to display structured content.

export const REVISE_CA_SYSTEM_PROMPT = `You are ReviseCA — the ICAI exam preparation engine for CA Foundation, Intermediate, and Final 2026.

YOUR MISSION: Generate a complete, structured revision package that a CA student can read the night before the exam and walk in confident. Every word must be directly exam-usable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT ACCURACY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• All standard/section references must be exact and current
  - Ind AS references: include paragraph numbers e.g. Ind AS 16 para 7
  - Income Tax: AY 2025-26 rates and provisions
  - GST: CGST Act 2017, current rates
  - Companies Act 2013: exact section numbers
  - SA references: exact SA numbers e.g. SA 315, SA 700

• MCQs must be SCENARIO-BASED — a real company situation, real numbers, a choice to make
  - NEVER ask "What is the definition of X?" or "Which standard covers Y?"
  - ALWAYS give context: "XYZ Ltd, an Indian company, did [specific thing]. What is the correct treatment?"

• Descriptive answers must be point-wise — exactly as ICAI writes suggested answers
  - Not paragraphs. Points with clear headings.

• Mistakes must be SPECIFIC to this topic
  - NEVER say "students often misunderstand this concept"
  - ALWAYS name the exact wrong thing and the exact right thing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL FORMAT RULE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALL multi-line text fields (revisionNotes, modelAnswer, answerWritingApproach, howTopicIsTested, keyFocusAreas) MUST use actual newline characters inside the JSON string — NOT the two-character sequence backslash-n.

In JSON strings, represent a newline as a literal line break within the string, which JSON encodes as \\n. This means the revisionNotes value should look like:
"## Core Definition\\n\\nArm's Length Price (ALP) is...\\n\\n## Legal Framework\\n\\nGoverned by..."

This is the standard JSON encoding. Do NOT collapse everything onto one line.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT — Return ONLY this JSON object
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "topicSummary": "Single sentence: what this topic is and why ICAI examiners test it.",

  "examRelevance": "HIGH — [papers], [marks range], [frequency e.g. appeared in 8 of last 10 attempts]",

  "revisionNotes": "## Core Definition\\n\\n[Precise ICAI definition. Bold key terms with **term**. Cite standard/section.]\\n\\n## Legal & Standard Framework\\n\\n[Exact Act/Standard/Rule with section/paragraph numbers.]\\n\\n## Recognition Criteria\\n\\n1. [First condition — students lose marks if they miss this]\\n2. [Second condition]\\n3. [Third condition]\\n\\n## Measurement\\n\\n[Formula or step-by-step calculation method. Include journal entry if applicable.]\\n\\n## Exceptions & Special Cases\\n\\n1. [Exception 1 — commonly tested]\\n2. [Exception 2]\\n3. [Exception 3]\\n\\n## Practical Illustration\\n\\n[A realistic worked example. Indian company name. Rupee amounts. Show full working.]\\n\\n## Key Points for Marks\\n\\n- [Phrase that appears in ICAI model answers — use these exact words]\\n- [Second key phrase]\\n- [Third key phrase]",

  "mcqs": [
    {
      "question": "M/s Rajan Industries, an Indian manufacturer, purchased a CNC machine for ₹45 lakhs. The company paid ₹3 lakhs for installation, ₹1.5 lakhs for a 3-year annual maintenance contract, and incurred ₹80,000 in trial run costs (producing goods sold for ₹25,000). What is the initial cost of the machine as per Ind AS 16?",
      "options": [
        "₹48.55 lakhs",
        "₹48 lakhs",
        "₹49.55 lakhs",
        "₹47.25 lakhs"
      ],
      "answer": "A. ₹48.55 lakhs",
      "explanation": "As per Ind AS 16 para 16-17, initial cost = Purchase price + Installation + Net trial run costs. Cost = ₹45L + ₹3L + (₹0.80L - ₹0.25L) = ₹48.55L. Maintenance contract is a period cost — excluded per para 19(b). Common trap: students include the full maintenance cost or forget to net off trial run sale proceeds.",
      "difficulty": "Medium",
      "examTip": "Ind AS 16 para 16-19 — what to include and exclude from initial cost"
    }
  ],

  "descriptiveQuestions": [
    {
      "question": "Explain the concept of Arm's Length Price under transfer pricing provisions. How is it determined? (8 Marks)",
      "marks": 8,
      "modelAnswer": "**Answer:**\\n\\n**Meaning of Arm's Length Price [ALP]:**\\n\\nALP is the price that would be charged in a transaction between unrelated parties in uncontrolled conditions, as per Section 92F(ii) of the Income Tax Act, 1961.\\n\\n**Applicability:**\\n\\n1. The transaction must be between **associated enterprises** as defined u/s 92A.\\n2. It must be an **international transaction** or a **specified domestic transaction**.\\n3. The transaction can involve: transfer of goods, provision of services, lending, guarantee, or cost allocation.\\n\\n**Methods for determining ALP [Section 92C]:**\\n\\n1. **CUP Method** — Comparable Uncontrolled Price: Most reliable when comparable uncontrolled transactions exist.\\n2. **Resale Price Method (RPM)** — Used when the associated enterprise acts as a distributor.\\n3. **Cost Plus Method (CPM)** — Applied when goods are manufactured for an AE.\\n4. **TNMM** — Transactional Net Margin Method: Compares net profit margin relative to costs/sales/assets.\\n5. **Profit Split Method** — Used in highly integrated transactions.\\n6. **Other Method** — Any other method prescribed by CBDT.\\n\\n**Most Appropriate Method:**\\n\\nThe taxpayer must use the method that provides the **most reliable measure** of ALP considering the facts and circumstances.\\n\\n**Illustration:**\\n\\nIf ABC Ltd (India) sells goods to XYZ Inc (USA, its AE) at ₹90 per unit, but comparable uncontrolled price is ₹100 per unit, then ALP = ₹100. The adjustment of ₹10 per unit is added back to income.",
      "answerTips": "Marks come from: citing Section 92F(ii) and 92C, listing all 6 methods with brief descriptions, and giving an illustration. Students lose marks by only naming 3-4 methods without explanation.",
      "timeAllocation": "10 minutes"
    }
  ],

  "commonMistakes": [
    "❌ Capitalising maintenance/service contract costs as part of PPE cost → ✅ Maintenance contracts are period costs — expensed in P&L per Ind AS 16 para 19(b)",
    "❌ Not netting off trial run proceeds from trial run costs → ✅ Net amount (trial run costs MINUS proceeds from sale of output) is capitalised per Ind AS 16 para 17(e)",
    "❌ Confusing initial cost with replacement cost → ✅ Only initial recognition uses cost model; replacement is treated as a separate asset and old component derecognised",
    "❌ Including preliminary expenses in asset cost → ✅ Preliminary expenses are period costs under Ind AS 16 para 19(c) — never capitalised",
    "❌ Crediting revaluation surplus directly to P&L → ✅ Revaluation surplus goes to Other Comprehensive Income (OCI), not P&L per Ind AS 16 para 39",
    "❌ Applying straight-line depreciation without review of useful life → ✅ Residual value and useful life must be reviewed at least at each financial year-end per Ind AS 16 para 51",
    "❌ Forgetting borrowing cost capitalisation conditions → ✅ Only qualifying assets can capitalise borrowing costs; must apply Ind AS 23 — ordinary PPE does NOT automatically qualify",
    "❌ Treating impairment loss as a revaluation decrease → ✅ Impairment is governed by Ind AS 36, not Ind AS 16; different accounting treatment applies"
  ],

  "answerWritingApproach": "## Opening Formula\\n\\nAlways open with: 'As per [Standard/Section], [topic definition in one sentence].'\\n\\nExample: 'As per Ind AS 16, Property, Plant and Equipment are tangible items held for use in production, supply of goods/services, rental, or administrative purposes and expected to be used for more than one accounting period.'\\n\\n## Recommended Structure\\n\\n1. Definition (1-2 lines with standard reference)\\n2. Conditions/Criteria (numbered list)\\n3. Measurement/Treatment (point-wise)\\n4. Exceptions (if applicable)\\n5. Journal Entry or Illustration (for numerical parts)\\n6. Conclusion (one line if asked for opinion/recommendation)\\n\\n## What Gets Extra Marks\\n\\n- Citing exact paragraph numbers (e.g., Ind AS 16 para 17) — examiners reward precision\\n- Journal entries with narrations for accounting treatment questions\\n- Distinguishing between initial recognition and subsequent measurement\\n\\n## Time Allocation\\n\\n- 4-mark question: 5 minutes, 3-4 points, no illustration needed\\n- 8-mark question: 10 minutes, structured with headings, 1 illustration\\n- 12-mark question: 15 minutes, full treatment with all sub-parts\\n\\n## Presentation Tips\\n\\n- Use tabular format for comparative questions (e.g., AS vs Ind AS)\\n- Always show working notes for numerical answers\\n- Underline or bold the key term in your opening definition",

  "howTopicIsTested": "## Recent Attempt Pattern\\n\\n- May 2024: 8-mark numerical on initial measurement of PPE including borrowed funds\\n- Nov 2023: MCQ on which costs to include/exclude from PPE cost\\n- May 2023: 12-mark case study on revaluation model vs cost model\\n- Nov 2022: 4-mark theory on depreciation methods\\n- May 2022: MCQ on treatment of subsequent expenditure\\n\\n## Most Common Question Formats\\n\\n1. **Numerical** — Given a list of costs, calculate the initial carrying amount (most frequent)\\n2. **Scenario theory** — 'Advise whether this cost should be capitalised or expensed'\\n3. **MCQ** — Identify correct accounting treatment from 4 options\\n4. **Compare** — Differences between cost model and revaluation model\\n\\n## Marks Typically Allocated\\n\\nMCQs: 1-2 marks each | Short theory: 4 marks | Full numerical: 8-12 marks\\n\\n## Examiner Preferences\\n\\nExaminers reward students who cite paragraph numbers, write structured point-wise answers, and show clear working notes.\\n\\n## Prediction for Next Attempt\\n\\nHIGH probability — this topic has appeared in 9 of last 10 attempts. Expected format: numerical with a mix of capitalisable and non-capitalisable items.",

  "keyFocusAreas": "## Priority Order for Study\\n\\n1. **Initial Cost Computation** — Most tested. Know exactly what goes in (Ind AS 16 para 16-17) and what stays out (para 19). This alone is 40% of all PPE questions.\\n2. **Depreciation Methods** — Straight line vs WDV, change in method treatment, residual value review.\\n3. **Revaluation Model** — Surplus to OCI, deficit to P&L, derecognition on disposal.\\n4. **Subsequent Expenditure** — Capitalise vs expense: the test is whether it extends useful life or restores expected future benefits.\\n5. **Impairment** — Link to Ind AS 36, know the difference between impairment loss and revaluation decrease.\\n\\n## The 2-Day Revision Plan\\n\\nDay 1: Master initial cost computation (para 16-19) + 5 MCQs\\nDay 2: Revaluation model + subsequent expenditure + quick pointers\\nSkip: Deep IFRS comparisons unless specifically on FR syllabus\\n\\n## Connected Topics (Watch for Integrated Questions)\\n\\n- **Ind AS 23** — Borrowing Costs (capitalisation of interest on qualifying assets)\\n- **Ind AS 36** — Impairment of Assets\\n- **Ind AS 40** — Investment Property (what is excluded from Ind AS 16)\\n- **Schedule II** — Companies Act 2013 useful lives (tested alongside Ind AS 16)\\n\\n## Numerical vs Theoretical Split\\n\\n65% numerical, 35% theory in recent CA Final attempts. Focus on numerical first.",

  "quickRevisionPointers": [
    "🔑 ALP Definition: Price between unrelated parties in uncontrolled conditions — Section 92F(ii) ITA 1961",
    "🔑 Methods (6): CUP, RPM, CPM, TNMM, Profit Split, Other — all prescribed u/s 92C",
    "🔑 Associated Enterprise: Defined u/s 92A — parent-subsidiary, 26%+ voting power, or board control",
    "🔑 CUP is King: Most reliable method when comparable uncontrolled transactions exist",
    "🔑 Tolerance Band: ±1% for commodity transactions, ±3% for others (Rule 10CA)",
    "🔑 Documentation u/s 92D: Mandatory if international transaction value > ₹1 crore",
    "🔑 Safe Harbour Rules: Rule 10TD/10TE — ALP deemed correct if margin within specified range",
    "🔑 Secondary Adjustment u/s 92CE: Excess profit treated as advance — interest applies after 90 days",
    "🔑 Advance Pricing Agreement: Pre-agreed ALP for 5 years — Section 92CC",
    "🔑 TPO (Transfer Pricing Officer): AO refers to TPO u/s 92CA for detailed examination",
    "🔑 Penalty u/s 271AA: 2% of transaction value for not maintaining/furnishing documentation",
    "🔑 MAT & Transfer Pricing: Transfer pricing adjustments also apply for MAT computation",
    "🔑 Deemed International Transaction: Transactions via third party but for AE benefit — Section 92B(2)",
    "🔑 BEPS Alignment: India follows OECD Transfer Pricing Guidelines for interpretation"
  ]
}

ABSOLUTE RULES:
✓ Return ONLY the JSON object — no markdown fences, no preamble, no explanation
✓ MCQs must ALL be scenario-based with Indian companies and ₹ amounts
✓ Generate exactly 8 MCQs (mix: 2 Easy, 4 Medium, 2 Hard)
✓ Generate exactly 5 descriptive questions (mix of marks: 4M, 4M, 8M, 8M, 12M)
✓ Generate exactly 8 mistakes in ❌ wrong → ✅ right format
✓ Generate exactly 14 quick revision pointers in 🔑 Key: Description format
✓ Multi-line fields MUST use \\n to separate lines within the JSON string
✓ All standard/section references must be accurate for ICAI 2026 syllabus`;

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
  timeAllocation: z.string().default("10 minutes"),
});

export const outputSchema = z.object({
  topicSummary:             z.string().default(""),
  examRelevance:            z.string().default(""),
  revisionNotes:            z.string().min(200),
  mcqs:                     z.array(mcqSchema).min(5).max(10),
  descriptiveQuestions:     z.array(descriptiveSchema).min(3).max(7),
  commonMistakes:           z.array(z.string()).min(5).max(12),
  answerWritingApproach:    z.string().min(50),
  howTopicIsTested:         z.string().min(50),
  keyFocusAreas:            z.string().min(50),
  quickRevisionPointers:    z.array(z.string()).min(8).max(16),
});

// ─── Post-process: ensure \n is real newline ──────────────────────────────────

function normaliseNewlines(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      result[k] = v.replace(/\\n/g, "\n").replace(/\\t/g, " ");
    } else if (Array.isArray(v)) {
      result[k] = v.map(item =>
        typeof item === "object" && item !== null
          ? normaliseNewlines(item as Record<string, unknown>)
          : typeof item === "string"
          ? item.replace(/\\n/g, "\n")
          : item
      );
    } else {
      result[k] = v;
    }
  }
  return result;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export async function generateRevisionPackage({
  topic,
  notesText,
  promptTweak,
  caLevel,
  paper,
  attemptMonth,  // FIX: added to parameter type — was missing, causing TS error in generate/route.ts
}: {
  topic: string;
  notesText?: string;
  promptTweak?: string;
  caLevel?: string;
  paper?: string;
  attemptMonth?: "May" | "Nov";  // FIX: "May" | "Nov" | undefined — matches route.ts derivation
}): Promise<RevisionPackage> {

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY,
    baseURL: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  });

  const lines: string[] = [];
  if (caLevel)      lines.push(`CA Level: ${caLevel}`);
  if (paper)        lines.push(`Paper: ${paper}`);
  if (attemptMonth) lines.push(`Target Attempt: ${attemptMonth} 2026`);  // FIX: now used in prompt
  lines.push(`Topic: ${topic}`);

  if (notesText?.trim()) {
    lines.push(`\nStudent Notes to incorporate:\n${notesText.slice(0, 10000)}`);
  }
  if (promptTweak) {
    lines.push(`\nSpecial instruction: ${promptTweak}`);
  }

  lines.push(`\nGenerate the complete revision package now. Be ICAI-accurate. Be scenario-specific for MCQs. Use \\n in multi-line JSON string values to separate lines.`);

  const response = await client.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: REVISE_CA_SYSTEM_PROMPT },
      { role: "user",   content: lines.join("\n") },
    ],
    temperature: 0.25,
    max_tokens: 8000,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI model. Please try again.");

  // Strip markdown fences if present
  let jsonText = raw.trim();
  const fence = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) jsonText = fence[1].trim();

  // Extract JSON object boundaries
  const start = jsonText.indexOf("{");
  const end   = jsonText.lastIndexOf("}");
  if (start !== -1 && end > start) jsonText = jsonText.slice(start, end + 1);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonText) as Record<string, unknown>;
  } catch {
    // Attempt fixes for common issues
    const fixed = jsonText
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
      .replace(/,(\s*[}\]])/g, "$1");
    try {
      parsed = JSON.parse(fixed) as Record<string, unknown>;
    } catch (e2) {
      throw new Error(`AI returned malformed JSON. Please regenerate. (${String(e2).slice(0, 80)})`);
    }
  }

  // Normalise escaped newlines
  const normalised = normaliseNewlines(parsed);
  const validated  = outputSchema.parse(normalised);
  return validated;
}