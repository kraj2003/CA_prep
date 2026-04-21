"use client";

import { useMemo, useState } from "react";
import {
  BookOpen, Brain, FileText, AlertCircle, PenLine,
  BarChart2, Target, Zap, CheckCircle2, Copy, Check,
  Download, Loader2, ChevronDown, ChevronUp, X,
  Flame, Award
} from "lucide-react";
import { RevisionPackage } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── Tab Definitions ──────────────────────────────────────────────────────────

const TABS = [
  { key: "revisionNotes",          label: "Revision Notes",          icon: BookOpen,   short: "Notes"    },
  { key: "mcqs",                   label: "ICAI MCQs",                icon: Brain,      short: "MCQs"     },
  { key: "descriptiveQuestions",   label: "Model Answers",            icon: FileText,   short: "Answers"  },
  { key: "commonMistakes",         label: "Mark-Loss Traps",          icon: AlertCircle,short: "Traps"    },
  { key: "answerWritingApproach",  label: "Answer Strategy",          icon: PenLine,    short: "Strategy" },
  { key: "howTopicIsTested",       label: "Exam Pattern",             icon: BarChart2,  short: "Pattern"  },
  { key: "keyFocusAreas",          label: "Focus Areas",              icon: Target,     short: "Focus"    },
  { key: "quickRevisionPointers",  label: "Quick Pointers",           icon: Zap,        short: "Quick"    },
] as const;

type TabKey = typeof TABS[number]["key"];

// ─── Markdown renderer ────────────────────────────────────────────────────────

function MD({ text }: { text: string }) {
  const render = (t: string) =>
    t
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f8fafc;font-weight:600">$1</strong>')
      .replace(/`(.+?)`/g, '<code style="font-family:monospace;font-size:11px;background:rgba(59,130,246,0.12);color:#93c5fd;padding:2px 6px;border-radius:4px">$1</code>');

  return (
    <div className="space-y-1">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="text-[11px] font-bold text-blue-300/70 uppercase tracking-[0.1em] pt-4 pb-1 first:pt-0">
              {line.slice(3)}
            </h3>
          );
        }
        if (line.match(/^[•\-]\s/)) {
          return (
            <div key={i} className="flex gap-2.5 items-start py-0.5">
              <span className="w-1 h-1 rounded-full bg-blue-400/40 mt-2 shrink-0" />
              <p className="text-sm text-white/60 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: render(line.slice(2)) }} />
            </div>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          const m = line.match(/^(\d+)\.\s(.+)/);
          if (m) return (
            <div key={i} className="flex gap-2.5 items-start py-0.5">
              <span className="text-[11px] font-mono font-bold text-blue-400/50 shrink-0 mt-0.5 w-4">{m[1]}.</span>
              <p className="text-sm text-white/60 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: render(m[2]) }} />
            </div>
          );
        }
        return (
          <p key={i} className="text-sm text-white/60 leading-relaxed" dangerouslySetInnerHTML={{ __html: render(line) }} />
        );
      })}
    </div>
  );
}

// ─── Revision Notes ───────────────────────────────────────────────────────────

function RevisionNotes({ text }: { text: string }) {
  const sections: { heading: string; body: string }[] = [];
  let current = { heading: "", body: "" };
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      if (current.body.trim() || current.heading) sections.push({ ...current });
      current = { heading: line.slice(3), body: "" };
    } else {
      current.body += line + "\n";
    }
  }
  if (current.body.trim() || current.heading) sections.push(current);

  if (!sections.length) return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"><MD text={text} /></div>
  );

  return (
    <div className="space-y-2.5">
      {sections.map((sec, i) => (
        <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
          {sec.heading && (
            <div className="px-4 py-2.5 bg-blue-500/[0.05] border-b border-white/[0.05]">
              <p className="text-[11px] font-bold text-blue-300/70 uppercase tracking-widest">{sec.heading}</p>
            </div>
          )}
          <div className="px-4 py-3.5 bg-white/[0.01]"><MD text={sec.body.trim()} /></div>
        </div>
      ))}
    </div>
  );
}

// ─── MCQ Section ──────────────────────────────────────────────────────────────

function McqSection({ mcqs }: { mcqs: RevisionPackage["mcqs"] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  return (
    <div className="space-y-3">
      {mcqs.map((q, i) => {
        const isRevealed = revealed.has(i);
        const correctLetter = q.answer?.match(/^[A-D]/)?.[0];
        const diffColor: Record<string, string> = {
          Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
          Medium: "bg-amber-500/10 text-amber-400 border-amber-500/25",
          Hard: "bg-red-500/10 text-red-400 border-red-500/25",
        };

        return (
          <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-start gap-3 px-4 py-3.5 bg-white/[0.02]">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-black text-purple-400">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border tracking-wide uppercase", diffColor[q.difficulty ?? "Medium"])}>
                    {q.difficulty ?? "Medium"}
                  </span>
                  {q.examTip && <span className="text-[10px] text-white/25 truncate max-w-[200px]">💡 {q.examTip}</span>}
                </div>
                <p className="text-sm text-white/85 font-medium leading-relaxed">{q.question}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-1.5 px-4 pb-3 pt-1">
              {q.options.map((opt, j) => {
                const letter = String.fromCharCode(65 + j);
                const isCorrect = isRevealed && correctLetter === letter;
                return (
                  <div key={j} className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all",
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-white/[0.02] border-white/[0.06] text-white/50"
                  )}>
                    <span className={cn("font-bold shrink-0 text-[11px] mt-0.5", isCorrect ? "text-emerald-400" : "text-white/25")}>{letter}.</span>
                    <span className="leading-relaxed">{opt}</span>
                    {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-auto mt-0.5" />}
                  </div>
                );
              })}
            </div>
            {isRevealed && (
              <div className="mx-4 mb-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <p className="text-xs font-bold text-emerald-400">Answer: {q.answer}</p>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{q.explanation}</p>
              </div>
            )}
            <button
              onClick={() => setRevealed(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })}
              className="w-full text-center text-xs font-semibold py-2 border-t border-white/[0.04] text-white/25 hover:text-white/55 hover:bg-white/[0.02] transition-colors"
            >
              {isRevealed ? "Hide Answer ↑" : "Show Answer →"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Descriptive Section ──────────────────────────────────────────────────────

function DescriptiveSection({ questions }: { questions: RevisionPackage["descriptiveQuestions"] }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  return (
    <div className="space-y-2.5">
      {questions.map((q, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
            <button
              onClick={() => setOpen(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })}
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
                {isOpen ? <ChevronUp className="w-4 h-4 text-white/25" /> : <ChevronDown className="w-4 h-4 text-white/25" />}
              </div>
            </button>
            {isOpen && (
              <div className="border-t border-white/[0.05]">
                <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04] flex items-center justify-between">
                  <p className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest">Model Answer</p>
                </div>
                <div className="px-4 py-4"><MD text={q.modelAnswer} /></div>
                {q.answerTips && (
                  <div className="mx-4 mb-4 flex gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.05] px-3.5 py-3">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/50 leading-relaxed">{q.answerTips}</p>
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

// ─── Mistakes Section ─────────────────────────────────────────────────────────

function MistakesSection({ mistakes }: { mistakes: string[] }) {
  return (
    <div className="space-y-2">
      {mistakes.map((m, i) => {
        const parts = m.split("→");
        const wrong = parts[0]?.replace(/^[✗❌\s]+/, "").trim() || m;
        const right = parts[1]?.replace(/^[✓✅\s]+/, "").trim();
        return (
          <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-start gap-3 px-4 py-3 bg-red-500/[0.03]">
              <div className="w-5 h-5 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-2.5 h-2.5 text-red-400" />
              </div>
              <p className="text-sm text-red-300/75 leading-relaxed">{wrong}</p>
            </div>
            {right && (
              <div className="flex items-start gap-3 px-4 py-3 border-t border-white/[0.04]">
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                </div>
                <p className="text-sm text-emerald-300/75 leading-relaxed">{right}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Pointers Section ─────────────────────────────────────────────────────────

function PointersSection({ pointers }: { pointers: string[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {pointers.map((p, i) => {
        const clean = p.replace(/^🔑\s*/, "");
        const colonIdx = clean.indexOf(":");
        const key = colonIdx > 0 ? clean.slice(0, colonIdx).trim() : "";
        const desc = colonIdx > 0 ? clean.slice(colonIdx + 1).trim() : clean;
        return (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] px-3.5 py-3 bg-white/[0.02]">
            <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[9px] font-black text-amber-400">{i + 1}</span>
            </div>
            <div className="min-w-0">
              {key ? (
                <>
                  <p className="text-xs font-bold text-amber-300/80">{key}</p>
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

// ─── Text Section ─────────────────────────────────────────────────────────────

function TextSection({ text }: { text: string }) {
  return (
    <div className="space-y-2.5">
      {text.split("## ").filter(Boolean).map((chunk, i) => {
        const lines = chunk.split("\n");
        const heading = lines[0].trim();
        const body = lines.slice(1).join("\n").trim();
        return (
          <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
            {heading && (
              <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.05]">
                <p className="text-[11px] font-bold text-blue-300/70 uppercase tracking-widest">{heading}</p>
              </div>
            )}
            {body && <div className="px-4 py-3.5"><MD text={body} /></div>}
          </div>
        );
      })}
      {!text.includes("##") && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <MD text={text} />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
  const [copied, setCopied] = useState(false);
  const [isRevised, setIsRevised] = useState(initialRevised);
  const [savingRevised, setSavingRevised] = useState(false);

  const copySection = async () => {
    const val = (data as Record<string, unknown>)[activeKey];
    const text = typeof val === "string" ? val : JSON.stringify(val, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleRevised = async () => {
    if (!revisionId) return;
    setSavingRevised(true);
    const next = !isRevised;
    const res = await fetch(`/api/revisions/${revisionId}/reviewed`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRevised: next }),
    });
    if (res.ok) setIsRevised(next);
    setSavingRevised(false);
  };

  const isHighRelevance = data.examRelevance?.toLowerCase().includes("high");

  const content = useMemo(() => {
    switch (activeKey) {
      case "revisionNotes":        return <RevisionNotes text={data.revisionNotes} />;
      case "mcqs":                 return <McqSection mcqs={data.mcqs} />;
      case "descriptiveQuestions": return <DescriptiveSection questions={data.descriptiveQuestions} />;
      case "commonMistakes":       return <MistakesSection mistakes={data.commonMistakes} />;
      case "quickRevisionPointers": return <PointersSection pointers={data.quickRevisionPointers} />;
      default:
        const val = (data as Record<string, unknown>)[activeKey];
        return <TextSection text={typeof val === "string" ? val : JSON.stringify(val)} />;
    }
  }, [activeKey, data]);

  return (
    <div
      className="rounded-2xl border border-white/[0.08] overflow-hidden"
      style={{ background: "rgba(8,16,32,0.95)" }}
    >
      {/* Package header */}
      <div
        className="px-5 py-4"
        style={{
          background: "linear-gradient(135deg, rgba(251,191,36,0.05), rgba(59,130,246,0.04))",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Exam relevance */}
        {data.examRelevance && (
          <div className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 mb-3",
            isHighRelevance ? "bg-amber-500/[0.07] border-amber-500/20" : "bg-blue-500/[0.06] border-blue-500/15"
          )}>
            <Flame className={cn("w-3 h-3 shrink-0", isHighRelevance ? "text-amber-400" : "text-blue-400")} />
            <p className={cn("text-xs font-semibold", isHighRelevance ? "text-amber-300/90" : "text-blue-300/90")}>
              {data.examRelevance}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={copySection}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all",
                copied
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/15"
              )}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy Section"}
            </button>

            {revisionId && (
              <button
                onClick={toggleRevised}
                disabled={savingRevised}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all",
                  isRevised
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-emerald-400/60 hover:border-emerald-500/20"
                )}
              >
                {savingRevised
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <CheckCircle2 className="w-3 h-3" />
                }
                {isRevised ? "Marked Revised ✓" : "Mark as Revised"}
              </button>
            )}
          </div>

          {revisionId && (
            <a
              href={`/api/export-pdf?revisionId=${revisionId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
            >
              <Download className="w-3 h-3" />
              Export PDF
            </a>
          )}
        </div>
      </div>

      {/* Tab bar — horizontal scroll on mobile */}
      <div
        className="flex overflow-x-auto border-b border-white/[0.05] scrollbar-hide"
        style={{ background: "rgba(6,13,26,0.6)" }}
      >
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveKey(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all shrink-0",
                isActive
                  ? "border-amber-400 text-white bg-amber-400/[0.04]"
                  : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-amber-400" : "text-white/25")} />
              <span className="hidden sm:block">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-5">
        {content}
      </div>
    </div>
  );
}