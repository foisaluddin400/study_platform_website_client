"use client";

import React, { useState } from "react";
import { MarketingNavbar } from "@/components/marketing/Navbar";
import { MarketingFooter } from "@/components/marketing/Footer";
import { CTASection } from "@/components/marketing/CTASection";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { Tabs } from "@/components/ui/Tabs";
import {
  Users,
  GraduationCap,
  FileCheck,
  Building2,
  BookOpen,
  Search,
  Send,
  Award,
  CheckSquare,
  Calendar,
  CreditCard,
  Percent,
  BarChart3,
  UserCog,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All 19 Modules" },
    { id: "crm", label: "Lead & Student CRM" },
    { id: "admissions", label: "Admissions & Matching" },
    { id: "visa", label: "Documents & Visa Compliance" },
    { id: "business", label: "Finance, Commissions & BI" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-slate-900 text-white py-16 sm:py-24 text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3.5 py-1.5 rounded-full border border-teal-800">
              Complete Feature Suite
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Every Tool Your Consultancy Needs to Dominate Admissions
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Designed from the ground up for agency directors, senior counselors, visa compliance officers, and international students.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/register">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Claim Free Lifetime Access
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="white" size="md">
                  View Live Agency Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid Component */}
        <FeatureGrid />

        {/* Deep dive callout */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-teal-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs font-bold uppercase text-teal-300 tracking-wider">
                  Continuous Innovation
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold">
                  Want to see how these modules operate with your agency data?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Book a tailored 20-minute product tour with our senior solution architect. We will demonstrate custom intake workflows for UK, Canada, Australia, and European destinations.
                </p>
              </div>
              <Link href="/contact" className="shrink-0">
                <Button variant="white" size="lg">
                  Schedule Custom Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <CTASection />
      </main>

      <MarketingFooter />
    </div>
  );
}
