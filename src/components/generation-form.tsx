"use client";

import { useState, useRef, useCallback } from "react";
import {
  Loader2, Sparkles, Upload, X, AlertTriangle,
  ChevronDown, ChevronUp, Check, Download, RefreshCw,
  BookOpen, Brain, FileText, AlertCircle, PenLine,
  BarChart2, Target, Zap, Copy, CheckCircle2,
  FileUp, Settings2, ArrowRight, Flame, Award, Shield,
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
    "Business Economics",
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
    "Advanced Auditing & Professional Ethics",
    "Corporate & Economic Laws",
    "Strategic Cost & Performance Management",
    "Direct Tax Laws & International Taxation",
    "Indirect Tax Laws (IDT)",
  ],
};

const QUICK_TOPICS = [
  "Ind AS 16 – Property, Plant & Equipment",
  "GST – Input Tax Credit (Sec 16–17)",
  "Transfer Pricing – Arm's Length Price",
  "Statutory Audit – SA 700 Series",
  "Capital Budgeting – NPV & IRR",
  "Amalgamation – AS 14",
];

const TWEAK_PRESETS = [
  { label: "More MCQs",    value: "Generate 10 scenario-based MCQs — increase difficulty to Medium/Hard" },
  { label: "Concise",      value: "Make revision notes concise — bullet-heavy, ideal for last-day revision" },
  { label: "Numericals",   value: "Add more solved numerical illustrations with step-by-step workings" },
  { label: "Exam Focus",   value: "Focus only on the most frequently tested sub-topics in recent ICAI attempts" },
];

// ─── Normalise text from AI ───────────────────────────────────────────────────
// The AI sometimes returns \\n (escaped) instead of real newlines.
// This ensures the renderer always gets real \n.

function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\n/g, "\n")   // fix doubly-escaped newlines
    .replace(/\\t/g, "  ")   // fix tabs
    .trim();
}

// ─── Inline markdown → HTML ───────────────────────────────────────────────────

function inlineMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f8fafc;font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em style="color:#cbd5e1">$1</em>')
    .replace(/`(.+?)`/g,       '<code style="font-family:monospace;font-size:11px;background:rgba(59,130,246,0.12);color:#93c5fd;padding:2px 6px;border-radius:4px;font-style:normal">$1</code>');
}

// ─── Structured Text Renderer ─────────────────────────────────────────────────
// Handles ## headings, - bullets, 1. numbered, **bold**, plain text.

function StructuredText({ raw }: { raw: string }) {
  const text = normalizeText(raw);
  const lines = text.split("\n");

  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2.5" />;

        // ## Heading
        if (trimmed.startsWith("## ")) {
          return (
            <div key={i} className="pt-4 pb-1.5 first:pt-0">
              <p className="text-[10px] font-black text-blue-300/70 uppercase tracking-[0.12em] border-b border-blue-500/15 pb-1">
                {trimmed.slice(3)}
              </p>
            </div>
          );
        }

        // # Heading (H1)
        if (trimmed.startsWith("# ")) {
          return (
            <p key={i} className="text-sm font-bold text-white pt-3 pb-1 first:pt-0">
              {trimmed.slice(2)}
            </p>
          );
        }

        // **Bold heading** (standalone line that is just bold)
        if (trimmed.match(/^\*\*.+\*\*:?$/) || trimmed.match(/^\*\*.+\*\*$/)) {
          return (
            <p key={i}
              className="text-xs font-bold text-white/80 pt-2 pb-0.5"
              dangerouslySetInnerHTML={{ __html: inlineMd(trimmed) }}
            />
          );
        }

        // Bullet: - or •
        if (trimmed.match(/^[-•]\s/)) {
          return (
            <div key={i} className="flex items-start gap-2.5 py-0.5 pl-1">
              <span className="mt-[7px] w-1 h-1 rounded-full bg-blue-400/50 shrink-0" />
              <p className="text-sm text-white/65 leading-relaxed flex-1"
                dangerouslySetInnerHTML={{ __html: inlineMd(trimmed.slice(2)) }} />
            </div>
          );
        }

        // Numbered list: 1. 2. 3.
        if (/^\d+\.\s/.test(trimmed)) {
          const m = trimmed.match(/^(\d+)\.\s(.+)/);
          if (m) return (
            <div key={i} className="flex items-start gap-2 py-0.5 pl-1">
              <span className="text-[11px] font-black text-blue-400/60 shrink-0 mt-[3px] w-5 tabular-nums">{m[1]}.</span>
              <p className="text-sm text-white/65 leading-relaxed flex-1"
                dangerouslySetInnerHTML={{ __html: inlineMd(m[2]) }} />
            </div>
          );
        }

        // Emoji lines (❌ ✅ ⚠️ 🔑 etc.)
        if (/^[❌✅⚠️🔑💡📌🎯⭐]/.test(trimmed)) {
          return (
            <p key={i} className="text-sm text-white/65 leading-relaxed py-0.5"
              dangerouslySetInnerHTML={{ __html: inlineMd(trimmed) }} />
          );
        }

        // Plain paragraph
        return (
          <p key={i} className="text-sm text-white/65 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: inlineMd(trimmed) }} />
        );
      })}
    </div>
  );
}

// ─── Revision Notes ───────────────────────────────────────────────────────────
// Splits text on ## headings into boxed sub-sections.

function RevisionNotes({ text }: { text: string }) {
  const normalised = normalizeText(text);
  const sections: { heading: string; body: string }[] = [];
  let current = { heading: "", body: "" };

  for (const line of normalised.split("\n")) {
    if (line.trim().startsWith("## ")) {
      if (current.body.trim() || current.heading) sections.push({ ...current });
      current = { heading: line.trim().slice(3), body: "" };
    } else {
      current.body += line + "\n";
    }
  }
  if (current.body.trim() || current.heading) sections.push(current);

  // If no headings found at all, render as plain structured text
  if (sections.length === 0 || (sections.length === 1 && !sections[0].heading)) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <StructuredText raw={text} />
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {sections.map((sec, i) => (
        <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
          {sec.heading && (
            <div className="px-4 py-2.5 bg-blue-500/[0.05] border-b border-white/[0.05]">
              <p className="text-[10px] font-black text-blue-300/70 uppercase tracking-widest">
                {sec.heading}
              </p>
            </div>
          )}
          <div className="px-4 py-3.5 bg-white/[0.01]">
            <StructuredText raw={sec.body.trim()} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MCQ Section ─────────────────────────────────────────────────────────────

function McqSection({ mcqs }: { mcqs: RevisionPackage["mcqs"] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const diffStyle: Record<string, string> = {
    Easy:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    Hard:   "bg-red-500/10 text-red-400 border-red-500/25",
  };

  return (
    <div className="space-y-3">
      {mcqs.map((q, i) => {
        const isRevealed    = revealed.has(i);
        // Extract correct letter from answer string like "A. ₹48.55 lakhs" or "Option A"
        const correctLetter = (q.answer ?? "").match(/^[A-D]/i)?.[0]?.toUpperCase()
                           ?? (q.answer ?? "").match(/Option\s+([A-D])/i)?.[1]?.toUpperCase();

        return (
          <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">

            {/* Question */}
            <div className="flex items-start gap-3 px-4 py-3.5 bg-white/[0.02]">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-black text-purple-400">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border tracking-wide uppercase",
                    diffStyle[q.difficulty ?? "Medium"] ?? diffStyle.Medium)}>
                    {q.difficulty ?? "Medium"}
                  </span>
                  {q.examTip && (
                    <span className="text-[10px] text-white/25 truncate max-w-[220px]">
                      💡 {q.examTip}
                    </span>
                  )}
                </div>
                {/* Scenario question — render with full line-break support */}
                <p className="text-sm text-white/85 font-medium leading-relaxed whitespace-pre-line">
                  {q.question}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="grid sm:grid-cols-2 gap-1.5 px-4 pb-3 pt-1">
              {q.options.map((opt, j) => {
                const letter    = String.fromCharCode(65 + j);
                const isCorrect = isRevealed && correctLetter === letter;
                return (
                  <div key={j} className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all",
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-white/[0.02] border-white/[0.06] text-white/55"
                  )}>
                    <span className={cn("font-bold shrink-0 text-[11px] mt-0.5 w-4",
                      isCorrect ? "text-emerald-400" : "text-white/25")}>
                      {letter}.
                    </span>
                    <span className="leading-relaxed flex-1">{opt}</span>
                    {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-auto mt-0.5" />}
                  </div>
                );
              })}
            </div>

            {/* Answer reveal */}
            {isRevealed && (
              <div className="mx-4 mb-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <p className="text-xs font-bold text-emerald-300">Answer: {q.answer}</p>
                </div>
                <p className="text-xs text-white/55 leading-relaxed">{q.explanation}</p>
              </div>
            )}

            {/* Toggle */}
            <button
              onClick={() => setRevealed(prev => {
                const n = new Set(prev);
                n.has(i) ? n.delete(i) : n.add(i);
                return n;
              })}
              className="w-full text-center text-xs font-semibold py-2.5 border-t border-white/[0.04] text-white/25 hover:text-white/60 hover:bg-white/[0.02] transition-colors"
            >
              {isRevealed ? "Hide Answer ↑" : "Show Answer →"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Descriptive Questions ────────────────────────────────────────────────────

function DescriptiveSection({ questions }: { questions: RevisionPackage["descriptiveQuestions"] }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  return (
    <div className="space-y-2.5">
      {questions.map((q, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
            <button
              onClick={() => setOpen(prev => {
                const n = new Set(prev);
                n.has(i) ? n.delete(i) : n.add(i);
                return n;
              })}
              className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-black text-blue-400">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                    {q.marks} Marks
                  </span>
                  <span className="text-[10px] text-white/25">⏱ {q.timeAllocation}</span>
                </div>
                <p className="text-sm font-semibold text-white/80 leading-relaxed">{q.question}</p>
              </div>
              <div className="shrink-0 mt-1">
                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-white/25" />
                  : <ChevronDown className="w-4 h-4 text-white/25" />
                }
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-white/[0.05]">
                <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04] flex items-center justify-between">
                  <p className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest">
                    Model Answer
                  </p>
                  <CopyBtn text={q.modelAnswer} />
                </div>
                <div className="px-4 py-4">
                  {/* Model answers are structured text with ## headings */}
                  <StructuredText raw={q.modelAnswer} />
                </div>
                {q.answerTips && (
                  <div className="mx-4 mb-4 flex gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.05] px-3.5 py-3">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/55 leading-relaxed">{q.answerTips}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Mark-Loss Traps ──────────────────────────────────────────────────────────

function MistakesSection({ mistakes }: { mistakes: string[] }) {
  return (
    <div className="space-y-2">
      {mistakes.map((m, i) => {
        // Split on → arrow
        const arrowIdx = m.indexOf("→");
        const wrongRaw = arrowIdx > -1 ? m.slice(0, arrowIdx) : m;
        const rightRaw = arrowIdx > -1 ? m.slice(arrowIdx + 1) : "";

        const wrong = wrongRaw.replace(/^[❌✗\s]+/, "").trim();
        const right = rightRaw.replace(/^[✅✓\s]+/, "").trim();

        return (
          <div key={i} className="rounded-xl border border-red-500/15 overflow-hidden">
            <div className="flex items-start gap-3 px-4 py-3 bg-red-500/[0.03]">
              <div className="w-5 h-5 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-2.5 h-2.5 text-red-400" />
              </div>
              <p className="text-sm text-red-300/80 leading-relaxed">{wrong}</p>
            </div>
            {right && (
              <div className="flex items-start gap-3 px-4 py-3 border-t border-white/[0.04] bg-emerald-500/[0.02]">
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                </div>
                <p className="text-sm text-emerald-300/80 leading-relaxed">{right}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Quick Pointers ───────────────────────────────────────────────────────────

function PointersSection({ pointers }: { pointers: string[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {pointers.map((p, i) => {
        const clean = p.replace(/^🔑\s*/, "").trim();
        const colonIdx = clean.indexOf(":");
        const key  = colonIdx > 0 ? clean.slice(0, colonIdx).trim() : clean;
        const desc = colonIdx > 0 ? clean.slice(colonIdx + 1).trim() : "";
        return (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] px-3.5 py-3 bg-white/[0.02]">
            <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[9px] font-black text-amber-400">{i + 1}</span>
            </div>
            <div className="min-w-0">
              {desc ? (
                <>
                  <p className="text-xs font-bold text-amber-300/80 leading-snug">{key}</p>
                  <p className="text-xs text-white/45 leading-relaxed mt-0.5">{desc}</p>
                </>
              ) : (
                <p className="text-xs text-white/60 leading-relaxed">{clean}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Generic Section (Strategy, Pattern, Focus Areas) ────────────────────────

function GenericSection({ text }: { text: string }) {
  const normalised = normalizeText(text);
  const sections: { heading: string; body: string }[] = [];
  let current = { heading: "", body: "" };

  for (const line of normalised.split("\n")) {
    if (line.trim().startsWith("## ")) {
      if (current.body.trim() || current.heading) sections.push({ ...current });
      current = { heading: line.trim().slice(3), body: "" };
    } else {
      current.body += line + "\n";
    }
  }
  if (current.body.trim() || current.heading) sections.push(current);

  if (sections.length === 0 || (sections.length === 1 && !sections[0].heading)) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <StructuredText raw={text} />
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {sections.map((sec, i) => (
        <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
          {sec.heading && (
            <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.05]">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                {sec.heading}
              </p>
            </div>
          )}
          <div className="px-4 py-3.5">
            <StructuredText raw={sec.body.trim()} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(normalizeText(text));
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all",
        done
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
      )}
    >
      {done ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Mark Revised Button ──────────────────────────────────────────────────────

function MarkRevisedBtn() {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => setDone(p => !p)}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all",
        done
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : "bg-white/[0.03] border-white/10 text-white/40 hover:text-emerald-400/70 hover:border-emerald-500/20"
      )}
    >
      <CheckCircle2 className="w-3 h-3" />
      {done ? "Revised ✓" : "Mark Done"}
    </button>
  );
}

// ─── Section Shell (accordion) ────────────────────────────────────────────────

function SectionShell({
  icon: Icon,
  label,
  badge,
  badgeColor,
  defaultOpen = false,
  copyText,
  children,
}: {
  icon: React.ElementType;
  label: string;
  badge: string;
  badgeColor: "blue" | "purple" | "amber" | "emerald" | "rose" | "cyan" | "orange";
  defaultOpen?: boolean;
  copyText: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const C: Record<string, { icon: string; badge: string; border: string; bg: string }> = {
    blue:    { icon: "text-blue-400",    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",    border: "border-blue-500/20",    bg: "bg-blue-500/[0.03]"    },
    purple:  { icon: "text-purple-400",  badge: "bg-purple-500/10 text-purple-400 border-purple-500/20", border: "border-purple-500/20",  bg: "bg-purple-500/[0.03]"  },
    amber:   { icon: "text-amber-400",   badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",   border: "border-amber-500/20",   bg: "bg-amber-500/[0.03]"   },
    emerald: { icon: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", border: "border-emerald-500/20", bg: "bg-emerald-500/[0.03]" },
    rose:    { icon: "text-rose-400",    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",      border: "border-rose-500/20",    bg: "bg-rose-500/[0.03]"    },
    cyan:    { icon: "text-cyan-400",    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",      border: "border-cyan-500/20",    bg: "bg-cyan-500/[0.03]"    },
    orange:  { icon: "text-orange-400",  badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", border: "border-orange-500/20", bg: "bg-orange-500/[0.03]"  },
  };
  const c = C[badgeColor];

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden transition-colors duration-200",
      open ? c.border : "border-white/[0.06]"
    )} style={{ background: open ? undefined : "rgba(10,22,40,0.5)" }}>

      {/* Header */}
      <button
        onClick={() => setOpen(p => !p)}
        className={cn(
          "w-full flex items-center gap-3 px-5 py-4 text-left transition-colors",
          open ? c.bg : "hover:bg-white/[0.02]"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
          open ? `${c.bg} ${c.border}` : "bg-white/[0.04] border-white/[0.06]"
        )}>
          <Icon className={cn("w-4 h-4", open ? c.icon : "text-white/30")} />
        </div>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className={cn("font-bold text-sm", open ? "text-white" : "text-white/60")}>
            {label}
          </span>
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded border tracking-wider uppercase shrink-0",
            open ? c.badge : "bg-white/[0.04] text-white/25 border-white/[0.06]"
          )}>
            {badge}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {open && (
            <>
              <MarkRevisedBtn />
              <CopyBtn text={copyText} />
            </>
          )}
          <div className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center border",
            open ? c.badge : "bg-white/[0.04] border-white/[0.06]"
          )}>
            {open
              ? <ChevronUp className={cn("w-3.5 h-3.5", c.icon)} />
              : <ChevronDown className="w-3.5 h-3.5 text-white/30" />
            }
          </div>
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="px-5 pb-5 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Package Header ───────────────────────────────────────────────────────────

function PackageHeader({
  topic, pkg, revisionId, onRegen, regenLoading,
}: {
  topic: string;
  pkg: RevisionPackage;
  revisionId?: string | null;
  onRegen: () => void;
  regenLoading: boolean;
}) {
  const isHigh = pkg.examRelevance?.toLowerCase().includes("high");

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/[0.08]"
      style={{ background: "linear-gradient(135deg, rgba(10,22,40,0.98), rgba(6,13,26,0.99))" }}
    >
      {/* Top strip */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-white/[0.05]"
        style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.06), rgba(59,130,246,0.04))" }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/35">
            ReviseCA · ICAI 2026 · Exam Package
          </span>
        </div>
        <div className="flex items-center gap-2">
          {revisionId && (
            <a href={`/api/export-pdf?revisionId=${revisionId}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white/45 hover:text-white/80 hover:border-white/20 transition-all">
              <Download className="w-3 h-3" />
              PDF
            </a>
          )}
          <button onClick={onRegen} disabled={regenLoading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white/45 hover:text-white/80 hover:border-white/20 disabled:opacity-40 transition-all">
            {regenLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Regen
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 py-5">
        <h2 className="text-2xl font-black text-white mb-2 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          {topic}
        </h2>
        {pkg.topicSummary && (
          <p className="text-sm text-white/45 leading-relaxed mb-4 border-l-2 border-amber-400/30 pl-3">
            {pkg.topicSummary}
          </p>
        )}
        {pkg.examRelevance && (
          <div className={cn("inline-flex items-center gap-2 rounded-xl border px-4 py-2.5",
            isHigh ? "bg-amber-500/[0.07] border-amber-500/20" : "bg-blue-500/[0.05] border-blue-500/15")}>
            <Flame className={cn("w-3.5 h-3.5 shrink-0", isHigh ? "text-amber-400" : "text-blue-400")} />
            <p className={cn("text-xs font-semibold", isHigh ? "text-amber-300/90" : "text-blue-300/90")}>
              {pkg.examRelevance}
            </p>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 border-t border-white/[0.05] divide-x divide-white/[0.04]">
        {[
          { n: pkg.mcqs.length,                   l: "MCQs"      },
          { n: pkg.descriptiveQuestions.length,   l: "Questions" },
          { n: pkg.quickRevisionPointers.length,  l: "Pointers"  },
          { n: pkg.commonMistakes.length,         l: "Traps"     },
        ].map(({ n, l }, idx) => (
          <div key={l} className={cn("flex flex-col items-center py-3.5", idx > 0 && "border-l border-white/[0.04]")}>
            <span className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{n}</span>
            <span className="text-[10px] text-white/25 mt-0.5 tracking-wide">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────

function LoadingState({ topic }: { topic: string }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Checking ICAI syllabus alignment",   icon: Shield    },
    { label: "Writing structured revision notes",  icon: BookOpen  },
    { label: "Crafting scenario-based MCQs",       icon: Brain     },
    { label: "Structuring model answers",          icon: FileText  },
    { label: "Identifying exam traps",             icon: AlertCircle },
    { label: "Finalising your exam package",       icon: Sparkles  },
  ];

  useState(() => {
    const id = setInterval(() => setStep(p => Math.min(p + 1, steps.length - 1)), 5000);
    return () => clearInterval(id);
  });

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-8">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
        <div className="absolute inset-0 rounded-full border-2 border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"
          style={{ animationDuration: "1.2s" }} />
        <div className="absolute inset-3 rounded-full bg-amber-400/10 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-amber-400" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
          Building your package
        </h3>
        <p className="text-sm text-white/40 max-w-xs">
          Generating ICAI-aligned content for{" "}
          <span className="text-amber-400/80 font-semibold">{topic || "your topic"}</span>
        </p>
      </div>

      <div className="w-full max-w-sm space-y-2">
        {steps.map((s, i) => {
          const Icon  = s.icon;
          const state = i < step ? "done" : i === step ? "active" : "pending";
          return (
            <div key={i} className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all duration-500",
              state === "done"    && "bg-emerald-500/[0.05] border-emerald-500/20 text-emerald-400",
              state === "active"  && "bg-amber-500/[0.06] border-amber-500/20 text-amber-300",
              state === "pending" && "bg-white/[0.02] border-white/[0.05] text-white/20",
            )}>
              {state === "done"
                ? <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                : state === "active"
                ? <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                : <Icon className="w-4 h-4 shrink-0 opacity-40" />
              }
              <span className="text-left">{s.label}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/20">Typically 30–60 seconds · Please don't close this tab</p>
    </div>
  );
}

// ─── Section config ───────────────────────────────────────────────────────────

const SECTIONS = [
  { key: "revisionNotes",          icon: BookOpen,    label: "Revision Notes",         badge: "Core Theory", badgeColor: "blue"    as const, defaultOpen: true  },
  { key: "mcqs",                   icon: Brain,       label: "ICAI-Style MCQs",         badge: "Practice",    badgeColor: "purple"  as const },
  { key: "descriptiveQuestions",   icon: FileText,    label: "Model Answers",           badge: "Marks",       badgeColor: "blue"    as const },
  { key: "commonMistakes",         icon: AlertCircle, label: "Mark-Loss Traps",         badge: "Critical",    badgeColor: "rose"    as const },
  { key: "answerWritingApproach",  icon: PenLine,     label: "Answer Writing Strategy", badge: "Strategy",    badgeColor: "emerald" as const },
  { key: "howTopicIsTested",       icon: BarChart2,   label: "How This is Tested",      badge: "Pattern",     badgeColor: "cyan"    as const },
  { key: "keyFocusAreas",          icon: Target,      label: "Key Focus Areas",         badge: "Priority",    badgeColor: "orange"  as const },
  { key: "quickRevisionPointers",  icon: Zap,         label: "Quick Revision Pointers", badge: "Last-Day",    badgeColor: "amber"   as const },
];

function sectionRawText(key: string, data: RevisionPackage): string {
  const val = (data as Record<string, unknown>)[key];
  if (typeof val === "string") return normalizeText(val);
  if (Array.isArray(val)) return val.map(v => typeof v === "string" ? v : JSON.stringify(v)).join("\n");
  return JSON.stringify(val);
}

function renderSection(key: string, data: RevisionPackage) {
  switch (key) {
    case "revisionNotes":          return <RevisionNotes    text={data.revisionNotes}               />;
    case "mcqs":                   return <McqSection        mcqs={data.mcqs}                        />;
    case "descriptiveQuestions":   return <DescriptiveSection questions={data.descriptiveQuestions} />;
    case "commonMistakes":         return <MistakesSection  mistakes={data.commonMistakes}          />;
    case "quickRevisionPointers":  return <PointersSection  pointers={data.quickRevisionPointers}   />;
    default:
      return <GenericSection text={sectionRawText(key, data)} />;
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function GenerationForm({ initialTopic = "" }: { initialTopic?: string }) {
  const [topic,        setTopic]        = useState(initialTopic);
  const [caLevel,      setCaLevel]      = useState("");
  const [paper,        setPaper]        = useState("");
  const [promptTweak,  setPromptTweak]  = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [file,         setFile]         = useState<File | null>(null);
  const [dragOver,     setDragOver]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [result,       setResult]       = useState<GenerateResponse | null>(null);
  const [error,        setError]        = useState<{ title: string; message: string; upgrade?: boolean } | null>(null);

  const fileRef   = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const doGenerate = useCallback(async (isRegen = false) => {
    setError(null);
    if (isRegen) {
      setRegenLoading(true);
    } else {
      setLoading(true);
      setResult(null);
    }

    try {
      const fd = new FormData();
      fd.append("topic",        topic);
      fd.append("promptTweak",  promptTweak);
      fd.append("caLevel",      caLevel);
      fd.append("paper",        paper);
      if (file) fd.append("file", file);

      const res  = await fetch("/api/generate", { method: "POST", body: fd });
      const json = await res.json() as GenerateResponse & { error?: string; message?: string };

      if (!res.ok) {
        setError({
          title:   json.error   ?? "Generation Failed",
          message: json.message ?? "Something went wrong. Please try again.",
          upgrade: res.status === 403,
        });
        return;
      }

      setResult(json);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch {
      setError({ title: "Network Error", message: "Connection failed. Please check your internet." });
    } finally {
      setLoading(false);
      setRegenLoading(false);
    }
  }, [topic, file, promptTweak, caLevel, paper]);

  const papers    = caLevel ? (PAPERS_BY_LEVEL[caLevel] ?? []) : [];
  const canSubmit = (topic.trim() || !!file) && !loading;

  return (
    <div className="space-y-5">

      {/* ── Input Card ── */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(10,22,40,0.85)" }}>

        {/* Card header */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-white/[0.05]"
          style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.04), rgba(59,130,246,0.03))" }}>
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Generate Exam Package
            </h2>
            <p className="text-[11px] text-white/30">ICAI 2026 · All levels · 8 sections</p>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* CA Level + Paper */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider">CA Level</label>
              <select value={caLevel} onChange={e => { setCaLevel(e.target.value); setPaper(""); }}
                className="w-full input-dark px-3 py-2.5 text-sm rounded-xl">
                <option value="">All levels</option>
                {CA_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Paper / Subject</label>
              <select value={paper} onChange={e => setPaper(e.target.value)} disabled={!caLevel}
                className="w-full input-dark px-3 py-2.5 text-sm rounded-xl disabled:opacity-40">
                <option value="">All subjects</option>
                {papers.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Topic *</label>
            <input value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Ind AS 16 – Property, Plant & Equipment"
              className="w-full input-dark px-4 py-3 text-sm rounded-xl"
              onKeyDown={e => e.key === "Enter" && canSubmit && doGenerate(false)} />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {QUICK_TOPICS.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className="text-[11px] px-2.5 py-1 rounded-lg border border-white/[0.07] text-white/35 hover:text-white/65 hover:border-white/15 transition-all bg-white/[0.02]">
                  {t.split("–")[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Upload Notes (optional)</label>
            <div
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-5 cursor-pointer transition-all",
                dragOver ? "border-amber-400/40 bg-amber-400/[0.04]"
                : file   ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                         : "border-white/[0.07] hover:border-white/[0.13] hover:bg-white/[0.02]"
              )}
            >
              {file ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <FileUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-300">{file.name}</p>
                    <p className="text-xs text-white/30">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setFile(null); }}
                    className="ml-2 text-white/25 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white/30" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/35">Drop your notes or click to upload</p>
                    <p className="text-xs text-white/20 mt-0.5">PDF · TXT · DOCX · Max 10MB</p>
                  </div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.txt,.docx" className="hidden"
              onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </div>

          {/* Advanced */}
          <div className="rounded-xl border border-white/[0.05] overflow-hidden">
            <button onClick={() => setShowAdvanced(p => !p)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm text-white/35 hover:text-white/55 transition-colors hover:bg-white/[0.02]">
              <span className="flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" />
                Advanced options
              </span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="border-t border-white/[0.05] p-4 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/25 uppercase tracking-wider">Custom instruction</label>
                  <textarea value={promptTweak} onChange={e => setPromptTweak(e.target.value)}
                    rows={2} placeholder="e.g. Focus more on numericals, add transfer pricing examples..."
                    className="w-full input-dark px-3 py-2.5 text-sm rounded-xl resize-none" />
                  <div className="flex flex-wrap gap-1.5">
                    {TWEAK_PRESETS.map(p => (
                      <button key={p.label} onClick={() => setPromptTweak(p.value)}
                        className="text-[11px] px-2.5 py-1 rounded-lg border border-white/[0.07] text-white/35 hover:text-white/65 hover:border-white/15 transition-all">
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-red-300 text-sm">{error.title}</p>
                <p className="text-xs text-red-400/70 mt-0.5">{error.message}</p>
                {error.upgrade && (
                  <a href="/pricing" className="inline-block mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">
                    Upgrade to Pro →
                  </a>
                )}
              </div>
              <button onClick={() => setError(null)} className="text-white/20 hover:text-white/50 transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={() => doGenerate(false)}
            disabled={!canSubmit}
            className={cn(
              "w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-base font-black transition-all relative overflow-hidden",
              canSubmit
                ? "bg-amber-400 text-black hover:bg-amber-300 hover:scale-[1.01] shadow-lg shadow-amber-400/20"
                : "bg-white/[0.05] text-white/25 cursor-not-allowed"
            )}
          >
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
              : <><Sparkles className="w-5 h-5" /> Generate Exam Package <ArrowRight className="w-4 h-4" /></>
            }
            {canSubmit && !loading && (
              <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
            )}
          </button>

          {!loading && (
            <p className="text-center text-xs text-white/20">
              ⚡ 30–60 seconds · Scenario-based MCQs · ICAI 2026 structure
            </p>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && <LoadingState topic={topic} />}

      {/* Result */}
      {!loading && result && (
        <div ref={resultRef} className="space-y-3">
          <PackageHeader
            topic={result.topic}
            pkg={result.data}
            revisionId={result.revisionId}
            onRegen={() => doGenerate(true)}
            regenLoading={regenLoading}
          />

          {SECTIONS.map(sec => (
            <SectionShell
              key={sec.key}
              icon={sec.icon}
              label={sec.label}
              badge={sec.badge}
              badgeColor={sec.badgeColor}
              defaultOpen={sec.defaultOpen ?? false}
              copyText={sectionRawText(sec.key, result.data)}
            >
              {renderSection(sec.key, result.data)}
            </SectionShell>
          ))}

          {result.revisionId && (
            <div className="fixed bottom-6 right-6 z-50">
              <a href={`/api/export-pdf?revisionId=${result.revisionId}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 px-5 py-3 text-sm font-black text-black shadow-2xl shadow-amber-400/25 transition-all hover:scale-105">
                <Download className="w-4 h-4" />
                Export PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}