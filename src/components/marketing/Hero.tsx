"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Send,
  Award,
  GraduationCap,
  Eye,
  FileCheck,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { PipelineFunnelChart } from "@/components/charts/PipelineFunnelChart";
import { MonthlyConversionChart } from "@/components/charts/MonthlyConversionChart";
import { mockStudents, mockApplications } from "@/data/mockData";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

export function MarketingHero() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "documents" | "student" | "visa">("pipeline");

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-radial from-teal-50/40 via-white to-slate-50">
      {/* Background glow & grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            <span>The All-In-One SaaS Operating System for Study Abroad Agencies</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mt-6 space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
            Manage Your Entire Study Abroad Consultancy in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">
              One Unified Place.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Manage students, documents, university applications, offers, visa cases, follow-ups, and partner commissions from a single powerful platform.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/register">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Claim Free Lifetime Access
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Book a Live Demo
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="white" leftIcon={<Eye className="w-4 h-4 text-teal-600" />}>
                Explore Live App
              </Button>
            </Link>
          </div>

          {/* Trust bullet points */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" /> Free Access — Lifetime
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" /> Unlimited students & staff
            </span>
          </div>
        </div>

        {/* Realistic Interactive Dashboard Mockup Showcase */}
        <div className="mt-14 max-w-6xl mx-auto">
          <div className="rounded-3xl border border-slate-300/80 bg-slate-900/95 p-2 sm:p-3 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-800">
            {/* Mock browser header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-slate-300 font-mono text-[11px]">app.abroadpath.com/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 text-[10px] font-bold border border-teal-700/50">
                  Live Interactive Mockup
                </span>
              </div>
            </div>

            {/* Mockup subheader tabs */}
            <div className="bg-[#0b132b] px-4 py-2.5 flex items-center justify-between border-b border-[#1a233f] overflow-x-auto">
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setActiveTab("pipeline")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "pipeline"
                      ? "bg-teal-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Agency Pipeline & KPIs
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "documents"
                      ? "bg-teal-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Document Verification Desk
                </button>
                <button
                  onClick={() => setActiveTab("student")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "student"
                      ? "bg-teal-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Student Portal View
                </button>
                <button
                  onClick={() => setActiveTab("visa")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "visa"
                      ? "bg-teal-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Visa Readiness Center
                </button>
              </div>

              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-semibold"
              >
                Launch Full App <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Mock Dashboard Body */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-b-2xl min-h-[460px] text-slate-900">
              {activeTab === "pipeline" && (
                <div className="space-y-5 animate-in fade-in">
                  {/* KPI Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard
                      title="Total Leads"
                      value="248"
                      change="+12.4%"
                      icon={<Users className="w-4 h-4 text-teal-600" />}
                      comparisonText="38 added this week"
                    />
                    <StatCard
                      title="Active Students"
                      value="86"
                      change="+8.7%"
                      icon={<GraduationCap className="w-4 h-4 text-indigo-600" />}
                      badgeColor="indigo"
                      comparisonText="In counselling/docs"
                    />
                    <StatCard
                      title="Offers Received"
                      value="31"
                      change="+15.2%"
                      icon={<Award className="w-4 h-4 text-emerald-600" />}
                      badgeColor="emerald"
                      comparisonText="Autumn 2027 intake"
                    />
                    <StatCard
                      title="Visa Cases"
                      value="18"
                      change="+94% rate"
                      icon={<Passport className="w-4 h-4 text-amber-600" />}
                      badgeColor="amber"
                      comparisonText="12 fully enrolled"
                    />
                  </div>

                  {/* Dual Chart Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">
                            Application & Offer Velocity
                          </h4>
                          <p className="text-xs text-slate-500">
                            Monthly submitted files vs issued offers
                          </p>
                        </div>
                      </div>
                      <MonthlyConversionChart />
                    </div>

                    <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">
                            Student Journey Funnel
                          </h4>
                          <p className="text-xs text-slate-500">
                            End-to-end conversion attrition
                          </p>
                        </div>
                      </div>
                      <PipelineFunnelChart />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">
                        Verification Vault & Checklist
                      </h4>
                      <p className="text-xs text-slate-500">
                        Zero missing documents before university submission
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200">
                      8 Documents Pending Review
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">BSc Official Transcript</p>
                          <p className="text-[11px] text-slate-500">Farhan Tanvir • BRAC University</p>
                        </div>
                      </div>
                      <StatusBadge status="Approved" />
                    </div>

                    <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Police Clearance Certificate</p>
                          <p className="text-[11px] text-slate-500">Farhan Tanvir • Resubmitted today</p>
                        </div>
                      </div>
                      <StatusBadge status="Correction Required" />
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">IELTS TRF (Score: 8.0)</p>
                          <p className="text-[11px] text-slate-500">Zoya Al-Mansoor • British Council</p>
                        </div>
                      </div>
                      <StatusBadge status="Approved" />
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Bank Solvency & 28-day Statement</p>
                          <p className="text-[11px] text-slate-500">Standard Chartered Bank • Father Sponsor</p>
                        </div>
                      </div>
                      <StatusBadge status="Under Review" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "student" && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-teal-700 to-indigo-800 text-white">
                    <div>
                      <p className="text-xs text-teal-200">Student Portal (Farhan Tanvir)</p>
                      <h4 className="text-lg font-bold">Your Application is Progressing Smoothly</h4>
                      <p className="text-xs text-teal-100 mt-0.5">Current Stage: Offer Received (82% Complete)</p>
                    </div>
                    <Link href="/student">
                      <Button variant="white" size="xs">
                        Open Student Portal
                      </Button>
                    </Link>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-teal-700 shadow-2xs border">
                        UoM
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">MSc Advanced Computer Science with AI</p>
                        <p className="text-[11px] text-slate-500">University of Manchester • Conditional Offer</p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Offer Letter Ready
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "visa" && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">
                        Embassy Visa Dossier & Compliance Tracker
                      </h4>
                      <p className="text-xs text-slate-500">
                        Country-specific rule checklists (UKVI, ImmiAccount, IRCC)
                      </p>
                    </div>
                    <StatusBadge status="Biometrics" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Target Country</span>
                      <p className="font-bold text-slate-900 mt-1">United Kingdom (Student Route)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Financial Requirement</span>
                      <p className="font-bold text-slate-900 mt-1">£28,500 continuous balance (28 days)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Biometrics Slot</span>
                      <p className="font-bold text-teal-700 mt-1">Confirmed at VFS Global Hub</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
