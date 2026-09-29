import axios, {
  AxiosError,
  AxiosHeaders,
} from "axios";

const TOKEN_KEY = "intellihire_token";

export const UNAUTHORIZED_EVENT =
  "intellihire:unauthorized";

export const FORBIDDEN_EVENT =
  "intellihire:forbidden";

export const API_UNAUTHORIZED_EVENT = "intellihire:api-unauthorized";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.warn(
    "[IntelliHire] VITE_API_BASE_URL is not set."
  );
}

export const api = axios.create({
  baseURL,
  timeout: 20_000,
});

export const tokenStore = {

  get: (): string | null =>
    localStorage.getItem(TOKEN_KEY),

  set: (token: string) =>
    localStorage.setItem(TOKEN_KEY, token),

  clear: () =>
    localStorage.removeItem(TOKEN_KEY),
};

// Add JWT + handle FormData correctly
api.interceptors.request.use((config) => {

  const token = tokenStore.get();

  const headers = AxiosHeaders.from(
    config.headers
  );

  // JWT
  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  // IMPORTANT:
  // Let the browser/Axios set multipart/form-data
  // boundary automatically for FormData.
  if (config.data instanceof FormData) {
    headers.delete("Content-Type");
  } else {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  config.headers = headers;

  return config;
});

let tokenValidation: { token: string; promise: Promise<boolean | null> } | null = null;

async function isTokenValid(token: string): Promise<boolean | null> {
  if (tokenValidation?.token === token) return tokenValidation.promise;

  const promise = axios.get("/auth/me", {
    baseURL,
    timeout: 10_000,
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => true).catch((validationError: AxiosError) => {
    if (validationError.response?.status === 401) return false;
    return null;
  }).finally(() => {
    if (tokenValidation?.promise === promise) tokenValidation = null;
  });
  tokenValidation = { token, promise };
  return promise;
}

function dispatchUnauthorized(eventName: string, detail: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

// A resource endpoint can return 401 for an account lookup failure too. Verify
// the session independently before clearing a token or redirecting the user.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      const requestUrl = error.config?.url ?? "";
      const isPublicAuthRequest = /(?:^|\/)auth\/(?:login|register)(?:[/?#]|$)/i.test(requestUrl);
      const isMeRequest = /(?:^|\/)auth\/me(?:[/?#]|$)/i.test(requestUrl);
      const authorization = AxiosHeaders.from(error.config?.headers).get("Authorization");
      const requestToken = typeof authorization === "string" && authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;

      if (!isPublicAuthRequest && requestToken && requestToken === tokenStore.get()) {
        const detail = {
          status,
          method: error.config?.method?.toUpperCase() ?? "REQUEST",
          url: requestUrl.split("?")[0],
          silent: window.location.pathname === "/login" || window.location.pathname === "/register",
        };
        const stillValid = isMeRequest ? false : await isTokenValid(requestToken);
        if (tokenStore.get() === requestToken) {
          if (stillValid === false) {
            tokenStore.clear();
            dispatchUnauthorized(UNAUTHORIZED_EVENT, detail);
          } else if (!isMeRequest) {
            dispatchUnauthorized(API_UNAUTHORIZED_EVENT, detail);
          }
        }
      }
    }

    // 403 = authenticated but not allowed
    // DO NOT delete the JWT.
    if (status === 403) {

      window.dispatchEvent(
        new CustomEvent(
          FORBIDDEN_EVENT,
          {
            detail: { status },
          }
        )
      );
    }

    return Promise.reject(error);
  }
);

export default api;
