"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileCheck,
  Clock,
  Loader2,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { visaCasesApi } from "@/lib/api/visaCases";
import { VisaCase } from "@/types";

export default function VisaDetailPage() {
  const params = useParams();
  const visaId = params.id as string;

  const [visaCase, setVisaCase] = useState<VisaCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisaCase = async () => {
      try {
        setLoading(true);
        const data = await visaCasesApi.getById(visaId);
        setVisaCase(data);
      } catch (err) {
        console.error("Failed to load visa case details", err);
      } finally {
        setLoading(false);
      }
    };
    if (visaId) fetchVisaCase();
  }, [visaId]);

  const toggleChecklistItem = async (itemId: string) => {
    if (!visaCase) return;
    const updatedChecklist = (visaCase.checklist || []).map((i) =>
      i.id === itemId ? { ...i, completed: !i.completed } : i
    );
    try {
      const updated = await visaCasesApi.update(visaCase.id, { checklist: updatedChecklist });
      setVisaCase(updated);
    } catch (err) {
      console.error("Failed to toggle checklist item", err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        <span className="text-xs text-slate-500 font-medium">Loading visa compliance dossier...</span>
      </div>
    );
  }

  if (!visaCase) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <p className="text-sm font-bold text-slate-800">Visa case not found</p>
        <Link href="/dashboard/visa">
          <Button variant="primary" size="sm">
            Back to Visa Cases
          </Button>
        </Link>
      </div>
    );
  }

  const sId = visaCase.studentId || (visaCase as any).student?._id || (visaCase as any).student;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/visa"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Visa Cases
        </Link>
      </div>

      {/* Hero Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg shadow-2xs">
              <Passport className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{visaCase.country} Visa Dossier</h1>
                <StatusBadge status={visaCase.status} />
              </div>
              <p className="text-xs text-slate-600">
                Route: <span className="font-semibold text-slate-900">{visaCase.visaType}</span> • Target: <span className="font-semibold text-slate-900">{visaCase.institutionName}</span> ({visaCase.targetIntake})
              </p>
              <p className="text-xs text-slate-500">
                Student: <Link href={`/dashboard/students/${sId}`} className="font-semibold text-teal-700 hover:underline">{visaCase.studentName}</Link> • Visa Officer: <span className="font-semibold text-slate-800">{visaCase.counselorName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/documents">
              <Button variant="outline" size="sm" leftIcon={<FileCheck className="w-4 h-4" />}>
                Document Vault
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">CAS / COE Number</span>
            <p className="font-bold text-slate-900 mt-0.5 font-mono">{visaCase.casOrCoeNumber || "Pending University"}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Biometrics Appointment</span>
            <p className="font-bold text-teal-700 mt-0.5">{visaCase.biometricsDate || "Not Scheduled Yet"}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Lodgement Date</span>
            <p className="font-bold text-slate-900 mt-0.5">{visaCase.applicationDate || "In Preparation"}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-[10px] text-amber-700 uppercase font-bold">Compliance Status</span>
            <p className="font-bold text-amber-900 mt-0.5">
              {(visaCase.checklist || []).filter((i) => i.completed).length} / {(visaCase.checklist || []).length} Verified
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Embassy Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">{visaCase.country} Mandatory Visa Checklist</h3>
              <span className="text-xs text-slate-500">Interactive Verification</span>
            </div>

            <div className="space-y-2.5">
              {(visaCase.checklist || []).map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    item.completed
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <div>
                      <p className={`text-xs ${item.completed ? "font-bold text-emerald-900" : "font-medium text-slate-800"}`}>
                        {item.item}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {item.required ? "Required" : "Optional"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Embassy Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">Embassy Processing Pipeline</h3>
            </div>

            <div className="relative pl-6 space-y-6 border-l-2 border-amber-500/40">
              {(visaCase.timeline || []).map((t, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.stage}</span>
                      <span className="text-[10px] text-slate-400">{t.date}</span>
                    </div>
                    {t.notes && <p className="text-slate-600 leading-relaxed">{t.notes}</p>}
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
