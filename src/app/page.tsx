import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14">
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="inline-block rounded-full bg-[#D4B24C]/15 px-3 py-1 text-xs font-semibold text-[#A17700]">
            Built for ICAI Foundation, Inter & Final
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#1847A4] md:text-5xl">
            ReviseCA: One-click exam-ready revision packages
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Type a topic or upload notes, then instantly get structured revision notes, ICAI-style MCQs,
            model answers, scoring traps, and quick revision pointers.
          </p>
          <div className="flex flex-wrap gap-3">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg">
                  Start Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" asChild>
                <Link href="/generate">
                  Generate Package <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </SignedIn>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>What you get every generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              "Revision Notes",
              "ICAI-Style MCQs (8-10)",
              "Descriptive Questions (5-7)",
              "Common Mistakes & Mark Loss Traps",
              "Answer Writing Approach",
              "How Topic Is Typically Tested",
              "Key Focus Areas for Scoring",
              "Quick Revision Pointers (10-15)",
            ].map((item) => (
              <p key={item} className="rounded-md border border-zinc-200 p-2 dark:border-zinc-700">
                {item}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
