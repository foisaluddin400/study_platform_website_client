import React from "react";
import { Star, Quote } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

export function Testimonials() {
  const testimonials = [
    {
      name: "Tariqul Alam",
      role: "Managing Director, Global Pathways Education",
      location: "London & Dhaka Hubs",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      quote:
        "AbroadPath OS reduced our application processing turnaround time by 60%. Before this platform, our counselors were drowning in WhatsApp messages and lost transcripts. Now, our entire 35-person agency runs on a single source of truth.",
      stats: "+140% Increase in Completed Enrolments",
    },
    {
      name: "Sarah Jenkins",
      role: "Director of International Admissions, EduLink Overseas",
      location: "Toronto & Vancouver",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      quote:
        "The Document Verification Vault alone saved us from dozens of potential visa refusals. The automatic 28-day financial checks and country-specific checklists give our consultancy immense credibility with top Canadian institutions.",
      stats: "98.4% First-Time Visa Approval Rate",
    },
    {
      name: "Rajeshwar Pillai",
      role: "Chief Operations Officer, Apex Study International",
      location: "Dubai Regional HQ",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      quote:
        "The Commission Ledger and Counselor Leaderboard completely eliminated payout disputes between our branches. Transparent, reliable, and our students love having their own clean portal.",
      stats: "$420,000+ Reconciled Commissions Tracked",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Trusted Agency Voices
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by Leading Consultancies Worldwide
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            See how top international education agencies scale their admissions operations with AbroadPath OS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:shadow-md hover:border-teal-300 transition-all group"
            >
              <div>
                {/* 5 stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div>
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-800 text-xs font-bold mb-4">
                  {t.stats}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/70">
                  <Avatar src={t.avatar} name={t.name} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                    <p className="text-[10px] text-teal-700 font-medium">{t.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
