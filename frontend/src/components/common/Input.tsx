import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightSlot, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30",
              "dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
              leftIcon && "pl-10",
              rightSlot && "pr-11",
              error
                ? "border-red-400 dark:border-red-500/70"
                : "border-slate-300 dark:border-slate-700",
              className
            )}
            {...props}
          />
          {rightSlot && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</span>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
