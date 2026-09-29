import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authApi } from "../api/authApi";
import { tokenStore, UNAUTHORIZED_EVENT, API_UNAUTHORIZED_EVENT } from "../api/axios";
import type { User } from "../types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  login: (token: string) => Promise<User>;
  logout: (options?: { silent?: boolean }) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => tokenStore.get());
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(() => Boolean(tokenStore.get()));
  const userLoadSequence = useRef(0);

  const loadUser = useCallback(async (): Promise<User | null> => {
    const requestSequence = ++userLoadSequence.current;
    setIsLoadingUser(true);
    try {
      const currentUser = await authApi.me();
      const normalizedUser: User = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      };
      if (requestSequence === userLoadSequence.current) {
        setUser(normalizedUser);
      }
      return normalizedUser;
    } catch {
      if (requestSequence === userLoadSequence.current) {
        setUser(null);
      }
      return null;
    } finally {
      if (requestSequence === userLoadSequence.current) {
        setIsLoadingUser(false);
      }
    }
  }, []);

  const login = useCallback(async (newToken: string): Promise<User> => {
    tokenStore.set(newToken);
    setToken(newToken);
    const currentUser = await loadUser();
    if (!currentUser) {
      tokenStore.clear();
      setToken(null);
      throw new Error("Could not load your account. Please try signing in again.");
    }
    return currentUser;
  }, [loadUser]);

  const logout = useCallback(
    (options?: { silent?: boolean }) => {
      tokenStore.clear();
      setToken(null);
      setUser(null);
      setIsLoadingUser(false);

      if (!options?.silent) {
        toast.success("You have been signed out.");
      }

      navigate("/login");
    },
    [navigate]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      if (tokenStore.get() === null) {
        setToken(null);
        setUser(null);
        setIsLoadingUser(false);
        const silent = event instanceof CustomEvent && Boolean(event.detail?.silent);
        if (!silent) {
          const request = event instanceof CustomEvent ? event.detail : null;
          const endpoint = request?.url ? ` (${request.method ?? "REQUEST"} ${request.url})` : "";
          toast.error(`The backend rejected your session${endpoint}. Please sign in again.`);
        }
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          navigate("/login");
        }
      }
    };

    const apiUnauthorizedHandler = (event: Event) => {
      const request = event instanceof CustomEvent ? event.detail : null;
      // CandidateDashboard already renders an inline error for this query.
      if (request?.url === "/applications/my") return;
      const endpoint = request?.url ? ` (${request.method ?? "REQUEST"} ${request.url})` : "";
      toast.error(`The backend rejected this request and the session could not be verified${endpoint}.`);
    };

    window.addEventListener(API_UNAUTHORIZED_EVENT, apiUnauthorizedHandler);
    window.addEventListener(UNAUTHORIZED_EVENT, handler);
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handler);
      window.removeEventListener(API_UNAUTHORIZED_EVENT, apiUnauthorizedHandler);
    };
  }, [navigate]);

  useEffect(() => {
    if (token) {
      void loadUser();
    }
    // Restore the user once when the app mounts. Login loads the user itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoadingUser,
      login,
      logout,
    }),
    [token, user, isLoadingUser, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
