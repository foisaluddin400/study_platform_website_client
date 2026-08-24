"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Plus,
  Menu,
  UserPlus,
  GraduationCap,
  Send,
  UploadCloud,
  Calendar,
  LogOut,
  Settings,
  User,
  Compass,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationDrawer } from "./NotificationDrawer";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { notificationsApi, NotificationItem } from "@/lib/api/notifications";
import { getSocket } from "@/lib/socket";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  onOpenMobileNav?: () => void;
}

export function AppHeader({ onOpenMobileNav }: AppHeaderProps) {
  const { role, currentUser, logout } = useRole();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Global Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const router = useRouter();

  // Fetch initial notifications and unread count
  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifs(true);
      const data = await notificationsApi.getAll();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount ?? (data.notifications || []).filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Failed to load notifications in header:", err);
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time Socket.IO notification listener
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (notif: NotificationItem) => {
      console.log("🔔 Real-time notification received:", notif);
      setNotifications((prev) => {
        // Prevent duplicate items
        const exists = prev.some((n) => n.id === notif.id);
        if (exists) return prev;
        return [notif, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, []);

  // Notification action handlers
  const handleMarkAllRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await notificationsApi.markAsRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const target = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      await notificationsApi.delete(id);
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        {/* Left side: Mobile Menu toggle + Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Mobile menu trigger */}
          <button
            onClick={onOpenMobileNav}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick global search trigger button matching design */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full max-w-md flex items-center justify-between px-3 sm:px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-400 hover:text-slate-600 transition-all text-xs cursor-pointer group shadow-2xs min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
              <span className="hidden sm:inline truncate">Search students, applications, universities...</span>
              <span className="sm:hidden text-xs">Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-200 shadow-2xs shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action button for Admin/Counselor */}
          {role !== "student" && (
            <div className="relative">
              <button
                onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>

              {isQuickAddOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsQuickAddOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white p-1.5 shadow-2xl border border-slate-200 z-40 animate-in fade-in zoom-in-95 text-xs">
                    <button
                      onClick={() => {
                        setIsQuickAddOpen(false);
                        router.push("/dashboard/leads");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-indigo-600" /> Add New Lead
                    </button>
                    <button
                      onClick={() => {
                        setIsQuickAddOpen(false);
                        router.push("/dashboard/students");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-teal-600" /> Add Student
                    </button>
                    <button
                      onClick={() => {
                        setIsQuickAddOpen(false);
                        router.push("/dashboard/applications");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-sky-600" /> Create Application
                    </button>
                    <button
                      onClick={() => {
                        setIsQuickAddOpen(false);
                        router.push("/dashboard/documents");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-amber-600" /> Upload Document
                    </button>
                    <button
                      onClick={() => {
                        setIsQuickAddOpen(false);
                        router.push("/dashboard/appointments");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-emerald-600" /> Schedule Session
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Authenticated Role Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              {currentUser.roleTitle ||
                (role === "admin"
                  ? "Agency Director"
                  : role === "counselor"
                  ? "Senior Counselor"
                  : "Student Applicant")}
            </span>
          </div>

          {/* Real-Time Notifications Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
            title={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Help link */}
          <Link
            href="/how-it-works"
            className="hidden sm:inline-flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Help & Knowledge Base"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          {/* User profile dropdown */}
          <div className="relative pl-1">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="sm"
                statusIndicator="online"
              />
            </button>

            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsProfileMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-40 animate-in fade-in zoom-in-95 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-slate-100 text-[10px] font-bold text-slate-700 uppercase">
                      {currentUser.roleTitle}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href={role === "student" ? "/student/profile" : "/dashboard/settings"}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" /> My Profile
                    </Link>
                    <Link
                      href={role === "student" ? "/student/settings" : "/dashboard/settings"}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" /> Account Settings
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Slide-over notifications */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        loading={loadingNotifs}
        onMarkAllRead={handleMarkAllRead}
        onMarkAsRead={handleMarkAsRead}
        onDeleteNotification={handleDeleteNotification}
      />

      {/* Global command palette search modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
