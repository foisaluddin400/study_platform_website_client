"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Calendar,
  Users,
  Award,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { MonthlyConversionChart } from "@/components/charts/MonthlyConversionChart";
import { PipelineFunnelChart } from "@/components/charts/PipelineFunnelChart";
import { CountryDistributionChart } from "@/components/charts/CountryDistributionChart";
import { RevenueBreakdownChart } from "@/components/charts/RevenueBreakdownChart";
import { Avatar } from "@/components/ui/Avatar";
import { analyticsApi, ReportsAnalyticsResponse } from "@/lib/api/analytics";

export default function ReportsPage() {
  const [selectedRange, setSelectedRange] = useState("Year to Date (2026)");
  const [reportsData, setReportsData] = useState<ReportsAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await analyticsApi.getReports();
        setReportsData(data);
      } catch (err) {
        console.warn("Using fallback reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const counselors = reportsData?.counselorStats || [
    {
      id: "1",
      name: "Marcus Holloway",
      role: "Senior Lead Counselor",
      assignedStudents: 18,
      activeApplications: 14,
      visasApproved: 9,
      conversionRate: "88%",
    },
    {
      id: "2",
      name: "Sophia Chen",
      role: "Senior Counselor",
      assignedStudents: 14,
      activeApplications: 11,
      visasApproved: 6,
      conversionRate: "82%",
    },
    {
      id: "3",
      name: "David Kimani",
      role: "Visa Specialist",
      assignedStudents: 10,
      activeApplications: 8,
      visasApproved: 4,
      conversionRate: "79%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Executive Intelligence</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Analytics & Reporting</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Agency Performance & Conversion Intelligence
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="Year to Date (2026)">Year to Date (2026)</option>
            <option value="Autumn 2027 Cohort">Autumn 2027 Cohort</option>
            <option value="Last 12 Months">Last 12 Months</option>
          </select>

          <Button variant="primary" size="xs" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Export Executive PDF Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Conversion Ratio"
          value="78.4%"
          trend={{ value: 4.2, isPositive: true }}
          icon={<Users className="w-4 h-4" />}
          colorScheme="teal"
        />
        <StatCard
          title="Offer Acceptance"
          value="91.6%"
          trend={{ value: 2.1, isPositive: true }}
          icon={<Award className="w-4 h-4" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Visa Approval Rate"
          value="98.2%"
          trend={{ value: 0.8, isPositive: true }}
          icon={<Passport className="w-4 h-4" />}
          colorScheme="indigo"
        />
        <StatCard
          title="Avg. Dossier Value"
          value="$4,250"
          trend={{ value: 12.5, isPositive: true }}
          icon={<DollarSign className="w-4 h-4" />}
          colorScheme="purple"
        />
      </div>

      {/* Row 1: Conversion Trend + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Monthly Pipeline Velocity</h3>
          <MonthlyConversionChart />
        </div>
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Revenue Breakdown</h3>
          <RevenueBreakdownChart />
        </div>
      </div>

      {/* Row 2: Destination Markets + Counselor Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Market Share by Destination</h3>
              <p className="text-xs text-slate-500">Applications by country</p>
            </div>
          </div>
          <CountryDistributionChart />
        </div>

        {/* Counselor Leaderboard */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Counselor Performance Leaderboard</h3>
              <p className="text-xs text-slate-500">Caseload conversion and active dossiers</p>
            </div>
            <Link href="/dashboard/team" className="text-xs font-semibold text-teal-700">
              View Team
            </Link>
          </div>

          <div className="space-y-3">
            {counselors.map((member, idx) => (
              <div
                key={member.id || idx}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <Avatar name={member.name} size="sm" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{member.name}</h4>
                    <p className="text-[10px] text-slate-500">{member.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-teal-700 text-xs">{member.conversionRate || "85%"} Conversion</span>
                  <p className="text-[10px] text-slate-400">{member.assignedStudents || 0} Active Dossiers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
