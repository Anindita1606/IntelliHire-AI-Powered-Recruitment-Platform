import {
  Briefcase,
  MapPin,
  Search,
  UserRound,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { DashboardShell } from "../components/layout/DashboardShell";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { EmptyState, ErrorState } from "../components/common/StateViews";
import { JobCardSkeleton } from "../components/jobs/JobCardSkeleton";

import { useAuth } from "../context/AuthContext";
import { useJobs } from "../hooks/useJobs";
import { formatSalary } from "../lib/utils";
import { toApiError } from "../lib/errors";
import { applicationsApi } from "../api/applicationsApi";

export default function CandidateDashboard() {
  const { user } = useAuth();

  const {
    data: jobs,
    isLoading,
    isError,
    error,
    refetch,
  } = useJobs();

  const applicationsQuery = useQuery({
    queryKey: ["myApplications"],
    queryFn: applicationsApi.getMyApplications,
  });

  const jobCount = jobs?.length ?? 0;

  return (
    <DashboardShell
      role="Candidate"
      title={`Welcome, ${user?.name || "Candidate"}`}
      subtitle="Explore live opportunities and manage your career journey from IntelliHire."
      tabs={[
        "Overview",
        "Recommended Jobs",
        "Applications",
        "Profile",
      ]}
    >
      {/* Candidate profile summary */}
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Candidate profile
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50">
                  {user?.name || "Candidate"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {user?.email || "Authenticated IntelliHire user"}
                </p>
              </div>
            </div>

            <Badge tone="emerald">
              <UserRound className="h-3.5 w-3.5" />
              Authenticated
            </Badge>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            <Briefcase className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live opportunities
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {isLoading ? "—" : jobCount}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Current jobs available through IntelliHire
          </p>
        </div>
      </section>

      {/* Candidate actions */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/jobs">
          <div className="surface-card group h-full p-6 transition hover:-translate-y-0.5 hover:border-brand-200 dark:hover:border-brand-800">
            <Search className="h-5 w-5 text-brand-600 dark:text-brand-400" />

            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              Explore open jobs
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Search and filter live job listings published by the platform.
            </p>

            <div className="mt-4">
              <Button size="sm">
                Browse jobs
              </Button>
            </div>
          </div>
        </Link>

        <div className="surface-card h-full p-6">
          <UserRound className="h-5 w-5 text-slate-500 dark:text-slate-400" />

          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            Profile & applications
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Track the jobs you have applied to and check each hiring status.
          </p>

          <Badge tone="brand" className="mt-4">
            {applicationsQuery.data?.length ?? 0} application{applicationsQuery.data?.length === 1 ? "" : "s"}
          </Badge>
        </div>
      </section>

      <section className="mt-10" id="applications">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Your activity</p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              My applications
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Applications and status updates are loaded from your account.
            </p>
          </div>
          <Link to="/jobs"><Button size="sm" variant="outline">Find another job</Button></Link>
        </div>

        <div className="mt-4">
          {applicationsQuery.isLoading ? (
            <div className="surface-card p-6 text-sm text-slate-500">Loading your applications…</div>
          ) : applicationsQuery.isError ? (
            <ErrorState
              title="Couldn’t load your applications"
              message={toApiError(applicationsQuery.error).message}
              onRetry={() => void applicationsQuery.refetch()}
            />
          ) : !applicationsQuery.data?.length ? (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="You haven’t applied to a job yet"
              message="Browse open roles and submit your first application with a PDF resume."
              action={<Link to="/jobs"><Button size="sm">Browse jobs</Button></Link>}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {applicationsQuery.data.map((application) => (
                <article key={application.id} className="surface-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{application.job.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{application.job.company} · {application.job.location}</p>
                    </div>
                    <Badge tone={application.status === "HIRED" ? "emerald" : application.status === "REJECTED" ? "slate" : application.status === "SHORTLISTED" ? "brand" : "amber"}>
                      {application.status}
                    </Badge>
                  </div>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                    Applied {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400" title={application.resumeFileName}>
                    Resume: {application.resumeFileName}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Live job opportunities */}
      <section className="mt-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Live opportunities</p>

            <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Latest jobs
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Retrieved directly from the Spring Boot job API.
            </p>
          </div>

          <Link to="/jobs">
            <Button size="sm" variant="outline">
              View all
            </Button>
          </Link>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              title="Couldn't load opportunities"
              message={toApiError(error).message}
              onRetry={() => refetch()}
            />
          ) : jobCount === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="No jobs available yet"
              message="Once recruiters publish openings, they will appear here."
              action={
                <Link to="/jobs">
                  <Button size="sm" variant="outline">
                    Browse jobs
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs?.slice(0, 3).map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="group"
                >
                  <div className="surface-card h-full p-6 transition group-hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                          {job.title}
                        </h3>

                        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                          {job.company}
                        </p>
                      </div>

                      <Badge tone="emerald">
                        Open
                      </Badge>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {job.description ||
                        "View the role details to learn more about this opportunity."}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Badge tone="slate">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </Badge>

                      <Badge tone="emerald">
                        <Wallet className="h-3.5 w-3.5" />
                        {formatSalary(job.salary)}
                      </Badge>
                    </div>

                    <div className="mt-5 text-sm font-medium text-brand-600 dark:text-brand-400">
                      View role →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
