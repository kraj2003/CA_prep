import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const amount = Number(process.env.RAZORPAY_MONTHLY_AMOUNT ?? 49900); // ₹499 in paise

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `subscription_${userId}_${Date.now()}`,
    notes: { userId, kind: "subscription" },
  });

  return NextResponse.json({ orderId: order.id });
}
