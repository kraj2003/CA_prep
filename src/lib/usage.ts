import { getSupabaseAdmin } from "@/lib/supabase";
import { clerkClient } from "@clerk/nextjs/server";

const FREE_MONTHLY_LIMIT = 3;

// Any Clerk account whose primary email matches this address is treated as a
// permanent premium owner — bypasses all usage limits without needing a
// Supabase subscription row.  Change this to your real email address.
const OWNER_EMAIL = "abc@gmail.com";

export async function canGenerate(userId: string) {
  // ── Owner check ────────────────────────────────────────────────────────────
  // Resolved against Clerk so it works even if the subscriptions table is
  // empty or the Supabase row is accidentally deleted.
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const primaryEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId,
    )?.emailAddress;

    if (primaryEmail?.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
      return { allowed: true, remaining: -1, isPaid: true, plan: "owner" };
    }
  } catch (e) {
    // Clerk API failed — fall through to the normal free-tier check rather
    // than crashing the whole generate request.
    console.error("Owner email check failed (falling back to free tier):", e);
  }

  // ── Paid subscription check ────────────────────────────────────────────────
  const supabase = getSupabaseAdmin();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, plan")
    .eq("user_id", userId)
    .maybeSingle();

  const isPaid = subscription?.status === "active";
  if (isPaid) {
    return {
      allowed: true,
      remaining: -1,
      isPaid: true,
      plan: subscription?.plan ?? "pro",
    };
  }

  // ── Free tier: count this month's generations ──────────────────────────────
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("revisions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());

  const used = count ?? 0;
  const remaining = Math.max(FREE_MONTHLY_LIMIT - used, 0);

  return { allowed: remaining > 0, remaining, isPaid: false, plan: "free" };
}