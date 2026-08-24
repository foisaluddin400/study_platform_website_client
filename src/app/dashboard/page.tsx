"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import {
  Users,
  GraduationCap,
  Send,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Plus,
  Filter,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { MonthlyConversionChart } from "@/components/charts/MonthlyConversionChart";
import { PipelineFunnelChart } from "@/components/charts/PipelineFunnelChart";
import { CountryDistributionChart } from "@/components/charts/CountryDistributionChart";
import { RevenueBreakdownChart } from "@/components/charts/RevenueBreakdownChart";
import { analyticsApi, DashboardAnalyticsResponse } from "@/lib/api/analytics";

export default function DashboardHomePage() {
  const { role, currentUser } = useRole();
  const [selectedIntake, setSelectedIntake] = useState("Autumn 2027");
  const [dashboardData, setDashboardData] = useState<DashboardAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await analyticsApi.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.warn("Analytics API unavailable, using fallback mock stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const stats = dashboardData?.stats;
  const recentLeads = dashboardData?.recentLeads || [];
  const recentApps = dashboardData?.recentApplications || [];
  const urgentTasks = dashboardData?.recentTasks || [];
  const upcomingAppts = dashboardData?.upcomingAppointments || [];

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Agency Operations</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Executive Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Welcome back, {currentUser.name}
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200">
              {currentUser.roleTitle}
            </span>
          </h1>
        </div>

        {/* Filter bar & actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Intake:</span>
            <select
              value={selectedIntake}
              onChange={(e) => setSelectedIntake(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Autumn 2027">Autumn / Sept 2027</option>
              <option value="Spring 2028">Spring / Jan 2028</option>
              <option value="All">All Intakes</option>
            </select>
          </div>

          <Link href="/dashboard/leads">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Leads"
          value={stats?.totalLeads ?? 128}
          trend={{ value: 14.8, isPositive: true }}
          icon={<Users className="w-4 h-4" />}
          description="Across all channels"
          colorScheme="teal"
        />
        <StatCard
          title="Active Students"
          value={stats?.totalStudents ?? 42}
          trend={{ value: 8.4, isPositive: true }}
          icon={<GraduationCap className="w-4 h-4" />}
          description="In counselling & pipeline"
          colorScheme="indigo"
        />
        <StatCard
          title="Applications"
          value={stats?.activeApplications ?? 38}
          trend={{ value: 12.0, isPositive: true }}
          icon={<Send className="w-4 h-4" />}
          description="Submitted to universities"
          colorScheme="amber"
        />
        <StatCard
          title="Offers Received"
          value={stats?.totalOffers ?? 24}
          trend={{ value: 18.2, isPositive: true }}
          icon={<Award className="w-4 h-4" />}
          description="Conditional & Direct"
          colorScheme="emerald"
        />
        <StatCard
          title="Visas Approved"
          value={stats?.visaApproved ?? 19}
          trend={{ value: 10.5, isPositive: true }}
          icon={<Passport className="w-4 h-4" />}
          description="98.2% grant rate"
          colorScheme="purple"
        />
        <StatCard
          title="Conversion Rate"
          value={stats?.conversionRate ?? "78%"}
          trend={{ value: 3.1, isPositive: true }}
          icon={<TrendingUp className="w-4 h-4" />}
          description="Lead to enrollment"
          colorScheme="teal"
        />
      </div>

      {/* Middle Grid: Funnel & Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Pipeline Funnel (2 spans) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Applicant Journey Conversion Funnel
              </h2>
              <p className="text-xs text-slate-500">Live progression across all study abroad stages</p>
            </div>
            <Link
              href="/dashboard/students"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Pipeline View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <PipelineFunnelChart stagesData={dashboardData?.stages} conversionRate={stats?.conversionRate} />
        </div>

        {/* Destination Breakdown (1 span) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Top Study Destinations
              </h2>
              <p className="text-xs text-slate-500">Student enrollment distribution</p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
              Active
            </span>
          </div>
          <CountryDistributionChart />
        </div>
      </div>

      {/* Financial & Conversion Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Applications vs. Visa Approvals
              </h2>
              <p className="text-xs text-slate-500">Last 7 months performance</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              +18.4% YoY Growth
            </span>
          </div>
          <MonthlyConversionChart />
        </div>

        {/* Commission & Fee Revenue Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Financial Productivity
              </h2>
              <p className="text-xs text-slate-500">Revenue streams & conversion gauge</p>
            </div>
            <span className="text-[11px] font-bold text-teal-700 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200">
              Audited
            </span>
          </div>
          <RevenueBreakdownChart stats={stats} />
        </div>
      </div>

      {/* Bottom Operational Grid: Recent Leads, Applications & Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Latest Inbound Leads
            </h3>
            <Link href="/dashboard/leads" className="text-xs font-bold text-teal-700 hover:text-teal-800">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={lead.avatar} name={lead.name} size="sm" />
                  <div>
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-xs font-bold text-slate-900 hover:text-teal-700 block"
                    >
                      {lead.name}
                    </Link>
                    <span className="text-[11px] text-slate-500">
                      {lead.countryInterest?.[0]} • {lead.studyLevel}
                    </span>
                  </div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Live Application Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              Recent Applications
            </h3>
            <Link href="/dashboard/applications" className="text-xs font-bold text-teal-700 hover:text-teal-800">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {recentApps.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div className="space-y-0.5 max-w-[65%]">
                  <p className="text-xs font-bold text-slate-900 truncate">{app.studentName}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {app.universityName} • {app.courseName}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Counselor Priority Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Urgent Follow-ups & Tasks
            </h3>
            <Link href="/dashboard/tasks" className="text-xs font-bold text-teal-700 hover:text-teal-800">
              Task Board
            </Link>
          </div>

          <div className="space-y-3">
            {urgentTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{task.title}</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    {task.dueDate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{task.description}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                  <span>Student: <strong>{task.studentName || "Farhan Tanvir"}</strong></span>
                  <span>Assigned: {task.assignedTo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
