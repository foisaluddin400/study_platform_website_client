"use client";

import React, { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Compass,
  MessageSquare,
  FileText,
  User,
  Shield,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  adminOnly?: boolean;
}

export function AppSidebar() {
  const pathname = usePathname();
  const { role, currentUser } = useRole();
  const [collapsed, setCollapsed] = useState(false);

  // Admin & Counselor navigation items
  const adminNavItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: "Leads CRM",
      href: "/dashboard/leads",
      icon: <Users className="w-4 h-4" />,
      badge: 5,
    },
    {
      name: "Students",
      href: "/dashboard/students",
      icon: <GraduationCap className="w-4 h-4" />,
      badge: 5,
    },
    {
      name: "Documents Vault",
      href: "/dashboard/documents",
      icon: <FileCheck className="w-4 h-4" />,
      badge: 2,
    },
    {
      name: "Universities",
      href: "/dashboard/universities",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      name: "Courses & Matcher",
      href: "/dashboard/courses",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      name: "Applications",
      href: "/dashboard/applications",
      icon: <Send className="w-4 h-4" />,
      badge: 6,
    },
    {
      name: "Offers Desk",
      href: "/dashboard/offers",
      icon: <Award className="w-4 h-4" />,
      badge: 3,
    },
    {
      name: "Visa Cases",
      href: "/dashboard/visa",
      icon: <Passport className="w-4 h-4" />,
      badge: 3,
    },
    {
      name: "Tasks",
      href: "/dashboard/tasks",
      icon: <CheckSquare className="w-4 h-4" />,
      badge: 6,
    },
    {
      name: "Appointments",
      href: "/dashboard/appointments",
      icon: <Calendar className="w-4 h-4" />,
      badge: 4,
    },
    {
      name: "Payments & Invoices",
      href: "/dashboard/payments",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      name: "Counselor Chat",
      href: "/dashboard/chat",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      name: "Commissions",
      href: "/dashboard/commissions",
      icon: <Percent className="w-4 h-4" />,
      adminOnly: true,
    },
    {
      name: "Reports & Analytics",
      href: "/dashboard/reports",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      name: "Team & Staff",
      href: "/dashboard/team",
      icon: <UserCog className="w-4 h-4" />,
      adminOnly: true,
    },
    {
      name: "Agency Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  // Student portal navigation items
  const studentNavItems: NavItem[] = [
    {
      name: "My Dashboard",
      href: "/student",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: "My Profile",
      href: "/student/profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      name: "My Documents",
      href: "/student/documents",
      icon: <FileText className="w-4 h-4" />,
      badge: "Action Req",
    },
    {
      name: "My Applications",
      href: "/student/applications",
      icon: <Send className="w-4 h-4" />,
      badge: 2,
    },
    {
      name: "Offers",
      href: "/student/offers",
      icon: <Award className="w-4 h-4" />,
      badge: 2,
    },
    {
      name: "Universities",
      href: "/student/universities",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      name: "Visa Tracker",
      href: "/student/visa",
      icon: <Passport className="w-4 h-4" />,
    },
    {
      name: "Action Tasks",
      href: "/student/tasks",
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      name: "Counselor Chat",
      href: "/student/chat",
      icon: <MessageSquare className="w-4 h-4" />,
      badge: "Chat",
    },
    {
      name: "Invoices & Fees",
      href: "/student/payments",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      name: "Account Settings",
      href: "/student/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const currentNav = role === "student" ? studentNavItems : adminNavItems;

  return (
    <aside
      className={cn(
        "hidden md:flex sticky top-0 h-screen bg-[#0b132b] border-r border-[#1a233f] flex-col transition-all duration-300 z-30 select-none shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1a233f] shrink-0">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/30 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-white tracking-tight leading-none truncate">
                AbroadPath OS
              </span>
              <span className="text-[10px] text-teal-400 font-medium mt-0.5 truncate">
                {currentUser.agencyName}
              </span>
            </div>
          </Link>
        )}

        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white mx-auto shadow-md shadow-teal-500/30">
            <Compass className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1c2541] transition-colors cursor-pointer",
            collapsed && "mx-auto mt-2"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Indicator */}
      {!collapsed && (
        <div className="px-4 py-2 border-b border-[#1a233f]/50 bg-[#090f23]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Active Session
            </span>
            <span
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                role === "admin"
                  ? "bg-purple-950/80 text-purple-300 border border-purple-800/80"
                  : role === "counselor"
                  ? "bg-teal-950/80 text-teal-300 border border-teal-800/80"
                  : "bg-blue-950/80 text-blue-300 border border-blue-800/80"
              )}
            >
              {role === "admin"
                ? "Agency Admin"
                : role === "counselor"
                ? "Counselor"
                : "Student"}
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1 scrollbar-thin scrollbar-thumb-[#1c2541]">
        {currentNav.map((item) => {
          if (role === "counselor" && item.adminOnly) {
            return null;
          }

          const isActive =
            item.href === "/dashboard" || item.href === "/student"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                isActive
                  ? "bg-teal-500 text-white font-semibold shadow-md shadow-teal-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#1c2541]"
              )}
              title={collapsed ? item.name : undefined}
            >
              <span className={cn("shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>
                {item.icon}
              </span>

              {!collapsed && <span className="truncate flex-1">{item.name}</span>}

              {!collapsed && item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-teal-950 text-teal-400 border border-teal-800/50"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-[#1a233f] bg-[#090f23] shrink-0">
        <div className="flex items-center gap-2.5">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" statusIndicator="online" />
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 truncate">{currentUser.roleTitle}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
