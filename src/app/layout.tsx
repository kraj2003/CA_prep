import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ReviseCA - The Ultimate CA Exam Revision Engine",
  description: "One input to an ICAI-perfect 8-section revision package for CA 2026 attempts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full bg-[#0f172a] text-zinc-100">
          <SiteHeader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
