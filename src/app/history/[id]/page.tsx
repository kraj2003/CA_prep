import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ResultTabs } from "@/components/result-tabs";
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function RevisionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data } = await supabase.from("revisions").select("*").eq("id", id).eq("user_id", userId).maybeSingle();
  if (!data) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1847A4]">{data.topic}</h1>
      <a
        className="inline-block rounded-md bg-[#E8ECF7] px-3 py-2 text-sm font-semibold text-[#1847A4]"
        href={`/api/export-pdf?revisionId=${data.id}`}
      >
        Export to PDF
      </a>
      <ResultTabs data={data.package_json} />
    </main>
  );
}
