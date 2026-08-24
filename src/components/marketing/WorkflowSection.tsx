import React from "react";
import {
  UserPlus,
  Compass,
  FileCheck,
  BookOpen,
  Send,
  Award,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";

export function WorkflowSection() {
  const steps = [
    {
      num: "01",
      title: "Lead Capture",
      desc: "Collect and auto-assign inquiries from your website, social ads, walk-ins, and education expos.",
      icon: <UserPlus className="w-5 h-5 text-teal-600" />,
    },
    {
      num: "02",
      title: "Counselling",
      desc: "Conduct structured assessment of student GPA, IELTS, budget, and destination preferences.",
      icon: <Compass className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: "03",
      title: "Profile & Docs",
      desc: "Build verified student dossiers in the Document Vault with automatic quality verification.",
      icon: <FileCheck className="w-5 h-5 text-sky-600" />,
    },
    {
      num: "04",
      title: "Shortlisting",
      desc: "Match students to ideal courses with our Course Matcher and side-by-side comparison matrix.",
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
    },
    {
      num: "05",
      title: "Application",
      desc: "Submit dossiers directly to partner universities and track real-time admissions status on Kanban.",
      icon: <Send className="w-5 h-5 text-teal-600" />,
    },
    {
      num: "06",
      title: "Offer Letters",
      desc: "Receive conditional/unconditional offers, log tuition deposits, and track student acceptances.",
      icon: <Award className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: "07",
      title: "Visa Filing",
      desc: "Manage country-specific embassy checklists (CAS, COE, 28-day financial rules, biometrics slots).",
      icon: <Passport className="w-5 h-5 text-rose-600" />,
    },
    {
      num: "08",
      title: "Enrollment",
      desc: "Celebrate successful visa grants, organize pre-departure briefings, and log partner commissions.",
      icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            End-To-End Student Journey
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One Continuous Workflow From First Inquiry to Campus Arrival
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Never drop the ball at any handoff. Every team member and student sees exactly what needs to happen next.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-teal-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-300 group-hover:text-teal-600 transition-colors font-mono">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="pt-4 flex items-center text-[11px] text-teal-600 font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Next Step <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
