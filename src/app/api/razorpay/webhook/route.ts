import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { razorpay } from "@/lib/razorpay";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("x-razorpay-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = getSupabaseAdmin();

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const notes = payment.notes || {};
    const userId = notes.userId;
    const kind = notes.kind;

    if (userId && (kind === "subscription" || kind === "one_time")) {
      await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: kind === "subscription" ? "monthly" : "one_time",
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.order_id,
        status: "active",
      });
    }
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    console.error("Payment failed:", payment.id);
  }

  return NextResponse.json({ received: true });
}