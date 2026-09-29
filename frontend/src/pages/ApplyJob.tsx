import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, FileText, GraduationCap, MapPin, ShieldCheck, UploadCloud, X } from "lucide-react";
import { applicationsApi } from "../api/applicationsApi";
import { jobsApi } from "../api/jobsApi";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import { toApiError } from "../lib/errors";
import type { Job } from "../types";

const MAX_RESUME_SIZE = 10 * 1024 * 1024;

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [form, setForm] = useState({ phone: "", location: "", education: "", experience: "", skills: "", coverLetter: "" });

  useEffect(() => {
    let active = true;
    if (!id || !/^\d+$/.test(id)) { setLoading(false); return; }
    jobsApi.getById(Number(id)).then((data) => { if (active) setJob(data); })
      .catch(() => { if (active) setError("We couldn't load this job. Please go back and try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const update = (field: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [field]: value }));
  const completed = useMemo(() => [Boolean(form.phone.trim()), Boolean(form.location.trim()), Boolean(form.education.trim()), Boolean(resume)].filter(Boolean).length, [form, resume]);

  const chooseResume = async (file?: File) => {
    setError("");
    if (!file) { setResume(null); return; }
    if (!file.name.toLowerCase().endsWith(".pdf") || file.type !== "application/pdf") {
      setResume(null); setError("Please choose a PDF file."); return;
    }
    if (file.size > MAX_RESUME_SIZE) { setResume(null); setError("Your resume must be 10 MB or smaller."); return; }
    try {
      const signature = new Uint8Array(await file.slice(0, 5).arrayBuffer());
      if (String.fromCharCode(...signature) !== "%PDF-") { setResume(null); setError("This file doesn't appear to be a valid PDF."); return; }
    } catch { setResume(null); setError("The selected file could not be read. Please choose it again."); return; }
    setResume(file);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!resume) { setError("Attach your resume as a PDF before submitting."); return; }
    if (!id) return;
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value.trim()));
    payload.append("resume", resume);
    setSubmitting(true);
    try {
      await applicationsApi.apply(Number(id), payload);
      await queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      toast.success("Application submitted successfully.");
      navigate("/candidate", { replace: true });
    } catch (submitError) {
      setError(toApiError(submitError).message);
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="container-page py-20 text-center text-slate-500">Preparing your application…</div>;
  if (!job) return <div className="container-page py-20 text-center"><h1 className="text-2xl font-bold">Unable to open this application</h1><p className="mt-2 text-slate-500">{error || "The job could not be found."}</p><Link to="/jobs" className="mt-5 inline-block font-semibold text-brand-700">Browse jobs</Link></div>;

  return (
    <div className="container-page max-w-5xl py-8 sm:py-12">
      <Link to={`/jobs/${job.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-700 dark:hover:text-brand-300"><ArrowLeft className="h-4 w-4" /> Back to job details</Link>
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-indigo-600 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full border-[36px] border-white/10" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">Candidate application</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Make your next move.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">Complete your details and share your resume with the hiring team. You can review everything before you submit.</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
            <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4" />{job.title} · {job.company}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{job.location}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_270px]">
          <form onSubmit={submit} className="space-y-9 p-5 sm:p-9" noValidate>
            <section>
              <div className="mb-5 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"><BriefcaseBusiness className="h-5 w-5" /></span><div><h2 className="font-semibold">Your contact details</h2><p className="mt-1 text-sm text-slate-500">We’ll use these details to identify your application.</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="applicant-name" label="Full name" value={user?.name || ""} readOnly className="bg-slate-50 dark:bg-slate-800" />
                <Input id="applicant-email" label="Email address" value={user?.email || ""} readOnly className="bg-slate-50 dark:bg-slate-800" />
                <Input id="applicant-phone" label="Phone number *" type="tel" autoComplete="tel" placeholder="e.g. +91 98765 43210" maxLength={20} value={form.phone} onChange={(event) => update("phone")(event.target.value)} required />
                <Input id="applicant-location" label="Current location *" autoComplete="address-level2" placeholder="City, State" maxLength={100} value={form.location} onChange={(event) => update("location")(event.target.value)} required />
              </div>
            </section>

            <section className="border-t border-slate-200 pt-8 dark:border-slate-800">
              <div className="mb-5 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"><GraduationCap className="h-5 w-5" /></span><div><h2 className="font-semibold">Education & experience</h2><p className="mt-1 text-sm text-slate-500">Give the hiring team a quick picture of your background.</p></div></div>
              <div className="space-y-4">
                <Input id="applicant-education" label="Highest education *" placeholder="e.g. B.Tech in Information Technology" maxLength={200} value={form.education} onChange={(event) => update("education")(event.target.value)} required />
                <Input id="applicant-experience" label="Relevant experience" placeholder="e.g. Fresher, or 2 years in backend development" maxLength={100} value={form.experience} onChange={(event) => update("experience")(event.target.value)} />
                <div><label htmlFor="applicant-skills" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Relevant skills</label><textarea id="applicant-skills" rows={3} maxLength={1000} placeholder="Add skills relevant to this role, separated by commas" value={form.skills} onChange={(event) => update("skills")(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900"/><p className="mt-1 text-right text-xs text-slate-400">{form.skills.length}/1000</p></div>
              </div>
            </section>

            <section className="border-t border-slate-200 pt-8 dark:border-slate-800">
              <div className="mb-5 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><FileText className="h-5 w-5" /></span><div><h2 className="font-semibold">Resume & note</h2><p className="mt-1 text-sm text-slate-500">Upload a PDF resume and add an optional introduction.</p></div></div>
              <label htmlFor="resume-file" className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition ${resume ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20" : "border-slate-300 bg-slate-50/70 hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-brand-500"}`}>
                {resume ? <><CheckCircle2 className="h-8 w-8 text-emerald-600"/><span className="mt-3 max-w-full truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{resume.name}</span><span className="mt-1 text-xs text-slate-500">{(resume.size / 1024 / 1024).toFixed(2)} MB · PDF selected</span></> : <><UploadCloud className="h-8 w-8 text-brand-600 dark:text-brand-300"/><span className="mt-3 text-sm font-semibold">Choose your resume</span><span className="mt-1 text-xs text-slate-500">PDF only · Maximum file size 10 MB</span><span className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900">Browse files</span></>}
                <input id="resume-file" type="file" className="sr-only" accept=".pdf,application/pdf" onChange={(event) => void chooseResume(event.target.files?.[0])} />
              </label>
              {resume && <button type="button" onClick={() => { setResume(null); const input = document.getElementById("resume-file") as HTMLInputElement | null; if (input) input.value = ""; }} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600"><X className="h-3.5 w-3.5"/> Remove resume</button>}
              <div className="mt-5"><label htmlFor="applicant-letter" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Message to the hiring team <span className="font-normal text-slate-400">(optional)</span></label><textarea id="applicant-letter" rows={5} maxLength={3000} placeholder="Briefly tell us why you’re interested in this role and what you’d bring to the team…" value={form.coverLetter} onChange={(event) => update("coverLetter")(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm leading-6 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900"/><p className="mt-1 text-right text-xs text-slate-400">{form.coverLetter.length}/3000</p></div>
            </section>

            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end dark:border-slate-800"><Button type="button" variant="outline" onClick={() => navigate(`/jobs/${job.id}`)}>Cancel</Button><Button type="submit" size="lg" isLoading={submitting} disabled={submitting || completed < 4}>{submitting ? "Submitting application…" : "Submit application"}</Button></div>
            <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400"><ShieldCheck className="h-4 w-4"/>Your information is shared with this job’s hiring team.</p>
          </form>

          <aside className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-7 lg:border-l lg:border-t-0 dark:border-slate-800 dark:bg-slate-950/30">
            <div className="lg:sticky lg:top-24"><p className="text-sm font-semibold">Application checklist</p><p className="mt-1 text-xs text-slate-500">{completed} of 4 required items complete</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${completed * 25}%` }}/></div>
              <ul className="mt-5 space-y-3 text-sm">{[["Phone number", Boolean(form.phone.trim())], ["Current location", Boolean(form.location.trim())], ["Education", Boolean(form.education.trim())], ["PDF resume", Boolean(resume)]].map(([label, done]) => <li key={String(label)} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">{done ? <CheckCircle2 className="h-4 w-4 text-emerald-600"/> : <span className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700"/>}{label}</li>)}</ul>
              <div className="mt-7 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applying for</p><p className="mt-2 font-semibold leading-5">{job.title}</p><p className="mt-1 text-sm text-slate-500">{job.company}</p><p className="mt-3 text-sm text-slate-500">₹{Number(job.salary || 0).toLocaleString("en-IN")} · {job.location}</p></div>
              <p className="mt-5 text-xs leading-5 text-slate-400">You can see your submitted application and its current status from your candidate dashboard.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
