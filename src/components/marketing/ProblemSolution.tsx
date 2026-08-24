import React from "react";
import { XCircle, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export function ProblemSolution() {
  const problems = [
    "Scattered Google Sheets, Excel files, and missing student rows",
    "Documents lost inside disorganized WhatsApp threads and email chains",
    "Missed university application deadlines and lost offer letters",
    "Disputed partner commission calculations and counselor incentives",
    "Anxious students constantly calling for status updates",
    "Zero audit trail for visa compliance and financial solvency checks",
  ];

  const solutions = [
    "Centralized CRM with automated student lifecycle stages & smart filters",
    "Cloud Verification Vault with inline audit, rejection notes & checklist",
    "Live Kanban Application Tracker with deadline counters and offer logs",
    "Automated Commission Ledger with university split & counselor payout",
    "Self-service Student Portal with real-time milestones and action tasks",
    "Built-in Embassy Visa Dossier manager with country rule validation",
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Why Modern Consultancies Switch
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Stop Juggling Spreadsheets, WhatsApp & Paper Folders.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Education consultancies lose up to 35% of their qualified leads to delayed follow-ups and lost documents. AbroadPath OS replaces the chaos with structured automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Old way */}
          <div className="rounded-3xl border border-rose-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">The Fragmented Way</h3>
                <p className="text-xs text-slate-500">Excel + WhatsApp + Google Drive Chaos</p>
              </div>
            </div>

            <ul className="space-y-3.5">
              {problems.map((prob) => (
                <li key={prob} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AbroadPath OS Way */}
          <div className="rounded-3xl border border-teal-300 bg-gradient-to-b from-teal-50/40 via-white to-teal-50/20 p-6 sm:p-8 shadow-md relative overflow-hidden ring-1 ring-teal-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  The AbroadPath OS Way
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                    Unified
                  </span>
                </h3>
                <p className="text-xs text-teal-800 font-medium">All-in-One Digital Consultancy OS</p>
              </div>
            </div>

            <ul className="space-y-3.5">
              {solutions.map((sol) => (
                <li key={sol} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
