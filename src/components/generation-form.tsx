"use client";

import { useState } from "react";
import { Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResultTabs } from "@/components/result-tabs";
import { RevisionPackage } from "@/lib/types";

type GenerateResponse = {
  revisionId: string;
  data: RevisionPackage;
};

export function GenerationForm() {
  const [topic, setTopic] = useState("");
  const [promptTweak, setPromptTweak] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("topic", topic);
      if (file) formData.append("file", file);
      if (promptTweak) formData.append("promptTweak", promptTweak);

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Generation failed.");
      }
      const data = (await res.json()) as GenerateResponse;
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Generate Exam-Ready Package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="topic" className="text-sm font-medium">
              Topic Name
            </label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ind AS 16 - Property, Plant and Equipment"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              Upload Notes (PDF / TXT / DOCX)
            </label>
            <Input id="file" type="file" accept=".pdf,.txt,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="tweak" className="text-sm font-medium">
              Regeneration Tweak (optional)
            </label>
            <Textarea
              id="tweak"
              value={promptTweak}
              onChange={(e) => setPromptTweak(e.target.value)}
              placeholder="Example: Focus more on practical adjustment entries."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onGenerate} disabled={loading || (!topic && !file)}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Exam-Ready Package
            </Button>
            <Button
              variant="outline"
              onClick={onGenerate}
              disabled={loading || (!topic && !file)}
              title="Regenerate with optional tweak"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            {result ? (
              <Button variant="secondary" asChild>
                <a href={`/api/export-pdf?revisionId=${result.revisionId}`} target="_blank" rel="noreferrer">
                  Export to PDF
                </a>
              </Button>
            ) : null}
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </CardContent>
      </Card>
      {result ? <ResultTabs data={result.data} /> : null}
    </div>
  );
}
