import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, CheckCircle, Clock, Plus, Search } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { q, filter } = await searchParams;
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("revisions")
    .select("id, topic, created_at, is_revised")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    query = query.ilike("topic", `%${q.trim()}%`);
  }
  if (filter === "revised") {
    query = query.eq("is_revised", true);
  } else if (filter === "pending") {
    query = query.eq("is_revised", false);
  }

  const { data } = await query.limit(50);
  const revisedCount = data?.filter((d) => d.is_revised).length ?? 0;
  const pendingCount = (data?.length ?? 0) - revisedCount;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">My Revisions</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {data?.length ?? 0} package{(data?.length ?? 0) !== 1 ? "s" : ""} ·{" "}
            <span className="text-emerald-600">{revisedCount} revised</span> ·{" "}
            <span className="text-orange-500">{pendingCount} pending</span>
          </p>
        </div>
        <Button asChild className="gap-2 shrink-0">
          <Link href="/generate">
            <Plus className="h-4 w-4" />
            New Package
          </Link>
        </Button>
      </div>

      {/* Search & filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find your saved revision packages</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 sm:flex-row" action="/history" method="GET">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search by topic name..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="outline" className="shrink-0">Search</Button>
              <Link
                href={`/history?q=${q ?? ""}&filter=revised`}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  filter === "revised"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Revised
              </Link>
              <Link
                href={`/history?q=${q ?? ""}&filter=pending`}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  filter === "pending"
                    ? "border-orange-200 bg-orange-50 text-orange-700"
                    : "border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                Pending
              </Link>
              {(q || filter) && (
                <Link
                  href="/history"
                  className="inline-flex items-center rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent className="p-4 space-y-2">
          {data?.length ? (
            data.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-[#1847A4]/20 hover:bg-[#1847A4]/2 dark:border-zinc-700"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
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
                    <p className="truncate font-semibold text-zinc-900 dark:text-white">{item.topic}</p>
                    <p className="text-xs text-zinc-400">
                      {new Date(item.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {item.is_revised ? (
                        <span className="ml-2 font-medium text-emerald-600">· Revised ✓</span>
                      ) : (
                        <span className="ml-2 text-orange-500">· Not revised yet</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/generate?topic=${encodeURIComponent(item.topic)}`}>Reuse</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/history/${item.id}`}>Open</Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
              <p className="font-semibold text-zinc-500">
                {q || filter ? "No packages match your search" : "No packages yet"}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {q || filter ? "Try different search terms" : "Generate your first exam-ready package"}
              </p>
              {!(q || filter) && (
                <Button asChild className="mt-5 gap-2">
                  <Link href="/generate">
                    <Plus className="h-4 w-4" />
                    Generate First Package
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}