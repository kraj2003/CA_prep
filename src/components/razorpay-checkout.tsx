"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutButtonProps {
  kind: "one-time" | "subscription";
  userId: string;
  disabled?: boolean;
  className?: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckoutButton({
  kind,
  userId,
  disabled,
  className,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!userId) {
      window.location.href = "/sign-up";
      return;
    }
    setLoading(true);
    try {
      const endpoint = kind === "one-time" ? "/api/checkout/one-time" : "/api/checkout/subscription";
      const response = await fetch(endpoint, { method: "POST" });
      const data = (await response.json()) as { orderId?: string; error?: string };

      if (!data.orderId) {
        throw new Error(data.error ?? "Failed to create order");
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error("Failed to load payment gateway. Check your connection.");
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: kind === "one-time" ? 9900 : 49900,
        currency: "INR",
        name: "ReviseCA",
        description: kind === "one-time" ? "Single Booster Pack — ₹99" : "Pro Subscription — ₹499/month",
        order_id: data.orderId,
        handler: () => {
          const redirect =
            kind === "one-time"
              ? `${appUrl}/generate?purchase=success`
              : `${appUrl}/dashboard?upgrade=success`;
          window.location.href = redirect;
        },
        theme: { color: "#1847A4" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={disabled || loading} className={className}>
      {loading
        ? "Opening payment..."
        : kind === "one-time"
        ? "Buy One-Time Booster — ₹99"
        : "Start Pro — ₹499/month"}
    </Button>
  );
}