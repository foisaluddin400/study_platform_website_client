"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Sparkles,
  Building2,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Layers,
  ArrowRight,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { coursesApi } from "@/lib/api/courses";
import { studentsApi } from "@/lib/api/students";
import { universitiesApi } from "@/lib/api/universities";
import { agenciesApi } from "@/lib/api/agencies";
import { Course, Student, University } from "@/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [operatingCountries, setOperatingCountries] = useState<string[]>([
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "United States",
    "Malaysia",
  ]);
  const [availableDegrees, setAvailableDegrees] = useState<string[]>([
    "Master's",
    "Bachelor's",
    "Doctorate",
    "Diploma",
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  // Shortlist drawer state
  const [shortlistedCourses, setShortlistedCourses] = useState<Course[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);
  const [selectedCourseForShortlist, setSelectedCourseForShortlist] = useState<Course | null>(null);
  const [targetStudentId, setTargetStudentId] = useState("");

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const [coursesData, studentsData, agencyData, unisData] = await Promise.all([
        coursesApi.getAll({
          country: countryFilter !== "All" ? countryFilter : undefined,
          studyLevel: levelFilter !== "All" ? levelFilter : undefined,
          subject: subjectFilter !== "All" ? subjectFilter : undefined,
          search: searchQuery || undefined,
        }),
        studentsApi.getAll().catch(() => []),
        agenciesApi.getProfile().catch(() => null),
        universitiesApi.getAll().catch(() => []),
      ]);
      setCourses(coursesData);
      setStudents(studentsData);
      if (studentsData.length > 0 && !targetStudentId) {
        setTargetStudentId(studentsData[0].id);
      }
      if (agencyData?.operatingCountries && agencyData.operatingCountries.length > 0) {
        setOperatingCountries(agencyData.operatingCountries);
      }

      // Collect unique degree tags from universities
      const degreesSet = new Set<string>(["Master's", "Bachelor's", "Doctorate", "Diploma"]);
      unisData.forEach((u: University) => {
        if (u.degrees && Array.isArray(u.degrees)) {
          u.degrees.forEach((d) => degreesSet.add(d));
        }
      });
      setAvailableDegrees(Array.from(degreesSet));
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  }, [countryFilter, levelFilter, subjectFilter, searchQuery]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const toggleShortlist = (course: Course) => {
    if (shortlistedCourses.some((c) => c.id === course.id)) {
      setShortlistedCourses(shortlistedCourses.filter((c) => c.id !== course.id));
    } else {
      if (shortlistedCourses.length >= 4) {
        alert("You can compare up to 4 courses at a time.");
        return;
      }
      setShortlistedCourses([...shortlistedCourses, course]);
    }
  };

  const handleAssignShortlist = () => {
    setIsShortlistModalOpen(false);
    alert(`Course added to shortlisted options for student!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Course Discovery</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Program Matcher</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Global Programs & Degree Matcher
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {courses.length} Programs
            </span>
          </h1>
        </div>

        {shortlistedCourses.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCompareModalOpen(true)}
            leftIcon={<Layers className="w-4 h-4" />}
          >
            Compare ({shortlistedCourses.length}) Programs
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs by title, university, discipline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Operating Country filter */}
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
        >
          <option value="All">All Operating Countries</option>
          {operatingCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* University Degree levels filter */}
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
        >
          <option value="All">All Degree Levels</option>
          {availableDegrees.map((deg) => (
            <option key={deg} value={deg}>
              {deg}
            </option>
          ))}
        </select>
      </div>

      {/* Courses Cards Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Matching courses catalog...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No matching programs found</p>
          <p className="text-xs text-slate-500">Adjust your destination or degree filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isShortlisted = shortlistedCourses.some((c) => c.id === course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{course.universityName}</p>
                        <span className="text-[11px] text-slate-500">{course.country}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                      {course.studyLevel}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{course.courseName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{course.subjectArea} • {course.duration}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Tuition Fee:</span>
                      <strong className="text-slate-900">
                        {course.currency} {course.tuitionFee?.toLocaleString()} / yr
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">English Requirement:</span>
                      <strong className="text-slate-900">{course.ieltsRequirement}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Minimum GPA:</span>
                      <strong className="text-slate-900">{course.gpaRequirement}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant={isShortlisted ? "primary" : "outline"}
                    size="xs"
                    onClick={() => toggleShortlist(course)}
                  >
                    {isShortlisted ? "In Comparison" : "Compare"}
                  </Button>

                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setSelectedCourseForShortlist(course);
                      setIsShortlistModalOpen(true);
                    }}
                    leftIcon={<Plus className="w-3 h-3" />}
                  >
                    Shortlist for Student
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compare Modal */}
      <Modal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        title="Compare University Programs"
        description="Side-by-side comparison matrix for student counselling sessions."
        maxWidth="4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortlistedCourses.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{c.universityName}</span>
                <button
                  type="button"
                  onClick={() => toggleShortlist(c)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="font-bold text-teal-800">{c.courseName}</p>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <p>Fee: <strong>{c.currency} {c.tuitionFee?.toLocaleString()}</strong></p>
                <p>IELTS: <strong>{c.ieltsRequirement}</strong></p>
                <p>GPA: <strong>{c.gpaRequirement}</strong></p>
                <p>Intakes: <strong>{c.intakes?.join(", ")}</strong></p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Shortlist Modal */}
      {selectedCourseForShortlist && (
        <Modal
          isOpen={isShortlistModalOpen}
          onClose={() => setIsShortlistModalOpen(false)}
          title="Recommend Program to Student"
          description={`Assign ${selectedCourseForShortlist.courseName} at ${selectedCourseForShortlist.universityName}.`}
        >
          <div className="space-y-4 text-xs">
            <select
              value={targetStudentId}
              onChange={(e) => setTargetStudentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsShortlistModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAssignShortlist}>
                Save to Student Portfolio
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
