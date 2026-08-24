"use client";

import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface FunnelStage {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

interface PipelineFunnelChartProps {
  stagesData?: {
    Lead?: number;
    Counselling?: number;
    Documents?: number;
    Application?: number;
    Offer?: number;
    Visa?: number;
    Enrollment?: number;
  };
  conversionRate?: string;
}

export function PipelineFunnelChart({ stagesData, conversionRate }: PipelineFunnelChartProps) {
  const totalLeads = Math.max(stagesData?.Lead || 248, 1);

  const rawStages = [
    { name: "Total Leads", count: stagesData?.Lead ?? 248, color: "bg-slate-700" },
    { name: "Counselling", count: stagesData?.Counselling ?? 184, color: "bg-indigo-600" },
    { name: "Verified Dossiers", count: stagesData?.Documents ?? 122, color: "bg-sky-600" },
    { name: "Applications", count: stagesData?.Application ?? 86, color: "bg-teal-600" },
    { name: "Offers Received", count: stagesData?.Offer ?? 54, color: "bg-emerald-600" },
    { name: "Visa Approved", count: stagesData?.Visa ?? 28, color: "bg-amber-600" },
    { name: "Enrolled & Flying", count: stagesData?.Enrollment ?? 18, color: "bg-teal-500" },
  ];

  const stages: FunnelStage[] = rawStages.map((s) => ({
    ...s,
    percentage: Math.min(100, Math.max(8, Math.round((s.count / totalLeads) * 100))),
  }));

  return (
    <div className="space-y-3">
      {stages.map((stage, idx) => {
        const prevCount = idx > 0 ? Math.max(stages[idx - 1].count, 1) : stage.count;
        const dropoff = idx > 0 ? Math.round((stage.count / prevCount) * 100) : 100;

        return (
          <div key={stage.name} className="space-y-1 group">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-slate-800 font-semibold">{stage.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {idx > 0 && (
                  <span className="text-[11px] text-slate-400 font-normal">
                    {dropoff}% conversion from prev
                  </span>
                )}
                <span className="font-bold text-slate-900">{stage.count} students</span>
              </div>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${stage.color} rounded-full transition-all duration-500 group-hover:opacity-90`}
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Overall Funnel Efficiency: {conversionRate || "78%"}
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          Target Intake: Autumn 2027 <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
