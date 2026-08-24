import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#0b132b] via-[#0f172a] to-[#0b132b] text-white relative overflow-hidden">
      {/* Subtle background circles */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/60 border border-teal-700/50 text-teal-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transform Your Agency Admissions Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Ready to Modernize Your Study Abroad Consultancy?
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of progressive education agencies delivering faster application turnarounds, zero visa compliance errors, and transparent team commissions.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Free Lifetime Access
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="white">
              Schedule Live Demo
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-400 font-medium pt-2">
          Instant setup • Zero subscription fees • Complete agency data isolation
        </p>
      </div>
    </section>
  );
}
