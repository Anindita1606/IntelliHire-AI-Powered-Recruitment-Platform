import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Plus } from "lucide-react";
import { useJobs } from "../hooks/useJobs";
import { useAuth } from "../context/AuthContext";
import { JobCard } from "../components/jobs/JobCard";
import { JobCardSkeleton } from "../components/jobs/JobCardSkeleton";
import { JobFilters } from "../components/jobs/JobFilters";
import { EmptyState, ErrorState } from "../components/common/StateViews";
import { Button } from "../components/common/Button";
import { toApiError } from "../lib/errors";

export default function Jobs() {
  const { data: jobs, isLoading, isError, error, refetch, isFetching } = useJobs();
  const { isAuthenticated } = useAuth();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");

  const locations = useMemo(() => {
    const set = new Set<string>();
    (jobs ?? []).forEach((j) => j.location && set.add(j.location));
    return Array.from(set).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (jobs ?? []).filter((job) => {
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q);
      const matchesLocation = location === "all" || job.location === location;
      return matchesSearch && matchesLocation;
    });
  }, [jobs, search, location]);

  const resetFilters = () => {
    setSearch("");
    setLocation("all");
  };

  return (
    <div className="container-page py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Open positions</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
            Browse jobs
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Live roles served directly from your Spring Boot backend.
          </p>
        </div>
        {isAuthenticated && (
          <Link to="/jobs/new">
            <Button data-testid="jobs-post-job-button">
              <Plus className="h-4 w-4" /> Post a job
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-8">
        {!isError && (
          <JobFilters
            search={search}
            onSearchChange={setSearch}
            location={location}
            onLocationChange={setLocation}
            locations={locations}
            onReset={resetFilters}
            resultCount={filtered.length}
            totalCount={jobs?.length ?? 0}
          />
        )}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Couldn't load jobs"
            message={toApiError(error).message}
            onRetry={() => refetch()}
            testId="jobs-error-state"
          />
        ) : filtered.length === 0 ? (
          (jobs?.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="No jobs posted yet"
              message="Once your backend has published openings, they'll appear here in real time."
              testId="jobs-empty-state"
              action={
                isAuthenticated ? (
                  <Link to="/jobs/new">
                    <Button size="sm">
                      <Plus className="h-4 w-4" /> Post the first opening
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="sm" variant="outline">
                      Sign in to post a job
                    </Button>
                  </Link>
                )
              }
            />
          ) : (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="No jobs match your filters"
              message="Try adjusting your search terms or clearing the location filter."
              testId="jobs-no-match-state"
              action={
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  Clear filters
                </Button>
              }
            />
          )
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {isFetching && !isLoading && (
        <p className="mt-6 text-center text-xs text-slate-400">Refreshing…</p>
      )}
    </div>
  );
}
