import OpenAI from "openai";
import { z } from "zod";
import { RevisionPackage } from "@/lib/types";

export const REVISE_CA_SYSTEM_PROMPT = `You are ReviseCA, the most accurate and exam-focused CA revision engine in India. Your only job is to convert any CA topic into a perfect ICAI-exam-ready package.
Rules (never break these):

You are an expert CA Final rank holder + ICAI examiner perspective.
Output MUST be in clean JSON format with these exact keys: revisionNotes, mcqs, descriptiveQuestions, commonMistakes, answerWritingApproach, howTopicIsTested, keyFocusAreas, quickRevisionPointers.
All content must be 100% accurate to latest ICAI syllabus and past papers.
Make it concise but comprehensive - students are in last 30 days, so no fluff.
MCQs must be exactly ICAI style (tricky, conceptual).
Always include practical exam tips.
Use professional, motivating tone.`;

const outputSchema = z.object({
  revisionNotes: z.array(z.string()).min(8),
  mcqs: z
    .array(
      z.object({
        question: z.string(),
        options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
        correctAnswer: z.string(),
        explanation: z.string(),
      }),
    )
    .min(8)
    .max(10),
  descriptiveQuestions: z
    .array(
      z.object({
        question: z.string(),
        modelAnswer: z.string(),
      }),
    )
    .min(5)
    .max(7),
  commonMistakes: z.array(z.string()).min(5),
  answerWritingApproach: z.array(z.string()).min(5),
  howTopicIsTested: z.array(z.string()).min(5),
  keyFocusAreas: z.array(z.string()).min(5),
  quickRevisionPointers: z.array(z.string()).min(10).max(15),
});

export async function generateRevisionPackage({
  topic,
  notesText,
  promptTweak,
}: {
  topic: string;
  notesText?: string;
  promptTweak?: string;
}): Promise<RevisionPackage> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const userPrompt = [
    `Topic: ${topic}`,
    notesText ? `Uploaded Notes:\n${notesText.slice(0, 10000)}` : "Uploaded Notes: None",
    promptTweak ? `Prompt tweak: ${promptTweak}` : "",
    "Return strict JSON only.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    input: [
      { role: "system", content: REVISE_CA_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "revision_package",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: [
            "revisionNotes",
            "mcqs",
            "descriptiveQuestions",
            "commonMistakes",
            "answerWritingApproach",
            "howTopicIsTested",
            "keyFocusAreas",
            "quickRevisionPointers",
          ],
          properties: {
            revisionNotes: { type: "array", items: { type: "string" } },
            mcqs: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["question", "options", "correctAnswer", "explanation"],
                properties: {
                  question: { type: "string" },
                  options: {
                    type: "array",
                    minItems: 4,
                    maxItems: 4,
                    items: { type: "string" },
                  },
                  correctAnswer: { type: "string" },
                  explanation: { type: "string" },
                },
              },
            },
            descriptiveQuestions: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["question", "modelAnswer"],
                properties: {
                  question: { type: "string" },
                  modelAnswer: { type: "string" },
                },
              },
            },
            commonMistakes: { type: "array", items: { type: "string" } },
            answerWritingApproach: { type: "array", items: { type: "string" } },
            howTopicIsTested: { type: "array", items: { type: "string" } },
            keyFocusAreas: { type: "array", items: { type: "string" } },
            quickRevisionPointers: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  });

  const jsonText = response.output_text;
  const parsed = outputSchema.parse(JSON.parse(jsonText));
  return parsed;
}
