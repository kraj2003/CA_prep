import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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

  const { data: latest } = await supabase
    .from("revisions")
    .select("id, topic, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1847A4]">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Packages</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{count ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Plan Status</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">{usage.isPaid ? "Paid" : "Free"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Free Generations Left</CardTitle>
            <CardDescription>Resets monthly</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{usage.isPaid ? "Unlimited" : usage.remaining}</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/generate">Generate Exam-Ready Package</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/history">Open My Revisions</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Packages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {latest?.length ? (
            latest.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <div>
                  <p className="font-medium">{item.topic}</p>
                  <p className="text-xs text-zinc-500">{new Date(item.created_at).toLocaleString()}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/history/${item.id}`}>View</Link>
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">No revisions generated yet.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
