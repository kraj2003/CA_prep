import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ReviseCA — CA Exam Revision Engine | ICAI 2026",
  description:
    "One topic → a complete ICAI-aligned 8-section exam package in 45 seconds. MCQs, model answers, mark-loss traps, and more. Built for CA Foundation, Intermediate & Final 2026.",
  keywords: "CA exam, ICAI 2026, CA revision, CA final, CA intermediate, CA foundation, revision notes",
  openGraph: {
    title: "ReviseCA — Stop Studying. Start Scoring.",
    description: "Generate a complete exam-ready revision package in 45 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          className="min-h-full antialiased"
          style={{
            background: "#060d1a",
            color: "#f8fafc",
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          <SiteHeader />
          <div className="relative">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}