import { api } from "./axios";
import type {
  Application,
  ApplicationStatus,
  Job,
} from "../types";

export const recruiterApi = {
  async myJobs(): Promise<Job[]> {
    const { data } = await api.get<Job[]>("/recruiter/jobs");
    return Array.isArray(data) ? data : [];
  },

  async applicants(jobId: number): Promise<Application[]> {
    const { data } = await api.get<Application[]>(
      `/recruiter/applications/job/${jobId}`
    );

    return Array.isArray(data) ? data : [];
  },

  async updateApplicationStatus(
    applicationId: number,
    status: ApplicationStatus
  ): Promise<Application> {
    const { data } = await api.put<Application>(
      `/recruiter/applications/${applicationId}/status`,
      null,
      {
        params: { status },
      }
    );

    return data;
  },

  async downloadResume(application: Application): Promise<void> {
    const { data } = await api.get<Blob>(
      `/recruiter/applications/${application.id}/resume`,
      {
        responseType: "blob",
      }
    );

    const objectUrl = URL.createObjectURL(data);

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download =
      application.resumeFileName || "candidate-resume.pdf";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  },
};