import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("revisions")
    .select("id, topic, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#1847A4]">My Revisions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Revision History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data?.length ? (
            data.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border border-zinc-200 p-3 dark:border-zinc-700">
                <div>
                  <p className="font-medium">{item.topic}</p>
                  <p className="text-xs text-zinc-500">{new Date(item.created_at).toLocaleString()}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/history/${item.id}`}>Open</Link>
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
