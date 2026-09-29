import type { ApiError } from "../types";
import { AxiosError } from "axios";

/**
 * Normalises any thrown error (Axios / network / unknown) into a safe,
 * user-friendly ApiError. Never exposes raw stack traces.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? null;

    if (error.code === "ERR_NETWORK" || status === null) {
      return {
        status: null,
        message:
          "Cannot reach the server. Check your connection or confirm the backend is running.",
      };
    }

    const backendMessage = extractBackendMessage(error.response?.data);

    switch (status) {
      case 400:
        return { status, message: backendMessage ?? "Invalid request. Please review the details and try again." };
      case 401:
        return { status, message: backendMessage ?? "The server rejected this request. Please sign in again if your session has expired." };
      case 403:
        return { status, message: backendMessage ?? "You don't have permission to perform this action." };
      case 404:
        return { status, message: backendMessage ?? "The requested resource was not found." };
      case 409:
        return { status, message: backendMessage ?? "This record already exists." };
      case 500:
        return { status, message: backendMessage ?? "Something went wrong on the server. Please try again shortly." };
      default:
        return { status, message: backendMessage ?? "An unexpected error occurred. Please try again." };
    }
  }

  return { status: null, message: "An unexpected error occurred. Please try again." };
}

function extractBackendMessage(data: unknown): string | null {
  if (typeof data === "string" && data.trim().length > 0 && data.length < 300) {
    return data;
  }
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidate = record.message ?? record.error;
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }
  return null;
}
