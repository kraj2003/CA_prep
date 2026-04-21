import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; payload: { payment: { entity: { id: string; order_id: string; notes?: Record<string, string> } } } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const notes = payment.notes ?? {};
    const userId = notes.userId;
    const kind = notes.kind;

    if (userId && (kind === "subscription" || kind === "one_time")) {
      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          plan: kind === "subscription" ? "monthly" : "one_time",
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          status: "active",
        },
        { onConflict: "user_id" }
      );
    }
  }

  if (event.event === "payment.failed") {
    console.error("Payment failed:", event.payload.payment.entity.id);
  }

  return NextResponse.json({ received: true });
}