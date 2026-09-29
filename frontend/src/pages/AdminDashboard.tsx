import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  Database,
  ShieldCheck,
  Users,
} from "lucide-react";

import { DashboardShell } from "../components/layout/DashboardShell";
import { ComingSoon } from "../components/common/ComingSoon";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import {
  EmptyState,
  ErrorState,
} from "../components/common/StateViews";
import { JobCardSkeleton } from "../components/jobs/JobCardSkeleton";

import { useJobs } from "../hooks/useJobs";
import { toApiError } from "../lib/errors";

export default function AdminDashboard() {
  const {
    data: jobs,
    isLoading,
    isError,
    error,
    refetch,
  } = useJobs();

  const jobCount = jobs?.length ?? 0;

  return (
    <DashboardShell
      role="Admin"
      title="Admin dashboard"
      subtitle="Monitor platform activity using verified backend data and prepare the system for the next administrative layer."
      tabs={[
        "Overview",
        "Users",
        "Jobs",
        "Platform Analytics",
      ]}
    >
      {/* Platform health */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              <Briefcase className="h-5 w-5" />
            </div>

            <Badge tone="emerald">
              Live
            </Badge>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Published jobs
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {isLoading ? "—" : jobCount}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            GET /jobs
          </p>
        </div>

        <div className="surface-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Users className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Registered users
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            —
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Admin user API pending
          </p>
        </div>

        <div className="surface-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <BarChart3 className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Platform analytics
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            —
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Analytics API pending
          </p>
        </div>

        <div className="surface-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            API status
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Active
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Frontend connected to backend
          </p>
        </div>
      </section>

      {/* Verified backend capabilities */}
      <section className="mt-8">
        <div>
          <p className="eyebrow">Platform capabilities</p>

          <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Currently verified
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            These capabilities are backed by the current IntelliHire backend.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="surface-card p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                JWT Authentication
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Secure login issues a JWT that is validated on protected requests.
            </p>
          </div>

          <div className="surface-card p-5">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Live job database
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Job listings are retrieved from the Spring Boot API backed by MySQL.
            </p>
          </div>

          <div className="surface-card p-5">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Job publishing
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Authenticated users can publish job records through the live API.
            </p>
          </div>
        </div>
      </section>

      {/* Current jobs */}
      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">System data</p>

            <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Current job inventory
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Read-only platform view of the jobs currently exposed by the backend.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              title="Couldn't load platform jobs"
              message={toApiError(error).message}
              onRetry={() => refetch()}
            />
          ) : jobCount === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="No jobs in the platform"
              message="Once jobs are published, they will appear in this administrative read-only view."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-[720px] w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-900/60">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Job
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Company
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Location
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                    {jobs?.map((job) => (
                      <tr
                        key={job.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                              {job.title
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {job.title}
                              </p>

                              <p className="text-xs text-slate-400">
                                ID #{job.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {job.company}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {job.location}
                        </td>

                        <td className="px-5 py-4">
                          <Badge tone="emerald">
                            Active listing
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Future admin modules */}
      <section className="mt-8">
        <ComingSoon
          title="User administration and platform analytics"
          description="The administrative UI is ready for the next backend layer. These modules remain intentionally inactive until real admin APIs are implemented."
          requiredApis={[
            "GET /admin/users",
            "PATCH /admin/users/{id}/role",
            "GET /admin/analytics",
          ]}
          testId="admin-coming-soon"
        />
      </section>
    </DashboardShell>
  );
}