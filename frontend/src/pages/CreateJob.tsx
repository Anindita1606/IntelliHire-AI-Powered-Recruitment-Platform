import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Wallet } from "lucide-react";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { useCreateJob } from "../hooks/useJobs";
import { formatSalary, getInitials } from "../lib/utils";
import type { JobDraft } from "../types";

interface FieldErrors {
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  description?: string;
}

const empty = { title: "", company: "", location: "", salary: "", description: "" };

export default function CreateJob() {
  const navigate = useNavigate();
  const createJob = useCreateJob();
  const [form, setForm] = useState<typeof empty>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});

  const update = (key: keyof typeof empty) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!form.title.trim()) next.title = "Job title is required.";
    if (!form.company.trim()) next.company = "Company is required.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.salary.trim()) next.salary = "Salary is required.";
    else if (Number.isNaN(Number(form.salary)) || Number(form.salary) < 0)
      next.salary = "Enter a valid positive number.";
    if (!form.description.trim()) next.description = "Description is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const draft: JobDraft = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      salary: Number(form.salary),
      description: form.description.trim(),
    };

    createJob.mutate(draft, {
      onSuccess: () => navigate("/jobs"),
    });
  };

  const salaryPreview = form.salary && !Number.isNaN(Number(form.salary)) ? Number(form.salary) : null;

  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <p className="eyebrow">Employer tools</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
          Post a new job
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Publish a role directly to your Spring Boot backend via <span className="font-mono text-brand-600 dark:text-brand-400">POST /jobs</span>.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <form onSubmit={onSubmit} className="surface-card space-y-5 p-8 lg:col-span-3" noValidate>
          <Input
            id="create-job-title"
            label="Job title"
            placeholder="Senior Backend Engineer"
            value={form.title}
            onChange={(e) => update("title")(e.target.value)}
            error={errors.title}
            data-testid="create-job-title-input"
          />
          <Input
            id="create-job-company"
            label="Company"
            placeholder="IntelliHire Inc."
            value={form.company}
            onChange={(e) => update("company")(e.target.value)}
            error={errors.company}
            leftIcon={<Building2 className="h-4 w-4" />}
            data-testid="create-job-company-input"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="create-job-location"
              label="Location"
              placeholder="Remote / Bengaluru"
              value={form.location}
              onChange={(e) => update("location")(e.target.value)}
              error={errors.location}
              leftIcon={<MapPin className="h-4 w-4" />}
              data-testid="create-job-location-input"
            />
            <Input
              id="create-job-salary"
              label="Annual salary (INR)"
              placeholder="1200000"
              type="number"
              min={0}
              value={form.salary}
              onChange={(e) => update("salary")(e.target.value)}
              error={errors.salary}
              leftIcon={<Wallet className="h-4 w-4" />}
              data-testid="create-job-salary-input"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="create-job-description"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description
            </label>
            <textarea
              id="create-job-description"
              rows={6}
              placeholder="Describe the responsibilities, requirements and perks…"
              value={form.description}
              onChange={(e) => update("description")(e.target.value)}
              data-testid="create-job-description-input"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {errors.description && (
              <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              isLoading={createJob.isPending}
              data-testid="create-job-submit-button"
            >
              Publish job
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/jobs")} data-testid="create-job-cancel-button">
              Cancel
            </Button>
          </div>
        </form>

        {/* Live preview */}
        <div className="lg:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live preview
          </p>
          <div className="surface-card p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                {getInitials(form.company || form.title || "IH")}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                  {form.title || "Your job title"}
                </h3>
                <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                  {form.company || "Company name"}
                </p>
              </div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {form.description || "Your job description preview will appear here as you type."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="slate">
                <MapPin className="h-3.5 w-3.5" /> {form.location || "Location"}
              </Badge>
              <Badge tone="emerald">
                <Wallet className="h-3.5 w-3.5" /> {formatSalary(salaryPreview)}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
