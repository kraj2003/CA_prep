import OpenAI from "openai";
import { z } from "zod";
import { RevisionPackage } from "@/lib/types";

export const REVISE_CA_SYSTEM_PROMPT = `You are ReviseCA, India’s most accurate and exam-focused CA revision engine (2026 new syllabus).
You are a CA Final All-India Rank 1 + ICAI examiner.
Convert any topic into a perfect, ready-to-score ICAI exam package.
Output ONLY valid JSON with these exact keys:
{
  "revisionNotes": string,
  "mcqs": [array of at least 5 objects with {question: string, options: [4 strings], answer: string, explanation: string}],
  "descriptiveQuestions": [array of at least 3 objects with {question: string, modelAnswer: string}],
  "commonMistakes": [array of at least 4 strings],
  "answerWritingApproach": string,
  "howTopicIsTested": string,
  "keyFocusAreas": string,
  "quickRevisionPointers": [array of at least 8 strings]
}
CRITICAL: Generate MINIMUM quantities specified. Never skip fields.
Rules: Be concise but comprehensive. Last-30-days focused. 100% accurate to latest ICAI syllabus and past papers. No fluff. Professional yet motivating tone. Never break JSON structure. Return valid JSON ONLY.`;

const outputSchema = z.object({
  revisionNotes: z.string(),
  mcqs: z
    .array(
      z.object({
        question: z.string(),
        options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
        answer: z.string(),
        explanation: z.string(),
      }),
    )
    .min(5)
    .max(10),
  descriptiveQuestions: z
    .array(
      z.object({
        question: z.string(),
        modelAnswer: z.string(),
      }),
    )
    .min(3)
    .max(7),
  commonMistakes: z.array(z.string()).min(4),
  answerWritingApproach: z.string(),
  howTopicIsTested: z.string(),
  keyFocusAreas: z.string(),
  quickRevisionPointers: z.array(z.string()).min(8).max(15),
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
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY,
    baseURL: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  });
  const userPrompt = [
    `Topic: ${topic}`,
    notesText ? `Uploaded Notes:\n${notesText.slice(0, 10000)}` : "Uploaded Notes: None",
    promptTweak ? `Prompt tweak: ${promptTweak}` : "",
    "Return strict JSON only.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await client.chat.completions.create({
    model: process.env.GROQ_MODEL ?? process.env.OPENAI_MODEL ?? "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: REVISE_CA_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  const jsonText = response.choices[0].message.content;
  if (!jsonText) {
    throw new Error("No response content from model");
  }
  
  // Extract JSON from markdown code blocks if present
  let cleanJson = jsonText;
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    cleanJson = jsonMatch[1].trim();
  }
  
  const parsed = outputSchema.parse(JSON.parse(cleanJson));
  return parsed;
}
