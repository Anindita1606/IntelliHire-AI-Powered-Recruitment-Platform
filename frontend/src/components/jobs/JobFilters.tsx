import { MapPin, Search, X } from "lucide-react";
import { Input } from "../common/Input";
import { cn } from "../../lib/utils";

interface JobFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  locations: string[];
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

export function JobFilters({
  search,
  onSearchChange,
  location,
  onLocationChange,
  locations,
  onReset,
  resultCount,
  totalCount,
}: JobFiltersProps) {
  const hasActiveFilters = search.trim().length > 0 || location !== "all";

  return (
    <div className="surface-card p-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or company…"
          leftIcon={<Search className="h-4 w-4" />}
          data-testid="job-search-input"
          aria-label="Search jobs"
        />
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <select
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            data-testid="job-location-filter"
            aria-label="Filter by location"
            className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-10 pr-8 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="all">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{resultCount}</span> of{" "}
          {totalCount} roles
        </p>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          data-testid="job-filter-reset"
          className={cn(
            "inline-flex items-center gap-1 text-sm font-medium transition-colors",
            hasActiveFilters
              ? "text-brand-600 hover:text-brand-700 dark:text-brand-400"
              : "cursor-not-allowed text-slate-300 dark:text-slate-600"
          )}
        >
          <X className="h-3.5 w-3.5" /> Clear filters
        </button>
      </div>
    </div>
  );
}
