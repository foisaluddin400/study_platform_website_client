import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  isPositive?: boolean;
  comparisonText?: string;
  description?: string;
  className?: string;
  badgeColor?: "teal" | "indigo" | "amber" | "rose" | "emerald" | "purple";
  colorScheme?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  isPositive = true,
  comparisonText,
  description,
  className,
  badgeColor = "teal",
  colorScheme,
  trend,
  onClick,
}: StatCardProps) {
  const effectiveColor = (colorScheme || badgeColor) as string;

  const badgeColorStyles: Record<string, string> = {
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };

  const activeChange = change || (trend ? `${trend.isPositive ? "+" : ""}${trend.value}%` : undefined);
  const activeIsPositive = trend ? trend.isPositive : isPositive;
  const subtitle = description || comparisonText;

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between group",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs transition-transform group-hover:scale-105",
                badgeColorStyles[effectiveColor] || badgeColorStyles.teal
              )}
            >
              {icon}
            </div>
          )}
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <button
          type="button"
          className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
        {activeChange && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border",
              activeIsPositive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            )}
          >
            {activeIsPositive ? (
              <TrendingUp className="w-3 h-3 text-emerald-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-rose-600" />
            )}
            {activeChange}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
