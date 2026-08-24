"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send,
  Search,
  Plus,
  LayoutGrid,
  List,
  Building2,
  Calendar,
  Eye,
  Loader2,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { applicationsApi } from "@/lib/api/applications";
import { studentsApi } from "@/lib/api/students";
import { universitiesApi } from "@/lib/api/universities";
import { agenciesApi } from "@/lib/api/agencies";
import { mockUniversities } from "@/data/mockData";
import { Application, ApplicationStatus, Student, University } from "@/types";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [operatingCountries, setOperatingCountries] = useState<string[]>([
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "United States",
    "Malaysia",
  ]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Confirm delete dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    appId: string;
    appName: string;
  }>({
    isOpen: false,
    appId: "",
    appName: "",
  });

  // New Application form state
  const [newApp, setNewApp] = useState({
    studentId: "",
    universityId: "",
    courseName: "",
    country: "United Kingdom",
    studyLevel: "Master's Degree",
    intake: "September 2027",
    notes: "",
  });

  // Edit Application form state
  const [editApp, setEditApp] = useState({
    id: "",
    courseName: "",
    country: "",
    intake: "",
    status: "Submitted" as ApplicationStatus,
    notes: "",
  });

  const kanbanColumns: { id: string; title: string; statuses: ApplicationStatus[]; color: string }[] = [
    {
      id: "col-draft",
      title: "Draft & Ready",
      statuses: ["Draft", "Documents Pending", "Ready to Apply"],
      color: "border-slate-300 bg-slate-50/50",
    },
    {
      id: "col-submitted",
      title: "Submitted to Portal",
      statuses: ["Submitted"],
      color: "border-sky-300 bg-sky-50/30",
    },
    {
      id: "col-review",
      title: "Under Review",
      statuses: ["Under Review"],
      color: "border-indigo-300 bg-indigo-50/30",
    },
    {
      id: "col-offers",
      title: "Offer Received",
      statuses: ["Conditional Offer", "Unconditional Offer"],
      color: "border-emerald-300 bg-emerald-50/30",
    },
  ];

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true);
      const [appsData, studentsData, unisData, agencyData] = await Promise.all([
        applicationsApi.getAll({
          search: searchQuery || undefined,
        }).catch(() => []),
        studentsApi.getAll().catch(() => []),
        universitiesApi.getAll().catch(() => []),
        agenciesApi.getProfile().catch(() => null),
      ]);

      const finalUniversities = unisData && unisData.length > 0 ? unisData : mockUniversities;
      setApplications(appsData || []);
      setStudents(studentsData || []);
      setUniversities(finalUniversities);

      if (agencyData?.operatingCountries && agencyData.operatingCountries.length > 0) {
        setOperatingCountries(agencyData.operatingCountries);
      }

      if (finalUniversities.length > 0 && !newApp.universityId) {
        setNewApp((prev) => ({
          ...prev,
          universityId: finalUniversities[0].id,
          country: finalUniversities[0].country,
        }));
      }

      if (studentsData.length > 0 && !newApp.studentId) {
        setNewApp((prev) => ({ ...prev, studentId: studentsData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleUniversityChange = (uniId: string) => {
    const uni = universities.find((u) => u.id === uniId);
    setNewApp({
      ...newApp,
      universityId: uniId,
      country: uni?.country || newApp.country,
    });
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!newApp.studentId) {
      setModalError("Please select a student applicant.");
      return;
    }
    if (!newApp.universityId) {
      setModalError("Please select a target university.");
      return;
    }
    if (!newApp.courseName.trim()) {
      setModalError("Please enter the degree program / course name.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await applicationsApi.create({
        studentId: newApp.studentId,
        universityId: newApp.universityId,
        courseName: newApp.courseName.trim(),
        degreeProgram: newApp.courseName.trim(),
        country: newApp.country,
        studyLevel: newApp.studyLevel,
        intake: newApp.intake,
        notes: newApp.notes,
      });

      setApplications([created, ...applications]);
      setIsAddModalOpen(false);
      setNewApp({
        studentId: students[0]?.id || "",
        universityId: universities[0]?.id || "",
        courseName: "",
        country: "United Kingdom",
        studyLevel: "Master's Degree",
        intake: "September 2027",
        notes: "",
      });
    } catch (err: any) {
      setModalError(err.message || "Failed to initialize university application.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (app: Application) => {
    setSelectedApp(app);
    setEditApp({
      id: app.id,
      courseName: app.courseName,
      country: app.country,
      intake: app.intake || "September 2027",
      status: app.status,
      notes: app.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editApp.id) return;
    setSubmitting(true);
    try {
      const updated = await applicationsApi.update(editApp.id, {
        courseName: editApp.courseName,
        country: editApp.country,
        intake: editApp.intake,
        status: editApp.status,
        notes: editApp.notes,
      });

      setApplications(applications.map((a) => (a.id === editApp.id ? updated : a)));
      setIsEditModalOpen(false);
    } catch (err: any) {
      setModalError(err.message || "Failed to update application.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!confirmDelete.appId) return;
    try {
      await applicationsApi.delete(confirmDelete.appId);
      setApplications(applications.filter((a) => a.id !== confirmDelete.appId));
      setConfirmDelete({ isOpen: false, appId: "", appName: "" });
    } catch (err) {
      console.error("Failed to delete application", err);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (countryFilter !== "All" && app.country !== countryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Admissions Processing</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Casework Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            University Application Pipeline
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {applications.length} Total Cases
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Kanban / Table toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setModalError(null);
              setIsAddModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Application
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, university, course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>

        {/* Country Filter from Operating Countries */}
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
        >
          <option value="All">All Operating Countries</option>
          {operatingCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Applications Pipeline View */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading applications pipeline...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No applications on file</p>
          <p className="text-xs text-slate-500">Click &apos;New Application&apos; to submit a university dossier.</p>
        </div>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colApps = filteredApplications.filter((app) => col.statuses.includes(app.status));

            return (
              <div key={col.id} className="space-y-3">
                <div className={`p-3 rounded-2xl border ${col.color} flex items-center justify-between`}>
                  <h3 className="font-bold text-xs text-slate-800">{col.title}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-xs text-slate-900 line-clamp-1">{app.studentName}</p>
                          <p className="text-[11px] text-slate-500">{app.universityName} • {app.country}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <p className="font-semibold text-slate-800 line-clamp-2">{app.courseName}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">Intake: {app.intake || "September 2027"}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {app.trackingNumber || app.id.slice(-6).toUpperCase()}
                        </span>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => openEditModal(app)}
                            title="Edit application"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() =>
                              setConfirmDelete({
                                isOpen: true,
                                appId: app.id,
                                appName: `${app.studentName} - ${app.courseName}`,
                              })
                            }
                            title="Delete application"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>University & Country</TableHead>
              <TableHead>Degree Program / Course</TableHead>
              <TableHead>Intake</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-bold text-slate-900 text-xs">{app.studentName}</TableCell>
                <TableCell className="text-xs text-slate-700">{app.universityName} • {app.country}</TableCell>
                <TableCell className="text-xs font-semibold text-slate-800">{app.courseName}</TableCell>
                <TableCell className="text-xs text-slate-500">{app.intake}</TableCell>
                <TableCell><StatusBadge status={app.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => openEditModal(app)}
                      title="Edit application"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        setConfirmDelete({
                          isOpen: true,
                          appId: app.id,
                          appName: `${app.studentName} - ${app.courseName}`,
                        })
                      }
                      title="Delete application"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* New Application Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Initialize New University Application"
        description="Attach student profile to partner university and enter the degree program course."
      >
        {modalError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {modalError}
          </div>
        )}

        <form onSubmit={handleCreateApplication} className="space-y-4">
          {students.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
              <p className="font-bold">No Students Available</p>
              <p>You must add a student profile before creating an application.</p>
              <Link href="/dashboard/students" className="text-teal-700 font-bold underline block mt-1">
                &rarr; Go to Students CRM to create a student
              </Link>
            </div>
          ) : (
            <Select
              label="Target Student Applicant"
              value={newApp.studentId}
              onChange={(e) => setNewApp({ ...newApp, studentId: e.target.value })}
              options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` }))}
              required
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Target University"
              value={newApp.universityId}
              onChange={(e) => handleUniversityChange(e.target.value)}
              options={
                universities.length > 0
                  ? universities.map((u) => ({ value: u.id, label: `${u.name} (${u.country})` }))
                  : [{ value: "", label: "No universities in catalog" }]
              }
              required
            />

            {/* Operating Country */}
            <Select
              label="Destination Country"
              value={newApp.country}
              onChange={(e) => setNewApp({ ...newApp, country: e.target.value })}
              options={operatingCountries.map((c) => ({ value: c, label: c }))}
              required
            />
          </div>

          {/* Degree Program / Course is a TEXT INPUT (Requirement 10) */}
          <Input
            label="Degree Program / Course (Type Any Program)"
            placeholder="e.g. MSc Artificial Intelligence, BSc Computer Science, LLM Corporate Law"
            required
            value={newApp.courseName}
            onChange={(e) => setNewApp({ ...newApp, courseName: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Study Level / Qualification"
              placeholder="e.g. Master's Degree, Bachelor's"
              value={newApp.studyLevel}
              onChange={(e) => setNewApp({ ...newApp, studyLevel: e.target.value })}
            />

            {/* Month + Year Intake DatePicker */}
            <DatePicker
              label="Target Intake"
              mode="month-year"
              value={newApp.intake}
              onChange={(val) => setNewApp({ ...newApp, intake: val })}
              required
            />
          </div>

          <Textarea
            label="Application Notes / Instructions"
            placeholder="e.g. Deposit voucher attached, priority admissions review requested."
            rows={2}
            value={newApp.notes}
            onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting} disabled={students.length === 0}>
              Create & Dispatch Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Application Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit University Application"
        description="Update degree program details, intake, or application status."
      >
        <form onSubmit={handleUpdateApplication} className="space-y-4">
          <Input
            label="Degree Program / Course"
            required
            value={editApp.courseName}
            onChange={(e) => setEditApp({ ...editApp, courseName: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Country"
              value={editApp.country}
              onChange={(e) => setEditApp({ ...editApp, country: e.target.value })}
              options={operatingCountries.map((c) => ({ value: c, label: c }))}
            />

            <DatePicker
              label="Intake"
              mode="month-year"
              value={editApp.intake}
              onChange={(val) => setEditApp({ ...editApp, intake: val })}
            />
          </div>

          <Select
            label="Application Status"
            value={editApp.status}
            onChange={(e) => setEditApp({ ...editApp, status: e.target.value as ApplicationStatus })}
            options={[
              { value: "Draft", label: "Draft" },
              { value: "Documents Pending", label: "Documents Pending" },
              { value: "Ready to Apply", label: "Ready to Apply" },
              { value: "Submitted", label: "Submitted" },
              { value: "Under Review", label: "Under Review" },
              { value: "Conditional Offer", label: "Conditional Offer" },
              { value: "Unconditional Offer", label: "Unconditional Offer" },
              { value: "Rejected", label: "Rejected" },
              { value: "Withdrawn", label: "Withdrawn" },
            ]}
          />

          <Textarea
            label="Notes"
            rows={2}
            value={editApp.notes}
            onChange={(e) => setEditApp({ ...editApp, notes: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save Application Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, appId: "", appName: "" })}
        onConfirm={handleDeleteApplication}
        title="Delete University Application"
        message={`Are you sure you want to delete application "${confirmDelete.appName}"?`}
        confirmText="Are you sure you want to delete this application?"
      />
    </div>
  );
}
