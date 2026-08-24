"use client";

import React, { useState, useEffect } from "react";
import { Search, GraduationCap, Users, Building2, BookOpen, ArrowRight, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { studentsApi } from "@/lib/api/students";
import { leadsApi } from "@/lib/api/leads";
import { universitiesApi } from "@/lib/api/universities";
import { coursesApi } from "@/lib/api/courses";
import { Student, Lead, University, Course } from "@/types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setStudents([]);
        setLeads([]);
        setUniversities([]);
        setCourses([]);
        return;
      }

      setLoading(true);
      try {
        const [studentsRes, leadsRes, unisRes, coursesRes] = await Promise.all([
          studentsApi.getAll({ search: query }).catch(() => []),
          leadsApi.getAll({ search: query }).catch(() => []),
          universitiesApi.getAll({ search: query }).catch(() => []),
          coursesApi.getAll({ search: query }).catch(() => []),
        ]);
        setStudents(studentsRes.slice(0, 4));
        setLeads(leadsRes.slice(0, 4));
        setUniversities(unisRes.slice(0, 4));
        setCourses(coursesRes.slice(0, 4));
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
  };

  const hasResults =
    students.length > 0 ||
    leads.length > 0 ||
    universities.length > 0 ||
    courses.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95">
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, leads, universities, courses... (e.g. Manchester, Farhan)"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-teal-600 shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <p className="text-xs text-slate-400 text-center py-6">
              Type to search live candidates, institutions, or program options
            </p>
          )}

          {query.trim() && !loading && !hasResults && (
            <p className="text-xs text-slate-400 text-center py-6">
              No matching records found for "{query}"
            </p>
          )}

          {/* Students Section */}
          {students.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Students
              </span>
              <div className="space-y-1">
                {students.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(`/dashboard/students/${s.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-100">
                        <GraduationCap className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-teal-700">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {s.preferredCourse || s.preferredCountries?.join(", ")} • {s.nationality}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads Section */}
          {leads.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Leads CRM
              </span>
              <div className="space-y-1">
                {leads.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect(`/dashboard/leads/${l.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <Users className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700">
                          {l.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {l.preferredCourse || l.countryInterest?.join(", ")} • {l.leadSource}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Universities Section */}
          {universities.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Partner Universities
              </span>
              <div className="space-y-1">
                {universities.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelect(`/dashboard/universities/${u.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        <Building2 className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-teal-700">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {u.city}, {u.country} • {u.ranking}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courses Section */}
          {courses.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Courses
              </span>
              <div className="space-y-1">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(`/dashboard/courses/${c.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <BookOpen className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700">
                          {c.courseName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {c.universityName} • {c.studyLevel}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
