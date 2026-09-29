import api from "./axios";
import type { Job, JobDraft } from "../types";

/** API methods supported by the Spring Boot jobs controller. */
export const jobsApi = {
  async list(): Promise<Job[]> {
    const { data } = await api.get<Job[]>("/jobs");
    return Array.isArray(data) ? data : [];
  },

  async getById(id: number): Promise<Job> {
    const { data } = await api.get<Job>(`/jobs/${id}`);
    return data;
  },

  async create(payload: JobDraft): Promise<Job> {
    const { data } = await api.post<Job>("/jobs", payload);
    return data;
  },

  async update(id: number, payload: JobDraft): Promise<Job> {
    const { data } = await api.put<Job>(`/jobs/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};