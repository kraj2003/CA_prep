import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${String(err)}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const kind = session.metadata?.kind;
    if (userId && (kind === "subscription" || kind === "one_time")) {
      const supabase = getSupabaseAdmin();
      await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: kind === "subscription" ? "monthly" : "one_time",
        stripe_customer_id: String(session.customer ?? ""),
        stripe_subscription_id: kind === "subscription" ? String(session.subscription ?? "") : null,
        status: "active",
      });
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const supabase = getSupabaseAdmin();
    await supabase
      .from("subscriptions")
      .update({ status: subscription.status === "active" ? "active" : "cancelled" })
      .eq("stripe_subscription_id", subscription.id);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const supabase = getSupabaseAdmin();
    await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("stripe_subscription_id", subscription.id);
  }

  return NextResponse.json({ received: true });
}
