import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, CheckCircle, Clock, Flame, Plus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  const statCards = [
    {
      icon: BookOpen,
      label: "Total Packages",
      value: totalCount,
      sub: "all time",
      color: "text-[#1847A4]",
      bg: "bg-[#1847A4]/8",
    },
    {
      icon: Flame,
      label: "This Month",
      value: thisMonthCount ?? 0,
      sub: usage.isPaid ? "Unlimited plan" : `${usage.remaining} left free`,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: CheckCircle,
      label: "Marked Revised",
      value: revisedCount,
      sub: `out of last ${Math.min(latest?.length ?? 0, 8)}`,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: TrendingUp,
      label: "Plan",
      value: usage.isPaid ? "Pro" : "Free",
      sub: usage.isPaid ? "Unlimited generations" : "3/month free",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Your CA revision command centre</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/history">My Revisions</Link>
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link href="/generate">
              <Plus className="h-4 w-4" />
              New Package
            </Link>
          </Button>
        </div>
      </div>

      {/* Upgrade banner for free users */}
      {!usage.isPaid && (usage.remaining ?? 3) < 3 && (
        <div className="flex items-center justify-between rounded-xl border border-[#FFD700]/40 bg-[#FFD700]/10 px-5 py-4">
          <div>
            <p className="font-semibold text-[#8a6500]">
              {usage.remaining === 0
                ? "You've used all free packages this month"
                : `${usage.remaining} free package${usage.remaining === 1 ? "" : "s"} left this month`}
            </p>
            <p className="text-sm text-[#a17700]">Upgrade to Pro for unlimited generations and PDF export.</p>
          </div>
          <Button asChild size="sm" className="bg-[#FFD700] text-[#0a1628] hover:bg-[#f0ca00] font-bold shrink-0">
            <Link href="/pricing">Upgrade Now</Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <Card key={label} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-xs font-medium text-zinc-500">{label}</p>
              <p className="mt-1 text-3xl font-black text-zinc-900 dark:text-white">{value}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick start */}
      <Card className="border-[#1847A4]/20 bg-gradient-to-br from-[#1847A4]/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-[#1847A4]">Ready to revise?</CardTitle>
          <CardDescription>Generate a new exam-ready package or continue from your history.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <Link href="/generate">
              <Plus className="h-4 w-4" />
              Generate New Package
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/generate?topic=Ind+AS+16+Property+Plant+Equipment">Try: Ind AS 16</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/generate?topic=GST+Input+Tax+Credit">Try: GST ITC</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/generate?topic=Transfer+Pricing">Try: Transfer Pricing</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent revisions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Packages</CardTitle>
            <CardDescription>Your last {Math.min(latest?.length ?? 0, 8)} generated packages</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/history">View All</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {latest?.length ? (
            latest.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-[#1847A4]/20 hover:bg-[#1847A4]/2 dark:border-zinc-700"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      item.is_revised
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                  >
                    {item.is_revised ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900 dark:text-white">{item.topic}</p>
                    <p className="text-xs text-zinc-400">
                      {new Date(item.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {item.is_revised && (
                        <span className="ml-2 font-medium text-emerald-600">· Revised</span>
                      )}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild className="shrink-0">
                  <Link href={`/history/${item.id}`}>Open</Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
              <p className="font-medium text-zinc-500">No packages yet</p>
              <p className="mt-1 text-sm text-zinc-400">Generate your first exam-ready package to get started.</p>
              <Button asChild className="mt-4 gap-2">
                <Link href="/generate">
                  <Plus className="h-4 w-4" />
                  Generate First Package
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}