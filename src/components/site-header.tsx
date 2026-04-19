import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1847A4] transition-transform group-hover:scale-105">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-black text-[#1847A4]">ReviseCA</span>
        </Link>

        {/* Center nav — hidden on mobile */}
        <nav className="hidden items-center gap-1 md:flex">
          <SignedIn>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/generate">Generate</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/history">My Revisions</Link>
            </Button>
          </SignedIn>
          <Button asChild variant="ghost" size="sm">
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
              <Button variant="ghost" size="sm">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="hidden sm:inline-flex">Start Free</Button>
            </SignUpButton>
          </SignedOut>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}