import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { authApi } from "../api/authApi";
import { toApiError } from "../lib/errors";
import { AuthShell } from "../components/auth/AuthShell";

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const MIN_PASSWORD = 8;

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"CANDIDATE" | "EMPLOYER">("CANDIDATE");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!fullName.trim()) next.fullName = "Full name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < MIN_PASSWORD) next.password = `Password must be at least ${MIN_PASSWORD} characters.`;
    if (confirmPassword !== password) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await authApi.register({ fullName: fullName.trim(), email: email.trim(), password, role });
      toast.success("Account created successfully.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join IntelliHire to explore roles and manage hiring with a secure workflow."
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          id="register-name"
          label="Full name"
          placeholder="Anindita Chatterjee"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          leftIcon={<User className="h-4 w-4" />}
          autoComplete="name"
          data-testid="register-name-input"
        />
        <Input
          id="register-email"
          type="email"
          label="Email address"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          autoComplete="email"
          data-testid="register-email-input"
        />
        <div>
          <label htmlFor="register-role" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            I’m joining as
          </label>
          <select
            id="register-role"
            value={role}
            onChange={(e) => setRole(e.target.value as "CANDIDATE" | "EMPLOYER")}
            data-testid="register-role-select"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="CANDIDATE">Candidate — looking for a role</option>
            <option value="EMPLOYER">Employer — hiring for a role</option>
          </select>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Admin access is assigned separately and can’t be selected here.
          </p>
        </div>
        <Input
          id="register-password"
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          data-testid="register-password-input"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              data-testid="register-password-toggle"
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <Input
          id="register-confirm-password"
          type={showPassword ? "text" : "password"}
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          data-testid="register-confirm-password-input"
        />
        <Button type="submit" className="w-full" isLoading={submitting} data-testid="register-submit-button">
          <UserPlus className="h-4 w-4" /> Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
