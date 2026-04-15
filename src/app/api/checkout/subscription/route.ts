import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?upgrade=cancelled`,
    line_items: [{ price: process.env.STRIPE_MONTHLY_PRICE_ID!, quantity: 1 }],
    metadata: { userId, kind: "subscription" },
  });

  return NextResponse.redirect(session.url!, 303);
}
