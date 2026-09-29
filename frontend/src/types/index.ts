export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: number;
  description: string;
}

export type JobDraft = Omit<Job, "id">;

/**
 * The current backend login response only provides a JWT token.
 * Fields below (name / email / role) are OPTIONAL and reserved for a future
 * backend "current user" endpoint — they are never fabricated on the client.
 */
export type UserRole = "CANDIDATE" | "EMPLOYER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "ADMIN">;
}

/** POST /auth/login returns exactly this shape. */
export interface AuthResponse {
  token: string;
}

export interface ApiError {
  status: number | null;
  message: string;
}
export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "REJECTED"
  | "HIRED";

export interface ApplicationJobSummary {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: number;
  description: string;
}

export interface ApplicationCandidateSummary {
  id: number;
  fullName: string;
  email: string;
}

export interface Application {
  id: number;
  job: ApplicationJobSummary;
  candidate: ApplicationCandidateSummary;
  phone: string;
  location: string;
  education: string;
  experience: string | null;
  skills: string | null;
  coverLetter: string | null;
  resumeFileName: string;
  status: ApplicationStatus;
  appliedAt: string;
}
