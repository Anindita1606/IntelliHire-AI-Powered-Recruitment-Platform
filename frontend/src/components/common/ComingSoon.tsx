import type { ReactNode } from "react";
import { Construction } from "lucide-react";
import { Badge } from "./Badge";

/**
 * Honest "backend integration pending" surface. Used for any feature whose
 * Spring Boot endpoint does not yet exist (candidate/recruiter/admin, AI, etc.).
 * Never renders fabricated data.
 */
export function ComingSoon({
  eyebrow = "Backend integration pending",
  title,
  description,
  requiredApis,
  children,
  testId = "coming-soon",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  requiredApis?: string[];
  children?: ReactNode;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className="surface-card overflow-hidden"
    >
      <div className="flex flex-col gap-5 p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <Construction className="h-5 w-5" />
          </span>
          <Badge tone="amber">{eyebrow}</Badge>
        </div>
        <div className="max-w-2xl">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        {requiredApis && requiredApis.length > 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Backend endpoints required to activate
            </p>
            <ul className="space-y-1.5">
              {requiredApis.map((endpoint) => (
                <li key={endpoint} className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {endpoint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
