"use client";

import React, { useState } from "react";
import { MarketingNavbar } from "@/components/marketing/Navbar";
import { MarketingFooter } from "@/components/marketing/Footer";
import { CTASection } from "@/components/marketing/CTASection";
import { WorkflowSection } from "@/components/marketing/WorkflowSection";
import {
  Users,
  Compass,
  FileCheck,
  BookOpen,
  Send,
  Award,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HowItWorksPage() {
  const [perspective, setPerspective] = useState<"agency" | "student">("agency");

  const agencySteps = [
    {
      step: "01",
      title: "Consolidated Lead Intake & Triage",
      desc: "Inquiries from your website form, WhatsApp click-to-chat, Facebook Lead Ads, and education fair registers automatically flow into the CRM. Set up automated assignment rules by country specialty or counselor workload.",
    },
    {
      step: "02",
      title: "Smart Course Matching & Shortlisting",
      desc: "Evaluate academic eligibility against entry requirements for 500+ universities. Filter by GPA cutoffs, English tests (IELTS/PTE), tuition budget, and post-study work rights.",
    },
    {
      step: "03",
      title: "Verification Vault & Checklist Audit",
      desc: "Document specialists inspect transcripts, English test report forms, and financial solvency letters. Flag corrections directly with inline notes before application submission.",
    },
    {
      step: "04",
      title: "Direct Application Dispatch & Offer Tracking",
      desc: "Track admissions progression across Kanban columns. Log conditional requirements, acceptances, tuition deposits, and CAS/COE issuance.",
    },
    {
      step: "05",
      title: "Embassy Visa File Prep & Commission Ledger",
      desc: "Generate destination-specific visa checklists, schedule biometrics appointments, and automatically record agency commission splits upon enrollment confirmation.",
    },
  ];

  const studentSteps = [
    {
      step: "01",
      title: "Personalized Applicant Portal Access",
      desc: "Log in to a distraction-free student portal. View your target degree programs, tuition costs, and your assigned senior counselor contact details.",
    },
    {
      step: "02",
      title: "One-Click Document Uploads",
      desc: "Upload scanned copies of your passport, transcripts, IELTS certificate, and financial solvency documents from any phone or desktop with instant verification status updates.",
    },
    {
      step: "03",
      title: "Real-Time Application Timeline",
      desc: "Watch your applications advance through each milestone: Dossier Verified → Submitted → Under Faculty Assessment → Offer Issued → CAS/COE Release.",
    },
    {
      step: "04",
      title: "Accept Offers & Prepare Visa Dossier",
      desc: "Download official offer letters, confirm seat acceptance, and follow step-by-step guidance for visa biometrics and medical examinations.",
    },
  ];

  const currentSteps = perspective === "agency" ? agencySteps : studentSteps;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-slate-900 text-white py-16 sm:py-24 text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3.5 py-1.5 rounded-full border border-teal-800">
              Interactive Workflow Lifecycle
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              How AbroadPath OS Powers Frictionless Admissions
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore the platform from both the agency team&apos;s operational perspective and the applicant&apos;s self-service experience.
            </p>

            {/* Toggle */}
            <div className="pt-6 flex justify-center">
              <div className="inline-flex p-1 rounded-2xl bg-slate-800 border border-slate-700">
                <button
                  onClick={() => setPerspective("agency")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    perspective === "agency"
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Agency & Counselor Perspective
                </button>
                <button
                  onClick={() => setPerspective("student")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    perspective === "student"
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Student & Applicant Perspective
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step by step list */}
        <div className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {currentSteps.map((item, idx) => (
            <div
              key={item.step}
              className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-6 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-indigo-700 text-white font-mono font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
                {item.step}
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual 8-stage journey */}
        <WorkflowSection />

        <CTASection />
      </main>

      <MarketingFooter />
    </div>
  );
}
