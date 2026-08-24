"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileCheck,
  Building2,
  BookOpen,
  Send,
  Award,
  CheckSquare,
  Calendar,
  CreditCard,
  Percent,
  BarChart3,
  UserCog,
  Settings,
  X,
  Compass,
  MessageSquare,
  FileText,
  User,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { role, currentUser } = useRole();

  if (!isOpen) return null;

  const adminNavItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Leads CRM", href: "/dashboard/leads", icon: <Users className="w-4 h-4" /> },
    { name: "Students", href: "/dashboard/students", icon: <GraduationCap className="w-4 h-4" /> },
    { name: "Documents Vault", href: "/dashboard/documents", icon: <FileCheck className="w-4 h-4" /> },
    { name: "Universities", href: "/dashboard/universities", icon: <Building2 className="w-4 h-4" /> },
    { name: "Courses & Matcher", href: "/dashboard/courses", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Applications", href: "/dashboard/applications", icon: <Send className="w-4 h-4" /> },
    { name: "Offers Desk", href: "/dashboard/offers", icon: <Award className="w-4 h-4" /> },
    { name: "Visa Cases", href: "/dashboard/visa", icon: <Passport className="w-4 h-4" /> },
    { name: "Tasks", href: "/dashboard/tasks", icon: <CheckSquare className="w-4 h-4" /> },
    { name: "Appointments", href: "/dashboard/appointments", icon: <Calendar className="w-4 h-4" /> },
    { name: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-4 h-4" /> },
    { name: "Commissions", href: "/dashboard/commissions", icon: <Percent className="w-4 h-4" />, adminOnly: true },
    { name: "Reports", href: "/dashboard/reports", icon: <BarChart3 className="w-4 h-4" /> },
    { name: "Team & Staff", href: "/dashboard/team", icon: <UserCog className="w-4 h-4" />, adminOnly: true },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const studentNavItems: NavItem[] = [
    { name: "Dashboard", href: "/student", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "My Profile", href: "/student/profile", icon: <User className="w-4 h-4" /> },
    { name: "My Documents", href: "/student/documents", icon: <FileText className="w-4 h-4" /> },
    { name: "My Applications", href: "/student/applications", icon: <Send className="w-4 h-4" /> },
    { name: "Offers", href: "/student/offers", icon: <Award className="w-4 h-4" /> },
    { name: "Universities", href: "/student/universities", icon: <Building2 className="w-4 h-4" /> },
    { name: "Visa Tracker", href: "/student/visa", icon: <Passport className="w-4 h-4" /> },
    { name: "Tasks", href: "/student/tasks", icon: <CheckSquare className="w-4 h-4" /> },
    { name: "Messages", href: "/student/messages", icon: <MessageSquare className="w-4 h-4" /> },
    { name: "Payments", href: "/student/payments", icon: <CreditCard className="w-4 h-4" /> },
    { name: "Settings", href: "/student/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const currentNav = role === "student" ? studentNavItems : adminNavItems;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0b132b] text-slate-300 z-10 animate-in slide-in-from-left duration-200">
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1a233f]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-sm">AbroadPath OS</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Role Session indicator */}
        <div className="px-4 py-2 border-b border-[#1a233f] bg-[#0e1938] flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">Signed in as</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
            {currentUser.roleTitle || (role === "admin" ? "Agency Admin" : role === "counselor" ? "Counselor" : "Student")}
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {currentNav.map((item) => {
            if (role === "counselor" && item.adminOnly) return null;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && item.href !== "/student" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                  isActive
                    ? "bg-teal-600 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer profile */}
        <div className="p-4 border-t border-[#1a233f] bg-[#090f23] flex items-center gap-3">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">{currentUser.name}</span>
            <span className="text-[10px] text-slate-400 truncate">{currentUser.roleTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
