"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight, BookOpen, Brain, FileText, Target, Zap,
  Star, CheckCircle, Sparkles, Award, GraduationCap,
  Clock, Shield, ChevronDown, Play, TrendingUp,
  Users, BarChart3, Flame, Trophy, Lock
} from "lucide-react";

// ─── Canvas Particle System ──────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number; opacity: number;
      color: string; life: number; maxLife: number;
    }

    const particles: Particle[] = [];
    const colors = ["#f59e0b", "#fbbf24", "#fcd34d", "#3b82f6", "#60a5fa", "#e2e8f0"];

    const spawnParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.5 + 0.5),
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 200 + 150,
      });
    };

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frame % 3 === 0) spawnParticle();
      frame++;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}

// ─── 3D Floating Book ─────────────────────────────────────────────────────────

function FloatingBook3D() {
  const [rotX, setRotX] = useState(15);
  const [rotY, setRotY] = useState(-20);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.02;
      setRotX(15 + Math.sin(t * 0.7) * 8);
      setRotY(-20 + Math.sin(t) * 12);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setRotY(((e.clientX - cx) / rect.width) * 30 - 10);
    setRotX(-((e.clientY - cy) / rect.height) * 20 + 10);
  }, []);

  const pages = ["GST & Indirect Tax", "Ind AS 16 & 36", "Transfer Pricing", "Company Law", "Auditing SA 700"];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-72 h-72 flex items-center justify-center cursor-none"
      style={{ perspective: "800px" }}
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-3xl scale-75" />
      <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl" />

      {/* Book body */}
      <div
        className="relative w-44 h-56"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Cover */}
        <div
          className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #1e3a5f 0%, #0f2942 50%, #1a1a2e 100%)",
            boxShadow: "inset -3px 0 8px rgba(0,0,0,0.4), 0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Cover design */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-amber-400 text-xs font-black tracking-[0.2em] uppercase">ReviseCA</p>
            <div className="w-16 h-0.5 bg-amber-400/40" />
            <p className="text-white/90 text-xs text-center font-medium leading-tight">
              CA Exam<br />Revision Engine<br />2026
            </p>
            {/* Decorative lines */}
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-px bg-white/10" />
              ))}
            </div>
          </div>

          {/* Shine effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            }}
          />
        </div>

        {/* Spine */}
        <div
          className="absolute top-0 left-0 bottom-0 w-4 rounded-l-sm"
          style={{
            transform: "translateX(-50%) rotateY(-90deg) translateX(50%)",
            transformOrigin: "left center",
            background: "linear-gradient(to bottom, #2d5a8e, #1a3a5f, #0f2030)",
          }}
        />

        {/* Pages effect */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute right-0 top-1 bottom-1"
            style={{
              width: "3px",
              right: `-${(i + 1) * 3}px`,
              background: `rgba(255,255,255,${0.15 - i * 0.03})`,
              transform: `translateZ(-${(i + 1) * 2}px)`,
            }}
          />
        ))}

        {/* Floating page topics */}
        {pages.map((page, i) => {
          const angle = (i / pages.length) * 360;
          const rad = (angle * Math.PI) / 180;
          return (
            <div
              key={i}
              className="absolute text-xs font-medium text-white/70 whitespace-nowrap"
              style={{
                top: "50%",
                left: "50%",
                transform: `translateX(-50%) translateY(-50%) translateZ(${80 + i * 10}px)`,
                marginTop: `${(i - 2) * 18}px`,
                opacity: 0.6 + i * 0.08,
                fontSize: "9px",
                letterSpacing: "0.05em",
                textShadow: "0 0 10px rgba(251,191,36,0.5)",
              }}
            >
              {i === 0 ? "📘 " : i === 1 ? "📗 " : i === 2 ? "📙 " : i === 3 ? "📕 " : "📓 "}
              {page}
            </div>
          );
        })}
      </div>

      {/* Shadow */}
      <div
        className="absolute bottom-4 w-32 h-4 bg-black/50 rounded-full blur-xl"
        style={{ transform: "translateZ(-50px)" }}
      />
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = duration / 60;
    const increment = end / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Typewriter Effect ────────────────────────────────────────────────────────

function Typewriter({ texts, speed = 80 }: { texts: string[]; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        if (charIdx > 0) {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setTextIdx(i => (i + 1) % texts.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-8 bg-amber-400 ml-1 animate-pulse" />
    </span>
  );
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────

function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── 3D Card ──────────────────────────────────────────────────────────────────

function Card3D({ children, className = "", glowColor = "amber" }: { children: React.ReactNode; className?: string; glowColor?: string }) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [hover, setHover] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setRotX(-y * 10);
    setRotY(x * 10);
  };

  const glows: Record<string, string> = {
    amber: "rgba(251,191,36,0.15)",
    blue: "rgba(59,130,246,0.15)",
    emerald: "rgba(16,185,129,0.15)",
    purple: "rgba(139,92,246,0.15)",
    rose: "rgba(244,63,94,0.15)",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setRotX(0); setRotY(0); }}
      className={`relative rounded-2xl cursor-pointer transition-all duration-300 ${className}`}
      style={{
        transform: hover ? `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)` : "perspective(1000px) rotateX(0) rotateY(0) translateY(0)",
        transition: hover ? "transform 0.1s ease" : "transform 0.5s ease",
        boxShadow: hover
          ? `0 30px 80px ${glows[glowColor] ?? glows.amber}, 0 0 0 1px rgba(255,255,255,0.05)`
          : "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {children}
      {/* Shine */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${hover ? "50% 30%" : "50% 50%"}, rgba(255,255,255,0.06) 0%, transparent 70%)`,
          opacity: hover ? 1 : 0,
        }}
      />
    </div>
  );
}

// ─── Section Badge ────────────────────────────────────────────────────────────

function SectionBadge({ icon, label, num }: { icon: string; label: string; num: number }) {
  return (
    <Card3D className="bg-[#0d1f35] border border-white/5 p-4" glowColor="blue">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{label}</p>
          <p className="text-white/30 text-xs">Section {num}</p>
        </div>
      </div>
    </Card3D>
  );
}

// ─── Mock Result Preview ──────────────────────────────────────────────────────

function ResultPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      label: "📚 Notes",
      content: (
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <h4 className="text-amber-400 font-bold text-sm tracking-wide">IND AS 16 – PROPERTY, PLANT & EQUIPMENT</h4>
          </div>
          {[
            { h: "Core Concept", t: "Assets held for use in production/supply of goods/services, for rental, or for admin purposes & expected to be used for more than one period." },
            { h: "Recognition Criteria", t: "✓ Probable future economic benefits will flow to entity\n✓ Cost can be measured reliably" },
            { h: "Initial Measurement", t: "At COST = Purchase price + Import duties + Directly attributable costs - Trade discounts" },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <p className="text-blue-300 text-xs font-bold uppercase tracking-wider">## {item.h}</p>
              <p className="text-white/70 text-xs leading-relaxed">{item.t}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "🧠 MCQ",
      content: (
        <div className="space-y-4 text-left">
          <p className="text-white/90 text-sm font-medium leading-relaxed">
            ABC Ltd purchased machinery for ₹50 lakhs. Installation cost ₹2L, trial run cost ₹1L (output sold for ₹0.3L). Initial operating losses ₹1.5L. What is the carrying amount?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {["₹50.7 Lakhs", "₹53 Lakhs", "₹52.7 Lakhs ✓", "₹54.5 Lakhs"].map((opt, i) => (
              <div key={i} className={`rounded-lg p-2.5 text-xs font-medium border ${i === 2 ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "bg-white/5 border-white/10 text-white/60"}`}>
                {String.fromCharCode(65 + i)}. {opt}
              </div>
            ))}
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <p className="text-emerald-400 text-xs font-semibold mb-1">✓ Correct Answer: C</p>
            <p className="text-white/60 text-xs">Cost = 50 + 2 + (1 - 0.3) = ₹52.7L. Initial operating losses NOT capitalized per Ind AS 16 para 20.</p>
          </div>
        </div>
      ),
    },
    {
      label: "⚠️ Traps",
      content: (
        <div className="space-y-3 text-left">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">Common Mark-Loss Traps</p>
          {[
            { wrong: "Including operating losses in asset cost", right: "Operating losses after asset is ready for use → P&L, never capitalize" },
            { wrong: "Capitalizing interest on all PPE", right: "Interest only capitalized if it's a qualifying asset under Ind AS 23" },
            { wrong: "Revaluation surplus → P&L", right: "Revaluation surplus → OCI (Other Comprehensive Income)" },
          ].map((trap, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-red-400 text-xs mt-0.5">✗</span>
                <p className="text-red-300/80 text-xs">{trap.wrong}</p>
              </div>
              <div className="flex items-start gap-2 ml-4">
                <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                <p className="text-emerald-300/80 text-xs">{trap.right}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="relative">
      {/* Browser chrome */}
      <div className="bg-[#1a2744] rounded-t-2xl px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <p className="text-white/50 text-xs">reviseca.com/generate</p>
        </div>
      </div>

      <div className="bg-[#0d1a2e] rounded-b-2xl p-5 border border-white/5 border-t-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-bold text-sm">Ind AS 16 – Property, Plant & Equipment</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded px-1.5 py-0.5">🔥 HIGH PRIORITY</span>
              <span className="text-[10px] text-white/40">FR Paper · 8-12 marks · 92% attempts</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded bg-amber-400/20 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 text-xs py-1.5 px-2 rounded-lg font-medium transition-all ${activeTab === i ? "bg-amber-500 text-black" : "text-white/50 hover:text-white/80"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[220px] text-sm">
          {tabs[activeTab].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex gap-3">
            {[{ n: 9, l: "MCQs" }, { n: 5, l: "Questions" }, { n: 7, l: "Traps" }].map(({ n, l }) => (
              <div key={l} className="text-center">
                <p className="text-amber-400 font-black text-sm">{n}</p>
                <p className="text-white/30 text-[10px]">{l}</p>
              </div>
            ))}
          </div>
          <button className="text-xs bg-amber-400 text-black font-bold px-3 py-1.5 rounded-lg">
            Export PDF →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function ScrollIndicator() {
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    const handleScroll = () => setOpacity(Math.max(0, 1 - window.scrollY / 200));
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2" style={{ opacity }}>
      <p className="text-white/30 text-xs tracking-widest uppercase">Scroll to explore</p>
      <div className="w-6 h-9 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
        <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
  }, []);

  const stats = [
    { icon: Users, value: 50000, suffix: "+", label: "CA Students Trust Us", color: "amber" },
    { icon: BookOpen, value: 8, suffix: "", label: "ICAI-Aligned Sections", color: "blue" },
    { icon: Clock, value: 45, suffix: "s", label: "Average Generation Time", color: "emerald" },
    { icon: Trophy, value: 94, suffix: "%", label: "Pass Rate Improvement", color: "purple" },
  ];

  const features = [
    { icon: "📚", title: "Revision Notes", desc: "Dense, exam-focused theory with ## structured headings, section references, and practical illustrations. Replaces your textbook chapter.", color: "blue", glow: "blue" },
    { icon: "🧠", title: "ICAI-Style MCQs", desc: "8-10 scenario-based questions mirroring exact ICAI paper patterns. Not definition MCQs — application MCQs that actually appear.", color: "purple", glow: "purple" },
    { icon: "📝", title: "Model Answers", desc: "5-7 descriptive questions with ICAI-format answers, marks allocation, time strategy, and examiner's marking scheme insights.", color: "indigo", glow: "blue" },
    { icon: "⚠️", title: "Mark-Loss Traps", desc: "The exact mistakes examiners red-mark every attempt. Wrong → Correct format so you never lose marks on preventable errors.", color: "amber", glow: "amber" },
    { icon: "✍️", title: "Answer Writing", desc: "ICAI-approved answer structure, opening line formula, presentation format that gets you marks even when content is average.", color: "emerald", glow: "emerald" },
    { icon: "📊", title: "Past Paper Patterns", desc: "How this topic was tested in last 10 attempts. Marks weightage, question format, examiner preferences, next-attempt prediction.", color: "cyan", glow: "blue" },
    { icon: "🎯", title: "Key Focus Areas", desc: "High-yield scoring zones ranked by priority. The 20% of content that gives you 80% of marks — with a 48-hour cramming guide.", color: "orange", glow: "amber" },
    { icon: "⚡", title: "Quick Pointers", desc: "12-15 exam-day bullets formatted as memory triggers. Read 5 minutes before entering the hall and walk in confident.", color: "rose", glow: "amber" },
  ];

  const testimonials = [
    { name: "Priya Sharma", score: "AIR 12 · CA Final 2025", text: "The MCQs were so close to the actual paper it was scary. SFM went from my weakest to strongest paper. Every question in the exam felt familiar.", avatar: "PS", paper: "SFM" },
    { name: "Arjun Mehta", score: "87 Marks · CA Inter May 2025", text: "Taxation is brutal to revise alone. ReviseCA's 'How Topic is Tested' section literally changed how I approach the subject. I stopped reading randomly.", avatar: "AM", paper: "Taxation" },
    { name: "Divya Nair", score: "First Attempt Clear · CA Foundation", text: "The Mark-Loss Traps section saved me 15+ marks. Every trap it listed, I had been making for the past year without realizing it.", avatar: "DN", paper: "Accounts" },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "",
      desc: "3 packages/month to feel the power",
      features: ["All 8 ICAI sections", "Topic & file upload", "Save to history", "Mark as revised"],
      missing: ["PDF export", "Unlimited generations", "Priority AI"],
      cta: "Start Free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      desc: "Unlimited generations through your entire prep",
      features: ["Everything in Free", "Unlimited packages", "Branded PDF export", "Priority AI model", "Exam-day support"],
      missing: [],
      cta: "Go Pro →",
      highlight: true,
    },
    {
      name: "Booster",
      price: "₹99",
      period: " one-time",
      desc: "Sprint one subject to perfection",
      features: ["5 packages pack", "PDF export included", "Never expires"],
      missing: [],
      cta: "Buy Booster",
      highlight: false,
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#060d1a] overflow-x-hidden">
      <ParticleCanvas />

      {/* ════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16">

        {/* Background mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Radial overlay */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, #060d1a 80%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Main hero grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — Copy */}
            <div className="space-y-8">
              {/* Badge */}
              <div
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.8s ease 0.1s",
                }}
              >
                <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-300 text-xs font-bold tracking-wide">ICAI 2026 NEW SYLLABUS · LIVE</span>
                  <span className="text-amber-400/60 text-xs">Foundation · Inter · Final</span>
                </div>
              </div>

              {/* Headline */}
              <div
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
                  transition: "all 0.8s ease 0.2s",
                }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                  <span
                    className="block text-white"
                    style={{ fontFamily: "'system-ui', sans-serif" }}
                  >
                    Stop Studying
                  </span>
                  <span
                    className="block"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #ffffff 60%, #93c5fd 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Start Scoring
                  </span>
                </h1>
                <p className="mt-4 text-xl text-white/50 leading-relaxed max-w-lg">
                  One topic → a complete exam-ready package in{" "}
                  <span className="text-white/80 font-semibold">45 seconds</span>.
                  Built by CA rankers. Tuned to ICAI patterns.
                </p>
              </div>

              {/* Typewriter */}
              <div
                className="text-lg text-amber-300/80 font-medium h-8 flex items-center"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transition: "opacity 0.8s ease 0.4s",
                }}
              >
                <Typewriter
                  texts={[
                    "Ind AS 16 — covered in 45 seconds",
                    "GST Input Tax Credit — exam-ready now",
                    "Transfer Pricing — full package generated",
                    "Statutory Audit SA 700 — sorted instantly",
                    "Capital Budgeting NPV/IRR — done!",
                  ]}
                />
              </div>

              {/* CTA */}
              <div
                className="flex flex-col sm:flex-row gap-4"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.8s ease 0.5s",
                }}
              >
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="group relative inline-flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-lg px-8 py-4 rounded-2xl shadow-2xl shadow-amber-400/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-amber-400/50">
                      <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
                      Generate Free Now
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      {/* Shimmer */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                      </div>
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/generate">
                    <button className="group relative inline-flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-lg px-8 py-4 rounded-2xl shadow-2xl shadow-amber-400/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-amber-400/50">
                      <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
                      Generate Now
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                      </div>
                    </button>
                  </Link>
                </SignedIn>
                <Link href="/pricing">
                  <button className="inline-flex items-center gap-2 text-white/60 hover:text-white font-medium px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/5">
                    <Play className="w-4 h-4" />
                    See Pricing
                  </button>
                </Link>
              </div>

              {/* Trust signals */}
              <div
                className="flex items-center gap-6 pt-2"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transition: "opacity 0.8s ease 0.7s",
                }}
              >
                <div className="flex -space-x-2">
                  {["PS", "AM", "DN", "RK", "SV"].map((init, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-[#060d1a] flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626"][i] }}
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-white/60 text-xs ml-1">4.9/5</span>
                  </div>
                  <p className="text-white/40 text-xs">50,000+ packages generated</p>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span className="text-white/40 text-xs">Free forever · 3 packs/month</span>
                </div>
              </div>
            </div>

            {/* Right — 3D Visual */}
            <div
              className="flex flex-col items-center gap-8"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateX(0)" : "translateX(40px)",
                transition: "all 1s ease 0.4s",
              }}
            >
              {/* 3D Book + Preview */}
              <div className="relative w-full">
                <div className="flex justify-center mb-6">
                  <FloatingBook3D />
                </div>

                {/* Result preview card */}
                <Card3D className="w-full" glowColor="blue">
                  <div className="bg-[#0d1a2e] rounded-2xl overflow-hidden border border-white/5">
                    <ResultPreview />
                  </div>
                </Card3D>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-16">
            <ScrollIndicator />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════ */}
      <section className="relative py-8 border-y border-white/5">
        <div className="absolute inset-0 bg-white/[0.02]" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-white mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-white/40 text-xs">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          WHAT YOU GET (8 SECTIONS)
      ════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span className="text-white/60 text-xs font-medium tracking-wide">8 SECTIONS · EVERY PACKAGE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                One input.{" "}
                <span style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Everything you need.
                </span>
              </h2>
              <p className="text-white/40 text-lg max-w-xl mx-auto">
                Every section is crafted by an AI that has studied 10,000+ ICAI past papers and model answers.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <Card3D className="h-full" glowColor={f.glow}>
                  <div className="bg-[#0a1628] border border-white/5 rounded-2xl p-5 h-full flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{f.icon}</div>
                      <span className="text-[10px] text-white/20 font-mono border border-white/10 rounded px-1.5 py-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1.5">{f.title}</h3>
                      <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute right-0 top-0 w-[500px] h-full bg-amber-500/3 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                3 steps to{" "}
                <span style={{ background: "linear-gradient(135deg, #fbbf24, #fde68a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  exam confidence
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

            {[
              {
                step: "01",
                icon: "🎯",
                title: "Enter your topic",
                desc: "Type any CA topic or upload your notes PDF/DOCX. Select your level (Foundation/Inter/Final) for targeted output.",
                color: "amber",
              },
              {
                step: "02",
                icon: "⚡",
                title: "AI builds your package",
                desc: "In 45 seconds, our ICAI-trained AI generates all 8 sections — from notes to MCQs to mark-loss traps.",
                color: "blue",
              },
              {
                step: "03",
                icon: "🏆",
                title: "Walk in prepared",
                desc: "Study the package, mark sections as revised, export to PDF, and enter the exam hall actually confident.",
                color: "emerald",
              },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <Card3D glowColor={step.color}>
                  <div className="bg-[#0a1628] border border-white/5 rounded-2xl p-6 text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </Card3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Students who{" "}
                <span style={{ background: "linear-gradient(135deg, #a78bfa, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  cracked it
                </span>
              </h2>
              <p className="text-white/40 text-lg">Real results from real CA students.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <Card3D className="h-full" glowColor="purple">
                  <div className="bg-[#0a1628] border border-white/5 rounded-2xl p-6 h-full flex flex-col gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <blockquote className="text-white/70 text-sm leading-relaxed flex-1">
                      "{t.text}"
                    </blockquote>
                    <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white"
                        style={{ background: ["linear-gradient(135deg,#2563eb,#7c3aed)", "linear-gradient(135deg,#059669,#0891b2)", "linear-gradient(135deg,#d97706,#dc2626)"][i] }}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        <p className="text-amber-400/80 text-xs">{t.score}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-[10px] bg-white/5 border border-white/10 rounded px-2 py-1 text-white/40">
                          {t.paper}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          PRICING
      ════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Simple{" "}
                <span style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  pricing
                </span>
              </h2>
              <p className="text-white/40 text-lg">Start free. Scale when your exam is near.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {pricingPlans.map((plan, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <Card3D className={plan.highlight ? "ring-1 ring-amber-400/40" : ""} glowColor={plan.highlight ? "amber" : "blue"}>
                  <div className={`rounded-2xl p-6 h-full flex flex-col gap-4 border ${plan.highlight ? "bg-gradient-to-b from-amber-400/10 to-[#0a1628] border-amber-400/20" : "bg-[#0a1628] border-white/5"}`}>
                    {plan.highlight && (
                      <div className="bg-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full self-start tracking-wide">
                        MOST POPULAR
                      </div>
                    )}
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">{plan.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-black ${plan.highlight ? "text-amber-400" : "text-white"}`}>
                          {plan.price}
                        </span>
                        <span className="text-white/30 text-sm">{plan.period}</span>
                      </div>
                      <p className="text-white/40 text-xs mt-1">{plan.desc}</p>
                    </div>

                    <ul className="space-y-2 flex-1">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                      {plan.missing.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-white/25">
                          <Lock className="w-3.5 h-3.5 text-white/20 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <SignedOut>
                      <SignUpButton mode="modal">
                        <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.highlight ? "bg-amber-400 text-black hover:bg-amber-300 hover:scale-105" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}>
                          {plan.cta}
                        </button>
                      </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                      <Link href={i === 0 ? "/generate" : "/pricing"}>
                        <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.highlight ? "bg-amber-400 text-black hover:bg-amber-300 hover:scale-105" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}>
                          {plan.cta}
                        </button>
                      </Link>
                    </SignedIn>
                  </div>
                </Card3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-400/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-2 mb-8">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-xs font-bold">3 FREE PACKAGES WAITING FOR YOU</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Your exams are
              <br />
              <span style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                in 30 days.
              </span>
            </h2>

            <p className="text-white/50 text-xl mb-12 max-w-xl mx-auto">
              Every day you study without a ReviseCA package is a day of wasted effort.
              Generate your first one. Free. Right now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="group relative inline-flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-xl px-10 py-5 rounded-2xl shadow-2xl shadow-amber-400/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-amber-400/50">
                    <Sparkles className="w-6 h-6 transition-transform group-hover:rotate-12" />
                    Start Free — No Card Needed
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                    </div>
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/generate">
                  <button className="group relative inline-flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-xl px-10 py-5 rounded-2xl shadow-2xl shadow-amber-400/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-amber-400/50">
                    <Sparkles className="w-6 h-6" />
                    Generate Your Package
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </SignedIn>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════ */}
      <footer className="relative border-t border-white/5 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-black text-lg">ReviseCA</p>
                <p className="text-white/30 text-xs">The Ultimate CA Exam Revision Engine</p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/30">
              {[["Generate", "/generate"], ["My Revisions", "/history"], ["Dashboard", "/dashboard"], ["Pricing", "/pricing"]].map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-white/70 transition-colors">
                  {label}
                </Link>
              ))}
            </nav>

            <p className="text-white/20 text-xs">
              © 2026 ReviseCA · Built for CA students who want to rank.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}