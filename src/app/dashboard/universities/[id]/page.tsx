"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  ExternalLink,
  Award,
  FileCheck,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { StatusBadge } from "@/components/ui/Badge";
import { universitiesApi } from "@/lib/api/universities";
import { University, Course } from "@/types";

export default function UniversityDetailPage() {
  const params = useParams();
  const uniId = params.id as string;

  const [university, setUniversity] = useState<University | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const data = await universitiesApi.getById(uniId);
        setUniversity(data.university);
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to load university details", err);
      } finally {
        setLoading(false);
      }
    };
    if (uniId) fetchUniversity();
  }, [uniId]);

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        <span className="text-xs text-slate-500 font-medium">Loading university partner dossier...</span>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <p className="text-sm font-bold text-slate-800">University partner not found</p>
        <Link href="/dashboard/universities">
          <Button variant="primary" size="sm">
            Back to Universities
          </Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview & Requirements" },
    { id: "courses", label: "Active Programs", count: courses.length },
    { id: "scholarships", label: "Scholarships & Intakes" },
    { id: "commission", label: "Agency Commission Terms" },
  ];

  return (
    <div className="space-y-6">
      {/* Top back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/universities"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to University Directory
        </Link>
      </div>

      {/* Hero Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-teal-700 text-xl shadow-2xs">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">{university.name}</h1>
                <StatusBadge status={university.agentStatus} />
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{university.city}, {university.country}</span>
                <span>•</span>
                <span className="font-semibold text-slate-900">{university.ranking}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {university.website && (
              <a
                href={university.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Official Portal
                </Button>
              </a>
            )}
            <Link href="/dashboard/applications">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Create Application
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick parameters bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">App Fee</span>
            <p className="font-bold text-slate-900 mt-0.5">{university.applicationFee > 0 ? `${university.currency} ${university.applicationFee}` : "No Fee"}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Average Tuition</span>
            <p className="font-bold text-slate-900 mt-0.5">{university.avgTuition}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Primary Intakes</span>
            <p className="font-bold text-slate-900 mt-0.5">{(university.intakes || []).join(", ")}</p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
            <span className="text-[10px] text-teal-700 uppercase font-bold">Commission Terms</span>
            <p className="font-bold text-teal-900 mt-0.5">{university.commissionRate}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Institutional Profile & Faculty Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {university.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600" /> General Entry Requirements
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {university.requirementsSummary}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> Scholarships & Bursaries
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {university.scholarshipsSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Courses */}
      {activeTab === "courses" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Programs Catalog ({courses.length})</h3>
            <Link href="/dashboard/courses">
              <Button variant="outline" size="xs">
                Open Course Matcher
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {courses.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {c.studyLevel} • {c.subjectArea}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{c.courseName}</h4>
                  <p className="text-xs text-slate-500">
                    Duration: {c.duration} • IELTS Requirement: {c.ieltsRequirement}
                  </p>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-400">Tuition:</span>
                    <p className="text-sm font-bold text-slate-900">
                      {c.currency} {c.tuitionFee?.toLocaleString()}
                    </p>
                  </div>
                  <Link href={`/dashboard/courses/${c.id}`}>
                    <Button variant="outline" size="xs">
                      Course Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Scholarships */}
      {activeTab === "scholarships" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Intake Deadlines & Scholarship Schemes
          </h3>
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              <strong>Upcoming Intake Deadlines:</strong> Applications for September 2027 must be submitted prior to May 31, 2027 for priority scholarship consideration.
            </p>
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 space-y-2">
              <span className="font-bold text-teal-900">Available Merit Awards:</span>
              <p className="text-teal-800">{university.scholarshipsSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Commission */}
      {activeTab === "commission" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Contractual Commission Structure (Admin Confidential)
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Standard Partner Commission</span>
              <span className="font-bold text-emerald-700">{university.commissionRate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Payout Schedule</span>
              <span className="font-medium text-slate-800">45 days after student census date</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Agency Split Rule</span>
              <span className="font-medium text-slate-800">65% Agency / 35% Counselor Incentive</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
