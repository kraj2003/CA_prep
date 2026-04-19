"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevisionPackage } from "@/lib/types";
import { Button } from "@/components/ui/button";

const tabDefs = [
  { key: "revisionNotes", label: "Revision Notes" },
  { key: "mcqs", label: "ICAI-Style MCQs" },
  { key: "descriptiveQuestions", label: "Descriptive Questions" },
  { key: "commonMistakes", label: "Common Mistakes & Traps" },
  { key: "answerWritingApproach", label: "Answer Writing Approach" },
  { key: "howTopicIsTested", label: "How Topic Is Tested" },
  { key: "keyFocusAreas", label: "Key Focus Areas" },
  { key: "quickRevisionPointers", label: "Quick Revision Pointers" },
] as const;

export function ResultTabs({
  data,
  revisionId,
  initialRevised = false,
}: {
  data: RevisionPackage;
  revisionId?: string;
  initialRevised?: boolean;
}) {
  const [activeKey, setActiveKey] = useState<(typeof tabDefs)[number]["key"]>("revisionNotes");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRevised, setIsRevised] = useState(initialRevised);
  const [savingRevised, setSavingRevised] = useState(false);

  async function copyCurrentSection() {
    const value = data[activeKey];
    const serialized = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    await navigator.clipboard.writeText(serialized);
    setCopiedKey(activeKey);
    setTimeout(() => setCopiedKey(null), 1200);
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
      if (res.ok) {
        setIsRevised(next);
      }
    } finally {
      setSavingRevised(false);
    }
  }

  const content = useMemo(() => {
    const value = data[activeKey];
    if (typeof value === "string") return <p className="leading-7 whitespace-pre-wrap">{value}</p>;

    if (Array.isArray(value)) {
      if (activeKey === "mcqs") {
        return (
          <ul className="space-y-3">
            {value.map((item, idx) => {
              if (typeof item === "string") return null;
              return (
                <li key={idx} className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-700">
                  <p className="font-semibold">{idx + 1}. {item.question}</p>
                  <div className="mt-2 space-y-1 text-zinc-700 dark:text-zinc-200">
                    {item.options.map((option: string, optionIdx: number) => (
                      <p key={`${idx}-${optionIdx}`}>{String.fromCharCode(65 + optionIdx)}. {option}</p>
                    ))}
                  </div>
                  <p className="mt-2 font-medium text-emerald-700 dark:text-emerald-400">Answer: {item.answer}</p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-300">{item.explanation}</p>
                </li>
              );
            })}
          </ul>
        );
      }
      if (activeKey === "descriptiveQuestions") {
        return (
          <ul className="space-y-3">
            {value.map((item, idx) => {
              if (typeof item === "string") return null;
              return (
                <li key={idx} className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-700">
                  <p className="font-semibold">{idx + 1}. {item.question}</p>
                  <p className="mt-2 whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">{item.modelAnswer}</p>
                </li>
              );
            })}
          </ul>
        );
      }
      return (
        <ul className="space-y-3">
          {value.map((item, idx) => (
            <li key={idx} className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-700">
              <pre className="font-sans whitespace-pre-wrap">
                {typeof item === "string" ? item : JSON.stringify(item, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      );
    }

    return <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>;
  }, [activeKey, data]);

  return (
    <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#0052CC]" />
          Generated Exam-Ready Package
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={copyCurrentSection}>
            <Copy className="mr-2 h-4 w-4" />
            {copiedKey === activeKey ? "Copied" : "Copy Section"}
          </Button>
          {revisionId ? (
            <Button type="button" size="sm" variant={isRevised ? "default" : "secondary"} onClick={toggleRevised} disabled={savingRevised}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isRevised ? "Marked as Revised" : "Mark as Revised"}
            </Button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {tabDefs.map((tab) => (
            <Button
              key={tab.key}
              type="button"
              variant={activeKey === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveKey(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
