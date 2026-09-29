import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LogOut, Menu, Plus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "./Logo";
import { ThemeToggle } from "../common/ThemeToggle";
import { Button } from "../common/Button";
import { cn } from "../../lib/utils";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  );

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-[#090D16]/85">
      <div className="container-page flex h-16 items-center justify-between">

        {/* Logo + Desktop Navigation */}
        <div className="flex items-center gap-8">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink
              to="/jobs"
              className={navClass}
              data-testid="nav-jobs-link"
            >
              Jobs
            </NavLink>

            {user && (
              <NavLink
                to={user.role === "EMPLOYER" ? "/recruiter" : user.role === "ADMIN" ? "/admin" : "/candidate"}
                className={navClass}
                data-testid="nav-dashboard-link"
              >
                Dashboard
              </NavLink>
            )}

            {user?.role === "EMPLOYER" && (
              <NavLink
                to="/jobs/new"
                className={navClass}
                data-testid="nav-post-job-link"
              >
                Post a Job
              </NavLink>
            )}
          </nav>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* Logged-in User */}
              {user && (
                <div
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                  data-testid="nav-user-info"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden lg:block">
                    <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="max-w-[150px] truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Post Job */}
              {user?.role === "EMPLOYER" && <Link to="/jobs/new">
                <Button
                  size="sm"
                  variant="subtle"
                  data-testid="nav-post-job-cta"
                >
                  <Plus className="h-4 w-4" />
                  Post a Job
                </Button>
              </Link>}

              {/* Logout */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => logout()}
                data-testid="nav-logout-button"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              {/* Not Logged In */}
              <Link to="/login">
                <Button
                  size="sm"
                  variant="ghost"
                  data-testid="nav-login-link"
                >
                  Sign in
                </Button>
              </Link>

              <Link to="/register">
                <Button
                  size="sm"
                  data-testid="nav-register-link"
                >
                  Create account
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            data-testid="mobile-menu-toggle"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden dark:border-slate-800 dark:bg-[#090D16]">
          <nav className="flex flex-col gap-1">

            <NavLink
              to="/jobs"
              className={navClass}
              data-testid="mobile-nav-jobs-link"
            >
              Jobs
            </NavLink>

            {isAuthenticated ? (
              <>
                {/* Mobile User Info */}
                {user && (
                  <div
                    className="my-2 flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700"
                    data-testid="mobile-nav-user-info"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {user && (
                  <NavLink
                    to={user.role === "EMPLOYER" ? "/recruiter" : user.role === "ADMIN" ? "/admin" : "/candidate"}
                    className={navClass}
                    data-testid="mobile-nav-dashboard-link"
                  >
                    Dashboard
                  </NavLink>
                )}

                {user?.role === "EMPLOYER" && (
                  <NavLink
                    to="/jobs/new"
                    className={navClass}
                    data-testid="mobile-nav-post-job-link"
                  >
                    Post a Job
                  </NavLink>
                )}

                {/* Mobile Logout */}
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => logout()}
                  data-testid="mobile-nav-logout-button"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full"
                    data-testid="mobile-nav-login-link"
                  >
                    Sign in
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    className="w-full"
                    data-testid="mobile-nav-register-link"
                  >
                    Create account
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
