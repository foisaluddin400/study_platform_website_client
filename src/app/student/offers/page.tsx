"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  Eye,
  Calendar,
  Building2,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { FilePreviewModal } from "@/components/ui/FilePreviewModal";
import { offersApi } from "@/lib/api/offers";
import { Offer } from "@/types";

export default function StudentOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // File Preview Modal state
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    title: string;
    fileUrl?: string;
    fileBlob?: File | null;
    fileType?: string;
  }>({
    isOpen: false,
    title: "",
    fileUrl: "",
    fileBlob: null,
    fileType: "PDF",
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await offersApi.getMyOffers();
        setOffers(data);
      } catch (err) {
        console.error("Failed to load my offers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleAccept = async (offerId: string) => {
    try {
      const updated = await offersApi.respond(offerId, "Accepted");
      setOffers(offers.map((o) => (o.id === offerId ? updated : o)));
    } catch (err) {
      console.error("Failed to accept offer", err);
    }
  };

  const handleDecline = async (offerId: string) => {
    try {
      const updated = await offersApi.respond(offerId, "Declined");
      setOffers(offers.map((o) => (o.id === offerId ? updated : o)));
    } catch (err) {
      console.error("Failed to decline offer", err);
    }
  };

  const handlePreviewOfferLetter = (offer: Offer) => {
    const isImg =
      offer.offerLetterMimeType?.includes("image") ||
      offer.offerLetterFileName?.match(/\.(png|jpg|jpeg|webp)$/i);

    setPreviewModal({
      isOpen: true,
      title: `${offer.universityName} - ${offer.offerType || offer.type || "Admission"} Offer Letter`,
      fileUrl: offer.offerLetterUrl || `/api/v1/offers/stream/${offer.id}`,
      fileBlob: null,
      fileType: isImg ? "IMAGE" : "PDF",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span>Student Portal</span>
          <span>•</span>
          <span className="text-teal-700 font-semibold">Offer Letters & Decisions</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          My University Admission Offers
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            {offers.length} {offers.length === 1 ? "Offer" : "Offers"}
          </span>
        </h1>
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading your university offers...</span>
        </div>
      ) : offers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No admission offers received yet</p>
          <p className="text-xs text-slate-500">
            Your university admission decisions and formal offer letters will appear here as soon as they are processed.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => {
            const currentOfferType = offer.offerType || offer.type || "Conditional";
            const deadlineText = offer.deadline || offer.conditionsDeadline || offer.depositDeadline || "Rolling Basis";

            return (
              <div
                key={offer.id}
                className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6 hover:border-slate-300 transition-all"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          currentOfferType === "Unconditional"
                            ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                            : "text-amber-800 bg-amber-50 border-amber-200"
                        }`}
                      >
                        {currentOfferType} Offer
                      </span>
                      <StatusBadge status={offer.acceptanceStatus} />
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">{offer.universityName}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                        {offer.courseName} • {offer.country} {offer.intake ? `(${offer.intake})` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Decision Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {offer.acceptanceStatus === "Pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecline(offer.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAccept(offer.id)}
                          leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        >
                          Accept Offer & Pay Deposit
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Key Financial & Deadline Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Decision Deadline</span>
                    <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>{deadlineText}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Year 1 Tuition Fee</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {offer.tuitionFee
                        ? `${offer.currency || "$"}${offer.tuitionFee.toLocaleString()}`
                        : "Contact Counselor"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Seat Deposit Required</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {offer.depositAmount
                        ? `${offer.currency || "$"}${offer.depositAmount.toLocaleString()}`
                        : "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Deposit Status</span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold mt-0.5 ${
                        offer.depositPaid ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {offer.depositPaid ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Paid / Confirmed
                        </>
                      ) : (
                        "Pending Payment"
                      )}
                    </span>
                  </div>
                </div>

                {/* Offer Letter File Card */}
                <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {offer.offerLetterFileName || `${offer.universityName} Official Offer Letter`}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {offer.offerLetterSize ? `${offer.offerLetterSize} • ` : ""}Official admission decision document
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewOfferLetter(offer)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      className="flex-1 sm:flex-none text-xs"
                    >
                      Preview Letter
                    </Button>
                    <a
                      href={offersApi.getDownloadUrl(offer.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                        className="w-full text-xs"
                      >
                        Download PDF
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Conditions Checklist */}
                {offer.conditions && offer.conditions.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                        Outstanding Offer Conditions Checklist
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {offer.conditions.filter((c) => c.fulfilled).length} of {offer.conditions.length} fulfilled
                      </span>
                    </div>

                    <div className="space-y-2">
                      {offer.conditions.map((cond) => (
                        <div
                          key={cond.id}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            cond.fulfilled
                              ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                              : "bg-amber-50/60 border-amber-200 text-amber-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {cond.fulfilled ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            )}
                            <span className="font-medium">{cond.text}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 shrink-0">
                            {cond.fulfilled ? "Fulfilled" : "Action Required"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        title={previewModal.title}
        fileUrl={previewModal.fileUrl}
        fileBlob={previewModal.fileBlob}
        fileType={previewModal.fileType}
      />
    </div>
  );
}
