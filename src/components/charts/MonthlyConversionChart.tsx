"use client";

import React, { useState } from "react";

interface MonthlyPoint {
  period: string;
  applications: number;
  offers: number;
  revenueK: number;
}

export function MonthlyConversionChart() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const data: MonthlyPoint[] = [
    { period: "Jan 2026", applications: 32, offers: 18, revenueK: 14.2 },
    { period: "Feb 2026", applications: 45, offers: 24, revenueK: 19.8 },
    { period: "Mar 2026", applications: 58, offers: 32, revenueK: 26.5 },
    { period: "Apr 2026", applications: 42, offers: 28, revenueK: 21.0 },
    { period: "May 2026", applications: 68, offers: 44, revenueK: 35.4 },
    { period: "Jun 2026", applications: 84, offers: 56, revenueK: 48.0 },
    { period: "Jul 2026", applications: 96, offers: 68, revenueK: 58.2 },
    { period: "Aug 2026", applications: 112, offers: 82, revenueK: 72.5 },
  ];

  const maxVal = 120;

  return (
    <div className="space-y-4">
      {/* Legend & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs text-slate-500 font-medium">Total Pipeline Value</span>
          <div className="text-2xl font-bold text-slate-900">$295,600</div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-teal-600" />
            <span className="text-slate-600 font-medium">Applications</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-400" />
            <span className="text-slate-600 font-medium">Offers Issued</span>
          </div>
        </div>
      </div>

      {/* Stacked Chart Canvas */}
      <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100 relative">
        {data.map((item, idx) => {
          const appHeight = (item.applications / maxVal) * 100;
          const offerHeight = (item.offers / maxVal) * 100;
          const isHovered = activeIdx === idx;

          return (
            <div
              key={item.period}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-14 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none animate-in fade-in">
                  <div className="font-semibold text-teal-300">{item.period}</div>
                  <div>Apps: {item.applications} | Offers: {item.offers}</div>
                  <div className="text-amber-300 font-medium">Revenue: ${item.revenueK}k</div>
                </div>
              )}

              {/* Dual Bar Pair */}
              <div className="flex items-end gap-1 w-full max-w-[28px]">
                <div
                  className="w-1/2 bg-teal-600 rounded-t-sm transition-all duration-300 group-hover:bg-teal-500"
                  style={{ height: `${appHeight}%` }}
                />
                <div
                  className="w-1/2 bg-rose-400 rounded-t-sm transition-all duration-300 group-hover:bg-rose-300"
                  style={{ height: `${offerHeight}%` }}
                />
              </div>

              {/* Label */}
              <span className="text-[10px] text-slate-400 mt-2 font-medium truncate max-w-full">
                {item.period.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
