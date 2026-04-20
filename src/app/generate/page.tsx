import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sparkles, Shield, Clock, BookOpen, Zap, Flame } from "lucide-react";
import { GenerationForm } from "@/components/generation-form";
import { canGenerate } from "@/lib/usage";
import Link from "next/link";

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; purchase?: string; upgrade?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { topic, purchase, upgrade } = await searchParams;
  const usage = await canGenerate(userId);

  return (
    <main
      className="min-h-screen px-4 py-8"
      style={{ background: "linear-gradient(180deg, #060d1a 0%, #080f20 100%)" }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-amber-500/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-6">

        {/* ── Success banners ── */}
        {(purchase === "success" || upgrade === "success") && (
          <div
            className="flex items-center gap-3 rounded-2xl p-4"
            style={{
              background: "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.04))",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-emerald-300 text-sm">
                {upgrade === "success" ? "🎉 Pro unlocked! Unlimited generations activated." : "🎉 Booster pack activated!"}
              </p>
              <p className="text-xs text-emerald-400/70">Time to crush those exams. Generate away!</p>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="text-3xl font-black text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Generate Package
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(248,250,252,0.35)" }}>
              ICAI-aligned · 8 sections · 2026 new syllabus
            </p>
          </div>
          <div>
            {usage.isPaid ? (
              <div className="badge-emerald flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                Pro · Unlimited
              </div>
            ) : (
              <div className={`flex items-center gap-1.5 ${(usage.remaining ?? 0) === 0 ? "badge-red" : "badge-amber"}`}>
                <Flame className="w-3 h-3" />
                {usage.remaining} free left this month
              </div>
            )}
          </div>
        </div>

        {/* ── Limit warning ── */}
        {!usage.isPaid && (usage.remaining ?? 0) === 0 && (
          <div
            className="flex items-center justify-between gap-4 rounded-2xl p-4"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04))",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <div>
              <p className="font-bold text-red-300 text-sm">No free packages left this month</p>
              <p className="text-xs text-red-400/70 mt-0.5">Upgrade to Pro for unlimited generations.</p>
            </div>
            <Link href="/pricing">
              <button className="shrink-0 bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                Upgrade Now
              </button>
            </Link>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">

          {/* ── Main Form ── */}
          <GenerationForm initialTopic={topic ?? ""} />

          {/* ── Sidebar ── */}
          <aside className="space-y-4">

            {/* What you get */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  What you get
                </p>
              </div>
              <ul className="space-y-2">
                {[
                  { icon: "📚", label: "Comprehensive Revision Notes" },
                  { icon: "🧠", label: "8-10 ICAI-Style MCQs" },
                  { icon: "📝", label: "4-6 Model Q&As" },
                  { icon: "⚠️", label: "Mark-Loss Traps" },
                  { icon: "✍️", label: "Answer Writing Strategy" },
                  { icon: "📊", label: "Past Paper Patterns" },
                  { icon: "🎯", label: "High-Yield Focus Areas" },
                  { icon: "⚡", label: "Quick Revision Bullets" },
                ].map(({ icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5 text-xs" style={{ color: "rgba(248,250,252,0.5)" }}>
                    <span>{icon}</span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quality promise */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(10,22,40,0.9))",
                border: "1px solid rgba(59,130,246,0.12)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-blue-400" />
                <p className="text-sm font-bold text-blue-300" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Quality Promise
                </p>
              </div>
              <ul className="space-y-2">
                {[
                  "100% ICAI 2026 syllabus aligned",
                  "Correct section & standard refs",
                  "Current tax rates & provisions",
                  "Past paper pattern analysis",
                  "Examiner-approved answer format",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs" style={{ color: "rgba(248,250,252,0.45)" }}>
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-amber-400/70" />
                <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Pro Tips
                </p>
              </div>
              <ul className="space-y-2">
                {[
                  "Be specific: \"Ind AS 16 – Revaluation\" beats just \"Assets\"",
                  "Select your CA level for targeted output",
                  "Upload notes for personalised package",
                  "Use 'Make it concise' for 48-hour sprints",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs" style={{ color: "rgba(248,250,252,0.35)" }}>
                    <span className="text-amber-400/60 shrink-0">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Time */}
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <Clock className="h-4 w-4 shrink-0" style={{ color: "rgba(248,250,252,0.25)" }} />
              <p className="text-xs" style={{ color: "rgba(248,250,252,0.35)" }}>
                Generation takes{" "}
                <span className="font-semibold text-white/60">30–60 seconds</span>.
                Please stay on this page.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}