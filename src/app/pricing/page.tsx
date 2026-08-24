"use client";

import React from "react";
import { MarketingNavbar } from "@/components/marketing/Navbar";
import { MarketingFooter } from "@/components/marketing/Footer";
import { PricingTable } from "@/components/marketing/PricingTable";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { CheckCircle2, Sparkles, ShieldCheck, Zap, Database, Globe2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PricingPage() {
  const pillars = [
    {
      title: "Capacity & Scale",
      desc: "Unlimited student records, counselor accounts, and document storage with multi-branch management support.",
    },
    {
      title: "Admissions & University Matcher",
      desc: "500+ global university directory, course shortlisting engine, and stage-by-stage Kanban tracking.",
    },
    {
      title: "Compliance & Visa Desk",
      desc: "Country-specific visa checklists, 28-day financial audit tools, and biometrics appointment scheduler.",
    },
    {
      title: "Student Experience & Invoicing",
      desc: "Integrated applicant portal, tuition & service fee tracking, commission splits, and automated emails.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-[#0b132b] text-white py-16 sm:py-24 text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3.5 py-1.5 rounded-full border border-teal-800">
              Free Access — Lifetime
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Every Powerful Tool. 100% Free Forever.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We empower education agencies worldwide by eliminating expensive software barriers. Access the entire consultancy operating system with zero subscription costs.
            </p>
          </div>
        </div>

        {/* Pricing Table Component */}
        <PricingTable />

        {/* 4 Pillars Section */}
        <div className="py-16 sm:py-20 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Built For Modern Consultancies
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Everything you need to run, scale, and automate your study abroad operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FAQSection />
        <CTASection />
      </main>

      <MarketingFooter />
    </div>
  );
}
