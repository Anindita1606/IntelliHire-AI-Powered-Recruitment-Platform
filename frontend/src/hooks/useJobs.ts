import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { jobsApi } from "../api/jobsApi";
import { toApiError } from "../lib/errors";
import type { Job, JobDraft } from "../types";

export const jobsKeys = {
  all: ["jobs"] as const,
};

export function useJobs() {
  return useQuery<Job[]>({
    queryKey: jobsKeys.all,
    queryFn: jobsApi.list,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: JobDraft) => jobsApi.create(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.all });
      toast.success("Job published successfully.");
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });
}
