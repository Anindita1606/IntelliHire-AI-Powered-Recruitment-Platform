import {
  Briefcase,
  GitBranch,
  LayoutDashboard,
  MapPin,
  Plus,
  Users,
  Wallet,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DashboardShell } from "../components/layout/DashboardShell";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { formatSalary } from "../lib/utils";
import {
  EmptyState,
  ErrorState,
} from "../components/common/StateViews";
import { JobCardSkeleton } from "../components/jobs/JobCardSkeleton";
import { toApiError } from "../lib/errors";
import { recruiterApi } from "../api/recruiterApi";
import { jobsApi } from "../api/jobsApi";
import { toast } from "sonner";
import { ApplicantReview } from "../components/recruiter/ApplicantReview";

export default function RecruiterDashboard() {
  const queryClient = useQueryClient();
  const deleteJob = useMutation({
    mutationFn: jobsApi.remove,
    onSuccess: async (_result, jobId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["recruiterJobs"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
      ]);
      toast.success("Job deleted successfully.");
    },
    onError: (error) => {
      const apiError = toApiError(error);
      toast.error(apiError.status === 409
        ? "This job has applications and cannot be deleted."
        : apiError.message);
    },
  });
  const {
    data: jobs,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recruiterJobs"],
    queryFn: recruiterApi.myJobs,
  });

  const jobCount = jobs?.length ?? 0;

  return (
    <DashboardShell
      role="Recruiter"
      title="Recruiter dashboard"
      subtitle="Manage published opportunities and create new openings from one place."
      tabs={[
        "Manage Jobs",
        "Applicants",
        "Hiring Pipeline",
        "Analytics",
      ]}
    >
      {/* Overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              <Briefcase className="h-5 w-5" />
            </div>

            <Badge tone="emerald">Live</Badge>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Published jobs
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {isLoading ? "—" : jobCount}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Retrieved from the Spring Boot backend
          </p>
        </div>

        <div className="surface-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Users className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Applications
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            —
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Review candidates for each job below
          </p>
        </div>

        <div className="surface-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <GitBranch className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Hiring pipeline
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            —
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Backend workflow not connected
          </p>
        </div>
      </section>

      {/* Jobs */}
      <section className="mt-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-brand-600 dark:text-brand-400" />

              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Published opportunities
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              These listings are shared with candidates through the live job board.
            </p>
          </div>

          <Link to="/jobs/new">
            <Button
              size="sm"
              data-testid="recruiter-post-job-button"
            >
              <Plus className="h-4 w-4" />
              Post a job
            </Button>
          </Link>
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
              title="Couldn't load published jobs"
              message={toApiError(error).message}
              onRetry={() => refetch()}
              testId="recruiter-jobs-error"
            />
          ) : jobCount === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="No published jobs yet"
              message="Create your first opening and publish it directly to the Spring Boot backend."
              testId="recruiter-empty-state"
              action={
                <Link to="/jobs/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    Create a job
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-900/60">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Position
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Company
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Location
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Salary
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                    {jobs?.map((job) => (
                      <tr
                        key={job.id}
                        data-testid="recruiter-job-row"
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        {/* Position */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                              {job.title
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {job.title}
                              </p>

                              <p className="text-xs text-slate-400">
                                Job #{job.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {job.company}
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {job.location}
                          </span>
                        </td>

                        {/* Salary */}
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5 text-slate-400" />
                            {formatSalary(job.salary)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/jobs/${job.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                data-testid={`recruiter-view-job-${job.id}`}
                              >
                                View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="danger"
                              isLoading={deleteJob.isPending && deleteJob.variables === job.id}
                              data-testid={`recruiter-delete-job-${job.id}`}
                              onClick={() => {
                                if (window.confirm(`Delete "${job.title}"? This cannot be undone.`)) {
                                  deleteJob.mutate(job.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>

                            <Badge tone="slate">
                              Published
                            </Badge>
                          </div>
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

      <ApplicantReview jobs={jobs ?? []} />
    </DashboardShell>
  );
}
