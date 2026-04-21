import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

interface ReferralCode {
  id: string;
  code: string;
  description: string | null;
  plan_type: string;
  max_uses: number | null;
  uses_count: number;
  is_active: boolean;
  expires_at: string | null;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();
    const supabase = getSupabaseAdmin();

    // 1. Find the referral code
    const { data: referralCode, error: fetchError } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("code", normalizedCode)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching referral code:", fetchError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!referralCode) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
    }

    const rc = referralCode as ReferralCode;

    // 2. Validate the code
    if (!rc.is_active) {
      return NextResponse.json({ error: "This referral code has been deactivated" }, { status: 400 });
    }

    if (rc.expires_at && new Date(rc.expires_at) < new Date()) {
      return NextResponse.json({ error: "This referral code has expired" }, { status: 400 });
    }

    if (rc.max_uses !== null && rc.uses_count >= rc.max_uses) {
      return NextResponse.json({ error: "This referral code has reached its usage limit" }, { status: 400 });
    }

    // 3. Check if user already used a code
    const { data: existingRedemption } = await supabase
      .from("referral_redemptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingRedemption) {
      return NextResponse.json({ error: "You have already redeemed a referral code" }, { status: 400 });
    }

    // 4. Update subscription to pro
    const { error: updateError } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: userId,
        plan: rc.plan_type === "lifetime" ? "lifetime" : "pro",
        status: "active",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (updateError) {
      console.error("Error updating subscription:", updateError);
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
    }

    // 5. Increment usage count
    const { error: incrementError } = await supabase
      .from("referral_codes")
      .update({ uses_count: rc.uses_count + 1 })
      .eq("id", rc.id);

    if (incrementError) {
      console.error("Error incrementing usage:", incrementError);
    }

    // 6. Record the redemption
    const { error: redemptionError } = await supabase
      .from("referral_redemptions")
      .insert({
        user_id: userId,
        code_id: rc.id,
      });

    if (redemptionError) {
      console.error("Error recording redemption:", redemptionError);
    }

    return NextResponse.json({
      success: true,
      message: rc.plan_type === "lifetime"
        ? "Lifetime premium unlocked!"
        : "Pro plan activated! Unlimited generations unlocked.",
      plan: rc.plan_type === "lifetime" ? "lifetime" : "pro",
    });

  } catch (error) {
    console.error("Referral code error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

// ─── GET: validate a code without redeeming ───────────────────────────────────
// FIX: was using Partial<ReferralCode> which made uses_count and max_uses
// possibly-undefined, causing TS errors on the comparison and arithmetic.
// Now uses Pick<ReferralCode, ...> so only the selected columns are in the
// type — all as their real non-optional types.

type ReferralCodePreview = Pick<
  ReferralCode,
  "code" | "description" | "plan_type" | "max_uses" | "uses_count" | "is_active" | "expires_at"
>;

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code parameter required" }, { status: 400 });
  }

  const normalizedCode = code.trim().toUpperCase();
  const supabase = getSupabaseAdmin();

  // Check if user already used a code
  const { data: existingRedemption } = await supabase
    .from("referral_redemptions")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingRedemption) {
    return NextResponse.json({
      valid: false,
      message: "You have already redeemed a referral code",
    });
  }

  // Check if code exists and is valid
  const { data: referralCode } = await supabase
    .from("referral_codes")
    .select("code, description, plan_type, max_uses, uses_count, is_active, expires_at")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (!referralCode) {
    return NextResponse.json({ valid: false, message: "Invalid referral code" });
  }

  // FIX: cast to Pick type — every field here is a real column that was
  // explicitly selected, so none of them can actually be undefined at runtime.
  // Partial<ReferralCode> was wrong because it made required fields optional.
  const rc = referralCode as ReferralCodePreview;

  if (!rc.is_active) {
    return NextResponse.json({ valid: false, message: "This code has been deactivated" });
  }

  if (rc.expires_at && new Date(rc.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, message: "This code has expired" });
  }

  // FIX: rc.max_uses is number | null (not undefined), rc.uses_count is number
  // (not undefined) — both comparisons are now type-safe.
  if (rc.max_uses !== null && rc.uses_count >= rc.max_uses) {
    return NextResponse.json({ valid: false, message: "This code has reached its usage limit" });
  }

  return NextResponse.json({
    valid: true,
    description: rc.description,
    planType: rc.plan_type,
  });
}