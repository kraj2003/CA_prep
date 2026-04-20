import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, CheckCircle, Clock, Flame, Plus, TrendingUp, Zap, ArrowRight, Sparkles, Target } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase";
import { canGenerate } from "@/lib/usage";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const supabase = getSupabaseAdmin();
  const [{ count }, usage] = await Promise.all([
    supabase.from("revisions").select("id", { count: "exact", head: true }).eq("user_id", userId),
    canGenerate(userId),
  ]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count: thisMonthCount } = await supabase
    .from("revisions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());

  const { data: latest } = await supabase
    .from("revisions")
    .select("id, topic, created_at, is_revised")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(8);

  const revisedCount = latest?.filter((item) => item.is_revised).length ?? 0;
  const totalCount = count ?? 0;

  const quickTopics = [
    "Ind AS 16 – PPE",
    "GST Input Tax Credit",
    "Transfer Pricing",
    "Statutory Audit SA 700",
    "Deferred Tax Ind AS 12",
    "Cash Flow Statement",
  ];

  return (
    <main
      className="min-h-screen px-4 py-8"
      style={{ background: "linear-gradient(180deg, #060d1a 0%, #080f20 100%)" }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[300px] bg-amber-500/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="text-3xl font-black text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Dashboard
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(248,250,252,0.35)" }}>
              Your CA revision command centre · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/history">
              <button className="px-4 py-2 rounded-xl text-sm font-medium transition-all btn-secondary">
                My Revisions
              </button>
            </Link>
            <Link href="/generate">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold btn-primary">
                <Plus className="w-4 h-4" />
                New Package
              </button>
            </Link>
          </div>
        </div>

        {/* ── Free limit banner ── */}
        {!usage.isPaid && (usage.remaining ?? 3) < 3 && (
          <div
            className="flex items-center justify-between rounded-2xl p-4 gap-4"
            style={{
              background: (usage.remaining ?? 0) === 0
                ? "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04))"
                : "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.04))",
              border: `1px solid ${(usage.remaining ?? 0) === 0 ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.2)"}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${(usage.remaining ?? 0) === 0 ? "bg-red-500/20" : "bg-amber-400/20"}`}>
                <Flame className={`w-4 h-4 ${(usage.remaining ?? 0) === 0 ? "text-red-400" : "text-amber-400"}`} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: (usage.remaining ?? 0) === 0 ? "#f87171" : "#fbbf24" }}>
                  {(usage.remaining ?? 0) === 0
                    ? "All free packages used this month"
                    : `${usage.remaining} free package${(usage.remaining ?? 0) === 1 ? "" : "s"} left this month`}
                </p>
                <p className="text-xs" style={{ color: "rgba(248,250,252,0.4)" }}>
                  Upgrade to Pro for unlimited generations
                </p>
              </div>
            </div>
            <Link href="/pricing">
              <button className="shrink-0 btn-primary text-sm px-4 py-2 rounded-xl">
                Upgrade
              </button>
            </Link>
          </div>
        )}

        {/* ── Stats Grid ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpen,
              label: "Total Packages",
              value: totalCount,
              sub: "all time",
              color: "#60a5fa",
              bg: "rgba(59,130,246,0.08)",
              border: "rgba(59,130,246,0.15)",
            },
            {
              icon: Flame,
              label: "This Month",
              value: thisMonthCount ?? 0,
              sub: usage.isPaid ? "Unlimited plan" : `${usage.remaining} remaining free`,
              color: "#fb923c",
              bg: "rgba(251,146,60,0.08)",
              border: "rgba(251,146,60,0.15)",
            },
            {
              icon: CheckCircle,
              label: "Marked Revised",
              value: revisedCount,
              sub: `of last ${Math.min(latest?.length ?? 0, 8)} packages`,
              color: "#34d399",
              bg: "rgba(52,211,153,0.08)",
              border: "rgba(52,211,153,0.15)",
            },
            {
              icon: Zap,
              label: "Plan",
              value: usage.isPaid ? "Pro" : "Free",
              sub: usage.isPaid ? "Unlimited generations" : "3 packages/month",
              color: "#a78bfa",
              bg: "rgba(167,139,250,0.08)",
              border: "rgba(167,139,250,0.15)",
            },
          ].map(({ icon: Icon, label, value, sub, color, bg, border }) => (
            <div
              key={label}
              className="rounded-2xl p-5 transition-all card-hover"
              style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${border}` }}
            >
              <div
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: bg }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <p className="text-xs font-medium" style={{ color: "rgba(248,250,252,0.4)" }}>{label}</p>
              <p
                className="mt-1 text-3xl font-black text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {value}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "rgba(248,250,252,0.3)" }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Quick Generate ── */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(10,22,40,0.9) 100%)",
            border: "1px solid rgba(251,191,36,0.12)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>
                Quick Generate
              </h2>
              <p className="text-xs" style={{ color: "rgba(248,250,252,0.35)" }}>
                Tap any topic to generate instantly
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickTopics.map((topic) => (
              <Link key={topic} href={`/generate?topic=${encodeURIComponent(topic)}`}>
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm transition-all btn-secondary hover:border-amber-400/20 hover:text-amber-300">
                  <Target className="w-3 h-3" />
                  {topic}
                </button>
              </Link>
            ))}
            <Link href="/generate">
              <button className="flex items-center gap-2 btn-primary px-4 py-2 rounded-xl text-sm font-bold">
                <Plus className="w-3.5 h-3.5" />
                Custom Topic
              </button>
            </Link>
          </div>
        </div>

        {/* ── Recent Revisions ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <h2 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                Recent Packages
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "rgba(248,250,252,0.35)" }}>
                Your last {Math.min(latest?.length ?? 0, 8)} generated packages
              </p>
            </div>
            <Link href="/history">
              <button className="flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          <div className="p-4 space-y-2">
            {latest?.length ? (
              latest.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl p-4 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.04)";
                  }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: item.is_revised
                          ? "rgba(52,211,153,0.12)"
                          : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {item.is_revised ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Clock className="h-4 w-4" style={{ color: "rgba(248,250,252,0.25)" }} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-sm text-white">{item.topic}</p>
                      <p className="text-xs" style={{ color: "rgba(248,250,252,0.3)" }}>
                        {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {item.is_revised && (
                          <span className="ml-2 text-emerald-400 font-medium">· Revised ✓</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Link href={`/history/${item.id}`}>
                    <button className="shrink-0 btn-secondary text-xs px-3 py-1.5 rounded-lg">
                      Open →
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8" style={{ color: "rgba(248,250,252,0.2)" }} />
                </div>
                <p className="font-bold text-white">No packages yet</p>
                <p className="mt-1 text-sm" style={{ color: "rgba(248,250,252,0.35)" }}>
                  Generate your first exam-ready package to get started
                </p>
                <Link href="/generate">
                  <button className="mt-5 flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-bold mx-auto">
                    <Plus className="w-4 h-4" />
                    Generate First Package
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}