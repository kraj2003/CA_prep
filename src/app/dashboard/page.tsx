import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  BookOpen, CheckCircle, Clock, Flame, Plus,
  ArrowRight, Sparkles, Target
} from "lucide-react";
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
    "Cash Flow Statement AS 3",
  ];

  const statCards = [
    {
      label: "Total Packages",
      value: totalCount,
      sub: "all time",
      colorClass: "text-blue-400",
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500/20",
    },
    {
      label: "This Month",
      value: thisMonthCount ?? 0,
      sub: usage.isPaid ? "Unlimited plan" : `${usage.remaining} remaining`,
      colorClass: "text-orange-400",
      bgClass: "bg-orange-500/10",
      borderClass: "border-orange-500/20",
    },
    {
      label: "Marked Revised",
      value: revisedCount,
      sub: `of last ${Math.min(latest?.length ?? 0, 8)} packages`,
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-500/10",
      borderClass: "border-emerald-500/20",
    },
    {
      label: "Plan",
      value: usage.isPaid ? "Pro" : "Free",
      sub: usage.isPaid ? "Unlimited" : "3 packages/month",
      colorClass: "text-purple-400",
      bgClass: "bg-purple-500/10",
      borderClass: "border-purple-500/20",
    },
  ];

  return (
    <main
      className="min-h-screen px-4 py-8"
      style={{ background: "linear-gradient(180deg, #060d1a 0%, #080f20 100%)" }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] rounded-full blur-[100px]" style={{ background: "rgba(59,130,246,0.05)" }} />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[300px] rounded-full blur-[100px]" style={{ background: "rgba(251,191,36,0.04)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-white/35">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/history">
              <button className="px-4 py-2 rounded-xl text-sm font-medium text-white/50 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white/80 transition-all">
                My Revisions
              </button>
            </Link>
            <Link href="/generate">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-amber-400 text-black hover:bg-amber-300 transition-all">
                <Plus className="w-4 h-4" />
                New Package
              </button>
            </Link>
          </div>
        </div>

        {/* Free limit banner */}
        {!usage.isPaid && (usage.remaining ?? 3) < 3 && (
          <div className={`flex items-center justify-between rounded-2xl p-4 gap-4 border ${
            (usage.remaining ?? 0) === 0 ? "bg-red-500/5 border-red-500/20" : "bg-amber-500/5 border-amber-500/20"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${(usage.remaining ?? 0) === 0 ? "bg-red-500/20" : "bg-amber-400/20"}`}>
                <Flame className={`w-4 h-4 ${(usage.remaining ?? 0) === 0 ? "text-red-400" : "text-amber-400"}`} />
              </div>
              <div>
                <p className={`font-bold text-sm ${(usage.remaining ?? 0) === 0 ? "text-red-300" : "text-amber-300"}`}>
                  {(usage.remaining ?? 0) === 0 ? "All free packages used this month" : `${usage.remaining} free package${(usage.remaining ?? 0) === 1 ? "" : "s"} remaining`}
                </p>
                <p className="text-xs text-white/35">Upgrade to Pro for unlimited generations</p>
              </div>
            </div>
            <Link href="/pricing">
              <button className="shrink-0 bg-amber-400 text-black font-bold text-sm px-4 py-2 rounded-xl hover:bg-amber-300 transition-all">
                Upgrade
              </button>
            </Link>
          </div>
        )}

        {/* Stats Grid — NO inline event handlers, pure Tailwind hover */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, sub, colorClass, bgClass, borderClass }) => (
            <div
              key={label}
              className={`rounded-2xl p-5 border ${borderClass} hover:-translate-y-0.5 transition-transform duration-200`}
              style={{ background: "rgba(10,22,40,0.8)" }}
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bgClass}`}>
                <div className="w-3 h-3 rounded-full bg-current opacity-60" style={{ color: "currentColor" }} />
              </div>
              <p className="text-xs font-medium text-white/40">{label}</p>
              <p className={`mt-1 text-3xl font-black ${colorClass}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                {value}
              </p>
              <p className="mt-0.5 text-xs text-white/25">{sub}</p>
            </div>
          ))}
        </div>

        {/* Quick Generate */}
        <div className="rounded-2xl p-6 border border-amber-500/10" style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.05) 0%, rgba(10,22,40,0.95) 100%)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>Quick Generate</h2>
              <p className="text-xs text-white/30">Tap a topic to generate instantly</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickTopics.map((topic) => (
              <Link key={topic} href={`/generate?topic=${encodeURIComponent(topic)}`}>
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm border border-white/10 text-white/50 bg-white/5 hover:bg-white/10 hover:text-amber-300 hover:border-amber-400/20 transition-all">
                  <Target className="w-3 h-3" />
                  {topic}
                </button>
              </Link>
            ))}
            <Link href="/generate">
              <button className="flex items-center gap-2 bg-amber-400 text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-amber-300 transition-all">
                <Plus className="w-3.5 h-3.5" />
                Custom Topic
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Revisions */}
        <div className="rounded-2xl overflow-hidden border border-white/5" style={{ background: "rgba(10,22,40,0.8)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div>
              <h2 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Recent Packages</h2>
              <p className="text-xs text-white/30 mt-0.5">Last {Math.min(latest?.length ?? 0, 8)} generated</p>
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
                /* Pure CSS hover — no JS event handlers */
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-3 rounded-xl p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-150"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.is_revised ? "bg-emerald-500/10" : "bg-white/5"}`}>
                      {item.is_revised
                        ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                        : <Clock className="h-4 w-4 text-white/20" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-sm text-white">{item.topic}</p>
                      <p className="text-xs text-white/25">
                        {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {item.is_revised && <span className="ml-2 text-emerald-400 font-medium">· Revised ✓</span>}
                      </p>
                    </div>
                  </div>
                  <Link href={`/history/${item.id}`}>
                    <button className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/40 group-hover:text-white/70 group-hover:border-white/20 transition-all">
                      Open →
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white/15" />
                </div>
                <p className="font-bold text-white">No packages yet</p>
                <p className="mt-1 text-sm text-white/30">Generate your first exam-ready package</p>
                <Link href="/generate">
                  <button className="mt-5 inline-flex items-center gap-2 bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-amber-300 transition-all">
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