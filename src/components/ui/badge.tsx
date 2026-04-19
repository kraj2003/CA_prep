import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "gold" | "success" | "destructive" | "outline";

const variants: Record<BadgeVariant, string> = {
  default:
    "border-[#1847A4]/30 bg-[#1847A4]/10 text-[#1847A4] dark:bg-[#1847A4]/20 dark:text-blue-300",
  gold:
    "border-[#D4B24C]/40 bg-[#D4B24C]/10 text-[#A17700] dark:bg-[#D4B24C]/20 dark:text-[#FFD700]",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
  destructive:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  outline: "border-zinc-300 bg-transparent text-zinc-700 dark:border-zinc-700 dark:text-zinc-300",
};

interface BadgeProps {
  className?: string;
  children: ReactNode;
  variant?: BadgeVariant;
}

function Badge({ className, children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Badge };