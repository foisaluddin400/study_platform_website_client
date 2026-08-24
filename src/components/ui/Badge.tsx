import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "warning" | "error" | "info" | "purple" | "teal" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    error: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    outline: "bg-transparent text-slate-600 border-slate-300",
  };

  const dotColors = {
    neutral: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
    info: "bg-sky-500",
    purple: "bg-purple-500",
    teal: "bg-teal-500",
    outline: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  let variant: BadgeProps["variant"] = "neutral";

  switch (status) {
    // Success / positive
    case "Converted":
    case "Unconditional Offer":
    case "Approved":
    case "Completed":
    case "Paid":
    case "Active":
    case "Direct Partner":
      variant = "success";
      break;

    // Warning / In progress
    case "Conditional Offer":
    case "Under Review":
    case "Biometrics":
    case "Documents Pending":
    case "Correction Required":
    case "In Progress":
    case "Partial":
    case "Due":
    case "Expected":
    case "Aggregator Agreement":
      variant = "warning";
      break;

    // Info / New / Submitted
    case "New":
    case "Contacted":
    case "Counselling":
    case "Interested":
    case "Ready to Apply":
    case "Submitted":
    case "Document Preparation":
    case "Uploaded":
    case "Scheduled":
    case "Sub-Agent":
      variant = "info";
      break;

    // Error / Refused
    case "Lost":
    case "Rejected":
    case "Refused":
    case "Withdrawn":
    case "Cancelled":
    case "Overdue":
    case "Inactive":
      variant = "error";
      break;

    default:
      variant = "neutral";
  }

  return (
    <Badge variant={variant} dot size="sm" className={className}>
      {status}
    </Badge>
  );
}
