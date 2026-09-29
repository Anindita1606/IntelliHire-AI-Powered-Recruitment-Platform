import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import { toApiError } from "../lib/errors";
import { AuthShell } from "../components/auth/AuthShell";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from;

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { token } = await authApi.login({ email: email.trim(), password });
      const currentUser = await login(token);
      toast.success("Signed in successfully.");
      navigate(
        redirectTo ?? (currentUser.role === "EMPLOYER" ? "/recruiter" : "/candidate"),
        { replace: true }
      );
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage jobs and access your IntelliHire workspace."
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          id="login-email"
          type="email"
          label="Email address"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          autoComplete="email"
          data-testid="login-email-input"
        />
        <Input
          id="login-password"
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="current-password"
          data-testid="login-password-input"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              data-testid="login-password-toggle"
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <Button type="submit" className="w-full" isLoading={submitting} data-testid="login-submit-button">
          <LogIn className="h-4 w-4" /> Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
