"use client";

import React from "react";
import { DollarSign, Award } from "lucide-react";

interface RevenueBreakdownChartProps {
  stats?: {
    totalRevenue?: number;
    expectedCommission?: number;
    receivedCommission?: number;
    conversionRate?: string;
  };
}

export function RevenueBreakdownChart({ stats }: RevenueBreakdownChartProps) {
  const commRevenue = stats?.receivedCommission ?? 184200;
  const studentFeeRevenue = stats?.totalRevenue ?? 48900;
  const productivity = stats?.conversionRate ? parseInt(stats.conversionRate, 10) : 68;

  return (
    <div className="space-y-4">
      {/* Circle / Radial Progress */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xs">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-teal-300 font-bold">
            Productivity Health
          </span>
          <div className="text-2xl font-bold mt-1">{productivity}%</div>
          <p className="text-[11px] text-slate-300 mt-1 max-w-[160px]">
            High agency conversion throughput this intake cycle.
          </p>
        </div>

        {/* Circular SVG gauge */}
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-700"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-teal-400"
              strokeDasharray={`${productivity}, 100`}
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            {productivity}%
          </div>
        </div>
      </div>

      {/* Stream breakdown cards */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
          <div className="flex items-center gap-1.5 text-teal-700 font-semibold mb-1">
            <Award className="w-3.5 h-3.5" /> University Comm.
          </div>
          <div className="text-sm font-bold text-slate-900">${commRevenue.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-medium">+14.2% YoY</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
          <div className="flex items-center gap-1.5 text-indigo-700 font-semibold mb-1">
            <DollarSign className="w-3.5 h-3.5" /> Student Fees
          </div>
          <div className="text-sm font-bold text-slate-900">${studentFeeRevenue.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-medium">+8.5% YoY</span>
        </div>
      </div>
    </div>
  );
}
