"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Percentage value between 0 and 100. */
  value?: number | null;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value ?? undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${Math.min(Math.max(value || 0, 0), 100)}%` }}
      />
    </div>
  )
);
Progress.displayName = "Progress";

export { Progress };