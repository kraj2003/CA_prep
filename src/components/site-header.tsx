import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105 group-hover:rotate-3">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-white">ReviseCA</span>
        </Link>

        {/* Center nav — hidden on mobile */}
        <nav className="hidden items-center gap-1 md:flex">
          <SignedIn>
            <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Link href="/generate">Generate</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Link href="/history">My Revisions</Link>
            </Button>
          </SignedIn>
          <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
            <Link href="/pricing">Pricing</Link>
          </Button>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-600 hover:to-amber-700 hidden sm:inline-flex">
                <Sparkles className="w-4 h-4 mr-1" />
                Start Free
              </Button>
            </SignUpButton>
          </SignedOut>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}