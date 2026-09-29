import { api } from "./axios";

export interface Application {
  id: number;
  status: "APPLIED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  appliedAt: string;

  phone: string;
  location: string;
  education: string;
  experience: string;
  skills: string;
  coverLetter: string;

  resumeFileName: string;
  candidate?: {
    id: number;
    fullName: string;
    email: string;
  };

  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: number;
    description: string;
  };
}

export const applicationsApi = {

  apply: async (
    jobId: number,
    formData: FormData
  ) => {

    const response = await api.post(
      `/applications/${jobId}`,
      formData
    );

    return response.data;
  },

  getMyApplications: async (): Promise<Application[]> => {

    const response = await api.get(
      "/applications/my"
    );

    return response.data;
  },
};
