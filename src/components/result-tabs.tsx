"use client";

import { useMemo, useState } from "react";
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

export function ResultTabs({ data }: { data: RevisionPackage }) {
  const [activeKey, setActiveKey] = useState<(typeof tabDefs)[number]["key"]>("revisionNotes");

  const content = useMemo(() => {
    const value = data[activeKey];
    if (typeof value === "string") return <p className="leading-7 whitespace-pre-wrap">{value}</p>;

    if (Array.isArray(value)) {
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
    <Card>
      <CardHeader>
        <CardTitle>Generated Exam-Ready Package</CardTitle>
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
