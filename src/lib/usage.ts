import { getSupabaseAdmin } from "@/lib/supabase";
import { clerkClient } from "@clerk/nextjs/server";

const FREE_MONTHLY_LIMIT = 3;
const PREMIUM_EMAIL = "abc@gmail.com";

export async function canGenerate(userId: string) {
  // Check if user is the premium owner
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (email?.toLowerCase() === PREMIUM_EMAIL.toLowerCase()) {
      return { allowed: true, remaining: -1, isPaid: true, plan: "owner" };
    }
  } catch (e) {
    // Clerk API failed - continue with free tier check instead of crashing
    console.error("Error checking premium user (falling back to free tier):", e);
  }

  const supabase = getSupabaseAdmin();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, plan")
    .eq("user_id", userId)
    .maybeSingle();

  const isPaid = subscription?.status === "active";
  if (isPaid) {
    return { allowed: true, remaining: -1, isPaid, plan: subscription?.plan ?? "pro" };
  }

  const { count } = await supabase
    .from("revisions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());

  const used = count ?? 0;
  const remaining = Math.max(FREE_MONTHLY_LIMIT - used, 0);
  return { allowed: remaining > 0, remaining, isPaid: false, plan: "free" };
}
