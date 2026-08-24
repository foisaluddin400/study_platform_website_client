"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Users,
  FileCheck,
  Send,
  Building2,
  Lock,
  Mail,
  Loader2,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { Button } from "@/components/ui/Button";

export default function FreeAccessPage() {
  const router = useRouter();
  const { currentUser, activateFreeAccess, logout } = useRole();
  const [activating, setActivating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleActivate = async () => {
    setActivating(true);
    setErrorMsg(null);
    try {
      await activateFreeAccess();
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to activate Free Access. Please try again.");
    } finally {
      setActivating(false);
    }
  };

  const featureList = [
    {
      icon: <GraduationCap className="w-5 h-5 text-teal-600" />,
      title: "Unlimited Students & Lead CRM",
      desc: "Manage prospective applicant pipelines, student profiles, academic transcripts, and stages with zero limits.",
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      title: "Full Team & Counselor Seats",
      desc: "Invite all your branch counselors and document reviewers with secure role permissions and automated email invites.",
    },
    {
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
      title: "Document Vault & 28-Day Audit",
      desc: "Cloud storage for passports, bank statements, SOPs, and compliance checks with instant preview.",
    },
    {
      icon: <Building2 className="w-5 h-5 text-blue-600" />,
      title: "Global University Directory",
      desc: "Direct course matcher, intake timelines, entry requirements, and fee structures for top destination countries.",
    },
    {
      icon: <Passport className="w-5 h-5 text-purple-600" />,
      title: "Visa Dossier & Biometrics Desk",
      desc: "Pre-departure checklist, embassy appointment tracker, CAS/i20 verification, and compliance status.",
    },
    {
      icon: <Mail className="w-5 h-5 text-rose-600" />,
      title: "Automated Student & Staff Email System",
      desc: "Live Nodemailer email engine sending credentials, onboarding packages, and milestone notifications.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 px-6 sm:px-12 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-lg text-white">AbroadPath OS</span>
            <span className="block text-[11px] text-teal-400 -mt-0.5">Agency Workspace Activation</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Signed in as <strong className="text-slate-200">{currentUser?.email}</strong>
          </span>
          <button
            onClick={() => logout()}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Activation Card Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-700/80 text-teal-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Single Plan • Zero Subscription Fees</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Free Access — Lifetime
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to your agency operating system. We believe education consultancies shouldn&apos;t be held back by subscription limits. Activate your lifetime free license below to enter your workspace.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-xs sm:text-sm text-rose-300 text-center font-medium max-w-xl mx-auto">
            {errorMsg}
          </div>
        )}

        {/* Feature Grid Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                Included Workspace Features
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Full Platform Capabilities Unlocked Forever
              </h2>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Agency Owner License</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center gap-1.5 text-[11px] text-teal-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Unlimited & Free</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button Bar */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              <span>No credit card required. No hidden fees. Complete agency data isolation.</span>
            </div>

            <button
              onClick={handleActivate}
              disabled={activating}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {activating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Activating Workspace...</span>
                </>
              ) : (
                <>
                  <span>Activate Free Access — Lifetime</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500 z-10">
        AbroadPath OS &copy; {new Date().getFullYear()} • Secure Multi-Tenant Study Abroad Operating System
      </footer>
    </div>
  );
}
