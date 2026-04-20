"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { BookOpen, Sparkles, Menu, X, Zap, LayoutDashboard, History, FileEdit, Tag } from "lucide-react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/generate", label: "Generate", icon: FileEdit },
    { href: "/history", label: "My Revisions", icon: History },
    { href: "/pricing", label: "Pricing", icon: Tag },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(6, 13, 26, 0.90)"
            : "rgba(6, 13, 26, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                boxShadow: "0 4px 20px rgba(251,191,36,0.3)",
              }}
            >
              <BookOpen className="h-5 w-5 text-black" />
              {/* Glow pulse */}
              <div className="absolute inset-0 rounded-xl bg-amber-400/30 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="text-lg font-black text-white leading-none tracking-tight">
                Revise<span className="text-amber-400">CA</span>
              </span>
              <span className="text-[9px] text-white/25 font-medium tracking-[0.15em] uppercase hidden sm:block">
                2026 Syllabus
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <SignedIn>
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? "text-white bg-white/10"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive(href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
                  )}
                  {label}
                </Link>
              ))}
            </SignedIn>
            <SignedOut>
              {[{ href: "/pricing", label: "Pricing" }].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                  {label}
                </Link>
              ))}
            </SignedOut>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <SignedIn>
              {/* Generate CTA */}
              <Link href="/generate" className="hidden sm:flex">
                <button
                  className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-amber-400/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate
                </button>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 ring-1 ring-amber-400/30 hover:ring-amber-400/60 transition-all",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-white/60 hover:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/5 transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="hidden sm:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-amber-400/30">
                  <Zap className="w-3.5 h-3.5" />
                  Start Free
                </button>
              </SignUpButton>
            </SignedOut>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(p => !p)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0 z-40 md:hidden pointer-events-none"
        style={{ top: "60px" }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          style={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "auto" : "none" }}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className="absolute top-0 right-0 w-72 h-auto rounded-bl-3xl overflow-hidden pointer-events-auto"
          style={{
            background: "rgba(6,13,26,0.95)",
            backdropFilter: "blur(30px)",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="p-5 space-y-1">
            {/* Links */}
            <SignedIn>
              {navLinks.map(({ href, label, icon: Icon }, i) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(href)
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <Icon className={`w-4 h-4 ${isActive(href) ? "text-amber-400" : "text-white/30"}`} />
                  {label}
                  {isActive(href) && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </Link>
              ))}
            </SignedIn>
            <SignedOut>
              <Link href="/pricing" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
                <Tag className="w-4 h-4 text-white/30" />
                Pricing
              </Link>
            </SignedOut>

            {/* Divider */}
            <div className="h-px bg-white/5 my-3" />

            {/* Auth */}
            <SignedIn>
              <Link href="/generate">
                <button className="w-full flex items-center justify-center gap-2 bg-amber-400 text-black font-bold py-3 rounded-xl text-sm hover:bg-amber-300 transition-all">
                  <Sparkles className="w-4 h-4" />
                  Generate Package
                </button>
              </Link>
            </SignedIn>
            <SignedOut>
              <div className="space-y-2">
                <SignInButton mode="modal">
                  <button className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl text-sm hover:bg-white/10 transition-all">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full flex items-center justify-center gap-2 bg-amber-400 text-black font-bold py-3 rounded-xl text-sm hover:bg-amber-300 transition-all">
                    <Zap className="w-4 h-4" />
                    Start Free — 3 Packs/Month
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>

          {/* Bottom badge */}
          <div className="px-5 pb-5">
            <div className="bg-amber-400/5 border border-amber-400/10 rounded-xl px-3 py-2.5 text-center">
              <p className="text-amber-400/70 text-[10px] font-medium">ICAI 2026 · Foundation · Inter · Final</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[60px]" />
    </>
  );
}