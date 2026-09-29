import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Logo } from "../layout/Logo";

const bullets = [
  "Stateless JWT authentication",
  "Secure, auditable hiring workflows",
  "Real job data from your Spring Boot core",
];

/** Split-screen auth layout shared by Login and Register. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-12 py-12 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:block">
        <div className="relative overflow-hidden rounded-2xl bg-brand-800 p-10 dark:bg-slate-900">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(30rem_20rem_at_20%_0%,rgba(255,255,255,0.12),transparent)]" />
          <div className="relative">
            <Logo className="[&_span]:text-white [&_.text-brand-600]:!text-brand-300" />
            <h2 className="mt-10 font-display text-3xl font-bold leading-tight text-white">
              The enterprise platform for smarter hiring.
            </h2>
            <p className="mt-4 max-w-md text-brand-100">
              Connect candidates and employers through secure, structured recruitment workflows.
            </p>
            <ul className="mt-10 space-y-4">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-brand-50">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
