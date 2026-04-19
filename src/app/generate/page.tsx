import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, Clock, Flame, Shield, Sparkles, Zap } from "lucide-react";
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
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Success banners */}
      {(purchase === "success" || upgrade === "success") && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-emerald-700 dark:text-emerald-300">
              {upgrade === "success" ? "🎉 Pro unlocked! Unlimited generations activated." : "🎉 Booster pack activated!"}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Time to crush those exams. Generate away!
            </p>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Generate Package</h1>
          <p className="mt-1 text-sm text-zinc-500">
            ICAI-aligned · 8 sections · 2026 new syllabus
          </p>
        </div>
        <div className="flex items-center gap-2">
          {usage.isPaid ? (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Zap className="h-3 w-3" />
              Pro · Unlimited
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              (usage.remaining ?? 0) === 0
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
            }`}>
              <Flame className="h-3 w-3" />
              {usage.remaining} free left this month
            </div>
          )}
        </div>
      </div>

      {/* Low usage warning */}
      {!usage.isPaid && (usage.remaining ?? 3) === 0 && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div>
            <p className="font-bold text-red-700 dark:text-red-300">No free packages left this month</p>
            <p className="text-sm text-red-600 dark:text-red-400">Upgrade to Pro for unlimited generations.</p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            Upgrade Now
          </Link>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Main form */}
        <GenerationForm initialTopic={topic ?? ""} />

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* What you get */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0052CC]" />
              <p className="text-sm font-bold text-zinc-900 dark:text-white">What you get</p>
            </div>
            <ul className="space-y-2">
              {[
                { icon: "📚", label: "Comprehensive Revision Notes" },
                { icon: "🧠", label: "8-10 ICAI-style MCQs" },
                { icon: "📝", label: "4-6 Descriptive Q&As" },
                { icon: "⚠️", label: "Common Mistakes & Traps" },
                { icon: "✍️", label: "Answer Writing Strategy" },
                { icon: "📊", label: "Past Paper Pattern Analysis" },
                { icon: "🎯", label: "High-yield Focus Areas" },
                { icon: "⚡", label: "12-15 Quick Revision Bullets" },
              ].map(({ icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span>{icon}</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Quality promise */}
          <div className="rounded-2xl border border-[#0052CC]/20 bg-[#0052CC]/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#0052CC]" />
              <p className="text-sm font-bold text-[#0052CC]">Quality Promise</p>
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              {[
                "100% ICAI 2026 syllabus aligned",
                "Correct standard & act references",
                "Current tax rates & provisions",
                "Past paper pattern analysis",
                "Examiner-approved answer format",
              ].map((p) => (
                <li key={p} className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Pro Tips</p>
            </div>
            <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
              <li>📌 Be specific: "Ind AS 16 – Revaluation" beats just "Assets"</li>
              <li>📌 Select your CA level for more targeted content</li>
              <li>📌 Upload handwritten notes for personalised output</li>
              <li>📌 Use "Make it more concise" for 48-hour cramming</li>
            </ul>
          </div>

          {/* Time estimate */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
            <Clock className="h-4 w-4 text-zinc-400" />
            <p className="text-xs text-zinc-500">
              Generation takes <span className="font-semibold text-zinc-700 dark:text-zinc-300">30–60 seconds</span>. Please stay on this page.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}