"use client";

import React from "react";
import { useRole } from "@/context/RoleContext";
import { ShieldCheck, UserCheck, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleSwitcher({ className }: { className?: string }) {
  const { role, currentUser } = useRole();

  const roleConfigs = {
    admin: {
      label: "Admin / Owner",
      color: "bg-indigo-600/10 text-indigo-700 border-indigo-200",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />,
    },
    counselor: {
      label: "Counselor / Staff",
      color: "bg-teal-600/10 text-teal-700 border-teal-200",
      icon: <UserCheck className="w-3.5 h-3.5 text-teal-600" />,
    },
    student: {
      label: "Student Portal",
      color: "bg-emerald-600/10 text-emerald-700 border-emerald-200",
      icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />,
    },
  };

  const current = roleConfigs[role] || roleConfigs.admin;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border",
        current.color,
        className
      )}
    >
      {current.icon}
      <span>{currentUser?.roleTitle || current.label}</span>
    </div>
  );
}
