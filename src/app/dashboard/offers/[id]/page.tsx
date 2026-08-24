"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { offersApi } from "@/lib/api/offers";
import { Offer } from "@/types";

export default function OfferDetailPage() {
  const params = useParams();
  const offerId = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const data = await offersApi.getById(offerId);
        setOffer(data);
      } catch (err) {
        console.error("Failed to load offer details", err);
      } finally {
        setLoading(false);
      }
    };
    if (offerId) fetchOffer();
  }, [offerId]);

  const toggleCondition = async (condId: string) => {
    if (!offer) return;
    const updatedConditions = (offer.conditions || []).map((c) =>
      c.id === condId ? { ...c, fulfilled: !c.fulfilled } : c
    );
    try {
      const updated = await offersApi.update(offer.id, { conditions: updatedConditions });
      setOffer(updated);
    } catch (err) {
      console.error("Failed to toggle condition", err);
    }
  };

  const handleDecision = async (status: "Accepted" | "Declined") => {
    if (!offer) return;
    try {
      const updated = await offersApi.respond(offer.id, status);
      setOffer(updated);
    } catch (err) {
      console.error("Failed to update offer decision", err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        <span className="text-xs text-slate-500 font-medium">Loading university offer letter...</span>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <p className="text-sm font-bold text-slate-800">Offer not found</p>
        <Link href="/dashboard/offers">
          <Button variant="primary" size="sm">
            Back to Offers Desk
          </Button>
        </Link>
      </div>
    );
  }

  const sId = offer.studentId || (offer as any).student?._id || (offer as any).student;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/offers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Offers Desk
        </Link>
      </div>

      {/* Hero Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-lg shadow-2xs">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{offer.universityName}</h1>
                <StatusBadge status={offer.offerType === "Unconditional" ? "Unconditional Offer" : "Conditional Offer"} />
              </div>
              <p className="text-xs text-slate-600">
                Program: <span className="font-semibold text-slate-900">{offer.courseName}</span> • Intake: <span className="font-semibold text-slate-900">{offer.intake}</span>
              </p>
              <p className="text-xs text-slate-500">
                Applicant: <Link href={`/dashboard/students/${sId}`} className="font-semibold text-teal-700 hover:underline">{offer.studentName}</Link>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={offer.acceptanceStatus === "Accepted" ? "success" : "primary"}
              size="sm"
              onClick={() => handleDecision("Accepted")}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {offer.acceptanceStatus === "Accepted" ? "Offer Accepted" : "Mark Offer Accepted"}
            </Button>
          </div>
        </div>

        {/* Quick parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Issue Date</span>
            <p className="font-bold text-slate-900 mt-0.5">{offer.offerDate || "Recently"}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Deposit Required</span>
            <p className="font-bold text-slate-900 mt-0.5">
              {offer.currency} {offer.depositAmount?.toLocaleString()} ({offer.depositPaid ? "Paid" : "Pending"})
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Acceptance Deadline</span>
            <p className="font-bold text-rose-600 mt-0.5">{offer.deadline}</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
            <span className="text-[10px] text-teal-700 uppercase font-bold">Decision Status</span>
            <p className="font-bold text-teal-900 mt-0.5">{offer.acceptanceStatus}</p>
          </div>
        </div>
      </div>

      {/* 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Conditions Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Conditions to Convert to Unconditional</h3>
              <span className="text-xs text-slate-500">
                {(offer.conditions || []).filter((c) => c.fulfilled).length} / {(offer.conditions || []).length} Cleared
              </span>
            </div>

            <div className="space-y-3">
              {(offer.conditions || []).map((cond) => (
                <div
                  key={cond.id}
                  onClick={() => toggleCondition(cond.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    cond.fulfilled
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={cond.fulfilled}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <p className={cond.fulfilled ? "line-through text-slate-500 font-medium" : "font-semibold"}>
                      {cond.text}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {cond.fulfilled ? "Condition verified compliant" : "Click to mark condition cleared"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Offer Letter Document Viewer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Official University Document
            </h3>

            <div className="p-8 rounded-2xl bg-slate-900 text-white text-center space-y-2">
              <Award className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="font-bold text-sm text-slate-100">{offer.universityName} Offer Letter</p>
              <p className="text-[11px] text-slate-400">PDF • Official Digital Stamp • 1.4 MB</p>
              <div className="pt-2">
                <a href={offer.offerLetterUrl || "#"} target="_blank" rel="noreferrer">
                  <Button variant="white" size="xs" leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Download Copy
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
