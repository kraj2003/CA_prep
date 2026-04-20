import OpenAI from "openai";
import { z } from "zod";
import { RevisionPackage } from "@/lib/types";

export const REVISE_CA_SYSTEM_PROMPT = `You are a senior CA examiner and coach with 15+ years of ICAI paper-setting and evaluation experience.

Your job: produce a structured, exam-ready revision package for a CA student. Every field must be precise, ICAI-accurate, and directly usable in the exam hall.

ABSOLUTE RULES:
1. Every definition must include the exact Standard / Section / Rule reference in square brackets, e.g. [Ind AS 16.7] or [Section 43(1) of Income Tax Act].
2. Every MCQ must be scenario-based: include a company name, specific rupee amount, and a date or financial year. No abstract MCQs.
3. Model answers must follow ICAI answer format: heading → statutory provision with citation → recognition/applicability criteria → application to given facts → conclusion. Write the full answer, not instructions about what to write.
4. commonMistakes: state the exact wrong text students write, then the exact correct text to write instead.
5. All tax rates, limits, and thresholds must match the assessment year relevant to the attempt.
6. Never use vague language. Never say "important provisions" — name the provision and cite it.
7. quickRevisionPointers: each pointer must be usable at 6 AM on exam day — sharp, one-line, memorable.
8. Do not pad. Every sentence must earn its place.

OUTPUT FORMAT — return ONLY valid JSON matching this exact structure. No markdown, no preamble, no explanation.

{
  "examRelevance": {
    "paperAndPart": "e.g. Paper 1: Financial Reporting — Group 1",
    "frequency": "e.g. Appeared in 7 out of last 10 attempts",
    "typicalMarks": "e.g. 8–10 marks (theory + illustration) or 2-mark MCQ",
    "lastAppeared": "e.g. Nov 2024 — Q4(b), 8 marks, revaluation of PPE",
    "prediction": "e.g. HIGH — topic not tested in May 2024, due in Nov 2025"
  },

  "revisionNotes": {
    "coreConcept": "One clear paragraph. What this topic is, why it exists, what problem it solves. Plain English.",
    "mustKnowDefinition": "Exact statutory definition in quotes. Source in square brackets at the end: [Ind AS X.Y / Section Z / Rule N]",
    "recognitionCriteria": [
      "Criterion 1 — exact wording ICAI expects, with standard reference",
      "Criterion 2",
      "Criterion 3"
    ],
    "measurementRule": "How to measure or calculate. Include the formula on its own line. Define every variable.",
    "workedExample": "Complete numerical with realistic numbers. Show every step. Include journal entries where applicable. Format as a worked solution.",
    "keyExceptions": [
      "Exception 1: [condition] — [what changes] [Standard ref]",
      "Exception 2"
    ],
    "examinerFavouritePoints": [
      "The point that appears in every model answer for this topic",
      "The comparison or distinction ICAI loves to test",
      "The disclosure requirement most students forget"
    ]
  },

  "mcqs": [
    {
      "scenario": "One sentence: company name, transaction type, specific rupee amount, date.",
      "question": "Full MCQ question exactly as ICAI would phrase it.",
      "options": ["Option A with specific value", "Option B with specific value", "Option C with specific value", "Option D with specific value"],
      "correctAnswer": "Letter and full text e.g. A — ₹5,00,000",
      "correctAnswerExplanation": "Step-by-step reason. Cite the provision. Show calculation if numerical.",
      "whyCorrect": "Same as correctAnswerExplanation — step-by-step with provision cited.",
      "wrongAnswerTrap": "Why the most common wrong option is picked and what misconception causes it.",
      "whyOthersWrong": "Same as wrongAnswerTrap.",
      "difficulty": "Easy or Medium or Hard",
      "conceptTested": "The specific provision or principle this MCQ tests.",
      "thisTestsYourUnderstandingOf": "Same as conceptTested."
    }
  ],

  "descriptiveQuestions": [
    {
      "question": "Full question exactly as ICAI would write it, including marks in brackets.",
      "exactQuestion": "Same as question field.",
      "marks": 8,
      "suggestedTime": "10 minutes",
      "timeToSpend": "Same as suggestedTime.",
      "openingLine": "The exact first sentence to write in the exam hall.",
      "openingLineToWrite": "Same as openingLine.",
      "modelAnswer": "Complete answer in ICAI format. Start with the relevant provision and citation. State recognition or applicability criteria as numbered points. Apply to the facts. State a clear conclusion. Include Working Note if numerical. Write the actual full answer here.",
      "markingBreakdown": "1 mark: definition | 2 marks: criteria | 3 marks: application | 2 marks: working note",
      "markingSchemeHints": "Same as markingBreakdown.",
      "bonusPoint": "One point that distinguishes an above-average answer — a disclosure, a comparison, or a nuance most students miss."
    }
  ],

  "commonMistakes": [
    {
      "wrongAnswer": "The exact wrong thing 60% of students write — quote it directly.",
      "mistake": "Same as wrongAnswer.",
      "whyStudentsWriteThis": "The specific misconception or trap in the question wording that causes this mistake.",
      "whyItHappens": "Same as whyStudentsWriteThis.",
      "correctAnswer": "The exact correct thing to write instead — quote it directly.",
      "correction": "Same as correctAnswer.",
      "standardReference": "The provision that settles this — cite it with section or standard number.",
      "marksImpact": "e.g. Loses 2 marks — checker marks Step 2 wrong which cascades.",
      "marksLost": "Same as marksImpact."
    }
  ],

  "answerWritingApproach": {
    "openingTemplate": "The exact template for the first line. Example: 'As per [Standard/Section], [topic] is defined as...'",
    "openingFormula": "Same as openingTemplate.",
    "structure": [
      "Step 1: [what to write first and why]",
      "Step 2: [what to write next]",
      "Step 3: [how to present the calculation or application]",
      "Step 4: [how to conclude]"
    ],
    "structureToFollow": "Step 1: [what to write first]. Step 2: [next]. Step 3: [application]. Step 4: [conclusion].",
    "checkerLooksFor": [
      "The exact phrase or heading the checker ticks",
      "The numerical format that earns presentation marks",
      "The conclusion statement that confirms the student applied the provision"
    ],
    "whatCheckerLooksFor": "The 3 things that determine marks: [1] definition with citation [2] criteria as numbered points [3] correct application with working note.",
    "timeBreakdown": "e.g. 2 min reading + 3 min theory + 5 min working note + 1 min conclusion",
    "timeAllocation": "Same as timeBreakdown.",
    "presentationFormat": "Table / journal entry / numbered list / prose — specify which and why for this topic.",
    "presentationTips": "Same as presentationFormat."
  },

  "howTopicIsTested": {
    "examPattern": [
      "May 2024 — Q3(a), 10 marks: asked for treatment of borrowing costs during construction",
      "Nov 2023 — MCQ, 2 marks: tested the capitalisation rate formula"
    ],
    "pastPaperPattern": "Specific appearances: May 2024 Q3(a) 10 marks — borrowing costs; Nov 2023 MCQ 2 marks — capitalisation rate.",
    "icaiAngle": "The specific angle ICAI always approaches this topic from. What the question is really testing.",
    "angleAlwaysTaken": "Same as icaiAngle.",
    "neverTested": "What you can safely skip — the part ICAI has never asked in 10 years.",
    "neverAsked": "Same as neverTested.",
    "questionTrick": "How the question is typically worded to mislead. The exact phrase to watch for.",
    "trickInQuestion": "Same as questionTrick."
  },

  "keyFocusAreas": {
    "highYieldAreas": [
      "Area 1 — accounts for ~40% of marks on this topic",
      "Area 2 — always appears as MCQ or part of a larger question",
      "Area 3 — most likely angle for the current attempt"
    ],
    "highYield": ["Same as highYieldAreas item 1", "Item 2", "Item 3"],
    "ifOnly2DaysLeft": "Study exactly this and nothing else: [specific sub-topics, provisions, and one worked example].",
    "linkedTopics": "This topic integrates with [Topic X] and [Topic Y]. Expect a combined question.",
    "linkToOtherTopics": "Same as linkedTopics.",
    "numericalVsTheory": "e.g. 70% marks come from numerical application, 30% from stating provisions."
  },

  "quickRevisionPointers": [
    "DEFINITION — [topic]: [one-line definition with source]",
    "CRITERIA — Recognition requires: [list conditions in 10 words]",
    "FORMULA — [name]: [formula] where [variable definitions]",
    "TRAP — Students confuse [X] with [Y]: [one-line distinction]",
    "EXCEPTION — [condition]: [what changes]",
    "EXAM HACK — Write this phrase to get marks: [exact phrase]",
    "LINK — Connects to [topic]: [one-line reason]",
    "LAST SEEN — [Attempt]: [what was asked]",
    "HIGH YIELD — [the sub-area most likely to appear]",
    "RATE/LIMIT — [specific number or threshold to memorise]",
    "DISCLOSURE — [the requirement most students forget]",
    "OPENER — Start every answer with: [exact phrase]"
  ],

  "formulaSheet": {
    "formulas": [
      {
        "name": "Formula name",
        "formula": "The formula exactly as written",
        "variables": "Define each variable clearly",
        "example": "Worked example with numbers: e.g. = 5,00,000 × 8% × 6/12 = ₹20,000"
      }
    ],
    "keyRates": [
      "Rate or limit 1 — what it applies to [AY or standard reference]",
      "Rate or limit 2"
    ],
    "mnemonics": [
      "MNEMONIC for remembering criteria or conditions"
    ]
  },

  "lastMinuteTips": [
    "If you run out of time: write [specific minimum] — partial credit is guaranteed for stating the provision",
    "If you blank out: write the definition with the standard reference first — marks flow from there",
    "Most common silly mistake on this topic: [exactly what it is] — avoid it by [what to do instead]",
    "One line that always impresses the checker: [specific sentence]"
  ]
}

Return ONLY valid JSON. No markdown code fences. No text before or after the JSON object.`;

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const examRelevanceSchema = z.object({
  paperAndPart: z.string().default(""),
  frequency: z.string().default(""),
  typicalMarks: z.string().default(""),
  lastAppeared: z.string().default(""),
  prediction: z.string().default(""),
});

const revisionNotesSchema = z.object({
  coreConcept: z.string().default(""),
  mustKnowDefinition: z.string().default(""),
  recognitionCriteria: z.array(z.string()).default([]),
  measurementRule: z.string().default(""),
  workedExample: z.string().default(""),
  keyExceptions: z.array(z.string()).default([]),
  examinerFavouritePoints: z.array(z.string()).default([]),
});

const mcqSchema = z.object({
  scenario: z.string().default(""),
  question: z.string().default(""),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctAnswer: z.string().default(""),
  correctAnswerExplanation: z.string().default(""),
  whyCorrect: z.string().default(""),
  wrongAnswerTrap: z.string().default(""),
  whyOthersWrong: z.string().default(""),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Medium"),
  conceptTested: z.string().default(""),
  thisTestsYourUnderstandingOf: z.string().default(""),
});

const descriptiveSchema = z.object({
  question: z.string().default(""),
  exactQuestion: z.string().default(""),
  marks: z.number().min(2).max(20).default(8),
  suggestedTime: z.string().default("10 minutes"),
  timeToSpend: z.string().default("10 minutes"),
  openingLine: z.string().default(""),
  openingLineToWrite: z.string().default(""),
  modelAnswer: z.string().default(""),
  markingBreakdown: z.string().default(""),
  markingSchemeHints: z.string().default(""),
  bonusPoint: z.string().default(""),
});

const commonMistakeSchema = z.object({
  wrongAnswer: z.string().default(""),
  mistake: z.string().default(""),
  whyStudentsWriteThis: z.string().default(""),
  whyItHappens: z.string().default(""),
  correctAnswer: z.string().default(""),
  correction: z.string().default(""),
  standardReference: z.string().default(""),
  marksImpact: z.string().default(""),
  marksLost: z.string().default(""),
});

const answerWritingApproachSchema = z.object({
  openingTemplate: z.string().default(""),
  openingFormula: z.string().default(""),
  structure: z.array(z.string()).default([]),
  structureToFollow: z.string().default(""),
  checkerLooksFor: z.array(z.string()).default([]),
  whatCheckerLooksFor: z.string().default(""),
  timeBreakdown: z.string().default(""),
  timeAllocation: z.string().default(""),
  presentationFormat: z.string().default(""),
  presentationTips: z.string().default(""),
});

const howTopicIsTestedSchema = z.object({
  examPattern: z.array(z.string()).default([]),
  pastPaperPattern: z.string().default(""),
  icaiAngle: z.string().default(""),
  angleAlwaysTaken: z.string().default(""),
  neverTested: z.string().default(""),
  neverAsked: z.string().default(""),
  questionTrick: z.string().default(""),
  trickInQuestion: z.string().default(""),
});

const keyFocusAreasSchema = z.object({
  highYieldAreas: z.array(z.string()).default([]),
  highYield: z.union([z.array(z.string()), z.string()]).default([]),
  ifOnly2DaysLeft: z.string().default(""),
  linkedTopics: z.string().default(""),
  linkToOtherTopics: z.string().default(""),
  numericalVsTheory: z.string().default(""),
});

const formulaItemSchema = z.object({
  name: z.string().default(""),
  formula: z.string().default(""),
  variables: z.string().default(""),
  example: z.string().default(""),
});

const formulaSheetSchema = z.object({
  formulas: z.array(formulaItemSchema).default([]),
  keyRates: z.array(z.string()).default([]),
  mnemonics: z.array(z.string()).default([]),
});

export const outputSchema = z.object({
  personalNote: z.string().default(""),
  examRelevance: examRelevanceSchema,
  revisionNotes: revisionNotesSchema,
  mcqs: z.array(mcqSchema).default([]),
  descriptiveQuestions: z.array(descriptiveSchema).default([]),
  commonMistakes: z.array(commonMistakeSchema).default([]),
  answerWritingApproach: answerWritingApproachSchema,
  howTopicIsTested: howTopicIsTestedSchema,
  keyFocusAreas: keyFocusAreasSchema,
  quickRevisionPointers: z.array(z.string()).default([]),
  formulaSheet: formulaSheetSchema,
  lastMinuteTips: z.array(z.string()).default([]),
});

// ─── Generator ───────────────────────────────────────────────────────────────

export async function generateRevisionPackage({
  topic,
  notesText,
  promptTweak,
  caLevel,
  paper,
  attemptMonth,
}: {
  topic: string;
  notesText?: string;
  promptTweak?: string;
  caLevel?: string;
  paper?: string;
  attemptMonth?: "May" | "Nov";
}): Promise<RevisionPackage> {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY,
    baseURL: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  });

  const contextParts: string[] = [];
  if (caLevel) contextParts.push(`CA Level: ${caLevel}`);
  if (paper) contextParts.push(`Paper/Subject: ${paper}`);
  if (attemptMonth) contextParts.push(`Attempt: ${attemptMonth} 2026`);
  contextParts.push(`Topic: ${topic}`);

  if (notesText?.trim()) {
    contextParts.push(
      `\nStudent's Uploaded Notes — use these to personalise the package:\n${notesText.slice(0, 12000)}`
    );
  }
  if (promptTweak) {
    contextParts.push(`\nSpecial Instructions: ${promptTweak}`);
  }
  contextParts.push(`\nReturn ONLY valid JSON. No markdown. No explanation.`);

  const userPrompt = contextParts.join("\n");

  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: REVISE_CA_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

      const rawContent = response.choices[0]?.message?.content;
      if (!rawContent) throw new Error("No response from AI model. Please try again.");

      let jsonText = rawContent.trim();

      const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) jsonText = fenceMatch[1].trim();

      const start = jsonText.indexOf("{");
      const end = jsonText.lastIndexOf("}");
      if (start !== -1 && end !== -1) jsonText = jsonText.slice(start, end + 1);

      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        jsonText = jsonText
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]");
        parsed = JSON.parse(jsonText);
      }

      return outputSchema.parse(parsed) as RevisionPackage;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Generation attempt ${attempt + 1} failed:`, lastError.message);
      if (attempt < maxRetries) continue;
      throw lastError;
    }
  }

  throw lastError ?? new Error("Generation failed.");
}