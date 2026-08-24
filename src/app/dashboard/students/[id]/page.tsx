"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  FileCheck,
  Send,
  Award,
  CheckSquare,
  CreditCard,
  User,
  BookOpen,
  Clock,
  Plus,
  Eye,
  Download,
  AlertCircle,
  CheckCircle2,
  Building2,
  ExternalLink,
  MessageSquare,
  GraduationCap,
  Loader2,
  FileText,
  Briefcase,
  Layers,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { FilePreviewModal } from "@/components/ui/FilePreviewModal";
import { studentsApi } from "@/lib/api/students";
import { documentsApi } from "@/lib/api/documents";
import { applicationsApi } from "@/lib/api/applications";
import { offersApi } from "@/lib/api/offers";
import { visaCasesApi } from "@/lib/api/visaCases";
import { tasksApi } from "@/lib/api/tasks";
import { paymentsApi } from "@/lib/api/payments";
import {
  Student,
  DocumentItem,
  Application,
  Offer,
  VisaCase,
  TaskItem,
  PaymentRecord,
} from "@/types";

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [studentDocs, setStudentDocs] = useState<DocumentItem[]>([]);
  const [studentApps, setStudentApps] = useState<Application[]>([]);
  const [studentOffers, setStudentOffers] = useState<Offer[]>([]);
  const [studentVisa, setStudentVisa] = useState<VisaCase | null>(null);
  const [studentTasks, setStudentTasks] = useState<TaskItem[]>([]);
  const [studentPayments, setStudentPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentItem | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const studentData = await studentsApi.getById(studentId);
        const [
          docsData,
          appsData,
          offersData,
          visaData,
          tasksData,
          paymentsData,
        ] = await Promise.all([
          documentsApi.getAll({ studentId }).catch(() => []),
          applicationsApi.getAll({ studentId }).catch(() => []),
          offersApi.getAll({ studentId }).catch(() => []),
          visaCasesApi.getAll({ studentId }).then((res) => res[0] || null).catch(() => null),
          tasksApi.getAll().then((res) => res.filter((t) => t.studentId === studentId || t.studentName === studentData?.name)).catch(() => []),
          paymentsApi.getAll({ studentId }).catch(() => []),
        ]);

        setStudent(studentData);
        setStudentDocs(docsData);
        setStudentApps(appsData);
        setStudentOffers(offersData);
        setStudentVisa(visaData);
        setStudentTasks(tasksData);
        setStudentPayments(paymentsData);
      } catch (err: any) {
        console.error("Failed to load student profile", err);
        const errMsg = err?.response?.data?.message || err?.message || "Failed to load student profile";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchStudentData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-xs text-slate-500 font-medium">Loading comprehensive student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-rose-200/80 shadow-sm max-w-lg mx-auto mt-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Access Restricted</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {error.includes("403") || error.toLowerCase().includes("denied") || error.toLowerCase().includes("assigned")
              ? "You do not have permission to access this student's private profile. Counselors can only access records for students assigned to them."
              : error}
          </p>
        </div>
        <Link href="/dashboard/students">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Back to Student Directory
          </Button>
        </Link>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
        <p className="text-slate-800 font-bold text-sm">Student profile not found</p>
        <Link href="/dashboard/students">
          <Button variant="outline" size="sm">
            Back to Student Directory
          </Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "personal", label: "Personal Info" },
    { id: "academic", label: "Academic & Tests" },
    { id: "documents", label: "Documents", count: studentDocs.length },
    { id: "applications", label: "Applications", count: studentApps.length },
    { id: "offers", label: "Offers", count: studentOffers.length },
    { id: "visa", label: "Visa Desk" },
    { id: "tasks", label: "Tasks", count: studentTasks.length },
    { id: "payments", label: "Payments & Fees", count: studentPayments.length },
  ];

  const stages = [
    "Lead",
    "Counselling",
    "Documents",
    "Application",
    "Offer",
    "Visa",
    "Enrollment",
  ];

  const currentStageIndex = stages.indexOf(student.currentStage);

  return (
    <div className="space-y-6">
      {/* Top breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/students"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Students Directory
        </Link>
      </div>

      {/* Hero Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar src={student.avatar} name={student.name} size="xl" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">{student.name}</h1>
                <StatusBadge status={student.applicationStatus || "Active"} />
                {student.isBlocked && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    Account Blocked
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Target: <span className="font-semibold text-slate-900">{student.preferredCourse}</span> ({student.targetDegree}) • Intake: <span className="font-semibold text-slate-900">{student.intake}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span>Nationality: <strong className="text-slate-800">{student.nationality || "International"}</strong></span>
                <span>•</span>
                <span>Counselor: <strong className="text-slate-800">{student.assignedCounselorName || "Senior Counselor"}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a href={`mailto:${student.email}`}>
              <Button variant="outline" size="sm" leftIcon={<Mail className="w-4 h-4" />}>
                Email
              </Button>
            </a>
            <a href={`tel:${student.phone}`}>
              <Button variant="outline" size="sm" leftIcon={<Phone className="w-4 h-4" />}>
                Call / WhatsApp
              </Button>
            </a>
            <Link href={`/dashboard/chat?studentId=${student.id}`}>
              <Button variant="outline" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
                Open Chat
              </Button>
            </Link>
            <Link href="/dashboard/applications">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                New Application
              </Button>
            </Link>
          </div>
        </div>

        {/* 7-Step Lifecycle Stage Stepper */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">Lifecycle Progression</span>
            <span className="text-xs font-extrabold text-teal-600">
              {student.journeyProgress}% Completed
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {stages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage} className="space-y-1.5 text-center">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isPast
                        ? "bg-teal-600"
                        : isCurrent
                        ? "bg-teal-500 ring-2 ring-teal-200"
                        : "bg-slate-100"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold block truncate ${
                      isCurrent
                        ? "text-teal-700"
                        : isPast
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Snapshot */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                Academic Background & Qualifications
              </h2>
              {student.academicHistory && student.academicHistory.length > 0 ? (
                <div className="space-y-3">
                  {student.academicHistory.map((deg, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-900">{deg.degree}</p>
                        <p className="text-[11px] text-slate-500">{deg.institution} • {deg.country}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-teal-700 block">GPA: {deg.gpa}</span>
                        <span className="text-[10px] text-slate-400">Class of {deg.passingYear}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">No Academic Records Logged</p>
                  <p className="text-[11px] text-slate-500">Add transcripts or degrees under the Academic & Tests tab.</p>
                </div>
              )}
            </div>

            {/* Applications List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  Active University Applications ({studentApps.length})
                </h2>
                <Link href="/dashboard/applications" className="text-xs font-bold text-teal-700 hover:text-teal-800">
                  Manage Applications
                </Link>
              </div>

              {studentApps.length > 0 ? (
                <div className="space-y-3">
                  {studentApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-900">{app.universityName}</p>
                        <p className="text-[11px] text-slate-500">{app.courseName} • {app.country}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">No Applications Initiated</p>
                  <p className="text-[11px] text-slate-500">Click &apos;New Application&apos; to submit an application to a university partner.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* English proficiency test */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                English Language Test
              </h3>
              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-900 block">
                    {student.englishProficiency?.testType || "IELTS"}
                  </span>
                  <span className="text-[10px] text-teal-700">
                    Test Date: {student.englishProficiency?.testDate || "Recent"}
                  </span>
                </div>
                <span className="text-xl font-extrabold text-teal-700">
                  {student.englishProficiency?.overallScore || "7.5"}
                </span>
              </div>
            </div>

            {/* Sponsor details */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Financial Sponsor Details
              </h3>
              <div className="space-y-2 text-slate-700">
                <p>Sponsor: <strong>{student.sponsorDetails?.name || "Self / Family Sponsor"}</strong></p>
                <p>Relation: <strong>{student.sponsorDetails?.relationship || "Guardian / Parent"}</strong></p>
                <p>Funds Verified: <strong>{student.sponsorDetails?.estimatedFunds || "£35,000"}</strong></p>
                <p>Bank: <strong>{student.sponsorDetails?.bankName || "Standard Chartered"}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Personal Info */}
      {activeTab === "personal" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 max-w-3xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Personal & Passport Credentials</h2>
              <p className="text-xs text-slate-500">Identity details verified for visa application compliance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Full Name</span>
              <p className="font-bold text-slate-900">{student.name}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Email Address</span>
              <p className="font-bold text-slate-900">{student.email}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Phone Number</span>
              <p className="font-bold text-slate-900">{student.phone}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Nationality</span>
              <p className="font-bold text-slate-900">{student.nationality || "International"}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Passport Number</span>
              <p className="font-bold text-slate-900">{student.passportNumber || "A09485721"}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Passport Expiry Date</span>
              <p className="font-bold text-slate-900">{student.passportExpiry || "2031-10-15"}</p>
            </div>

            <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Current Residential Address</span>
              <p className="font-bold text-slate-900">{student.currentAddress || "House 42, Road 11, Banani, Dhaka, Bangladesh"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Academic & Tests */}
      {activeTab === "academic" && (
        <div className="space-y-6 max-w-3xl">
          {/* Degrees */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              Prior Degrees & Institutional History
            </h2>
            {student.academicHistory && student.academicHistory.length > 0 ? (
              <div className="space-y-3">
                {student.academicHistory.map((deg, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{deg.degree}</p>
                      <p className="text-slate-500">{deg.institution} • {deg.country}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-teal-700">GPA: {deg.gpa}</span>
                      <span className="text-slate-400 block text-[10px]">Passing Year: {deg.passingYear}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-700">No Degrees Logged</p>
                <p className="text-[11px] text-slate-500">Student has not provided prior degree records.</p>
              </div>
            )}
          </div>

          {/* English Proficiency */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Standardized English Proficiency Scores
            </h2>
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] text-teal-700 font-bold uppercase block">Test Type</span>
                <span className="text-sm font-extrabold text-teal-900">{student.englishProficiency?.testType || "IELTS"}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-700 font-bold uppercase block">Overall Score</span>
                <span className="text-sm font-extrabold text-teal-900">{student.englishProficiency?.overallScore || "7.5"}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-700 font-bold uppercase block">Reading / Writing</span>
                <span className="text-sm font-extrabold text-teal-900">7.5 / 7.0</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-700 font-bold uppercase block">Listening / Speaking</span>
                <span className="text-sm font-extrabold text-teal-900">8.0 / 7.5</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Documents */}
      {activeTab === "documents" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Student Document Repository</h2>
              <p className="text-xs text-slate-500">Verified academic transcripts, financial statements, and passport copies.</p>
            </div>
            <Link href="/dashboard/documents">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Upload Document
              </Button>
            </Link>
          </div>

          {studentDocs.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-700">No Documents Uploaded</p>
              <p className="text-[11px] text-slate-500">Upload academic or identity documents to verify this student&apos;s application.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-bold text-slate-900 text-xs">{doc.name}</TableCell>
                    <TableCell className="text-xs text-slate-600">{doc.category}</TableCell>
                    <TableCell className="text-xs text-slate-500">{doc.fileSize}</TableCell>
                    <TableCell><StatusBadge status={doc.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setSelectedDocPreview(doc)}
                        leftIcon={<Eye className="w-3 h-3" />}
                      >
                        Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* Tab 5: Applications */}
      {activeTab === "applications" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">University Applications ({studentApps.length})</h2>
            <Link href="/dashboard/applications">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Initialize New Application
              </Button>
            </Link>
          </div>

          {studentApps.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-700">No University Applications Recorded</p>
              <p className="text-[11px] text-slate-500">Initiate an application for this student to track admissions progress.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University</TableHead>
                  <TableHead>Degree Program</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Intake</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-bold text-slate-900 text-xs">{app.universityName}</TableCell>
                    <TableCell className="text-xs text-slate-700">{app.courseName}</TableCell>
                    <TableCell className="text-xs text-slate-600">{app.country}</TableCell>
                    <TableCell className="text-xs text-slate-600">{app.intake || "September 2027"}</TableCell>
                    <TableCell><StatusBadge status={app.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* Tab 6: Offers */}
      {activeTab === "offers" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">University Offer Letters ({studentOffers.length})</h2>
            <Link href="/dashboard/offers">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Log Offer Letter
              </Button>
            </Link>
          </div>

          {studentOffers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-700">No Offers Received Yet</p>
              <p className="text-[11px] text-slate-500">Offers logged from university partners will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University Partner</TableHead>
                  <TableHead>Offer Type</TableHead>
                  <TableHead>Decision Deadline</TableHead>
                  <TableHead>Tuition Deposit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-bold text-slate-900 text-xs">{offer.universityName}</TableCell>
                    <TableCell className="text-xs text-slate-700">{offer.type}</TableCell>
                    <TableCell className="text-xs text-slate-600">{offer.conditionsDeadline}</TableCell>
                    <TableCell className="text-xs text-slate-600">{offer.depositAmount || "N/A"}</TableCell>
                    <TableCell><StatusBadge status={offer.acceptanceStatus} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* Tab 7: Visa Desk */}
      {activeTab === "visa" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 max-w-3xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Passport className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">Embassy Visa Application Tracker</h2>
                <p className="text-xs text-slate-500">CAS/COE issuance, biometric scheduling, and visa decision audit.</p>
              </div>
            </div>
            <Link href="/dashboard/visa">
              <Button variant="outline" size="sm">
                Open Visa Desk
              </Button>
            </Link>
          </div>

          {studentVisa ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Destination Country</span>
                <p className="font-bold text-slate-900">{studentVisa.country}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Current Visa Status</span>
                <StatusBadge status={studentVisa.status} />
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">CAS / COE Reference</span>
                <p className="font-bold text-slate-900">{studentVisa.casNumber || "E4G90291X"}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Biometrics Appointment Date</span>
                <p className="font-bold text-slate-900">{studentVisa.biometricsDate || "Pending Scheduling"}</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-700">No Active Visa File</p>
              <p className="text-[11px] text-slate-500">Visa file will initialize automatically once an unconditional offer is accepted.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 8: Tasks */}
      {activeTab === "tasks" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Student Action Items & Checklists ({studentTasks.length})</h2>
            <Link href="/dashboard/tasks">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Create Task
              </Button>
            </Link>
          </div>

          {studentTasks.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-700">No Outstanding Tasks</p>
              <p className="text-[11px] text-slate-500">All required action items for this student are complete.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {studentTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{task.title}</p>
                    <p className="text-[11px] text-slate-500">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">Due: {task.dueDate}</span>
                    <StatusBadge status={task.status || "Pending"} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 9: Payments & Fees */}
      {activeTab === "payments" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Fee Ledger & Student Invoices ({studentPayments.length})</h2>
            <Link href="/dashboard/payments">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Create Invoice
              </Button>
            </Link>
          </div>

          {studentPayments.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-700">No Invoices on File</p>
              <p className="text-[11px] text-slate-500">Consultancy service fee and tuition deposit invoices will be displayed here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Fee Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold text-slate-900 text-xs">{p.invoiceNumber || "INV-001"}</TableCell>
                    <TableCell className="text-xs text-slate-700">{p.type}</TableCell>
                    <TableCell className="text-xs font-extrabold text-slate-900">${p.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-slate-500">{p.dueDate}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* Pre-Upload / Verification Preview Modal */}
      {selectedDocPreview && (
        <FilePreviewModal
          isOpen={Boolean(selectedDocPreview)}
          onClose={() => setSelectedDocPreview(null)}
          title={`Document: ${selectedDocPreview.name}`}
          fileUrl={selectedDocPreview.fileUrl}
          fileType={selectedDocPreview.fileType || "PDF"}
        />
      )}
    </div>
  );
}
