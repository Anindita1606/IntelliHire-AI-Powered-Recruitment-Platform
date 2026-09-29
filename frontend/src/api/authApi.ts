import api from "./axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserRole
} from "../types";

/**
 * Authentication API — mirrors the EXISTING Spring Boot contract exactly.
 *
 * POST /auth/login    -> { token: string }
 * POST /auth/register -> "User Registered Successfully"
 * GET  /auth/me       -> { id, name, email }
 */

export interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      "/auth/login",
      payload
    );

    return data;
  },

  async register(payload: RegisterRequest): Promise<string> {
    const { data } = await api.post("/auth/register", payload);

    return typeof data === "string"
      ? data
      : "Account created successfully.";
  },

  async me(): Promise<BackendUser> {
    const { data } = await api.get<BackendUser>("/auth/me");
    return data;
  }
};
