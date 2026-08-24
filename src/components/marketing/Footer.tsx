import React from "react";
import Link from "next/link";
import { Compass, Mail, Phone, MapPin, Globe, ShieldCheck } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-white">AbroadPath OS</span>
            </Link>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              The purpose-built operating system for global study abroad agencies. Consolidating leads, document verification, university applications, offers, and visa compliance in one place.
            </p>
            <div className="flex items-center gap-4 text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-teal-400" /> ISO 27001 & GDPR Compliant
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="hover:text-teal-400 transition-colors">Features Overview</Link></li>
              <li><Link href="/how-it-works" className="hover:text-teal-400 transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-teal-400 transition-colors">Pricing & Plans</Link></li>
              <li><Link href="/dashboard" className="hover:text-teal-400 transition-colors">Agency Demo</Link></li>
              <li><Link href="/student" className="hover:text-teal-400 transition-colors">Student Portal</Link></li>
            </ul>
          </div>

          {/* Destination Modules */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Destinations</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-300">United Kingdom (CAS / UKVI)</span></li>
              <li><span className="text-slate-300">Canada (IRCC / SDS)</span></li>
              <li><span className="text-slate-300">Australia (Subclass 500)</span></li>
              <li><span className="text-slate-300">Germany (DAAD / Blocked Acct)</span></li>
              <li><span className="text-slate-300">Malaysia & ASEAN</span></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">About AbroadPath</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/login" className="hover:text-teal-400 transition-colors">Client Login</Link></li>
              <li><Link href="/register" className="hover:text-teal-400 transition-colors">Agency Registration</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 AbroadPath Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
