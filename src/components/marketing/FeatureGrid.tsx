import React from "react";
import {
  Users,
  GraduationCap,
  FileCheck,
  Building2,
  BookOpen,
  Search,
  CheckSquare,
  Send,
  Award,
  Calendar,
  CreditCard,
  Percent,
  BarChart3,
  UserCog,
  MessageSquare,
  Bell,
  Layers,
  Sparkles,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";

export function FeatureGrid() {
  const features = [
    {
      icon: <Users className="w-5 h-5 text-teal-600" />,
      title: "Lead CRM & Intake Pipeline",
      desc: "Capture website inquiries and expo leads. Segment by study level, target country, and assign directly to counselors.",
      category: "Admissions CRM",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      title: "Comprehensive Student Dossier",
      desc: "Complete 10-tab student profiles with academic history, IELTS scores, sponsor funds, and live milestone progress.",
      category: "Student Records",
    },
    {
      icon: <FileCheck className="w-5 h-5 text-sky-600" />,
      title: "Document Verification Vault",
      desc: "Pre-screen passports, transcripts, and financial certificates with audit notes, correction requests, and instant preview.",
      category: "Compliance",
    },
    {
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      title: "Global University Directory",
      desc: "Maintain partner institution contracts, direct agent agreements, entry criteria, tuition ranges, and intake dates.",
      category: "Partnerships",
    },
    {
      icon: <Search className="w-5 h-5 text-amber-600" />,
      title: "Intelligent Course Finder & Matcher",
      desc: "Match student profiles against 10,000+ degree programs by GPA, English level, budget, and intake eligibility.",
      category: "Advisory",
    },
    {
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      title: "Shortlist Comparison Matrix",
      desc: "Compare shortlisted university programs side-by-side on tuition, entry requirements, living costs, and deadlines.",
      category: "Advisory",
    },
    {
      icon: <Send className="w-5 h-5 text-teal-600" />,
      title: "Kanban Application Tracker",
      desc: "Visual drag-ready board tracking applications from draft and submission to university review and decision.",
      category: "Admissions CRM",
    },
    {
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      title: "Offer Letter & Deposit Desk",
      desc: "Manage conditional/unconditional offers, deposit countdown deadlines, and track student acceptances in real-time.",
      category: "Admissions CRM",
    },
    {
      icon: <Passport className="w-5 h-5 text-rose-600" />,
      title: "Embassy Visa Case Room",
      desc: "Destination-specific visa checklists (UK CAS, Australia COE, 28-day financial statement audit, biometrics slots).",
      category: "Compliance",
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-indigo-600" />,
      title: "Counselor Task & Follow-up Board",
      desc: "Prioritized tasks, urgent due-date reminders, and student follow-up triggers across phone, email, and meeting.",
      category: "Productivity",
    },
    {
      icon: <Calendar className="w-5 h-5 text-sky-600" />,
      title: "Appointment & Video Scheduler",
      desc: "Book 1-on-1 counseling, document audits, and visa consultation slots with Zoom and Google Meet integration.",
      category: "Productivity",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-amber-600" />,
      title: "Payment & Invoice Tracking",
      desc: "Track consultancy service fees, university application fees, and visa processing charges with receipt logs.",
      category: "Finance",
    },
    {
      icon: <Percent className="w-5 h-5 text-purple-600" />,
      title: "University Commission Ledger",
      desc: "Admin-only module calculating expected partner commissions, agency splits, and counselor performance incentives.",
      category: "Finance",
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-teal-600" />,
      title: "Executive BI Analytics & Reports",
      desc: "Conversion funnels, lead source attribution, revenue trends, destination breakdown, and counselor leaderboards.",
      category: "Executive",
    },
    {
      icon: <UserCog className="w-5 h-5 text-slate-700" />,
      title: "Multi-Branch Team Management",
      desc: "Manage counselors, visa officers, and branch managers with granular role-based permissions across global offices.",
      category: "Executive",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      title: "Dedicated Student Portal",
      desc: "A clean, self-service applicant portal where students upload documents, track application milestones, and view offers.",
      category: "Student Experience",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Enterprise Module Suite
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered Specifically for High-Volume Education Agencies
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Every feature is designed around the real, day-to-day operations of modern international study abroad consultancies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {f.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {f.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-teal-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
