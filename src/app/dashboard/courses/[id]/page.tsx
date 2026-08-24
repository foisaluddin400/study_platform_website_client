"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Award,
  CheckCircle2,
  Briefcase,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { coursesApi } from "@/lib/api/courses";
import { Course } from "@/types";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.getById(courseId);
        setCourse(data);
      } catch (err) {
        console.error("Failed to load course details", err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        <span className="text-xs text-slate-500 font-medium">Loading course syllabus...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <p className="text-sm font-bold text-slate-800">Course not found</p>
        <Link href="/dashboard/courses">
          <Button variant="primary" size="sm">
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course Catalog
        </Link>
      </div>

      {/* Hero Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {course.studyLevel} • {course.subjectArea}
              </span>
              <span className="text-xs text-slate-500 font-medium">{course.country}</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">{course.courseName}</h1>

            <Link
              href={`/dashboard/universities/${course.universityId || (course as any).university?._id || (course as any).university}`}
              className="text-xs text-teal-700 hover:underline flex items-center gap-1.5 font-semibold"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{course.universityName}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/applications">
              <Button variant="primary" size="sm" leftIcon={<Send className="w-4 h-4" />}>
                Create Application for Student
              </Button>
            </Link>
          </div>
        </div>

        {/* Matrix Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Annual Tuition Fee</span>
            <p className="font-bold text-slate-900 mt-0.5">{course.currency} {course.tuitionFee?.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Program Duration</span>
            <p className="font-bold text-slate-900 mt-0.5">{course.duration}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">IELTS Requirement</span>
            <p className="font-bold text-slate-900 mt-0.5">{course.ieltsRequirement}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Intakes</span>
            <p className="font-bold text-slate-900 mt-0.5">{(course.intakes || []).join(", ")}</p>
          </div>
        </div>
      </div>

      {/* 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Description & Career Outcomes */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Curriculum Overview & Specialization
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" /> Graduate Career Outcomes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(course.careerOutcomes || []).map((career, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{career}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Requirements & Scholarship */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Admission Requirements
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700">Academic Background / GPA:</span>
                <p className="text-slate-600 mt-0.5">{course.gpaRequirement}</p>
              </div>
              <div className="pt-2 border-t border-slate-50">
                <span className="font-bold text-slate-700">English Language Test:</span>
                <p className="text-slate-600 mt-0.5">{course.ieltsRequirement}</p>
              </div>
              <div className="pt-2 border-t border-slate-50">
                <span className="font-bold text-slate-700">Next Application Deadline:</span>
                <p className="font-bold text-rose-600 mt-0.5">{course.deadline}</p>
              </div>
            </div>
          </div>

          {course.scholarshipAvailable && (
            <div className="p-6 rounded-3xl bg-teal-50 border border-teal-200 text-teal-950 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-600" /> Scholarship Opportunities
              </span>
              <p className="text-xs text-teal-900 font-medium leading-relaxed">
                {course.scholarshipDetails}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
