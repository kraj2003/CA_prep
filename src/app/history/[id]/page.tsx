import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ResultTabs } from "@/components/result-tabs";
import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Download } from "lucide-react";

export default async function RevisionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("revisions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) notFound();

  const isHighRelevance = (data.package_json?.examRelevance ?? "").toLowerCase().includes("high");

  return (
    <main
      className="min-h-screen px-4 py-8"
      style={{ background: "linear-gradient(180deg, #060d1a 0%, #080f20 100%)" }}
    >
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-amber-500/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto space-y-5">

        {/* Back nav */}
        <div className="flex items-center gap-3">
          <Link href="/history">
            <button className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-white/65 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              My Revisions
            </button>
          </Link>
        </div>

        {/* Page header */}
        <div
          className="rounded-2xl border border-white/[0.07] p-5"
          style={{ background: "rgba(10,22,40,0.85)" }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/25">
                  {new Date(data.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {data.is_revised && (
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    ✓ Revised
                  </span>
                )}
                {isHighRelevance && (
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    🔥 High Priority
                  </span>
                )}
              </div>
              <h1
                className="text-2xl font-black text-white leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {data.topic}
              </h1>
              {data.package_json?.topicSummary && (
                <p className="text-sm text-white/40 mt-2 leading-relaxed border-l-2 border-amber-400/25 pl-3">
                  {data.package_json.topicSummary}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <a
                href={`/api/export-pdf?revisionId=${data.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/15 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </a>
              <Link href={`/generate?topic=${encodeURIComponent(data.topic)}`}>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/15 transition-all">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              </Link>
            </div>
          </div>

          {/* Stats row */}
          {data.package_json && (
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/[0.05]">
              {[
                { n: data.package_json.mcqs?.length ?? 0, l: "MCQs" },
                { n: data.package_json.descriptiveQuestions?.length ?? 0, l: "Questions" },
                { n: data.package_json.quickRevisionPointers?.length ?? 0, l: "Pointers" },
                { n: data.package_json.commonMistakes?.length ?? 0, l: "Traps" },
              ].map(({ n, l }) => (
                <div key={l} className="text-center">
                  <p className="text-xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{n}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Result tabs */}
        <ResultTabs
          data={data.package_json}
          revisionId={data.id}
          initialRevised={data.is_revised}
        />
      </div>
    </main>
  );
}