import { Link } from "react-router-dom";
import { ArrowRight, Building2, MapPin, Wallet } from "lucide-react";
import type { Job } from "../../types";
import { formatSalary, getInitials } from "../../lib/utils";
import { Badge } from "../common/Badge";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      data-testid="job-card-item"
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-elevated dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/50"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
          {getInitials(job.company || job.title)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            {job.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Building2 className="h-3.5 w-3.5" /> {job.company || "—"}
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {job.description || "No description provided."}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Badge tone="slate">
          <MapPin className="h-3.5 w-3.5" /> {job.location || "Location N/A"}
        </Badge>
        <Badge tone="emerald">
          <Wallet className="h-3.5 w-3.5" /> {formatSalary(job.salary)}
        </Badge>
      </div>

      <div className="mt-5 flex items-center border-t border-slate-100 pt-4 text-sm font-semibold text-brand-700 dark:border-slate-800 dark:text-brand-400">
        View details
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
