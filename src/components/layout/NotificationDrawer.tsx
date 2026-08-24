"use client";

import React from "react";
import {
  X,
  CheckCircle2,
  Award,
  FileText,
  UserPlus,
  Loader2,
  Trash2,
  Calendar,
  CreditCard,
  Bell,
  CheckCheck,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { Button } from "@/components/ui/Button";
import { NotificationItem } from "@/lib/api/notifications";
import { useRouter } from "next/navigation";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  onMarkAllRead: () => Promise<void>;
  onMarkAsRead: (id: string) => Promise<void>;
  onDeleteNotification: (id: string) => Promise<void>;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  loading,
  onMarkAllRead,
  onMarkAsRead,
  onDeleteNotification,
}: NotificationDrawerProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "offer":
        return <Award className="w-4 h-4 text-emerald-600" />;
      case "document":
        return <FileText className="w-4 h-4 text-teal-600" />;
      case "visa":
        return <Passport className="w-4 h-4 text-amber-600" />;
      case "lead":
        return <UserPlus className="w-4 h-4 text-indigo-600" />;
      case "appointment":
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case "task":
        return <CheckCircle2 className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-teal-600" />;
    }
  };

  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.isRead) {
      await onMarkAsRead(n.id);
    }

    if (n.link) {
      onClose();
      router.push(n.link);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await onDeleteNotification(id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Real-time alerts across your cases</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                <span className="text-xs text-slate-400">Loading alerts...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No notifications right now</p>
                <p className="text-[11px] text-slate-400">You're all caught up with your admissions workflow.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`group p-3 rounded-2xl transition-all cursor-pointer relative border ${
                    n.isRead
                      ? "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                      : "bg-teal-50/50 border-teal-200/60 hover:bg-teal-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-100 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-bold ${n.isRead ? "text-slate-700" : "text-slate-900"}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1.5 block font-medium">
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Just now"}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, n.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all absolute top-3 right-3"
                      title="Delete alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <Button
              variant="ghost"
              size="xs"
              onClick={onMarkAllRead}
              disabled={unreadCount === 0}
              leftIcon={<CheckCheck className="w-3.5 h-3.5 text-teal-600" />}
            >
              Mark all read
            </Button>
            <Button variant="outline" size="xs" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
