import { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, MapPin, Wallet } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { jobsApi } from "../api/jobsApi";
import type { Job } from "../types";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    if (!id || !/^\d+$/.test(id)) {
      setLoading(false);
      setLoadError(true);
      return;
    }
    jobsApi.getById(Number(id))
      .then((data) => { if (active) setJob(data); })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="container-page py-20 text-center text-slate-500">Loading job details…</div>;
  if (loadError || !job) return (
    <div className="container-page py-20 text-center">
      <h1 className="text-2xl font-bold">Job not found</h1>
      <p className="mt-2 text-slate-500">This job may have been removed or is temporarily unavailable.</p>
      <Button className="mt-6" onClick={() => navigate("/jobs")}>Browse jobs</Button>
    </div>
  );

  return (
    <div className="container-page py-10 sm:py-14">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-700 dark:hover:text-brand-300">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>
      <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="surface-card p-6 sm:p-9">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"><BriefcaseBusiness /></div>
          <p className="eyebrow mt-7">Job opportunity</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{job.title}</h1>
          <p className="mt-3 text-lg font-semibold text-brand-700 dark:text-brand-300">{job.company}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{job.location}</span>
            <span className="inline-flex items-center gap-2"><Wallet className="h-4 w-4" />₹{Number(job.salary || 0).toLocaleString("en-IN")}</span>
          </div>
          <div className="my-8 border-t border-slate-200 dark:border-slate-800" />
          <h2 className="text-lg font-semibold">About the role</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{job.description}</p>
        </article>

        <aside className="h-fit surface-card p-6 sm:p-7 lg:sticky lg:top-24">
          <p className="text-lg font-semibold">Ready to apply?</p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Share your experience and resume with the hiring team. It usually takes about 3 minutes.</p>
          <Button size="lg" className="mt-6 w-full" onClick={() => {
            if (!user) navigate("/login", { state: { from: `/jobs/${job.id}/apply` } });
            else if (user.role === "CANDIDATE") navigate(`/jobs/${job.id}/apply`);
            else navigate("/candidate");
          }}>
            {user?.role === "CANDIDATE" ? "Apply Now" : user ? "Candidate account required" : "Sign in to apply"}
          </Button>
          {user?.role === "CANDIDATE" && <Link to="/candidate" className="mt-4 block text-center text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">View my applications</Link>}
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">Your profile name and email will be included automatically. You can review your application before submitting.</div>
        </aside>
      </div>
    </div>
  );
}
