import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const { q } = await searchParams;
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("revisions")
    .select("id, topic, created_at, is_revised")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (q?.trim()) {
    query = query.ilike("topic", `%${q.trim()}%`);
  }
  const { data } = await query;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#1847A4]">My Revisions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Revision History</CardTitle>
          <form className="mt-3 flex gap-2" action="/history" method="GET">
            <Input name="q" defaultValue={q ?? ""} placeholder="Search by topic..." />
            <Button type="submit" variant="outline">Search</Button>
          </form>
        </CardHeader>
        <CardContent className="space-y-3">
          {data?.length ? (
            data.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border border-zinc-200 p-3 dark:border-zinc-700">
                <div>
                  <p className="font-medium">{item.topic}</p>
                  <p className="text-xs text-zinc-500">{new Date(item.created_at).toLocaleString()}</p>
                  <p className="text-xs text-zinc-500">{item.is_revised ? "Marked as revised" : "Not revised yet"}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/history/${item.id}`}>Open & Reuse</Link>
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">No saved revisions yet.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
