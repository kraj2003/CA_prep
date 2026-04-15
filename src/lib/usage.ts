import { getSupabaseAdmin } from "@/lib/supabase";

const FREE_MONTHLY_LIMIT = 3;

export async function canGenerate(userId: string) {
  const supabase = getSupabaseAdmin();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();

  const isPaid = subscription?.status === "active";
  if (isPaid) {
    return { allowed: true, remaining: -1, isPaid };
  }

  const { count } = await supabase
    .from("revisions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());

  const used = count ?? 0;
  const remaining = Math.max(FREE_MONTHLY_LIMIT - used, 0);
  return { allowed: remaining > 0, remaining, isPaid: false };
}
