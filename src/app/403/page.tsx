"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-6 shadow-xl animate-pulse">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <span className="text-xs uppercase font-bold tracking-widest text-rose-400 mb-2">
        Error 403 • Access Denied
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Unauthorized Area
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
        You do not possess the administrative privileges required to access this agency module. Please switch your persona or return to your authorized workspace.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Agency Dashboard
          </Button>
        </Link>
        <Link href="/student">
          <Button variant="white" size="md">
            Student Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
