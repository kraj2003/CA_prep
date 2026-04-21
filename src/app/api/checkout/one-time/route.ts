import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";

export const runtime = "nodejs";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const amount = Number(process.env.RAZORPAY_ONE_TIME_AMOUNT ?? 99); // ₹99 in paise

    const order = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: `one_time_${userId}_${Date.now()}`,
      notes: { userId, kind: "one_time" },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error("Razorpay one-time order error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}