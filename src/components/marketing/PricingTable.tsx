"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PricingTable() {
  const lifetimeFeatures = [
    "Unlimited Team Counselor & Staff Accounts",
    "Unlimited Active Student Profiles & CRM Pipeline",
    "Kanban Application Tracker & Stage Automations",
    "Global University & Course Matcher (500+ Institutions)",
    "Secure Document Vault & 28-Day Financial Statement Auditor",
    "Embassy Visa Dossier & Biometrics Scheduler",
    "Dedicated Self-Service Student Applicant Portal",
    "Agency Invoicing & Commission Management Ledgers",
    "Automated Nodemailer Email Dispatch for Onboarding & Updates",
    "Multi-Branch Architecture & Role Permissions",
    "Executive BI Analytics & CSV Data Export",
    "Enterprise-Grade Multi-Tenant Data Isolation",
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Single Plan • 100% Free
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Free Access — Lifetime
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Every feature unlocked forever. Zero monthly subscription fees, zero setup charges, and unlimited agency scaling.
          </p>
        </div>

        {/* Single Lifetime Free Card */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl border-2 border-teal-500 bg-white p-8 sm:p-12 shadow-xl ring-4 ring-teal-500/10 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> All-Inclusive Agency License
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Lifetime Free Access</h3>
                <p className="text-xs text-slate-500 mt-1">Complete operating system for modern study abroad consultancies.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-950">$0</span>
                <span className="text-xs text-slate-500 font-semibold">/ forever</span>
              </div>
            </div>

            <div className="my-8">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Everything Included In Your Workspace:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {lifetimeFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                <span>No credit card required. Instant workspace setup in 2 minutes.</span>
              </div>

              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Claim Lifetime Free Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
