"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { applicationsApi } from "@/lib/api/applications";
import { Application } from "@/types";

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const data = await applicationsApi.getMyApplications();
        setApplications(data || []);
      } catch (err) {
        console.error("Failed to load my applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span>Student Portal</span>
          <span>•</span>
          <span className="text-teal-700 font-semibold">Admissions Applications</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          My University Applications ({applications.length})
        </h1>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading your applications...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No applications found</p>
          <p className="text-xs text-slate-500">
            Your counselor will initialize university submissions once your documents are verified.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-lg shadow-2xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{app.universityName}</h3>
                    <p className="text-xs text-slate-600">
                      {app.courseName} • {app.country} • <span className="font-semibold text-teal-700">{app.intake}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                </div>
              </div>

              {/* Milestones Stepper */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Application Milestones
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {app.timeline?.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex items-center gap-3 ${
                        step.completed
                          ? "bg-teal-50/70 border-teal-200 text-teal-900"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          step.completed ? "text-teal-600" : "text-slate-300"
                        }`}
                      />
                      <div>
                        <p className="font-bold">{step.title}</p>
                        <span className="text-[10px] text-slate-500">{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


