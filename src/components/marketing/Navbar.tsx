"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Free Access", href: "/pricing" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/25 transition-transform group-hover:scale-105">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              AbroadPath <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-teal-50 text-teal-700 font-bold border border-teal-200">OS</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
              Study Abroad Consultancy Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  isActive
                    ? "text-teal-700 bg-teal-50 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Role Portal Links */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Admin Demo</span>
          </Link>

          <Link
            href="/student"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-all"
          >
            <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
            <span>Student Portal</span>
          </Link>

          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>

          <Link href="/register">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Free Access
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-center rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
              >
                Agency Dashboard
              </Link>
              <Link
                href="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-center rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold"
              >
                Student Portal
              </Link>
            </div>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Log In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="primary" size="sm" className="w-full">
                Free Access
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
