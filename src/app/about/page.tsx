"use client";

import React from "react";
import { MarketingNavbar } from "@/components/marketing/Navbar";
import { MarketingFooter } from "@/components/marketing/Footer";
import { CTASection } from "@/components/marketing/CTASection";
import { ShieldCheck, Award, Globe, Users, HeartHandshake, Building2, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

export default function AboutPage() {
  const leadership = [
    {
      name: "Dr. Alistair Sterling",
      role: "Co-Founder & Chief Executive Officer",
      bio: "Former International Admissions Director at UK Russell Group university with 18+ years across global student mobility.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Meera Chandrasekhar",
      role: "Co-Founder & Chief Product Officer",
      bio: "Former Head of EdTech Product at Silicon Valley SaaS firm, passionate about building frictionless cross-border education software.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Julian Vance",
      role: "VP of Global Institutional Partnerships",
      bio: "Directly oversees relations with 500+ university partners across UK, Canada, Australia, and Continental Europe.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    },
  ];

  const stats = [
    { value: "500+", label: "University Partners" },
    { value: "140,000+", label: "Students Processed" },
    { value: "98.4%", label: "Visa Compliance Rate" },
    { value: "32 Countries", label: "Agency Reach" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-slate-900 text-white py-16 sm:py-24 text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3.5 py-1.5 rounded-full border border-teal-800">
              Our Mission
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Democratizing Global Education Through Modern Software
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We build high-trust software that empowers study abroad agencies, universities, and students to navigate international admissions with absolute clarity and zero friction.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="py-12 bg-teal-900 text-white border-y border-teal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-mono">
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm text-teal-100 font-medium mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              The Journey
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Built by Education Veterans for Modern Consultancies
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              For over a decade, education agencies have relied on generic CRM tools built for real estate or car sales. These tools have no native understanding of CAS letters, 28-day financial holding rules, IELTS TRF authentications, or multi-tier university commissions.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              AbroadPath OS was born to give education consultancies an operating system engineered specifically for international admissions.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Uncompromising Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe preventing visa errors through strict document verification is the highest duty of any education consultancy.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Transparency First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear commission records, predictable agency splits, and realtime student milestone tracking foster long-term trust.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Global Reach, Local Depth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Purpose-built modules tailored to immigration requirements in the UK, Canada, Australia, Germany, and beyond.
              </p>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="pt-12">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-extrabold text-slate-900">Executive Leadership</h3>
              <p className="text-xs text-slate-500 mt-1">
                Guided by seasoned leaders in international higher education
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leadership.map((l) => (
                <div
                  key={l.name}
                  className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs text-center space-y-3"
                >
                  <Avatar src={l.avatar} name={l.name} size="xl" className="mx-auto" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{l.name}</h4>
                    <p className="text-xs text-teal-700 font-medium">{l.role}</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{l.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CTASection />
      </main>

      <MarketingFooter />
    </div>
  );
}
