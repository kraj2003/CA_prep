"use client";

import { useState, useRef, useCallback } from "react";
import {
  Loader2, Sparkles, Upload, X, RotateCw, ChevronDown, ChevronUp,
  BookOpen, Brain, FileText, Target, Zap, TrendingUp, Star, CheckCircle2,
  Copy, Check, Download, Save, AlertTriangle, Clock, Award, Flame,
  FileUp, Lightbulb, ArrowRight, RefreshCw, Settings2
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
    key: "revisionNotes" as const,
    icon: BookOpen,
    label: "Revision Notes",
    color: "blue",
    desc: "Complete theory with examples",
    badge: "Core",
  },
  {
    key: "mcqs" as const,
    icon: Brain,
    label: "ICAI-Style MCQs",
    color: "purple",
    desc: "8–10 scenario-based questions",
    badge: "Practice",
  },
  {
    key: "descriptiveQuestions" as const,
    icon: FileText,
    label: "Descriptive Questions",
    color: "indigo",
    desc: "Model answers in ICAI format",
    badge: "Marks",
  },
  {
    key: "commonMistakes" as const,
    icon: AlertTriangle,
    label: "Common Mistakes & Traps",
    color: "amber",
    desc: "Avoid these in the exam hall",
    badge: "Critical",
  },
  {
    key: "answerWritingApproach" as const,
    icon: Zap,
    label: "Answer Writing Strategy",
    color: "green",
    desc: "ICAI-approved structure",
    badge: "Strategy",
  },
  {
    key: "howTopicIsTested" as const,
    icon: TrendingUp,
    label: "How It's Tested",
    color: "cyan",
    desc: "Past paper patterns decoded",
    badge: "Insight",
  },
  {
    key: "keyFocusAreas" as const,
    icon: Star,
    label: "Key Focus Areas",
    color: "orange",
    desc: "High-yield scoring zones",
    badge: "Priority",
  },
  {
    key: "quickRevisionPointers" as const,
    icon: CheckCircle2,
    label: "Quick Revision Pointers",
    color: "emerald",
    desc: "10–15 exam-day bullets",
    badge: "Final",
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
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
        revised
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          : "border-zinc-200 bg-white text-zinc-500 hover:border-emerald-200 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-800",
      )}
    >
      {saving ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : revised ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <CheckCircle2 className="h-3 w-3 opacity-40" />
      )}
      {revised ? "Revised ✓" : "Mark Revised"}
    </button>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="mt-4 mb-1 text-base font-bold text-zinc-900 dark:text-white first:mt-0">
              {line.slice(3)}
            </h3>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h2 key={i} className="mt-4 mb-2 text-lg font-black text-[#0052CC] first:mt-0">
              {line.slice(2)}
            </h2>
          );
        }
        if (line.startsWith("• ") || line.startsWith("- ")) {
          const text = line.slice(2);
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0052CC]" />
              <span className="text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: renderInline(text) }} />
            </div>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.+)/);
          if (match) {
            return (
              <div key={i} className="flex gap-2">
                <span className="flex-shrink-0 font-bold text-[#0052CC]">{match[1]}.</span>
                <span className="text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: renderInline(match[2]) }} />
              </div>
            );
          }
        }
        if (line.startsWith("❌") || line.startsWith("✅") || line.startsWith("🔑") || line.startsWith("⚠️")) {
          return (
            <div key={i} className="text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
          );
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
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
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <MarkdownRenderer content={data} />
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
    <div className="space-y-4">
      {data.map((mcq, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
          <div className="p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0052CC] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", diffColor[mcq.difficulty ?? "Medium"])}>
                  {mcq.difficulty ?? "Medium"}
                </span>
              </div>
              {mcq.examTip && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                  💡 {mcq.examTip}
                </span>
              )}
            </div>
            <p className="mb-4 font-semibold text-zinc-900 dark:text-white leading-snug">{mcq.question}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {mcq.options.map((opt, j) => {
                const letter = String.fromCharCode(65 + j);
                const isAnswer = revealed.has(i) && mcq.answer.includes(letter) || revealed.has(i) && mcq.answer === opt;
                return (
                  <div
                    key={j}
                    className={cn(
                      "rounded-lg border p-3 text-sm transition-colors",
                      revealed.has(i) && (mcq.answer.includes(letter) || mcq.answer === opt)
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                    )}
                  >
                    <span className="mr-2 font-bold">{letter}.</span>
                    {opt}
                    {revealed.has(i) && (mcq.answer.includes(letter) || mcq.answer === opt) && (
                      <Check className="ml-2 inline h-3 w-3" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {revealed.has(i) && (
            <div className="border-t border-zinc-100 bg-emerald-50/50 p-4 dark:border-zinc-800 dark:bg-emerald-900/10">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                ✅ Answer: {mcq.answer}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{mcq.explanation}</p>
            </div>
          )}
          <div className="border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
            <button
              onClick={() => toggleReveal(i)}
              className={cn(
                "text-sm font-medium transition-colors",
                revealed.has(i) ? "text-zinc-500 hover:text-zinc-700" : "text-[#0052CC] hover:text-blue-700",
              )}
            >
              {revealed.has(i) ? "Hide Answer" : "Reveal Answer →"}
            </button>
          </div>
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
    <div className="space-y-3">
      {data.map((q, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => toggle(i)}
            className="flex w-full items-start justify-between gap-3 p-5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0052CC] text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white leading-snug">{q.question}</p>
                <div className="mt-1.5 flex gap-2">
                  <span className="rounded-full bg-[#0052CC]/10 px-2 py-0.5 text-xs font-medium text-[#0052CC]">
                    {q.marks} Marks
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                    ⏱ {q.timeAllocation}
                  </span>
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
            <div className="border-t border-zinc-100 dark:border-zinc-800">
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#0052CC] uppercase tracking-wider">Model Answer</p>
                  <CopyButton text={q.modelAnswer} />
                </div>
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <MarkdownRenderer content={q.modelAnswer} />
                </div>
                {q.answerTips && (
                  <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                    <p className="text-xs text-amber-800 dark:text-amber-200">{q.answerTips}</p>
                  </div>
                )}
              </div>
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
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <MarkdownRenderer content={wrong.trim()} />
            {right && (
              <div className="mt-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                <MarkdownRenderer content={"✅ " + right.trim()} />
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
          className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
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
      case "revisionNotes": return <RevisionNotesSection data={data as string} />;
      case "mcqs": return <McqSection data={data as RevisionPackage["mcqs"]} />;
      case "descriptiveQuestions": return <DescriptiveSection data={data as RevisionPackage["descriptiveQuestions"]} />;
      case "commonMistakes": return <MistakesSection data={data as string[]} />;
      case "quickRevisionPointers": return <PointersSection data={data as string[]} />;
      default: return <TextSection data={data as string} />;
    }
  };

  const itemCount = Array.isArray(data) ? data.length : null;

  return (
    <div className={cn("overflow-hidden rounded-2xl border transition-all duration-200", open ? colors.border : "border-zinc-200 dark:border-zinc-800")}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex w-full items-center justify-between gap-3 p-4 text-left transition-colors",
          open ? colors.bg : "bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50",
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl", open ? colors.bg : "bg-zinc-100 dark:bg-zinc-800")}>
            <Icon className={cn("h-4 w-4", open ? colors.icon : "text-zinc-500")} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("font-semibold", open ? colors.text : "text-zinc-900 dark:text-white")}>
                {config.label}
              </span>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", open ? colors.badge : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800")}>
                {config.badge}
              </span>
              {itemCount !== null && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-400 dark:bg-zinc-800">
                  {itemCount} items
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">{config.desc}</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {open && (
            <>
              <SectionRevisedToggle sectionKey={config.key} revisionId={revisionId} />
              <CopyButton text={getSectionText()} />
            </>
          )}
          <div className={cn("flex h-7 w-7 items-center justify-center rounded-full transition-colors", open ? colors.bg : "bg-zinc-100 dark:bg-zinc-800")}>
            {open ? (
              <ChevronUp className={cn("h-4 w-4", open ? colors.icon : "text-zinc-500")} />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            )}
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
          {renderContent()}
        </div>
      )}
    </div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────

function GeneratingState({ topic }: { topic: string }) {
  const steps = [
    { icon: BookOpen, text: "Analysing ICAI syllabus alignment..." },
    { icon: Brain, text: "Crafting scenario-based MCQs..." },
    { icon: FileText, text: "Writing ICAI-format model answers..." },
    { icon: Target, text: "Identifying common exam traps..." },
    { icon: Sparkles, text: "Finalising your exam-ready package..." },
  ];
  const [step, setStep] = useState(0);

  useState(() => {
    const id = setInterval(() => setStep((p) => Math.min(p + 1, steps.length - 1)), 2800);
    return () => clearInterval(id);
  });

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-8">
        <div className="h-20 w-20 rounded-full border-4 border-[#0052CC]/20">
          <div className="absolute inset-0 rounded-full border-4 border-t-[#0052CC] animate-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-[#0052CC]" />
        </div>
      </div>

      <h3 className="mb-2 text-xl font-black text-zinc-900 dark:text-white">
        Building Your Exam Package
      </h3>
      <p className="mb-8 max-w-xs text-sm text-zinc-500">
        Generating a perfect 8-section package for{" "}
        <span className="font-semibold text-[#0052CC]">{topic || "your topic"}</span>
      </p>

      <div className="w-full max-w-sm space-y-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-500",
                i < step
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                  : i === step
                  ? "border-[#0052CC]/30 bg-[#0052CC]/5 text-[#0052CC] font-medium"
                  : "border-zinc-100 bg-zinc-50 text-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600",
              )}
            >
              {i < step ? (
                <Check className="h-4 w-4 flex-shrink-0" />
              ) : i === step ? (
                <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
              ) : (
                <Icon className="h-4 w-4 flex-shrink-0 opacity-40" />
              )}
              {s.text}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-zinc-400">Usually takes 30–60 seconds · Please don't close this tab</p>
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
    <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-blue-900/20">
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Your Exam-Ready Package is Ready!
          </span>
        </div>

        <h2 className="mb-1 text-xl font-black text-zinc-900 dark:text-white">
          {result.topic}
        </h2>

        {result.data.topicSummary && (
          <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{result.data.topicSummary}</p>
        )}

        {result.data.examRelevance && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/20">
            <Flame className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">{result.data.examRelevance}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {result.revisionId && (
            <a
              href={`/api/export-pdf?revisionId=${result.revisionId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#0052CC]/25 transition-transform hover:scale-[1.02] hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Export Beautiful PDF
            </a>
          )}
          {result.revisionId && (
            <a
              href={`/history/${result.revisionId}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <Save className="h-4 w-4" />
              View Saved
            </a>
          )}
          <button
            onClick={onRegenerate}
            disabled={regenLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {regenLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Regenerate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 divide-x divide-zinc-200 border-t border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {[
          { label: "MCQs", value: result.data.mcqs.length },
          { label: "Questions", value: result.data.descriptiveQuestions.length },
          { label: "Pointers", value: result.data.quickRevisionPointers.length },
          { label: "Mistakes", value: result.data.commonMistakes.length },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-3">
            <span className="text-xl font-black text-[#0052CC]">{value}</span>
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
    <div className="space-y-6">
      {/* ── Form Card ── */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="border-b border-zinc-100 bg-gradient-to-r from-[#0052CC]/5 to-[#FFD700]/5 px-6 py-5 dark:border-zinc-800 dark:from-[#0052CC]/10 dark:to-[#FFD700]/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052CC]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Generate Exam-Ready Package</h2>
              <p className="text-xs text-zinc-500">Powered by ICAI syllabus-trained AI · 2026 New Syllabus</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* CA Level + Paper */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">CA Level</label>
              <select
                value={caLevel}
                onChange={(e) => { setCaLevel(e.target.value); setPaper(""); }}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-[#0052CC] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="">Select level (optional)</option>
                {CA_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Paper / Subject</label>
              <select
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
                disabled={!caLevel}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-[#0052CC] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="">Select paper (optional)</option>
                {papers.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Topic Name *</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Ind AS 16 – Property, Plant & Equipment"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#0052CC] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
            {/* Suggested topics */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SUGGESTED_TOPICS.slice(0, 4).map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 transition-colors hover:border-[#0052CC]/30 hover:bg-[#0052CC]/5 hover:text-[#0052CC] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {t.split("–")[0].trim()}
                </button>
              ))}
              <span className="py-1 text-xs text-zinc-400">← try a topic</span>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Upload Notes (optional)</label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-all",
                dragOver
                  ? "border-[#0052CC] bg-[#0052CC]/5"
                  : file
                  ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20"
                  : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50",
              )}
            >
              {file ? (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                    <FileUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{file.name}</p>
                    <p className="text-xs text-zinc-400">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400"
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-700">
                    <Upload className="h-5 w-5 text-zinc-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-zinc-400">PDF, TXT, DOCX · Max 10MB</p>
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

          {/* Advanced Settings */}
          <div className="rounded-xl border border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setShowAdvanced((p) => !p)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Advanced Options
              </div>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showAdvanced && (
              <div className="border-t border-zinc-100 p-4 dark:border-zinc-800 space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Custom Instruction / Tweak
                  </label>
                  <textarea
                    value={promptTweak}
                    onChange={(e) => setPromptTweak(e.target.value)}
                    rows={2}
                    placeholder="e.g. Focus more on practical numericals, Add transfer pricing examples..."
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

          {/* Submit */}
          <button
            onClick={() => doGenerate(false)}
            disabled={!canSubmit}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white transition-all",
              canSubmit
                ? "bg-[#0052CC] shadow-lg shadow-[#0052CC]/30 hover:bg-blue-700 hover:scale-[1.01]"
                : "bg-zinc-300 cursor-not-allowed dark:bg-zinc-700",
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Exam-Ready Package
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {!loading && (
            <p className="text-center text-xs text-zinc-400">
              ⚡ Usually ready in 30–60 seconds · Aligned to ICAI 2026 syllabus
            </p>
          )}
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