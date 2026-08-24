"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How does AbroadPath OS replace our existing spreadsheets and WhatsApp folders?",
      answer:
        "AbroadPath OS consolidates all student records, uploaded PDFs/transcripts, application statuses, and counselor tasks into a single cloud operating system. Instead of messaging in WhatsApp, counselors assign action items, audit documents in a verified vault, and manage university deadlines on Kanban boards.",
    },
    {
      question: "Can we restrict what counselors and external agents can view?",
      answer:
        "Yes! AbroadPath OS features robust role-based access control (RBAC). Counselors only see students assigned to their desk. Financial commissions, agency director reports, and global contract terms are strictly restricted to Admin users.",
    },
    {
      question: "Does the platform offer a dedicated portal for students?",
      answer:
        "Yes. Every enrolled student gets a dedicated, secure login where they can view their target courses, upload missing documents, track real-time application progress, and download offer letters without calling the office daily.",
    },
    {
      question: "How does the University Commission Ledger work?",
      answer:
        "When an application is marked as 'Enrolled', the platform calculates expected university partner commissions based on contract percentages (e.g. 12.5% of Year 1 tuition) and auto-splits between agency share and counselor incentive payouts.",
    },
    {
      question: "Can we migrate our existing student data from Excel or Google Sheets?",
      answer:
        "Absolutely. We provide a one-click CSV/Excel importer that maps your historical leads, students, and course selections into AbroadPath OS without any data loss.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Everything you need to know about implementing AbroadPath OS across your consultancy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/40 transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 text-sm sm:text-base cursor-pointer hover:bg-slate-100/60 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-teal-600"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
