"use client";

import React, { useState } from "react";
import { Lock, Bell, Globe, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

export default function StudentSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Student Portal</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Preferences</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Account Security & Alert Settings
          </h1>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Preferences Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notifications */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-600" /> Communication & Alert Preferences
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">WhatsApp Admissions Notifications</span>
                <span className="text-slate-500">Receive instant alerts when counselor reviews documents or universities issue offers.</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Email Digest & Intake Deadlines</span>
                <span className="text-slate-500">Weekly progress report and upcoming submission calendar.</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4" />
            </label>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" /> Security & Password
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
