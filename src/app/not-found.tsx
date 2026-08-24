"use client";

import React from "react";
import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b132b] flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="w-20 h-20 rounded-3xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mb-6 shadow-xl">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <span className="text-xs uppercase font-bold tracking-widest text-teal-400 mb-2">
        Error 404 • Destination Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Page Off the Map
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
        The route you are navigating to does not exist or has been relocated within AbroadPath OS.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Agency Dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="white" size="md">
            Public Website
          </Button>
        </Link>
      </div>
    </div>
  );
}
