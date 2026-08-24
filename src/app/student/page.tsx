"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck,
  Send,
  Award,
  MessageSquare,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { studentsApi, StudentDashboardSummary } from "@/lib/api/students";

export default function StudentDashboardPage() {
  const { currentUser } = useRole();
  const [summary, setSummary] = useState<StudentDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await studentsApi.getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.warn("Using fallback profile info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const student = summary?.student || {
    id: "student-me",
    name: currentUser.name || "Farhan Tanvir",
    email: currentUser.email || "student@abroadpath.com",
    journeyProgress: 75,
    currentStage: "Offer",
    preferredCourse: "MSc Advanced Computer Science & AI",
    assignedCounselorName: "Marcus Holloway",
  };

  const studentApps = summary?.applications || [];
  const studentOffers = summary?.offers || [];
  const studentDocs = summary?.documents || [];
  const pendingDocs = studentDocs.filter(
    (d) => d.status === "Correction Required" || d.status === "Under Review"
  );

  const stages = [
    "Lead",
    "Counselling",
    "Documents",
    "Application",
    "Offer",
    "Visa",
    "Enrollment",
  ];

  const currentStageIndex = stages.indexOf(student.currentStage || "Offer");

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0b132b] via-[#0f172a] to-[#0b132b] text-white shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Applicant Portal • Autumn 2027 Intake
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {student.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Your application dossier is progressing smoothly toward university enrollment.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/student/messages">
              <Button variant="white" size="sm" leftIcon={<MessageSquare className="w-4 h-4 text-teal-600" />}>
                Message Counselor
              </Button>
            </Link>
          </div>
        </div>

        {/* Journey Progress Bar in Banner */}
        <div className="pt-4 border-t border-slate-700/80 relative z-10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Study Abroad Journey Progress</span>
            <span className="font-extrabold text-teal-300">
              {student.journeyProgress || 75}% Completed
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {stages.map((st, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={st} className="space-y-1 text-center">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isPast
                        ? "bg-teal-400"
                        : isCurrent
                        ? "bg-teal-300 ring-2 ring-teal-300/40"
                        : "bg-slate-700"
                    }`}
                  />
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold block truncate ${
                      isCurrent
                        ? "text-teal-300"
                        : isPast
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3 Action Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Application Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Send className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-indigo-700">Application</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {studentApps[0]?.universityName || "University of Manchester"}
            </h3>
            <p className="text-xs text-slate-500">
              {studentApps[0]?.courseName || "MSc Advanced Computer Science & AI"}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <StatusBadge status={studentApps[0]?.status || "Conditional Offer"} />
            <Link
              href="/student/applications"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Track <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Offer Letter Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Award className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-emerald-700">Offer Received</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {studentOffers[0]?.offerType || "Conditional"} Offer Issued
            </h3>
            <p className="text-xs text-slate-500">
              Deposit: {studentOffers[0]?.currency || "£"}{studentOffers[0]?.depositAmount?.toLocaleString() || "2,000"} • Deadline: {studentOffers[0]?.deadline || "Oct 15, 2026"}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <StatusBadge status={studentOffers[0]?.acceptanceStatus || "Pending"} />
            <Link
              href="/student/offers"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Review Offer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Document Action Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <FileCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-teal-700">Document Vault</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {pendingDocs.length > 0 ? `${pendingDocs.length} Pending Actions` : "All Verified"}
            </h3>
            <p className="text-xs text-slate-500">
              {pendingDocs.length > 0
                ? "Academic transcripts and financial affidavits in review."
                : "All identity and academic records approved."}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              {studentDocs.length} Uploaded
            </span>
            <Link
              href="/student/documents"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Vault <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Counselor Support Contact Banner */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={student.assignedCounselorName || "Senior Counselor"} size="md" />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Your Dedicated Admissions Counselor
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              {student.assignedCounselorName || "Marcus Holloway"}
            </h4>
            <p className="text-xs text-slate-500">Admissions Specialist</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/student/messages">
            <Button variant="primary" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
              Open Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
