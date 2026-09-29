import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export function Logo({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      data-testid="brand-logo"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-brand-600">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M6 18V6h2.4v12H6zm4.4 0V6h2.3l2.9 5V6H18v12h-2.3l-2.9-5v5h-2.4z" fill="currentColor" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
        Intelli<span className="text-brand-600 dark:text-brand-400">Hire</span>
      </span>
    </Link>
  );
}
