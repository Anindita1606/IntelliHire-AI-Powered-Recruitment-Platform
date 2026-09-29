export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
