"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Award,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { applicationsApi } from "@/lib/api/applications";
import { Application } from "@/types";

export default function StudentApplicationDetailPage() {
  const params = useParams();
  const appId = params.id as string;

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        const data = await applicationsApi.getById(appId);
        setApp(data);
      } catch (err) {
        console.error("Failed to load application details", err);
      } finally {
        setLoading(false);
      }
    };
    if (appId) fetchApp();
  }, [appId]);

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        <span className="text-xs text-slate-500 font-medium">Loading application status...</span>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <p className="text-sm font-bold text-slate-800">Application not found</p>
        <Link href="/student/applications">
          <Button variant="primary" size="sm">
            Back to Applications
          </Button>
        </Link>
      </div>
    );
  }

  const milestones = [
    {
      name: "Application Submitted",
      date: app.applicationDate || "Completed",
      status: "done",
      desc: `Submitted to ${app.universityName} international admissions portal`,
    },
    {
      name: "Documents Verified",
      date: "Completed",
      status: "done",
      desc: "Passport, Academic Transcripts, and English proficiency verified",
    },
    {
      name: "University Review",
      date: "Completed",
      status: "done",
      desc: "Departmental academic assessment in progress",
    },
    {
      name: "Offer Stage",
      date: app.status.includes("Offer") ? "Offer Issued" : "Pending",
      status: app.status.includes("Offer") ? "done" : "current",
      desc: app.status.includes("Offer")
        ? `Offer letter generated for ${app.courseName}`
        : "Faculty evaluating candidate portfolio",
    },
    {
      name: "Offer Acceptance & Deposit",
      date: app.status.includes("Offer") ? "In Progress" : "Upcoming",
      status: app.status.includes("Offer") ? "current" : "upcoming",
      desc: "Deposit payment & condition fulfillment",
    },
    {
      name: "Visa Processing",
      date: "Upcoming",
      status: "upcoming",
      desc: "CAS / COE release and embassy visa application filing",
    },
    {
      name: "Enrollment & Departure",
      date: app.intake || "September 2027",
      status: "upcoming",
      desc: `Commence studies at ${app.universityName}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/applications"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Applications
        </Link>
      </div>

      {/* Hero */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-lg shadow-2xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{app.universityName}</h1>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-xs text-slate-600">
                {app.courseName} • Intake: <strong className="text-slate-900">{app.intake}</strong> • Tracking #: <strong className="font-mono">{app.trackingNumber || `APP-${app.id.slice(-6).toUpperCase()}`}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/student/offers">
              <Button variant="primary" size="sm" leftIcon={<Award className="w-4 h-4" />}>
                View Offer Letter
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Milestone Visual Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Admissions Milestone Progression</h3>
            <p className="text-xs text-slate-500">Live tracker updated directly by your assigned counselor</p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {app.status}
          </span>
        </div>

        <div className="relative pl-8 space-y-8 border-l-2 border-slate-200 ml-4">
          {milestones.map((m, idx) => {
            const isDone = m.status === "done";
            const isCurrent = m.status === "current";

            return (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? "bg-teal-600 text-white shadow-xs"
                      : isCurrent
                      ? "bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className={`text-sm font-bold ${isCurrent ? "text-amber-800" : isDone ? "text-slate-900" : "text-slate-400"}`}>
                      {m.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">{m.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
