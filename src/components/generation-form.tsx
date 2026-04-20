"use client";

import { useState, useRef, useCallback } from "react";
import {
  Loader2, Sparkles, Upload, X, RotateCw, ChevronDown, ChevronUp,
  BookOpen, Brain, FileText, Target, Zap, TrendingUp, Star, CheckCircle2,
  Copy, Check, Download, Save, AlertTriangle, Clock, Award, Flame,
  FileUp, Lightbulb, ArrowRight, RefreshCw, Settings2, Cloud, Heart, Calculator
} from "lucide-react";
import { RevisionPackage, GenerateResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const CA_LEVELS = ["Foundation", "Intermediate", "Final"];

const PAPERS_BY_LEVEL: Record<string, string[]> = {
  Foundation: [
    "Principles & Practice of Accounting",
    "Business Laws & Business Correspondence",
    "Business Mathematics & Statistics",
    "Business Economics & Business & Commercial Knowledge",
  ],
  Intermediate: [
    "Advanced Accounting",
    "Corporate & Other Laws",
    "Taxation (IT + GST)",
    "Cost & Management Accounting",
    "Auditing & Code of Ethics",
    "Financial Management & Strategic Management",
  ],
  Final: [
    "Financial Reporting (FR)",
    "Strategic Financial Management (SFM)",
    "Advanced Auditing, Assurance & Professional Ethics",
    "Corporate & Economic Laws",
    "Strategic Cost & Performance Management (SCMPE)",
    "Elective Paper",
    "Direct Tax Laws & International Taxation (DT)",
    "Indirect Tax Laws (IDT)",
  ],
};

const SUGGESTED_TOPICS = [
  "Ind AS 16 – Property, Plant & Equipment",
  "GST – Input Tax Credit (Section 16-17)",
  "Transfer Pricing – Arm's Length Price",
  "Capital Budgeting – NPV & IRR",
  "Statutory Audit – SA 700 Series",
  "Amalgamation – AS 14",
  "Deferred Tax – Ind AS 12",
  "Cash Flow Statement – AS 3",
];

const TWEAK_PRESETS = [
  { label: "More MCQs", value: "Generate 10 MCQs with harder difficulty, more scenario-based" },
  { label: "More Concise", value: "Make revision notes shorter and more bullet-point focused" },
  { label: "More Numericals", value: "Add more numerical examples and solved illustrations" },
  { label: "Exam Day Focus", value: "Focus on last-minute pointers and most frequently tested aspects only" },
];

const SECTION_CONFIG = [
  {
    key: "personalNote" as const,
    icon: Heart,
    label: "Personal Note",
    color: "rose",
    desc: "Motivation + what to focus on",
    badge: "Start Here",
  },
  {
    key: "examRelevance" as const,
    icon: Flame,
    label: "Exam Relevance",
    color: "amber",
    desc: "Frequency + marks + prediction",
    badge: "Priority",
  },
  {
    key: "revisionNotes" as const,
    icon: BookOpen,
    label: "Revision Notes",
    color: "blue",
    desc: "Core concept + definitions + worked example",
    badge: "Core",
  },
  {
    key: "mcqs" as const,
    icon: Brain,
    label: "ICAI-Style MCQs",
    color: "purple",
    desc: "8 scenario-based with ₹ amounts",
    badge: "Practice",
  },
  {
    key: "descriptiveQuestions" as const,
    icon: FileText,
    label: "Descriptive Questions",
    color: "indigo",
    desc: "Model answers + marking scheme",
    badge: "Marks",
  },
  {
    key: "commonMistakes" as const,
    icon: AlertTriangle,
    label: "Common Mistakes & Traps",
    color: "amber",
    desc: "What NOT to write + why",
    badge: "Critical",
  },
  {
    key: "answerWritingApproach" as const,
    icon: Zap,
    label: "Answer Writing Strategy",
    color: "green",
    desc: "Opening formula + structure",
    badge: "Strategy",
  },
  {
    key: "howTopicIsTested" as const,
    icon: TrendingUp,
    label: "How It's Tested",
    color: "cyan",
    desc: "Past papers + angles + tricks",
    badge: "Insight",
  },
  {
    key: "keyFocusAreas" as const,
    icon: Star,
    label: "Key Focus Areas",
    color: "orange",
    desc: "High-yield + 2-day plan",
    badge: "Priority",
  },
  {
    key: "quickRevisionPointers" as const,
    icon: CheckCircle2,
    label: "Quick Revision Pointers",
    color: "emerald",
    desc: "12–15 exam-day bullets",
    badge: "Final",
  },
  {
    key: "formulaSheet" as const,
    icon: Calculator,
    label: "Formula Sheet",
    color: "violet",
    desc: "All formulas with examples",
    badge: "Numerical",
  },
  {
    key: "lastMinuteTips" as const,
    icon: Clock,
    label: "Last Minute Tips",
    color: "red",
    desc: "If you run out of time...",
    badge: "Emergency",
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string; icon: string }> = {
  blue:    { bg: "bg-blue-50 dark:bg-blue-950/30",     border: "border-blue-200 dark:border-blue-800",     text: "text-blue-900 dark:text-blue-100",     badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",     icon: "text-blue-600" },
  purple:  { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", text: "text-purple-900 dark:text-purple-100", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300", icon: "text-purple-600" },
  indigo:  { bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800", text: "text-indigo-900 dark:text-indigo-100", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300", icon: "text-indigo-600" },
  amber:   { bg: "bg-amber-50 dark:bg-amber-950/30",   border: "border-amber-200 dark:border-amber-800",   text: "text-amber-900 dark:text-amber-100",   badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",   icon: "text-amber-600" },
  green:   { bg: "bg-green-50 dark:bg-green-950/30",   border: "border-green-200 dark:border-green-800",   text: "text-green-900 dark:text-green-100",   badge: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",   icon: "text-green-600" },
  cyan:    { bg: "bg-cyan-50 dark:bg-cyan-950/30",     border: "border-cyan-200 dark:border-cyan-800",     text: "text-cyan-900 dark:text-cyan-100",     badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",     icon: "text-cyan-600" },
  orange:  { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", text: "text-orange-900 dark:text-orange-100", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300", icon: "text-orange-600" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30",border: "border-emerald-200 dark:border-emerald-800",text: "text-emerald-900 dark:text-emerald-100",badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",icon: "text-emerald-600" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
        copied
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
        className,
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function SectionRevisedToggle({
  sectionKey,
  revisionId,
}: {
  sectionKey: string;
  revisionId?: string | null;
}) {
  const [revised, setRevised] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    if (!revisionId) { setRevised((p) => !p); return; }
    setSaving(true);
    setRevised((p) => !p);
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-300",
        revised
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
          : "bg-white text-zinc-600 border-2 border-zinc-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400",
      )}
    >
      {saving ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : revised ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <CheckCircle2 className="h-5 w-5 opacity-50" />
      )}
      {revised ? "Revised!" : "Mark as Revised"}
    </button>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-2 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="mt-6 mb-3 text-base font-bold text-[#1a365d] dark:text-blue-200 border-b border-zinc-200 dark:border-zinc-700 pb-1 first:mt-0">
              {line.slice(3)}
            </h3>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h2 key={i} className="mt-6 mb-3 text-lg font-black text-[#1a365d] dark:text-blue-200 first:mt-0">
              {line.slice(2)}
            </h2>
          );
        }
        if (line.startsWith("• ") || line.startsWith("- ")) {
          const text = line.slice(2);
          return (
            <div key={i} className="flex gap-3 ml-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1a365d]" />
              <span className="text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: renderInline(text) }} />
            </div>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.+)/);
          if (match) {
            return (
              <div key={i} className="flex gap-2 ml-2">
                <span className="flex-shrink-0 font-bold text-[#1a365d]">{match[1]}.</span>
                <span className="text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: renderInline(match[2]) }} />
              </div>
            );
          }
        }
        if (line.startsWith("❌") || line.startsWith("✅") || line.startsWith("🔑") || line.startsWith("⚠️")) {
          return (
            <div key={i} className="text-zinc-700 dark:text-zinc-300 ml-2" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
          );
        }
        if (line.trim() === "") return <div key={i} className="h-3" />;
        return (
          <p key={i} className="text-zinc-700 dark:text-zinc-300 ml-2" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
        );
      })}
    </div>
  );
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-zinc-900 dark:text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-zinc-700 dark:text-zinc-300">$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-xs font-mono text-[#0052CC]">$1</code>');
}

// ─── Section Components ───────────────────────────────────────────────────────

function RevisionNotesSection({ data }: { data: string }) {
  return (
    <div className="rounded-lg border border-zinc-300 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-l-4 border-[#1a365d] pl-4">
        <MarkdownRenderer content={data} />
      </div>
    </div>
  );
}

function McqSection({ data }: { data: RevisionPackage["mcqs"] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const toggleReveal = (i: number) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const diffColor: Record<string, string> = {
    Easy: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
    Medium: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    Hard: "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
  };

  return (
    <div className="space-y-3">
      {data.map((mcq, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1a365d] text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className={cn("rounded border px-2 py-0.5 text-xs font-medium", diffColor[mcq.difficulty ?? "Medium"])}>
              {mcq.difficulty ?? "Medium"}
            </span>
            {mcq.thisTestsYourUnderstandingOf && (
              <span className="text-xs text-zinc-500">💡 {mcq.thisTestsYourUnderstandingOf}</span>
            )}
          </div>
          {mcq.scenario && (
            <div className="mb-2 rounded bg-zinc-100 p-2 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              📋 {mcq.scenario}
            </div>
          )}
          <p className="mb-3 font-medium text-zinc-900 dark:text-white">{mcq.question}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {mcq.options.map((opt, j) => {
              const letter = String.fromCharCode(65 + j);
              const isCorrect = revealed.has(i) && (mcq.correctAnswer?.includes(letter) || mcq.correctAnswer === opt);
              return (
                <div
                  key={j}
                  className={cn(
                    "rounded border p-2.5 text-sm",
                    isCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
                  )}
                >
                  <span className="font-semibold mr-1.5">{letter}.</span>
                  {opt}
                  {isCorrect && <Check className="ml-2 inline h-3 w-3" />}
                </div>
              );
            })}
          </div>
          {revealed.has(i) && (
            <div className="mt-3 rounded border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                ✓ Answer: {mcq.correctAnswer}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{mcq.whyCorrect}</p>
              {mcq.whyOthersWrong && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">❌ {mcq.whyOthersWrong}</p>
              )}
            </div>
          )}
          <button
            onClick={() => toggleReveal(i)}
            className={cn(
              "mt-2 text-sm font-medium",
              revealed.has(i) ? "text-zinc-500" : "text-[#1a365d] dark:text-blue-400",
            )}
          >
            {revealed.has(i) ? "Hide Answer" : "Reveal Answer"}
          </button>
        </div>
      ))}
    </div>
  );
}

function DescriptiveSection({ data }: { data: RevisionPackage["descriptiveQuestions"] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));
  const toggle = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div className="space-y-2">
      {data.map((q, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <button
            onClick={() => toggle(i)}
            className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-[#1a365d] text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">{q.exactQuestion}</p>
                <div className="mt-1 flex gap-2">
                  <span className="rounded bg-[#1a365d]/10 px-2 py-0.5 text-xs font-medium text-[#1a365d] dark:text-blue-400">
                    {q.marks} Marks
                  </span>
                  <span className="text-xs text-zinc-500">⏱ {q.timeToSpend}</span>
                </div>
              </div>
            </div>
            {expanded.has(i) ? (
              <ChevronUp className="h-4 w-4 flex-shrink-0 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-400" />
            )}
          </button>
          {expanded.has(i) && (
            <div className="border-t border-zinc-100 p-4 dark:border-zinc-700">
              {q.openingLineToWrite && (
                <div className="mb-3 rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Opening Line</p>
                  <p className="text-sm text-blue-900 dark:text-blue-200 font-mono">{q.openingLineToWrite}</p>
                </div>
              )}
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-[#1a365d] uppercase tracking-wider dark:text-blue-400">Model Answer</p>
                <CopyButton text={q.modelAnswer} />
              </div>
              <div className="rounded border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <MarkdownRenderer content={q.modelAnswer} />
              </div>
              {q.markingSchemeHints && (
                <div className="mt-3 flex gap-2 rounded border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                  <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">{q.markingSchemeHints}</p>
                </div>
              )}
              {q.bonusPoint && (
                <div className="mt-3 flex gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  <p className="text-xs text-emerald-800 dark:text-emerald-200">{q.bonusPoint}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MistakesSection({ data }: { data: string[] }) {
  return (
    <div className="space-y-2">
      {data.map((m, i) => {
        const [wrong, right] = m.includes("→") ? m.split("→") : [m, ""];
        return (
          <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex gap-2">
              <span className="text-red-500">✗</span>
              <MarkdownRenderer content={wrong.trim()} />
            </div>
            {right && (
              <div className="mt-2 ml-4 rounded border border-emerald-200 bg-emerald-50 p-2.5 dark:border-emerald-800 dark:bg-emerald-900/20">
                <div className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  <MarkdownRenderer content={right.trim()} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PointersSection({ data }: { data: string[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {data.map((p, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-[#1a365d] text-xs font-bold text-white">
            {i + 1}
          </span>
          <p className="text-sm text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: renderInline(p) }} />
        </div>
      ))}
    </div>
  );
}

function TextSection({ data }: { data: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <MarkdownRenderer content={data} />
    </div>
  );
}

function ExamRelevanceSection({ data }: { data: RevisionPackage["examRelevance"] }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {data.frequency && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Frequency</p>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">{data.frequency}</p>
          </div>
        )}
        {data.typicalMarks && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Typical Marks</p>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">{data.typicalMarks}</p>
          </div>
        )}
        {data.lastAppeared && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Last Appeared</p>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-200">{data.lastAppeared}</p>
          </div>
        )}
        {data.prediction && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Prediction</p>
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">{data.prediction}</p>
          </div>
        )}
      </div>
      {data.paperAndPart && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Paper & Part</p>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">{data.paperAndPart}</p>
        </div>
      )}
    </div>
  );
}

function RevisionNotesObjSection({ data }: { data: RevisionPackage["revisionNotes"] }) {
  return (
    <div className="space-y-4">
      {data.coreConcept && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1">Core Concept</p>
          <p className="text-sm text-blue-800 dark:text-blue-300">{data.coreConcept}</p>
        </div>
      )}
      {data.mustKnowDefinition && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Must-Know Definition</p>
          <div className="border-l-4 border-[#1a365d] pl-3">
            <MarkdownRenderer content={data.mustKnowDefinition} />
          </div>
        </div>
      )}
      {data.recognitionCriteria.length > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-2">Recognition Criteria</p>
          <ol className="list-decimal list-inside space-y-1">
            {data.recognitionCriteria.map((c, i) => (
              <li key={i} className="text-sm text-emerald-800 dark:text-emerald-300">{c}</li>
            ))}
          </ol>
        </div>
      )}
      {data.measurementRule && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <p className="text-sm font-bold text-purple-900 dark:text-purple-200 mb-2">Measurement Rule</p>
          <p className="text-sm text-purple-800 dark:text-purple-300">{data.measurementRule}</p>
        </div>
      )}
      {data.workedExample && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-2">Worked Example</p>
          <div className="font-mono text-xs text-amber-800 dark:text-amber-300 whitespace-pre-wrap">{data.workedExample}</div>
        </div>
      )}
      {data.keyExceptions.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-bold text-red-900 dark:text-red-200 mb-2">Key Exceptions</p>
          <ul className="list-disc list-inside space-y-1">
            {data.keyExceptions.map((e, i) => (
              <li key={i} className="text-sm text-red-800 dark:text-red-300">{e}</li>
            ))}
          </ul>
        </div>
      )}
      {data.examinerFavouritePoints.length > 0 && (
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-900/20">
          <p className="text-sm font-bold text-cyan-900 dark:text-cyan-200 mb-2">Examiner Favourite Points</p>
          <ul className="list-disc list-inside space-y-1">
            {data.examinerFavouritePoints.map((p, i) => (
              <li key={i} className="text-sm text-cyan-800 dark:text-cyan-300">{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MistakesObjSection({ data }: { data: RevisionPackage["commonMistakes"] }) {
  return (
    <div className="space-y-3">
      {data.map((m, i) => (
        <div key={i} className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-red-500 font-bold">✗</span>
            <p className="text-sm font-medium text-red-900 dark:text-red-200">{m.mistake}</p>
          </div>
          {m.whyItHappens && (
            <p className="text-xs text-red-700 dark:text-red-400 ml-5 mb-2">{m.whyItHappens}</p>
          )}
          {m.correction && (
            <div className="ml-5 rounded border border-emerald-200 bg-emerald-50 p-2.5 dark:border-emerald-800 dark:bg-emerald-900/20">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <p className="text-sm text-emerald-800 dark:text-emerald-300">{m.correction}</p>
              </div>
            </div>
          )}
          {m.marksLost && (
            <p className="text-xs text-amber-600 dark:text-amber-400 ml-5 mt-2">⚠️ {m.marksLost}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function AnswerWritingSection({ data }: { data: RevisionPackage["answerWritingApproach"] }) {
  return (
    <div className="space-y-4">
      {data.openingFormula && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2">Opening Formula</p>
          <div className="font-mono text-sm text-blue-800 dark:text-blue-300 bg-white dark:bg-blue-950/50 p-3 rounded border border-blue-300 dark:border-blue-700">
            {data.openingFormula}
          </div>
        </div>
      )}
      {data.structureToFollow && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-2">Structure to Follow</p>
          <p className="text-sm text-emerald-800 dark:text-emerald-300">{data.structureToFollow}</p>
        </div>
      )}
      {data.whatCheckerLooksFor && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <p className="text-sm font-bold text-purple-900 dark:text-purple-200 mb-2">What Checker Looks For</p>
          <p className="text-sm text-purple-800 dark:text-purple-300">{data.whatCheckerLooksFor}</p>
        </div>
      )}
      {data.timeAllocation && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-2">Time Allocation</p>
          <p className="text-sm text-amber-800 dark:text-amber-300">{data.timeAllocation}</p>
        </div>
      )}
      {data.presentationTips && (
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-900/20">
          <p className="text-sm font-bold text-cyan-900 dark:text-cyan-200 mb-2">Presentation Tips</p>
          <p className="text-sm text-cyan-800 dark:text-cyan-300">{data.presentationTips}</p>
        </div>
      )}
    </div>
  );
}

function HowTestedSection({ data }: { data: RevisionPackage["howTopicIsTested"] }) {
  return (
    <div className="space-y-4">
      {data.pastPaperPattern && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2">Past Paper Pattern</p>
          <p className="text-sm text-blue-800 dark:text-blue-300">{data.pastPaperPattern}</p>
        </div>
      )}
      {data.angleAlwaysTaken && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-2">Angle Always Taken</p>
          <p className="text-sm text-amber-800 dark:text-amber-300">{data.angleAlwaysTaken}</p>
        </div>
      )}
      {data.neverAsked && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Never Asked (Skip)</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{data.neverAsked}</p>
        </div>
      )}
      {data.trickInQuestion && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-bold text-red-900 dark:text-red-200 mb-2">Trick in Question</p>
          <p className="text-sm text-red-800 dark:text-red-300">{data.trickInQuestion}</p>
        </div>
      )}
    </div>
  );
}

function KeyFocusSection({ data }: { data: RevisionPackage["keyFocusAreas"] }) {
  const highYieldItems = Array.isArray(data.highYield) ? data.highYield : (data.highYield ? [data.highYield] : []);
  
  return (
    <div className="space-y-4">
      {highYieldItems.length > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-2">High-Yield Areas</p>
          <ul className="list-disc list-inside space-y-1">
            {highYieldItems.map((h, i) => (
              <li key={i} className="text-sm text-emerald-800 dark:text-emerald-300">{h}</li>
            ))}
          </ul>
        </div>
      )}
      {data.ifOnly2DaysLeft && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-2">If Only 2 Days Left</p>
          <p className="text-sm text-amber-800 dark:text-amber-300">{data.ifOnly2DaysLeft}</p>
        </div>
      )}
      {data.linkToOtherTopics && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <p className="text-sm font-bold text-purple-900 dark:text-purple-200 mb-2">Links to Other Topics</p>
          <p className="text-sm text-purple-800 dark:text-purple-300">{data.linkToOtherTopics}</p>
        </div>
      )}
      {data.numericalVsTheory && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2">Numerical vs Theory</p>
          <p className="text-sm text-blue-800 dark:text-blue-300">{data.numericalVsTheory}</p>
        </div>
      )}
    </div>
  );
}

// ─── Section Accordion ────────────────────────────────────────────────────────

function SectionAccordion({
  config,
  data,
  revisionId,
  defaultOpen = false,
}: {
  config: (typeof SECTION_CONFIG)[0];
  data: RevisionPackage[keyof RevisionPackage];
  revisionId?: string | null;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const colors = COLOR_MAP[config.color];
  const Icon = config.icon;

  const getSectionText = () => {
    if (typeof data === "string") return data;
    if (Array.isArray(data)) return data.map((d) => (typeof d === "string" ? d : JSON.stringify(d))).join("\n\n");
    return JSON.stringify(data, null, 2);
  };

  const renderContent = () => {
    switch (config.key) {
      case "personalNote":
      case "formulaSheet": return <TextSection data={data as string} />;
      case "examRelevance": return <ExamRelevanceSection data={data as RevisionPackage["examRelevance"]} />;
      case "revisionNotes": return <RevisionNotesObjSection data={data as RevisionPackage["revisionNotes"]} />;
      case "mcqs": return <McqSection data={data as RevisionPackage["mcqs"]} />;
      case "descriptiveQuestions": return <DescriptiveSection data={data as RevisionPackage["descriptiveQuestions"]} />;
      case "commonMistakes": return <MistakesObjSection data={data as RevisionPackage["commonMistakes"]} />;
      case "answerWritingApproach": return <AnswerWritingSection data={data as RevisionPackage["answerWritingApproach"]} />;
      case "howTopicIsTested": return <HowTestedSection data={data as RevisionPackage["howTopicIsTested"]} />;
      case "keyFocusAreas": return <KeyFocusSection data={data as RevisionPackage["keyFocusAreas"]} />;
      case "quickRevisionPointers": return <PointersSection data={data as string[]} />;
      case "lastMinuteTips": return <PointersSection data={data as string[]} />;
      default: return <TextSection data={data as string} />;
    }
  };

  const itemCount = Array.isArray(data) ? data.length : null;
  
  // Get descriptive text for what's inside each section
  const getSectionDescription = () => {
    switch (config.key) {
      case "personalNote": return "Motivation + what to focus on";
      case "mcqs": return `${itemCount || "Multiple"} MCQs · Reveal answers one by one`;
      case "descriptiveQuestions": return `${itemCount || "Multiple"} Questions · Model answers with marks`;
      case "commonMistakes": return `${itemCount || "Multiple"} traps · Avoid these in exam`;
      case "quickRevisionPointers": return `${itemCount || "Multiple"} bullets · Last-minute revision`;
      case "lastMinuteTips": return `${itemCount || 3} emergency tips`;
      case "revisionNotes": return "Core concept · Definitions · Worked example";
      case "examRelevance": return "Frequency · Marks · Prediction";
      case "answerWritingApproach": return "Opening formula · Structure template";
      case "howTopicIsTested": return "Past papers · Angles · Tricks";
      case "keyFocusAreas": return "High-yield · 2-day plan · Links";
      case "formulaSheet": return "All formulas with examples";
      default: return itemCount ? `${itemCount} items` : "";
    }
  };

  return (
    <div className={cn("overflow-hidden rounded-2xl border-2 transition-all duration-300", open ? colors.border : "border-zinc-200 dark:border-zinc-700")}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex w-full items-center justify-between gap-4 p-5 text-left transition-all",
          open ? colors.bg : "bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800",
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn("flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl", open ? colors.bg : "bg-zinc-100 dark:bg-zinc-800")}>
            <Icon className={cn("h-6 w-6", open ? colors.icon : "text-zinc-500")} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={cn("text-lg font-bold", open ? colors.text : "text-zinc-900 dark:text-white")}>
                {config.label}
              </span>
              <span className={cn("rounded-full px-3 py-1 text-xs font-bold", open ? colors.badge : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800")}>
                {config.badge}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {getSectionDescription()}
            </p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {open && (
            <>
              <SectionRevisedToggle sectionKey={config.key} revisionId={revisionId} />
              <CopyButton text={getSectionText()} />
            </>
          )}
          <div className={cn("flex h-6 w-6 items-center justify-center rounded transition-colors", open ? colors.bg : "bg-zinc-100 dark:bg-zinc-800")}>
            {open ? (
              <ChevronUp className={cn("h-3.5 w-3.5", open ? colors.icon : "text-zinc-500")} />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            )}
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          {renderContent()}
        </div>
      )}
    </div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────

function GeneratingState({ topic }: { topic: string }) {
  const steps = [
    { icon: BookOpen, text: "Analyzing ICAI 2026 syllabus pattern..." },
    { icon: Brain, text: "Building 8-10 scenario-based MCQs..." },
    { icon: FileText, text: "Writing model answers in ICAI format..." },
    { icon: Target, text: "Identifying common mark-loss traps..." },
    { icon: TrendingUp, text: "Decoding past paper patterns..." },
    { icon: Sparkles, text: "Finalising your revision package..." },
  ];
  const [step, setStep] = useState(0);

  useState(() => {
    const id = setInterval(() => setStep((p) => Math.min(p + 1, steps.length - 1)), 2500);
    return () => clearInterval(id);
  });

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#0052CC] to-[#FFD700] transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-zinc-500">Step {step + 1} of {steps.length}</p>
      </div>

      <h3 className="mb-2 text-2xl font-black text-zinc-900 dark:text-white">
        Building Your Exam Package
      </h3>
      <p className="mb-8 max-w-md text-base text-zinc-500">
        Generating a perfect 8-section package for{" "}
        <span className="font-semibold text-[#0052CC]">{topic || "your topic"}</span>
      </p>

      <div className="w-full max-w-md space-y-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-base font-medium transition-all duration-500",
                i < step
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300"
                  : i === step
                  ? "border-[#0052CC]/30 bg-[#0052CC]/5 text-[#0052CC] shadow-lg shadow-[#0052CC]/10"
                  : "border-zinc-100 bg-zinc-50 text-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600",
              )}
            >
              {i < step ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                  <Check className="h-5 w-5 text-emerald-600" />
                </div>
              ) : i === step ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0052CC]/20">
                  <Loader2 className="h-5 w-5 text-[#0052CC] animate-spin" />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <Icon className="h-4 w-4 opacity-40" />
                </div>
              )}
              <span className="flex-1 text-left">{s.text}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-sm text-zinc-400">⏱ Usually takes 30-60 seconds · Don't close this tab</p>
    </div>
  );
}

// ─── Result Header ────────────────────────────────────────────────────────────

function ResultHeader({
  result,
  onRegenerate,
  regenLoading,
}: {
  result: GenerateResponse;
  onRegenerate: () => void;
  regenLoading: boolean;
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 bg-[#1a365d] px-6 py-4 dark:bg-[#0f2942]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">
              REVISECA — ICAI SYLLABUS 2026
            </span>
          </div>
          <span className="rounded bg-white/20 px-3 py-1 text-xs font-medium text-white">
            {result.data.examRelevance?.paperAndPart || "REVISION PACKAGE"}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="mb-2 text-2xl font-black text-zinc-900 dark:text-white">
          {result.topic}
        </h2>

        {result.data.personalNote && (
          <p className="mb-4 text-base text-zinc-600 dark:text-zinc-400 italic border-l-4 border-rose-500 pl-4">
            {result.data.personalNote}
          </p>
        )}

        {result.data.examRelevance?.prediction && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-900/20">
            <Flame className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{result.data.examRelevance.prediction}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {result.revisionId && (
            <a
              href={`/api/export-pdf?revisionId=${result.revisionId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#1a365d] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0f2942] dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </a>
          )}
          {result.revisionId && (
            <a
              href={`/history/${result.revisionId}`}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <Save className="h-4 w-4" />
              View Saved
            </a>
          )}
          <button
            onClick={onRegenerate}
            disabled={regenLoading}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {regenLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Regenerate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 divide-x divide-zinc-200 border-t border-zinc-200 bg-zinc-50 dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50">
        {[
          { label: "MCQs", value: result.data.mcqs.length },
          { label: "Questions", value: result.data.descriptiveQuestions.length },
          { label: "Pointers", value: result.data.quickRevisionPointers.length },
          { label: "Mistakes", value: result.data.commonMistakes.length },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-3">
            <span className="text-xl font-black text-[#1a365d] dark:text-blue-300">{value}</span>
            <span className="text-xs text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GenerationForm({ initialTopic = "" }: { initialTopic?: string }) {
  const [topic, setTopic] = useState(initialTopic);
  const [caLevel, setCaLevel] = useState("");
  const [paper, setPaper] = useState("");
  const [promptTweak, setPromptTweak] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const doGenerate = useCallback(
    async (isRegen = false) => {
      setError(null);
      if (isRegen) setRegenLoading(true);
      else setLoading(true);

      try {
        const fd = new FormData();
        fd.append("topic", topic);
        if (file) fd.append("file", file);
        if (promptTweak) fd.append("promptTweak", promptTweak);
        if (caLevel) fd.append("caLevel", caLevel);
        if (paper) fd.append("paper", paper);

        const res = await fetch("/api/generate", { method: "POST", body: fd });
        const data = await res.json() as GenerateResponse & { error?: string; message?: string; upgradeUrl?: string };

        if (!res.ok) {
          setError({
            title: data.error ?? "Generation Failed",
            message: data.message ?? "Something went wrong. Please try again.",
          });
          return;
        }

        setResult(data);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      } catch {
        setError({ title: "Network Error", message: "Could not connect. Please check your connection." });
      } finally {
        setLoading(false);
        setRegenLoading(false);
      }
    },
    [topic, file, promptTweak, caLevel, paper],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const canSubmit = (topic.trim() || file) && !loading;
  const papers = caLevel ? PAPERS_BY_LEVEL[caLevel] ?? [] : [];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      {/* ── Centered Form Card ── */}
      <div className="w-full max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/80 shadow-xl shadow-zinc-200/50 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80 dark:shadow-zinc-900/50">
          {/* Card Header */}
          <div className="border-b border-zinc-100/60 bg-gradient-to-br from-zinc-50/80 to-zinc-100/60 px-8 py-6 dark:from-zinc-800/40 dark:to-zinc-900/60 dark:border-zinc-800/60">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0052CC] to-[#003d99] shadow-lg shadow-blue-500/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-zinc-900 dark:text-white">ReviseCA</h2>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">AI-Powered CA Revision Engine</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* CA Level + Paper FIRST - Context makes AI output better */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="text-[#0052CC]">✦</span> CA Level
                </label>
                <select
                  value={caLevel}
                  onChange={(e) => { setCaLevel(e.target.value); setPaper(""); }}
                  className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3.5 text-sm font-medium text-zinc-900 focus:border-[#0052CC] focus:outline-none focus:ring-4 focus:ring-[#0052CC]/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="">Select your level</option>
                  {CA_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="text-[#0052CC]">✦</span> Paper / Subject
                </label>
                <select
                  value={paper}
                  onChange={(e) => setPaper(e.target.value)}
                  disabled={!caLevel}
                  className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3.5 text-sm font-medium text-zinc-900 focus:border-[#0052CC] focus:outline-none focus:ring-4 focus:ring-[#0052CC]/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="">Select paper</option>
                  {papers.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Topic Input - Full-width, large, with autocomplete */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                What do you want to revise?
              </label>
              <div className="relative">
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Ind AS 16 – Property, Plant and Equipment"
                  className="w-full rounded-2xl border-2 border-zinc-200 bg-white px-5 py-5 text-lg font-medium text-zinc-900 placeholder-zinc-400 focus:border-[#0052CC] focus:outline-none focus:ring-4 focus:ring-[#0052CC]/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-[#0052CC] dark:focus:ring-[#0052CC]/20"
                />
                {/* Autocomplete dropdown */}
                {topic.length > 2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800 z-50">
                    {SUGGESTED_TOPICS.filter(t => t.toLowerCase().includes(topic.toLowerCase())).slice(0, 5).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTopic(t)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-[#0052CC]" />
                        <span className="text-zinc-700 dark:text-zinc-300">{t}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Suggested topics as pills */}
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTED_TOPICS.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition-all hover:border-amber-400 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                  >
                    {t.split("–")[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Zone - Beautiful with Cloud Icon */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Or upload your notes</label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
                  dragOver
                    ? "border-[#0052CC] bg-[#0052CC]/5 scale-[1.02]"
                    : file
                    ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-900/20"
                    : "border-zinc-200 bg-zinc-50/30 hover:border-zinc-300 hover:bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-800/30 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50",
                )}
              >
                {file ? (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
                      <FileUp className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{file.name}</p>
                      <p className="text-xs text-zinc-400">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    {/* Animated cloud icon */}
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 group-hover:scale-110 group-hover:from-blue-50 group-hover:to-blue-100 dark:group-hover:from-blue-900/30 dark:group-hover:to-blue-800/30 transition-all duration-300">
                        <Cloud className="h-7 w-7 text-zinc-400 group-hover:text-[#0052CC] dark:text-zinc-500 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                      {/* Floating upload indicator */}
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0052CC] shadow-lg shadow-blue-500/40 group-hover:animate-bounce">
                        <Upload className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Drag & drop your files here
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">or upload notes PDF/TXT</p>
                    </div>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Advanced Settings Toggle */}
            <div className="rounded-xl border border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setShowAdvanced((p) => !p)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Customize your revision package
                </div>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showAdvanced && (
                <div className="border-t border-zinc-100 p-4 dark:border-zinc-800 space-y-4">
                  {/* Custom Instruction */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Custom Instruction
                    </label>
                    <textarea
                      value={promptTweak}
                      onChange={(e) => setPromptTweak(e.target.value)}
                      rows={2}
                      placeholder="e.g. Focus more on practical numericals..."
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#0052CC] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {TWEAK_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setPromptTweak(preset.value)}
                          className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 hover:border-[#0052CC]/30 hover:text-[#0052CC] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400">{error.title}</p>
                  <p className="text-sm text-red-600 dark:text-red-300">{error.message}</p>
                </div>
                <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Generate Button - Gold-Blue Gradient with Shimmer */}
            <button
              onClick={() => doGenerate(false)}
              disabled={!canSubmit}
              className={cn(
                "group relative flex w-full items-center justify-center gap-3 rounded-2xl py-4.5 text-base font-bold text-white transition-all duration-300",
                canSubmit
                  ? "bg-gradient-to-r from-[#0052CC] via-[#0066E6] to-[#FFD700] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.01]"
                  : "bg-zinc-300 cursor-not-allowed dark:bg-zinc-700",
              )}
            >
              {/* Shimmer effect */}
              {canSubmit && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute -inset-[200%] w-[200%] animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              )}
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Full Exam-Ready Package</span>
                  <span className="text-lg">✨</span>
                </>
              )}
            </button>

            {!loading && (
              <p className="text-center text-xs text-zinc-400">
                ⚡ Ready in 30-60 seconds · ICAI 2026 Syllabus
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Loading State ── */}
      {loading && <GeneratingState topic={topic} />}

      {/* ── Result ── */}
      {!loading && result && (
        <div ref={resultRef} className="space-y-4">
          <ResultHeader result={result} onRegenerate={() => doGenerate(true)} regenLoading={regenLoading} />

          {SECTION_CONFIG.map((config, i) => (
            <SectionAccordion
              key={config.key}
              config={config}
              data={result.data[config.key]}
              revisionId={result.revisionId}
              defaultOpen={i === 0}
            />
          ))}

          {/* Floating export button */}
          {result.revisionId && (
            <div className="fixed bottom-6 right-6 z-50">
              <a
                href={`/api/export-pdf?revisionId=${result.revisionId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-[#0052CC] px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-[#0052CC]/40 transition-all hover:scale-105 hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}