"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning" | "white";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow focus:ring-teal-500",
      secondary:
        "bg-slate-800 hover:bg-slate-900 text-white shadow-sm focus:ring-slate-700",
      outline:
        "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:text-slate-900 focus:ring-teal-500",
      ghost:
        "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus:ring-slate-400",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500",
      success:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500",
      warning:
        "bg-amber-600 hover:bg-amber-700 text-white shadow-sm focus:ring-amber-500",
      white:
        "bg-white hover:bg-slate-50 text-slate-900 shadow-xs border border-slate-200/60 focus:ring-slate-300",
    };

    const sizeStyles = {
      xs: "text-xs px-2.5 py-1 gap-1.5",
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-5 py-2.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
