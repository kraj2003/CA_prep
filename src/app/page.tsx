"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { 
  ArrowRight, BookOpen, Brain, FileText, Target, Zap, 
  TrendingUp, Star, CheckCircle, Sparkles, Award, GraduationCap,
  Clock, BarChart3, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a]" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      <div className="absolute -bottom-40 left-1/4 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '0.5s' }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
    </div>
  );
}

function FloatingCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 1) % 20);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`transition-transform duration-[2000ms] ease-in-out ${className}`}
      style={{ transform: `translateY(${offset > 10 ? -8 : 0}px)` }}
    >
      {children}
    </div>
  );
}

function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setTimeout(() => setCardsVisible(true), 600);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <div className={`mb-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white/90">ICAI 2026 New Syllabus</span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-7xl font-black text-white mb-6 leading-tight transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="bg-gradient-to-r from-white via-blue-200 to-amber-200 bg-clip-text text-transparent">
            ReviseCA
          </span>
        </h1>

        <p className={`text-xl md:text-2xl text-blue-200 mb-4 transition-all duration-1000 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          The Ultimate CA Exam Revision Engine
        </p>

        <p className={`text-lg text-white/50 mb-10 max-w-2xl mx-auto transition-all duration-1000 delay-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          One input → ICAI-perfect 8-section revision package in 3 minutes. 
          Powered by AI trained on 10,000+ past papers.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-800 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105 hover:-translate-y-1"
              >
                Start Generating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/generate">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105 hover:-translate-y-1"
              >
                Start Generating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </SignedIn>
          <Link href="/pricing">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-7 text-lg rounded-2xl backdrop-blur-md"
            >
              View Plans
            </Button>
          </Link>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-all duration-1000 delay-1000 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          {[
            { icon: BookOpen, label: "Revision Notes", color: "from-blue-500 to-blue-600" },
            { icon: Brain, label: "ICAI MCQs", color: "from-purple-500 to-purple-600" },
            { icon: FileText, label: "Model Answers", color: "from-emerald-500 to-emerald-600" },
            { icon: Target, label: "Exam Traps", color: "from-amber-500 to-amber-600" },
          ].map((item, i) => (
            <FloatingCard key={i} className={i % 2 === 0 ? "" : "md:mt-8"}>
              <div className="group relative p-5 md:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <p className="text-white font-semibold text-sm md:text-base">{item.label}</p>
              </div>
            </FloatingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "50,000+", label: "Packages Generated", icon: Sparkles },
    { value: "8", label: "ICAI-Aligned Sections", icon: BookOpen },
    { value: "3 mins", label: "Average Generation", icon: Clock },
    { value: "2026", label: "New Syllabus Ready", icon: GraduationCap },
  ];

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="text-center p-5 md:p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
              </div>
              <div className="text-2xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-blue-200 text-xs md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: BookOpen, title: "Revision Notes", desc: "Condensed, exam-focused theory with key definitions", color: "blue" },
    { icon: Brain, title: "ICAI-Style MCQs", desc: "8-10 scenario-based questions with explanations", color: "purple" },
    { icon: FileText, title: "Descriptive Questions", desc: "5-7 model answers in ICAI format", color: "indigo" },
    { icon: Target, title: "Mark Loss Traps", desc: "Common mistakes to avoid in exams", color: "amber" },
    { icon: Zap, title: "Answer Writing", desc: "ICAI-approved structure for max marks", color: "emerald" },
    { icon: TrendingUp, title: "How It's Tested", desc: "Past paper patterns decoded", color: "cyan" },
    { icon: Star, title: "Key Focus Areas", desc: "High-yield scoring zones", color: "orange" },
    { icon: CheckCircle, title: "Quick Pointers", desc: "10-15 last-minute revision bullets", color: "rose" },
  ];

  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    indigo: "from-indigo-500 to-indigo-600",
    amber: "from-amber-500 to-amber-600",
    emerald: "from-emerald-500 to-emerald-600",
    cyan: "from-cyan-500 to-cyan-600",
    orange: "from-orange-500 to-orange-600",
    rose: "from-rose-500 to-rose-600",
  };

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            8 Sections, <span className="text-amber-400">Perfectly Structured</span>
          </h2>
          <p className="text-blue-200 text-base md:text-lg max-w-2xl mx-auto">
            Every package follows the exact ICAI exam pattern. No fluff, just what gets you marks.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group p-5 md:p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${colorClasses[feature.color]} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-200 text-xs md:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCards() {
  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-blue-500/20 bg-blue-500/5 backdrop-blur-md hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Free Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-3xl font-black text-white">₹0<span className="text-sm font-normal text-blue-200">/month</span></p>
              <p className="text-blue-200 text-sm">3 generations/month for topic sprint practice.</p>
              <ul className="space-y-2 text-xs text-blue-100">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-blue-400" /> Revision Notes</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-blue-400" /> ICAI MCQs</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-blue-400" /> Basic Support</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-amber-600/5 backdrop-blur-md hover:-translate-y-2 transition-all duration-300 shadow-2xl shadow-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Pro Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-3xl font-black text-white">₹299<span className="text-sm font-normal text-amber-200">/month</span></p>
              <p className="text-amber-200 text-sm">Unlimited generations, priority quality.</p>
              <ul className="space-y-2 text-xs text-amber-100">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-amber-400" /> Everything in Free</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-amber-400" /> Unlimited Generations</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-amber-400" /> Export-ready PDF</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-amber-400" /> Priority Support</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-white/10 bg-white/5 backdrop-blur-md hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                Last 30 Days Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-3xl font-black text-white">Exam-Ready</p>
              <p className="text-blue-200 text-sm">Exam-style output engineered for direct mark gain.</p>
              <ul className="space-y-2 text-xs text-blue-100">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-400" /> ICAI Pattern</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-400" /> Mark-focused</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-400" /> Quick Revision</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
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

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Trusted by <span className="text-amber-400">Top Rankers</span>
          </h2>
          <p className="text-blue-200 text-base md:text-lg">Join thousands of students who cleared CA with ReviseCA</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((t, i) => (
            <div 
              key={i}
              className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-blue-300 text-xs">{t.exam}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-xs font-medium">{t.score}</span>
              </div>
              <p className="text-blue-100 text-xs md:text-sm leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-amber-500/20 via-blue-500/10 to-emerald-500/20 backdrop-blur-md border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Ready to <span className="text-amber-400">Ace Your CA Exam?</span>
          </h2>
          <p className="text-blue-200 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Start generating your exam-ready revision packages now. 
            3 free generations every month.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-10 py-6 text-xl rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105 hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/generate">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-10 py-6 text-xl rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105 hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a1628] px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-lg font-black text-white">ReviseCA</p>
          <p className="text-xs text-blue-300">The Ultimate CA Exam Revision Engine · 2026 Syllabus</p>
        </div>
        <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-blue-300">
          <Link href="/generate" className="hover:text-white transition-colors">Generate</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/history" className="hover:text-white transition-colors">History</Link>
        </div>
        <p className="text-xs text-blue-400">© 2026 ReviseCA. Built for CA students.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnimatedBackground />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PricingCards />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
