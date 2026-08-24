"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Clock,
  FileCheck,
  Award,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { applicationsApi } from "@/lib/api/applications";
import { documentsApi } from "@/lib/api/documents";
import { Application, DocumentItem } from "@/types";

export default function ApplicationDetailPage() {
  const params = useParams();
  const appId = params.id as string;

  const [app, setApp] = useState<Application | null>(null);
  const [attachedDocs, setAttachedDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const data = await applicationsApi.getById(appId);
        setApp(data);
        if (data && (data.studentId || (data as any).student?._id || (data as any).student)) {
          const sId = data.studentId || (data as any).student?._id || (data as any).student;
          const docs = await documentsApi.getAll({ studentId: sId }).catch(() => []);
          setAttachedDocs(docs);
        }
      } catch (err) {
        console.error("Failed to load application details", err);
      } finally {
        setLoading(false);
      }
    };
    if (appId) fetchApplication();
  }, [appId]);

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        <span className="text-xs text-slate-500 font-medium">Loading application dossier...</span>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <p className="text-sm font-bold text-slate-800">Application not found</p>
        <Link href="/dashboard/applications">
          <Button variant="primary" size="sm">
            Back to Applications
          </Button>
        </Link>
      </div>
    );
  }

  const sId = app.studentId || (app as any).student?._id || (app as any).student;

  return (
    <div className="space-y-6">
      {/* Top back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Applications Center
        </Link>
      </div>

      {/* Hero Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-lg shadow-2xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{app.universityName}</h1>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-xs text-slate-600">
                Program: <span className="font-semibold text-slate-900">{app.courseName}</span> • Intake: <span className="font-semibold text-slate-900">{app.intake}</span>
              </p>
              <p className="text-xs text-slate-500">
                Applicant: <Link href={`/dashboard/students/${sId}`} className="font-semibold text-teal-700 hover:underline">{app.studentName}</Link> • Tracking #: <span className="font-mono font-bold text-slate-800">{app.trackingNumber || `APP-${app.id.slice(-6).toUpperCase()}`}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/offers">
              <Button variant="outline" size="sm" leftIcon={<Award className="w-4 h-4" />}>
                Check Offer Desk
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick parameters row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Submission Date</span>
            <p className="font-bold text-slate-900 mt-0.5">{app.applicationDate || "Recently"}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">App Fee</span>
            <p className="font-bold text-slate-900 mt-0.5">
              {app.currency} {app.applicationFee} ({app.feePaid ? "Paid" : "Pending"})
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Admissions Deadline</span>
            <p className="font-bold text-rose-600 mt-0.5">{app.submissionDeadline || "Rolling / July 2027"}</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
            <span className="text-[10px] text-teal-700 uppercase font-bold">Managing Counselor</span>
            <p className="font-bold text-teal-900 mt-0.5">{app.counselorName || "Admissions Officer"}</p>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Attached Documents & Notes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Attached Documents Dossier */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Attached Application Documents</h3>
              </div>
              <span className="text-xs text-slate-500">{attachedDocs.length} Verified Files</span>
            </div>

            <div className="space-y-2.5">
              {attachedDocs.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">No documents attached yet</p>
              ) : (
                attachedDocs.map((doc) => (
                  <div key={doc.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{doc.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{doc.fileName} • {doc.fileSize}</p>
                      </div>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Counselor Internal Notes */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Internal Admissions Log
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {app.notes || "Submitted directly through university international agent portal."}
            </p>
          </div>
        </div>

        {/* Right Column: Admission Milestones Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm">Admissions Stage Progression</h3>
            </div>

            <div className="relative pl-6 space-y-6 border-l-2 border-teal-500/40">
              {(app.timeline || []).map((t, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-teal-500 ring-4 ring-teal-100" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{t.title}</span>
                      <span className="text-[10px] text-slate-400">{t.date}</span>
                    </div>
                    {t.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
