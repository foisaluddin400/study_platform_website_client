"use client";

import React from "react";

interface CountryStat {
  country: string;
  count: number;
  share: number;
  flag: string;
  color: string;
}

interface CountryDistributionChartProps {
  countryData?: Array<{ _id: string; count: number }>;
}

export function CountryDistributionChart({ countryData }: CountryDistributionChartProps) {
  const flagMap: Record<string, { flag: string; color: string }> = {
    "United Kingdom": { flag: "🇬🇧", color: "bg-teal-500" },
    Canada: { flag: "🇨🇦", color: "bg-indigo-500" },
    Australia: { flag: "🇦🇺", color: "bg-sky-500" },
    Germany: { flag: "🇩🇪", color: "bg-amber-500" },
    Malaysia: { flag: "🇲🇾", color: "bg-emerald-500" },
    USA: { flag: "🇺🇸", color: "bg-rose-500" },
    "United States": { flag: "🇺🇸", color: "bg-rose-500" },
    Default: { flag: "🌐", color: "bg-slate-500" },
  };

  let data: CountryStat[];

  if (countryData && countryData.length > 0) {
    const total = countryData.reduce((acc, c) => acc + c.count, 0) || 1;
    data = countryData.map((c) => {
      const config = flagMap[c._id] || flagMap.Default;
      return {
        country: c._id || "Other",
        count: c.count,
        share: Math.round((c.count / total) * 100),
        flag: config.flag,
        color: config.color,
      };
    });
  } else {
    data = [
      { country: "United Kingdom", count: 98, share: 44, flag: "🇬🇧", color: "bg-teal-500" },
      { country: "Canada", count: 46, share: 21, flag: "🇨🇦", color: "bg-indigo-500" },
      { country: "Australia", count: 38, share: 17, flag: "🇦🇺", color: "bg-sky-500" },
      { country: "Germany", count: 24, share: 11, flag: "🇩🇪", color: "bg-amber-500" },
      { country: "Malaysia", count: 16, share: 7, flag: "🇲🇾", color: "bg-emerald-500" },
    ];
  }

  return (
    <div className="space-y-4">
      {/* Segmented multi-bar */}
      <div className="h-4 w-full rounded-xl overflow-hidden flex shadow-2xs">
        {data.map((item) => (
          <div
            key={item.country}
            className={`${item.color} h-full transition-all duration-300 hover:opacity-85 cursor-pointer`}
            style={{ width: `${Math.max(item.share, 4)}%` }}
            title={`${item.country}: ${item.count} applicants (${item.share}%)`}
          />
        ))}
      </div>

      {/* Breakdown list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {data.map((item) => (
          <div
            key={item.country}
            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{item.flag}</span>
              <span className="text-xs font-semibold text-slate-800">{item.country}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-900">{item.count}</span>
              <span className="text-[10px] text-slate-500 ml-1.5">({item.share}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
