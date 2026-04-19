"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { load } from "@paypal/paypal-js";

interface RazorpayCheckoutButtonProps {
  kind: "one-time" | "subscription";
  userId: string;
  disabled?: boolean;
}

export function RazorpayCheckoutButton({ kind, userId, disabled }: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/checkout/${kind}`, {
        method: "POST",
      });
      const data = await response.json();

      if (!data.orderId) {
        throw new Error("Failed to create order");
      }

      // Load Razorpay checkout
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      await new Promise<void>((resolve) => {
        script.onload = () => resolve();
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: kind === "one-time" 
          ? Number(process.env.RAZORPAY_ONE_TIME_AMOUNT ?? 9900)
          : Number(process.env.RAZORPAY_MONTHLY_AMOUNT ?? 49900),
        currency: "INR",
        name: "CA Revision Tool",
        description: kind === "one-time" ? "Single Package (₹99)" : "Pro Subscription (₹499/month)",
        order_id: data.orderId,
        handler: (response: any) => {
          // Payment successful - redirect to success page
          const redirectUrl = kind === "one-time"
            ? `${process.env.NEXT_PUBLIC_APP_URL}/generate?purchase=success`
            : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`;
          window.location.href = redirectUrl;
        },
        prefill: {
          userId,
        },
        theme: {
          color: "#1847A4",
        },
      };

      // @ts-ignore
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={disabled || loading}>
      {loading ? "Loading..." : kind === "one-time" ? "Buy Single Package (₹99)" : "Start Subscription"}
    </Button>
  );
}