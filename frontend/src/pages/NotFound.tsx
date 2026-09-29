import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
        <Compass className="h-8 w-8" />
      </span>
      <p className="mt-6 font-display text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
        404
      </p>
      <h1 className="mt-2 text-xl font-semibold text-slate-800 dark:text-slate-200">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/">
          <Button variant="outline">Go home</Button>
        </Link>
        <Link to="/jobs">
          <Button>Browse jobs</Button>
        </Link>
      </div>
    </div>
  );
}
