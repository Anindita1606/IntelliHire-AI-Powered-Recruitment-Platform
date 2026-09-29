import type { ReactNode } from "react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "./Button";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  testId = "error-state",
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className="surface-card flex flex-col items-center gap-4 px-6 py-14 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} data-testid="error-retry-button">
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  icon,
  action,
  testId = "empty-state",
}: {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className="surface-card flex flex-col items-center gap-4 px-6 py-16 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {icon ?? <Inbox className="h-6 w-6" />}
      </span>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
      {action}
    </div>
  );
}
