import { cn } from "@/lib/utils";

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#D4B24C]/40 bg-[#D4B24C]/10 px-2.5 py-0.5 text-xs font-semibold text-[#A17700]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Badge };
