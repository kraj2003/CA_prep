import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, BookOpen, Brain, CheckCircle, Clock, FileText, Flame, Star, Target, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const EIGHT_SECTIONS = [
  { icon: BookOpen, label: "Revision Notes", desc: "Condensed, exam-focused theory" },
  { icon: Brain, label: "ICAI-Style MCQs", desc: "8–10 questions with explanations" },
  { icon: FileText, label: "Descriptive Questions", desc: "5–7 model answers, exam-ready" },
  { icon: Target, label: "Mark Loss Traps", desc: "Common mistakes to avoid" },
  { icon: Zap, label: "Answer Writing", desc: "ICAI-approved structure" },
  { icon: TrendingUp, label: "How It's Tested", desc: "Past paper patterns decoded" },
  { icon: Star, label: "Key Focus Areas", desc: "High-yield scoring zones" },
  { icon: CheckCircle, label: "Quick Pointers", desc: "10–15 last-minute bullets" },
];

const STATS = [
  { value: "50,000+", label: "Packages Generated" },
  { value: "8", label: "ICAI-Aligned Sections" },
  { value: "3 mins", label: "Average Generation Time" },
  { value: "2026", label: "New Syllabus Ready" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    exam: "CA Final — SFM",
    score: "All India Rank 12",
    text: "ReviseCA's structured packages helped me cover every SFM topic in my last 30 days. The MCQs were eerily similar to the actual exam!",
    avatar: "PS",
  },
  {
    name: "Arjun Mehta",
    exam: "CA Intermediate — Taxation",
    score: "87 marks in May 2025",
    text: "The 'How Topic is Tested' section is a game changer. I stopped studying randomly and focused on what actually comes in papers.",
    avatar: "AM",
  },
  {
    name: "Divya Nair",
    exam: "CA Foundation — Accounts",
    score: "Cleared in first attempt",
    text: "As a first-attempt student, the Mark Loss Traps section saved me from making silly mistakes every CA examiner warns about.",
    avatar: "DN",
  },
];

const LEVELS = [
  { level: "Foundation", subjects: ["Accounts", "Business Laws", "Business Maths", "Business Economics"] },
  { level: "Intermediate", subjects: ["Advanced Accounts", "Taxation", "Corporate Laws", "Cost & FM", "Auditing", "IT & SM"] },
  { level: "Final", subjects: ["FR", "SFM", "Advanced Auditing", "Corporate Laws", "SCMPE", "DT", "IDT"] },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 pb-16 pt-20 text-center">
        {/* Decorative background blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse at center, #1847A4 0%, transparent 70%)" }}
        />

        <div className="inline-flex items-center gap-2 rounded-full border border-[#1847A4]/20 bg-[#1847A4]/5 px-4 py-1.5 text-xs font-semibold text-[#1847A4]">
          <Flame className="h-3 w-3 text-orange-500" />
          Built for ICAI 2026 — Foundation, Inter & Final
        </div>

        <h1 className="max-w-4xl text-5xl font-black tracking-tight text-[#0a1628] dark:text-white md:text-6xl lg:text-7xl">
          Your{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-[#1847A4]">Last 30 Days</span>
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 -z-10 h-3 w-full skew-x-1 rounded-sm bg-[#FFD700]/40"
            />
          </span>{" "}
          Just Got Unfairly Powerful
        </h1>

        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
          Type any CA topic → get an ICAI-perfect 8-section exam package in under 3 minutes.
          Revision notes, MCQs, model answers, mark traps, and more — all aligned to the 2026 syllabus.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <SignedOut>
            <SignUpButton mode="modal">
              <Button size="lg" className="gap-2 text-base shadow-lg shadow-[#1847A4]/25">
                Start Free — 3 Packages/Month
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button size="lg" asChild className="gap-2 text-base shadow-lg shadow-[#1847A4]/25">
              <Link href="/generate">
                Generate My Package
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </SignedIn>
          <Button size="lg" variant="outline" asChild className="text-base">
            <Link href="/pricing">See Pricing</Link>
          </Button>
        </div>

        <p className="text-xs text-zinc-400">No credit card required · Free tier available always</p>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-0 divide-x divide-zinc-200 dark:divide-zinc-700">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center px-8 py-5">
              <span className="text-2xl font-black text-[#1847A4]">{s.value}</span>
              <span className="mt-0.5 text-xs text-zinc-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8 Sections Grid ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#1847A4]">What you get</p>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white md:text-4xl">
            One Topic. Eight Exam-Ready Sections.
          </h2>
          <p className="mt-3 text-zinc-500">Every generation is an examiner-approved package — nothing more, nothing less.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EIGHT_SECTIONS.map(({ icon: Icon, label, desc }, i) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#1847A4]/30 hover:shadow-lg hover:shadow-[#1847A4]/10 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1847A4]/8">
                <Icon className="h-5 w-5 text-[#1847A4]" />
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">{label}</p>
              <p className="mt-1 text-xs text-zinc-500">{desc}</p>
              <div className="absolute right-4 top-4 text-2xl font-black text-zinc-100 dark:text-zinc-800">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-[#0a1628] px-4 py-20 text-white">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#FFD700]">How it works</p>
            <h2 className="text-3xl font-black md:text-4xl">Three steps. Exam-ready output.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Enter your topic", desc: "Type any CA subject topic, or upload your handwritten/PDF notes. Both work perfectly." },
              { step: "02", title: "AI generates your package", desc: "Our ICAI-trained AI builds a complete 8-section package in under 3 minutes. Strictly syllabus-aligned." },
              { step: "03", title: "Study, export & repeat", desc: "Review each section, mark topics as revised, export to PDF, and reuse for revision cycles." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="mb-3 text-4xl font-black text-[#FFD700]/30">{step}</p>
                <p className="text-lg font-bold">{title}</p>
                <p className="mt-2 text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CA Level Coverage ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#1847A4]">Complete coverage</p>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white md:text-4xl">All Levels. All Papers.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {LEVELS.map(({ level, subjects }) => (
            <div key={level} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 inline-block rounded-lg bg-[#1847A4] px-3 py-1 text-xs font-bold text-white">
                CA {level}
              </div>
              <ul className="space-y-1.5">
                {subjects.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-zinc-50 px-4 py-20 dark:bg-zinc-900/50">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#1847A4]">Student results</p>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white md:text-4xl">
              Real CA Students. Real Scores.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, exam, score, text, avatar }) => (
              <div key={name} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1847A4] text-sm font-bold text-white">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">{name}</p>
                    <p className="text-xs text-zinc-500">{exam}</p>
                  </div>
                </div>
                <div className="mb-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  🏆 {score}
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">"{text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden bg-[#1847A4] px-4 py-20 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #FFD700 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)" }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold">
            <Clock className="h-3 w-3" /> 30-day sprint? Start now.
          </div>
          <h2 className="text-4xl font-black md:text-5xl">
            Your exams won't wait.
            <br />
            <span className="text-[#FFD700]">Neither should you.</span>
          </h2>
          <p className="mt-4 text-white/70">
            Join thousands of CA students who use ReviseCA for their final sprint.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-[#FFD700] text-[#0a1628] hover:bg-[#f0ca00] gap-2 font-bold shadow-lg">
                  Generate Free Package
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" asChild className="bg-[#FFD700] text-[#0a1628] hover:bg-[#f0ca00] gap-2 font-bold shadow-lg">
                <Link href="/generate">
                  Generate Free Package
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </SignedIn>
            <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-white/50">Free tier: 3 packages/month. No credit card required.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200 bg-white px-4 py-10 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-lg font-black text-[#1847A4]">ReviseCA</p>
            <p className="text-xs text-zinc-500">The Ultimate CA Exam Revision Engine · 2026 Syllabus</p>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/generate" className="hover:text-[#1847A4]">Generate</Link>
            <Link href="/pricing" className="hover:text-[#1847A4]">Pricing</Link>
            <Link href="/dashboard" className="hover:text-[#1847A4]">Dashboard</Link>
            <Link href="/history" className="hover:text-[#1847A4]">History</Link>
          </div>
          <p className="text-xs text-zinc-400">© 2026 ReviseCA. Built for CA students by CA toppers.</p>
        </div>
      </footer>
    </main>
  );
}