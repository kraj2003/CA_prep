"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2, Copy, BookOpen, Target, FileText,
  AlertTriangle, PenTool, BarChart2, Compass, Zap, Hash, Clock,
} from "lucide-react";
import { RevisionPackage } from "@/lib/types";
import { Button } from "@/components/ui/button";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { key: "revisionNotes",         label: "Revision Notes",   icon: BookOpen      },
  { key: "examRelevance",         label: "Exam Relevance",   icon: Target        },
  { key: "mcqs",                  label: "MCQs",             icon: Hash          },
  { key: "descriptiveQuestions",  label: "Model Answers",    icon: FileText      },
  { key: "commonMistakes",        label: "Mistakes & Traps", icon: AlertTriangle },
  { key: "answerWritingApproach", label: "Answer Writing",   icon: PenTool       },
  { key: "howTopicIsTested",      label: "How Tested",       icon: BarChart2     },
  { key: "keyFocusAreas",         label: "Focus Areas",      icon: Compass       },
  { key: "quickRevisionPointers", label: "Quick Revision",   icon: Zap           },
  { key: "formulaSheet",          label: "Formula Sheet",    icon: Hash          },
  { key: "lastMinuteTips",        label: "Last Minute",      icon: Clock         },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Primitives ───────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-zinc-800 my-1" />;
}

function Block({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 ${className}`}>
      {children}
    </div>
  );
}

function CodeBox({ children }: { children: string }) {
  return (
    <pre className="text-xs text-zinc-200 bg-zinc-800/70 rounded-lg p-4 whitespace-pre-wrap leading-relaxed border border-zinc-700/50 font-mono overflow-x-auto">
      {children}
    </pre>
  );
}

function Badge({ color, children }: { color: "blue" | "amber" | "emerald" | "red" | "purple"; children: React.ReactNode }) {
  const cls = {
    blue:    "bg-blue-500/10 text-blue-300 border-blue-500/20",
    amber:   "bg-amber-500/10 text-amber-300 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    red:     "bg-red-500/10 text-red-300 border-red-500/20",
    purple:  "bg-purple-500/10 text-purple-300 border-purple-500/20",
  }[color];
  return (
    <span className={`inline-block text-[11px] font-semibold rounded-md px-2 py-0.5 border ${cls}`}>
      {children}
    </span>
  );
}

function NumberedList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-zinc-200 leading-relaxed">
          <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items, accent = "zinc" }: { items: string[]; accent?: "zinc" | "emerald" | "red" | "amber" | "blue" }) {
  if (!items?.length) return null;
  const dot: Record<string, string> = {
    zinc: "bg-zinc-500", emerald: "bg-emerald-400", red: "bg-red-400", amber: "bg-amber-400", blue: "bg-blue-400",
  };
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-zinc-200 leading-relaxed">
          <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${dot[accent]} mt-2`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Section: Revision Notes ─────────────────────────────────────────────────

function RevisionNotesSection({ data }: { data: RevisionPackage["revisionNotes"] }) {
  if (!data) return null;
  return (
    <div className="space-y-5">
      {data.coreConcept && (
        <div>
          <Label>Core Concept</Label>
          <p className="text-sm text-zinc-200 leading-relaxed">{data.coreConcept}</p>
        </div>
      )}

      <Divider />

      {data.mustKnowDefinition && (
        <div>
          <Label>Statutory Definition</Label>
          <div className="border-l-2 border-blue-500 pl-4 py-2 bg-blue-500/5 rounded-r-lg pr-3">
            <p className="text-sm text-zinc-100 leading-relaxed italic">{data.mustKnowDefinition}</p>
          </div>
        </div>
      )}

      {data.recognitionCriteria?.length > 0 && (
        <div>
          <Label>Recognition / Applicability Criteria</Label>
          <NumberedList items={data.recognitionCriteria} />
        </div>
      )}

      {data.measurementRule && (
        <div>
          <Label>Measurement Rule</Label>
          <Block>
            <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{data.measurementRule}</p>
          </Block>
        </div>
      )}

      {data.workedExample && (
        <div>
          <Label>Worked Example</Label>
          <CodeBox>{data.workedExample}</CodeBox>
        </div>
      )}

      {data.keyExceptions?.length > 0 && (
        <div>
          <Label>Key Exceptions</Label>
          <BulletList items={data.keyExceptions} accent="amber" />
        </div>
      )}

      {data.examinerFavouritePoints?.length > 0 && (
        <div>
          <Label>Examiner Favourite Points</Label>
          <div className="space-y-2">
            {data.examinerFavouritePoints.map((pt, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-amber-400 shrink-0">★</span>
                <span className="text-zinc-200 leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: Exam Relevance ──────────────────────────────────────────────────

function ExamRelevanceSection({ data }: { data: RevisionPackage["examRelevance"] }) {
  if (!data) return null;
  return (
    <div className="space-y-4">
      {data.paperAndPart && (
        <Block>
          <Label>Paper & Part</Label>
          <p className="text-sm font-semibold text-white">{data.paperAndPart}</p>
        </Block>
      )}
      <div className="grid grid-cols-2 gap-3">
        {data.frequency && (
          <Block>
            <Label>Frequency</Label>
            <p className="text-sm text-zinc-100">{data.frequency}</p>
          </Block>
        )}
        {data.typicalMarks && (
          <Block>
            <Label>Typical Marks</Label>
            <p className="text-sm text-zinc-100">{data.typicalMarks}</p>
          </Block>
        )}
      </div>
      {data.lastAppeared && (
        <div>
          <Label>Last Appeared</Label>
          <p className="text-sm text-zinc-200">{data.lastAppeared}</p>
        </div>
      )}
      {data.prediction && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <Label>Prediction for This Attempt</Label>
          <p className="text-sm text-emerald-200 font-medium">{data.prediction}</p>
        </div>
      )}
    </div>
  );
}

// ─── Section: MCQs ───────────────────────────────────────────────────────────

function MCQsSection({ data }: { data: RevisionPackage["mcqs"] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  if (!data?.length) return <p className="text-sm text-zinc-500">No MCQs generated.</p>;

  function toggle(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {data.map((mcq, i) => {
        const explanation = mcq.correctAnswerExplanation || mcq.whyCorrect || "";
        const trap = mcq.wrongAnswerTrap || mcq.whyOthersWrong || "";
        const concept = mcq.conceptTested || mcq.thisTestsYourUnderstandingOf || "";

        return (
          <Block key={i}>
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-400">Q{i + 1}</span>
                <div className="flex gap-2 flex-wrap">
                  {mcq.difficulty && (
                    <Badge color={mcq.difficulty === "Easy" ? "emerald" : mcq.difficulty === "Hard" ? "red" : "amber"}>
                      {mcq.difficulty}
                    </Badge>
                  )}
                  {concept && <Badge color="blue">{concept}</Badge>}
                </div>
              </div>

              {/* Scenario */}
              {mcq.scenario && (
                <p className="text-xs text-zinc-400 italic border-l-2 border-zinc-700 pl-3 leading-relaxed">
                  {mcq.scenario}
                </p>
              )}

              {/* Question */}
              <p className="text-sm font-semibold text-zinc-100 leading-relaxed">{mcq.question}</p>

              {/* Options */}
              <div className="space-y-1.5">
                {mcq.options.map((opt, j) => (
                  <div key={j} className="flex gap-2.5 text-sm text-zinc-300 rounded-lg px-3 py-2 bg-zinc-800/50">
                    <span className="shrink-0 font-bold text-zinc-400 w-4">{String.fromCharCode(65 + j)}.</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggle(i)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                {revealed.has(i) ? "▲ Hide Answer" : "▼ Show Answer & Explanation"}
              </button>

              {/* Answer + Explanation */}
              {revealed.has(i) && (
                <div className="space-y-3 pt-2 border-t border-zinc-800">
                  <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/20 px-3 py-2">
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide mb-1">Correct Answer</p>
                    <p className="text-sm text-emerald-200">{mcq.correctAnswer}</p>
                  </div>
                  {explanation && (
                    <div>
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Why Correct</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{explanation}</p>
                    </div>
                  )}
                  {trap && (
                    <div className="rounded-lg bg-red-500/8 border border-red-500/20 px-3 py-2">
                      <p className="text-[11px] font-bold text-red-400 uppercase tracking-wide mb-1">Common Wrong Pick</p>
                      <p className="text-sm text-red-200 leading-relaxed">{trap}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Block>
        );
      })}
    </div>
  );
}

// ─── Section: Descriptive / Model Answers ────────────────────────────────────

function DescriptiveSection({ data }: { data: RevisionPackage["descriptiveQuestions"] }) {
  if (!data?.length) return <p className="text-sm text-zinc-500">No model answers generated.</p>;

  return (
    <div className="space-y-8">
      {data.map((q, i) => {
        const questionText  = q.question || q.exactQuestion || "";
        const timeText      = q.suggestedTime || q.timeToSpend || "";
        const openingText   = q.openingLine || q.openingLineToWrite || "";
        const markingText   = q.markingBreakdown || q.markingSchemeHints || "";

        return (
          <div key={i} className="space-y-4">
            {i > 0 && <Divider />}

            {/* Question */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Label>Question {i + 1}</Label>
                  <p className="text-sm font-semibold text-zinc-100 leading-relaxed">{questionText}</p>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <Badge color="amber">{q.marks} Marks</Badge>
                  {timeText && <p className="text-[11px] text-zinc-500 mt-1">{timeText}</p>}
                </div>
              </div>
            </div>

            {/* Opening line */}
            {openingText && (
              <div>
                <Label>Opening Line — Write This First</Label>
                <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 px-4 py-3">
                  <p className="text-sm text-purple-200 font-mono leading-relaxed">"{openingText}"</p>
                </div>
              </div>
            )}

            {/* Model answer */}
            {q.modelAnswer && (
              <div>
                <Label>Model Answer</Label>
                <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
                  <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{q.modelAnswer}</p>
                </div>
              </div>
            )}

            {/* Marking + bonus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {markingText && (
                <Block>
                  <Label>Marking Breakdown</Label>
                  <p className="text-xs text-zinc-300 leading-relaxed">{markingText}</p>
                </Block>
              )}
              {q.bonusPoint && (
                <Block className="border-amber-500/20 bg-amber-500/5">
                  <Label>Bonus Point</Label>
                  <p className="text-xs text-amber-200 leading-relaxed">{q.bonusPoint}</p>
                </Block>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Section: Common Mistakes ─────────────────────────────────────────────────

function CommonMistakesSection({ data }: { data: RevisionPackage["commonMistakes"] }) {
  if (!data?.length) return <p className="text-sm text-zinc-500">No common mistakes listed.</p>;

  return (
    <div className="space-y-4">
      {data.map((m, i) => {
        const wrong   = m.wrongAnswer   || m.mistake     || "";
        const why     = m.whyStudentsWriteThis || m.whyItHappens || "";
        const correct = m.correctAnswer || m.correction  || "";
        const impact  = m.marksImpact   || m.marksLost   || "";

        return (
          <Block key={i}>
            <div className="flex gap-2 items-center mb-3">
              <span className="text-xs font-bold text-zinc-400">Mistake {i + 1}</span>
              {impact && <Badge color="red">{impact}</Badge>}
            </div>

            <div className="space-y-2">
              {wrong && (
                <div className="rounded-lg bg-red-500/8 border border-red-500/20 px-3 py-2.5">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">What students write</p>
                  <p className="text-sm text-red-200 leading-relaxed">{wrong}</p>
                </div>
              )}
              {why && (
                <p className="text-xs text-zinc-400 italic px-1 leading-relaxed">{why}</p>
              )}
              {correct && (
                <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/20 px-3 py-2.5">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Write this instead</p>
                  <p className="text-sm text-emerald-200 leading-relaxed">{correct}</p>
                </div>
              )}
              {m.standardReference && (
                <p className="text-xs text-blue-400 px-1">📌 {m.standardReference}</p>
              )}
            </div>
          </Block>
        );
      })}
    </div>
  );
}

// ─── Section: Answer Writing ──────────────────────────────────────────────────

function AnswerWritingSection({ data }: { data: RevisionPackage["answerWritingApproach"] }) {
  if (!data) return null;

  const opening     = data.openingTemplate || data.openingFormula || "";
  const timeText    = data.timeBreakdown   || data.timeAllocation || "";
  const presText    = data.presentationFormat || data.presentationTips || "";
  const checkerText = data.whatCheckerLooksFor || "";

  return (
    <div className="space-y-5">
      {opening && (
        <div>
          <Label>Opening Template</Label>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 px-4 py-3">
            <p className="text-sm text-blue-200 font-mono leading-relaxed">{opening}</p>
          </div>
        </div>
      )}

      {data.structure?.length > 0 && (
        <div>
          <Label>Answer Structure</Label>
          <NumberedList items={data.structure} />
        </div>
      )}

      {data.checkerLooksFor?.length > 0 && (
        <div>
          <Label>What the Checker Ticks</Label>
          <div className="space-y-2">
            {data.checkerLooksFor.map((pt, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                <span className="text-zinc-200 leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy fallbacks */}
      {!data.structure?.length && data.structureToFollow && (
        <div>
          <Label>Structure to Follow</Label>
          <p className="text-sm text-zinc-200 leading-relaxed">{data.structureToFollow}</p>
        </div>
      )}
      {!data.checkerLooksFor?.length && checkerText && (
        <div>
          <Label>What Checker Looks For</Label>
          <p className="text-sm text-zinc-200 leading-relaxed">{checkerText}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {timeText && (
          <Block>
            <Label>Time Breakdown</Label>
            <p className="text-sm text-zinc-200">{timeText}</p>
          </Block>
        )}
        {presText && (
          <Block>
            <Label>Presentation Format</Label>
            <p className="text-sm text-zinc-200">{presText}</p>
          </Block>
        )}
      </div>
    </div>
  );
}

// ─── Section: How Topic Is Tested ────────────────────────────────────────────

function HowTestedSection({ data }: { data: RevisionPackage["howTopicIsTested"] }) {
  if (!data) return null;

  const angle   = data.icaiAngle     || data.angleAlwaysTaken || "";
  const never   = data.neverTested   || data.neverAsked       || "";
  const trick   = data.questionTrick || data.trickInQuestion  || "";

  return (
    <div className="space-y-5">
      {data.examPattern?.length > 0 && (
        <div>
          <Label>Past Paper Appearances</Label>
          <div className="space-y-2">
            {data.examPattern.map((entry, i) => (
              <div key={i} className="flex gap-3 text-sm rounded-lg bg-zinc-800/40 px-3 py-2 border border-zinc-800">
                <span className="text-blue-400 shrink-0">→</span>
                <span className="text-zinc-200">{entry}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy fallback */}
      {!data.examPattern?.length && data.pastPaperPattern && (
        <div>
          <Label>Past Paper Pattern</Label>
          <p className="text-sm text-zinc-200 leading-relaxed">{data.pastPaperPattern}</p>
        </div>
      )}

      <Divider />

      {angle && (
        <div>
          <Label>ICAI's Preferred Angle</Label>
          <p className="text-sm text-zinc-200 leading-relaxed">{angle}</p>
        </div>
      )}

      {never && (
        <div>
          <Label>Never Tested — Safe to Skip</Label>
          <p className="text-sm text-zinc-400 leading-relaxed">{never}</p>
        </div>
      )}

      {trick && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <Label>Watch Out For</Label>
          <p className="text-sm text-amber-200 leading-relaxed">{trick}</p>
        </div>
      )}
    </div>
  );
}

// ─── Section: Key Focus Areas ─────────────────────────────────────────────────

function KeyFocusSection({ data }: { data: RevisionPackage["keyFocusAreas"] }) {
  if (!data) return null;

  const highYield = data.highYieldAreas?.length
    ? data.highYieldAreas
    : Array.isArray(data.highYield)
    ? data.highYield
    : data.highYield
    ? [data.highYield]
    : [];

  const linked = data.linkedTopics || data.linkToOtherTopics || "";

  return (
    <div className="space-y-5">
      {highYield.length > 0 && (
        <div>
          <Label>High-Yield Areas</Label>
          <BulletList items={highYield as string[]} accent="emerald" />
        </div>
      )}

      {data.ifOnly2DaysLeft && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <Label>If Only 2 Days Left — Study This</Label>
          <p className="text-sm text-amber-200 leading-relaxed">{data.ifOnly2DaysLeft}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {linked && (
          <Block>
            <Label>Linked Topics</Label>
            <p className="text-sm text-zinc-200 leading-relaxed">{linked}</p>
          </Block>
        )}
        {data.numericalVsTheory && (
          <Block>
            <Label>Numerical vs Theory</Label>
            <p className="text-sm text-zinc-200">{data.numericalVsTheory}</p>
          </Block>
        )}
      </div>
    </div>
  );
}

// ─── Section: Quick Revision Pointers ────────────────────────────────────────

function QuickRevisionSection({ data }: { data: string[] }) {
  if (!data?.length) return null;
  return (
    <div className="space-y-2">
      {data.map((pointer, i) => {
        const dashIdx = pointer.indexOf("—");
        const hasLabel = dashIdx > 0 && dashIdx < 25;
        const labelText = hasLabel ? pointer.slice(0, dashIdx).replace(/^[🔑📌⚡★→•\s]+/, "").trim() : null;
        const bodyText  = hasLabel ? pointer.slice(dashIdx + 1).trim() : pointer;

        return (
          <div key={i} className="flex gap-3 rounded-lg bg-zinc-800/40 px-3 py-2.5 border border-zinc-800">
            {hasLabel ? (
              <>
                <span className="text-[11px] font-bold text-blue-400 shrink-0 w-28 leading-relaxed pt-0.5">
                  {labelText}
                </span>
                <span className="text-sm text-zinc-200 leading-relaxed">{bodyText}</span>
              </>
            ) : (
              <span className="text-sm text-zinc-200 leading-relaxed">{pointer}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Section: Formula Sheet ───────────────────────────────────────────────────

function FormulaSheetSection({ data }: { data: RevisionPackage["formulaSheet"] }) {
  // Handle case where formulaSheet is still a plain string (legacy)
  if (!data || typeof data === "string") {
    return (
      <div>
        <Label>Formulas</Label>
        <pre className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">{data as unknown as string}</pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.formulas?.length > 0 && (
        <div className="space-y-4">
          <Label>Formulas</Label>
          {data.formulas.map((f, i) => (
            <Block key={i} className="space-y-3">
              <p className="text-sm font-bold text-white">{f.name}</p>
              <div className="rounded-lg bg-zinc-800 px-4 py-3 text-center">
                <p className="text-base font-mono font-bold text-blue-300">{f.formula}</p>
              </div>
              {f.variables && (
                <p className="text-xs text-zinc-400 leading-relaxed">{f.variables}</p>
              )}
              {f.example && (
                <>
                  <Label>Example</Label>
                  <CodeBox>{f.example}</CodeBox>
                </>
              )}
            </Block>
          ))}
        </div>
      )}

      {data.keyRates?.length > 0 && (
        <div>
          <Label>Key Rates & Limits</Label>
          <BulletList items={data.keyRates} accent="amber" />
        </div>
      )}

      {data.mnemonics?.length > 0 && (
        <div>
          <Label>Mnemonics</Label>
          <div className="space-y-2">
            {data.mnemonics.map((m, i) => (
              <div key={i} className="rounded-lg bg-purple-500/8 border border-purple-500/20 px-4 py-2">
                <p className="text-sm text-purple-200 font-mono">{m}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: Last Minute Tips ────────────────────────────────────────────────

function LastMinuteSection({ data }: { data: string[] }) {
  if (!data?.length) return null;
  return (
    <div className="space-y-3">
      {data.map((tip, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3">
          <span className="text-amber-400 shrink-0 font-bold text-sm">{i + 1}.</span>
          <p className="text-sm text-zinc-200 leading-relaxed">{tip}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ResultTabs({
  data,
  revisionId,
  initialRevised = false,
}: {
  data: RevisionPackage;
  revisionId?: string;
  initialRevised?: boolean;
}) {
  const [activeKey, setActiveKey] = useState<TabKey>("revisionNotes");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRevised, setIsRevised] = useState(initialRevised);
  const [savingRevised, setSavingRevised] = useState(false);

  async function copyCurrentSection() {
    const value = data[activeKey];
    const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    await navigator.clipboard.writeText(text);
    setCopiedKey(activeKey);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  async function toggleRevised() {
    if (!revisionId) return;
    setSavingRevised(true);
    try {
      const next = !isRevised;
      const res = await fetch(`/api/revisions/${revisionId}/reviewed`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRevised: next }),
      });
      if (res.ok) setIsRevised(next);
    } finally {
      setSavingRevised(false);
    }
  }

  const sectionContent = useMemo(() => {
    switch (activeKey) {
      case "revisionNotes":         return <RevisionNotesSection   data={data.revisionNotes} />;
      case "examRelevance":         return <ExamRelevanceSection   data={data.examRelevance} />;
      case "mcqs":                  return <MCQsSection            data={data.mcqs} />;
      case "descriptiveQuestions":  return <DescriptiveSection     data={data.descriptiveQuestions} />;
      case "commonMistakes":        return <CommonMistakesSection  data={data.commonMistakes} />;
      case "answerWritingApproach": return <AnswerWritingSection   data={data.answerWritingApproach} />;
      case "howTopicIsTested":      return <HowTestedSection       data={data.howTopicIsTested} />;
      case "keyFocusAreas":         return <KeyFocusSection        data={data.keyFocusAreas} />;
      case "quickRevisionPointers": return <QuickRevisionSection   data={data.quickRevisionPointers} />;
      case "formulaSheet":          return <FormulaSheetSection    data={data.formulaSheet} />;
      case "lastMinuteTips":        return <LastMinuteSection      data={data.lastMinuteTips} />;
      default:                      return null;
    }
  }, [activeKey, data]);

  const activeTab = TABS.find((t) => t.key === activeKey)!;
  const ActiveIcon = activeTab.icon;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(8,15,32,0.95)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Revision Package
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">ICAI-aligned · 2026 syllabus</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={copyCurrentSection}
            className="h-8 text-xs border-zinc-700 text-zinc-300 hover:text-white">
            <Copy className="mr-1.5 h-3 w-3" />
            {copiedKey === activeKey ? "Copied ✓" : "Copy"}
          </Button>
          {revisionId && (
            <Button type="button" size="sm"
              variant={isRevised ? "default" : "secondary"}
              onClick={toggleRevised}
              disabled={savingRevised}
              className="h-8 text-xs">
              <CheckCircle2 className="mr-1.5 h-3 w-3" />
              {isRevised ? "Revised ✓" : "Mark Revised"}
            </Button>
          )}
        </div>
      </div>

      {/* Tab row */}
      <div
        className="flex gap-1 px-4 py-2.5 overflow-x-auto scrollbar-none"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveKey(tab.key)}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-3 w-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Section header */}
      <div className="px-5 pt-5 pb-2 flex items-center gap-2">
        <ActiveIcon className="h-4 w-4 text-blue-400" />
        <p className="text-sm font-bold text-white">{activeTab.label}</p>
      </div>

      {/* Content */}
      <div className="px-5 pb-6">{sectionContent}</div>
    </div>
  );
}