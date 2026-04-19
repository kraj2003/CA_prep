import Link from "next/link";
import { BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1847A4]/10">
        <BookOpen className="h-10 w-10 text-[#1847A4]" />
      </div>
      <h1 className="text-5xl font-black text-zinc-900 dark:text-white">404</h1>
      <p className="mt-2 text-xl font-bold text-zinc-600 dark:text-zinc-300">Page not found</p>
      <p className="mt-3 max-w-md text-zinc-500">
        This page doesn't exist — but your CA preparation does. Let's get you back on track.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/generate">Generate Package</Link>
        </Button>
      </div>
    </main>
  );
}