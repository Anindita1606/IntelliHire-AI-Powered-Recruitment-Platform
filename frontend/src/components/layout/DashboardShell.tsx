import type { ReactNode } from "react";

interface DashboardShellProps {
  role: string;
  title: string;
  subtitle: string;
  tabs: string[];
  children: ReactNode;
}

/** Shared shell for the candidate / recruiter / admin workspace previews. */
export function DashboardShell({ role, title, subtitle, tabs, children }: DashboardShellProps) {
  return (
    <div className="container-page py-12">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">{role} workspace</span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-px dark:border-slate-800">
        {tabs.map((tab, i) => (
          <span
            key={tab}
            className={
              i === 0
                ? "rounded-t-lg border-b-2 border-brand-600 px-4 py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-400"
                : "px-4 py-2.5 text-sm font-medium text-slate-400 dark:text-slate-500"
            }
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="mt-8 space-y-8">{children}</div>
    </div>
  );
}
