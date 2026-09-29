import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const columns = [
  {
    heading: "Platform",
    links: [
      { label: "Browse Jobs", to: "/jobs" },
      { label: "Post a Job", to: "/jobs/new" },
      { label: "Create Account", to: "/register" },
      { label: "Sign In", to: "/login" },
    ],
  },
  {
    heading: "Workspaces",
    links: [
      { label: "Candidate", to: "/candidate" },
      { label: "Recruiter", to: "/recruiter" },
      { label: "Admin", to: "/admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#090D16]">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            An intelligent recruitment platform connecting candidates and employers through secure
            workflows and AI-powered hiring capabilities.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.heading}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {col.heading}
            </h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-6 dark:border-slate-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
          <p>© 2026 IntelliHire Enterprise HR-Tech Systems Inc. All rights reserved.</p>
          <p>Built with React, TypeScript & a Java Spring Boot backend.</p>
        </div>
      </div>
    </footer>
  );
}
