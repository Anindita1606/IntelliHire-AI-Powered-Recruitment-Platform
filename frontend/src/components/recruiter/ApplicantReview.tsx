import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Users } from "lucide-react";
import { toast } from "sonner";

import { recruiterApi, type ApplicationStatus } from "../../api/recruiterApi";
import type { Job } from "../../types";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { EmptyState, ErrorState } from "../common/StateViews";
import { Spinner } from "../common/Spinner";
import { toApiError } from "../../lib/errors";

const statuses: ApplicationStatus[] = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"];

function statusTone(status: ApplicationStatus): "brand" | "slate" | "emerald" | "amber" {
  if (status === "HIRED") return "emerald";
  if (status === "SHORTLISTED") return "brand";
  if (status === "REJECTED") return "slate";
  return "amber";
}

export function ApplicantReview({ jobs }: { jobs: Job[] }) {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const activeJobId = selectedJobId ?? jobs[0]?.id ?? null;

  const applicantsQuery = useQuery({
    queryKey: ["recruiterApplicants", activeJobId],
    queryFn: () => recruiterApi.applicants(activeJobId as number),
    enabled: activeJobId !== null,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) =>
      recruiterApi.updateApplicationStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["recruiterApplicants", activeJobId],
      });
      toast.success("Application status updated.");
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  const handleDownload = async (applicationId: number) => {
    const application = applicantsQuery.data?.find((item) => item.id === applicationId);
    if (!application) return;
    try {
      await recruiterApi.downloadResume(application);
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  };

  return (
    <section className="mt-8 surface-card p-6" data-testid="recruiter-applicant-review">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Hiring workflow</p>
          <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-slate-50">
            Review applicants
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Applicant details and resumes are available only to the owner of each job.
          </p>
        </div>
        {jobs.length > 0 && (
          <div className="w-full sm:max-w-sm">
            <label htmlFor="applicant-job" className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Select a job
            </label>
            <select
              id="applicant-job"
              value={activeJobId ?? ""}
              onChange={(event) => setSelectedJobId(Number(event.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {jobs.map((job) => <option key={job.id} value={job.id}>{job.title} · {job.company}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="mt-5">
        {jobs.length === 0 ? (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="Post your first job to receive applications"
            message="Once candidates apply, you can review their details and update application status here."
          />
        ) : applicantsQuery.isLoading ? (
          <div className="flex justify-center py-12" role="status" aria-label="Loading applicants">
            <Spinner />
          </div>
        ) : applicantsQuery.isError ? (
          <ErrorState
            title="Couldn’t load applicants"
            message={toApiError(applicantsQuery.error).message}
            onRetry={() => void applicantsQuery.refetch()}
          />
        ) : !applicantsQuery.data?.length ? (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No applications for this job yet"
            message="New candidate applications will appear here."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-[720px] w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Candidate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Applied</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Resume</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                {applicantsQuery.data.map((application) => (
                  <tr key={application.id}>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {application.candidate?.fullName ?? "Candidate"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{application.candidate?.email}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <Button size="sm" variant="outline" onClick={() => void handleDownload(application.id)}>
                        <Download className="h-3.5 w-3.5" /> Download PDF
                      </Button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Badge tone={statusTone(application.status)}>{application.status}</Badge>
                        <select
                          aria-label={`Update status for ${application.candidate?.fullName ?? "candidate"}`}
                          value={application.status}
                          disabled={updateStatus.isPending}
                          onChange={(event) => updateStatus.mutate({
                            id: application.id,
                            status: event.target.value as ApplicationStatus,
                          })}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
