import React from "react";
import { ShieldCheck } from "lucide-react";

export function TrustedTicker() {
  const partners = [
    { name: "University of Manchester", country: "UK", tag: "Russell Group" },
    { name: "University of Toronto", country: "Canada", tag: "U15 Member" },
    { name: "University of Melbourne", country: "Australia", tag: "Group of Eight" },
    { name: "TU Munich", country: "Germany", tag: "Excellence Univ" },
    { name: "University of Birmingham", country: "UK", tag: "Russell Group" },
    { name: "Universiti Malaya", country: "Malaysia", tag: "QS #60" },
    { name: "University of Leeds", country: "UK", tag: "Russell Group" },
  ];

  return (
    <section className="py-10 border-y border-slate-200/80 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">
          Powering Admissions & Partnerships Across 500+ Top Global Universities
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/70 shadow-2xs hover:border-teal-300 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-xs font-bold text-slate-800">{partner.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-600 font-medium">
                {partner.country}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
