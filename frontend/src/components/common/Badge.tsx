import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type Tone = "brand" | "slate" | "emerald" | "amber";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

export function Badge({
  children,
  tone = "slate",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
