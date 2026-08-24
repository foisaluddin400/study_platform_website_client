"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Loader2,
  Clock,
  ShieldCheck,
  Building2,
  FileText,
  Sparkles,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { visaCasesApi } from "@/lib/api/visaCases";
import { VisaCase, VisaFeaturedDocument, VisaDocumentStatus } from "@/types";

export default function StudentVisaPage() {
  const [visaCase, setVisaCase] = useState<VisaCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisa = async () => {
      try {
        setLoading(true);
        const data = await visaCasesApi.getMyVisaCase();
        setVisaCase(data);
      } catch (err) {
        console.error("Failed to load my visa case", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisa();
  }, []);

  // Compute synchronized document list
  const getSynchronizedDocuments = (vc: VisaCase): VisaFeaturedDocument[] => {
    const baseDocs: VisaFeaturedDocument[] =
      vc.featuredDocuments && vc.featuredDocuments.length > 0
        ? vc.featuredDocuments
        : [
            { id: "fd-1", name: "Valid International Passport & Bio Page", status: "Submitted", required: true },
            { id: "fd-2", name: "Official CAS / COE / Unconditional Offer Letter", status: "Submitted", required: true },
            { id: "fd-3", name: "28-Day Bank Solvency Statement & Financial Affidavit", status: "Pending", required: true },
            { id: "fd-4", name: "TB Medical Clearance Certificate", status: "Pending", required: true },
            { id: "fd-5", name: "Police Clearance & Academic Attestations", status: "Pending", required: false },
          ];

    // Status sync with visa file status
    if (vc.status === "Submitted" || vc.status === "Biometrics" || vc.status === "Under Review") {
      return baseDocs.map((d) => (d.status === "Pending" ? { ...d, status: "Submitted" as VisaDocumentStatus } : d));
    }
    if (vc.status === "Approved") {
      return baseDocs.map((d) => ({ ...d, status: "Approved" as VisaDocumentStatus }));
    }

    return baseDocs;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span>Student Portal</span>
          <span>•</span>
          <span className="text-teal-700 font-semibold">Visa Compliance Desk</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          My Visa Readiness & Embassy Compliance Tracker
        </h1>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading visa compliance dossier...</span>
        </div>
      ) : !visaCase ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <Passport className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No active visa file</p>
          <p className="text-xs text-slate-500">
            Your visa case will be initialized by your assigned counselor once your offer and financial preparations are ready.
          </p>
        </div>
      ) : (
        <>
          {/* Hero Overview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg shadow-2xs">
                  <Passport className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">{visaCase.country} Student Route Visa</h2>
                    <StatusBadge status={visaCase.status} />
                  </div>
                  <p className="text-xs text-slate-600">
                    Target Institution: <strong className="text-slate-900">{visaCase.institutionName}</strong> • Target Intake: <strong>{visaCase.targetIntake || "September 2027"}</strong>
                  </p>
                </div>
              </div>

              <Link href="/student/documents">
                <Button variant="primary" size="sm" leftIcon={<FileCheck className="w-4 h-4" />}>
                  Upload Visa Documents
                </Button>
              </Link>
            </div>

            {/* Key Milestone Dates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">CAS / COE Reference</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block truncate">
                  {visaCase.casNumber || visaCase.casOrCoeNumber || "Pending Issuance"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Embassy Submission</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {visaCase.submissionDate || (visaCase.status === "Submitted" ? "Submitted" : "Pending Filing")}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Biometrics Slot</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {visaCase.biometricsDate || "Not Scheduled"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Decision Outcome</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {visaCase.decisionDate || (visaCase.status === "Approved" ? "Visa Granted" : "Awaiting Embassy")}
                </span>
              </div>
            </div>
          </div>

          {/* Embassy Mandatory Checklist (Featured Documents with 1., 2., 3. and Pending / Submitted / Approved status) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  Embassy Mandatory Checklist
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specific required visa documents and feature verification for your {visaCase.country} visa application.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {getSynchronizedDocuments(visaCase).filter((d) => d.status === "Approved").length} of {getSynchronizedDocuments(visaCase).length} Approved
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {getSynchronizedDocuments(visaCase).map((doc, idx) => {
                const isApproved = doc.status === "Approved";
                const isSubmitted = doc.status === "Submitted";
                const isPending = doc.status === "Pending";

                return (
                  <div
                    key={doc.id || idx}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                      isApproved
                        ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                        : isSubmitted
                        ? "bg-teal-50/40 border-teal-200 text-teal-950"
                        : "bg-amber-50/30 border-amber-200/80 text-amber-950"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="font-bold text-sm text-slate-400 shrink-0 w-6">
                        {idx + 1}.
                      </span>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{doc.name}</span>
                          {doc.required && (
                            <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        {doc.description && (
                          <p className="text-[11px] text-slate-500">{doc.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          isApproved
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : isSubmitted
                            ? "bg-teal-100 text-teal-800 border-teal-300"
                            : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}
                      >
                        {isApproved && <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
                        {isSubmitted && <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />}
                        {isPending && <Clock className="w-3.5 h-3.5 text-amber-700" />}
                        {doc.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
