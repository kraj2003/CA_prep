import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ResultTabs } from "@/components/result-tabs";
import { QuizMode } from "@/components/quiz-mode";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain } from "lucide-react";

export default async function RevisionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data } = await supabase.from("revisions").select("*").eq("id", id).eq("user_id", userId).maybeSingle();
  if (!data) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1847A4]">{data.topic}</h1>
          <p className="text-sm text-zinc-500">Generated on {new Date(data.created_at).toLocaleDateString("en-IN")}</p>
        </div>
        <div className="flex gap-2">
          <a
            className="inline-flex items-center gap-2 rounded-md bg-[#E8ECF7] px-3 py-2 text-sm font-semibold text-[#1847A4] hover:bg-[#d4dce8]"
            href={`/api/export-pdf?revisionId=${data.id}`}
          >
            Export to PDF
          </a>
          <Button variant="outline" asChild>
            <Link href={`/generate?topic=${encodeURIComponent(data.topic)}`}>Reuse Topic</Link>
          </Button>
        </div>
      </div>
      
      {/* Quiz Mode Section */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <Brain className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">Practice Mode</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Test yourself with {data.package_json.mcqs.length} scenario-based MCQs</p>
            </div>
          </div>
        </div>
      </div>
      
      <ResultTabs data={data.package_json} revisionId={data.id} initialRevised={data.is_revised} />
    </main>
  );
}
