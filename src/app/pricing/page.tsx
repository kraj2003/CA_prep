import { auth } from "@clerk/nextjs/server";
import { CheckCircle, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RazorpayCheckoutButton } from "@/components/razorpay-checkout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";

const FREE_FEATURES = [
  { text: "3 packages per month", included: true },
  { text: "All 8 ICAI sections", included: true },
  { text: "Topic & notes upload", included: true },
  { text: "History saved to dashboard", included: true },
  { text: "Mark topics as revised", included: true },
  { text: "PDF export", included: false },
  { text: "Unlimited generations", included: false },
  { text: "Priority AI model", included: false },
];

const PRO_FEATURES = [
  { text: "Unlimited packages", included: true },
  { text: "All 8 ICAI sections", included: true },
  { text: "Topic & notes upload", included: true },
  { text: "History saved to dashboard", included: true },
  { text: "Mark topics as revised", included: true },
  { text: "PDF export with branding", included: true },
  { text: "Priority AI model", included: true },
  { text: "Exam-day support priority", included: true },
];

const BOOSTER_FEATURES = [
  "5 additional packages (one-time)",
  "Full 8-section output",
  "PDF export included",
  "Never expires",
];

const FAQ = [
  {
    q: "What happens if I hit the free limit?",
    a: "You get a friendly message and can upgrade to Pro or buy a one-time booster. Your saved revisions are never deleted.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your uploaded notes and generated packages are stored securely in Supabase with row-level security. Only you can access your data.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, Pro subscriptions can be cancelled any time. You keep access until the end of your billing period.",
  },
  {
    q: "Does this cover the 2026 new syllabus?",
    a: "Absolutely. ReviseCA is built specifically for the ICAI 2026 new syllabus for Foundation, Intermediate, and Final.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major UPI apps (PhonePe, GPay, Paytm), net banking, debit/credit cards via Razorpay.",
  },
];

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1847A4]/20 bg-[#1847A4]/5 px-4 py-1.5 text-xs font-semibold text-[#1847A4]">
          <Zap className="h-3 w-3" />
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white md:text-5xl">
          Pick your plan.{" "}
          <span className="text-[#1847A4]">Crack your exam.</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-500">
          Start free. Upgrade when you need more. Cancel anytime.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free */}
          <Card className="relative">
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Free</p>
              <CardTitle className="text-4xl font-black">₹0</CardTitle>
              <p className="text-sm text-zinc-500">3 packages per month, always free</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {FREE_FEATURES.map(({ text, included }) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm">
                    {included ? (
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-zinc-300" />
                    )}
                    <span className={included ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400"}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
              {userId ? (
                <Button asChild className="w-full" variant="outline">
                  <Link href="/generate">Start with Free</Link>
                </Button>
              ) : (
                <SignUpButton mode="modal">
                  <Button className="w-full" variant="outline">
                    Sign Up Free
                  </Button>
                </SignUpButton>
              )}
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="relative border-[#1847A4] ring-2 ring-[#1847A4]/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-[#1847A4] text-white border-[#1847A4] px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1847A4]">Pro</p>
              <div className="flex items-baseline gap-1">
                <CardTitle className="text-4xl font-black text-[#1847A4]">₹499</CardTitle>
                <span className="text-zinc-500">/month</span>
              </div>
              <p className="text-sm text-zinc-500">Unlimited generations + full features</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {PRO_FEATURES.map(({ text, included }) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-zinc-700 dark:text-zinc-300">{text}</span>
                  </li>
                ))}
              </ul>
              <RazorpayCheckoutButton
                kind="subscription"
                userId={userId ?? ""}
                disabled={!userId}
                className="w-full"
              />
              {!userId && (
                <p className="text-center text-xs text-zinc-400">
                  <Link href="/sign-up" className="underline hover:text-[#1847A4]">Sign up</Link> first to subscribe
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* One-time booster */}
        <div className="mt-6 rounded-2xl border border-[#FFD700]/40 bg-[#FFD700]/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-block rounded-full bg-[#FFD700] px-3 py-0.5 text-xs font-bold text-[#0a1628]">
                One-Time Booster
              </div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">
                ₹99 <span className="text-base font-normal text-zinc-500">one-time</span>
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Perfect for a single subject sprint — no subscription needed.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {BOOSTER_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <RazorpayCheckoutButton
              kind="one-time"
              userId={userId ?? ""}
              disabled={!userId}
              className="shrink-0"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-zinc-50 px-4 py-16 dark:bg-zinc-900/50">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-black text-zinc-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="font-bold text-zinc-900 dark:text-white">{q}</p>
                <p className="mt-2 text-sm text-zinc-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}