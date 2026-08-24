"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Loader2,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { TagInput } from "@/components/ui/TagInput";
import { DatePicker } from "@/components/ui/DatePicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { studentsApi } from "@/lib/api/students";
import { usersApi } from "@/lib/api/users";
import { agenciesApi } from "@/lib/api/agencies";
import { Student, TeamMember } from "@/types";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [operatingCountries, setOperatingCountries] = useState<string[]>([
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "United States",
    "Malaysia",
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("All");
  const [countryFilter, setCountryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // "all", "blocked", "unblocked"

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: "danger" | "warning" | "primary";
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    variant: "danger",
    action: async () => {},
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsData, teamData, agencyData] = await Promise.all([
        studentsApi.getAll({
          stage: stageFilter !== "All" ? stageFilter : undefined,
          country: countryFilter !== "All" ? countryFilter : undefined,
          search: searchQuery || undefined,
          status: statusFilter,
        }),
        usersApi.getTeam().catch(() => []),
        agenciesApi.getProfile().catch(() => null),
      ]);
      setStudents(studentsData);
      setTeamMembers(teamData);
      if (agencyData?.operatingCountries && agencyData.operatingCountries.length > 0) {
        setOperatingCountries(agencyData.operatingCountries);
      }
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  }, [stageFilter, countryFilter, searchQuery, statusFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // New Student form state
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "Bangladeshi",
    targetDegree: "Master's Degree",
    preferredCourse: "",
    preferredCountries: ["United Kingdom"],
    intake: "September 2027",
    assignedCounselors: [] as string[],
    password: "",
    confirmPassword: "",
  });

  // Edit Student form state
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    phone: "",
    nationality: "",
    targetDegree: "",
    preferredCourse: "",
    preferredCountries: [] as string[],
    intake: "",
    assignedCounselors: [] as string[],
  });

  // Filter team members: only show users with Counselor role, exclude Admins
  const counselorTeamMembers = teamMembers.filter((t) => {
    if (t.userRole) return t.userRole === "COUNSELOR";
    const roleLower = (t.role || "").toLowerCase();
    return !roleLower.includes("admin") && !roleLower.includes("director");
  });

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (newStudent.password.length < 6) {
      setModalError("Password must be at least 6 characters long.");
      return;
    }

    if (newStudent.password !== newStudent.confirmPassword) {
      setModalError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await studentsApi.create({
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        nationality: newStudent.nationality,
        targetDegree: newStudent.targetDegree,
        preferredCourse: newStudent.preferredCourse || "General Studies",
        preferredCountries: newStudent.preferredCountries,
        intake: newStudent.intake,
        assignedCounselorId: newStudent.assignedCounselors[0] || undefined,
        assignedCounselors: newStudent.assignedCounselors,
        currentStage: "Counselling",
        journeyProgress: 20,
        applicationStatus: "Draft",
        visaStatus: "Document Preparation",
        budgetRange: "$15k - $25k / year",
        enrollmentYear: new Date().getFullYear() + 1,
        password: newStudent.password,
      });

      setIsAddModalOpen(false);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        nationality: "Bangladeshi",
        targetDegree: "Master's Degree",
        preferredCourse: "",
        preferredCountries: ["United Kingdom"],
        intake: "September 2027",
        assignedCounselors: [],
        password: "",
        confirmPassword: "",
      });
      fetchStudents();
    } catch (err: any) {
      setModalError(err.message || "Failed to create student.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    const counselorIds: string[] = [];
    if (student.assignedCounselors && Array.isArray(student.assignedCounselors)) {
      student.assignedCounselors.forEach((c: any) => {
        if (typeof c === "string") counselorIds.push(c);
        else if (c?._id) counselorIds.push(c._id);
        else if (c?.id) counselorIds.push(c.id);
      });
    } else if (student.assignedCounselorId) {
      counselorIds.push(student.assignedCounselorId);
    }

    setEditForm({
      id: student.id,
      name: student.name,
      phone: student.phone,
      nationality: student.nationality || "",
      targetDegree: student.targetDegree || "",
      preferredCourse: student.preferredCourse || "",
      preferredCountries: student.preferredCountries || [],
      intake: student.intake || "",
      assignedCounselors: counselorIds,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await studentsApi.update(editForm.id, {
        name: editForm.name,
        phone: editForm.phone,
        nationality: editForm.nationality,
        targetDegree: editForm.targetDegree,
        preferredCourse: editForm.preferredCourse,
        preferredCountries: editForm.preferredCountries,
        intake: editForm.intake,
        assignedCounselorId: editForm.assignedCounselors[0] || undefined,
        assignedCounselors: editForm.assignedCounselors,
      });
      setIsEditModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      setModalError(err.message || "Failed to update student.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlockStudent = (student: Student) => {
    setConfirmDialog({
      isOpen: true,
      title: "Block Student Account",
      message: `Are you sure you want to block ${student.name}? They will immediately be denied login access to their student portal.`,
      confirmText: "Yes, Block Account",
      variant: "warning",
      action: async () => {
        await studentsApi.block(student.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        fetchStudents();
      },
    });
  };

  const handleUnblockStudent = (student: Student) => {
    setConfirmDialog({
      isOpen: true,
      title: "Unblock Student Account",
      message: `Unblock ${student.name} to restore full portal access and messaging.`,
      confirmText: "Yes, Unblock",
      variant: "primary",
      action: async () => {
        await studentsApi.unblock(student.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        fetchStudents();
      },
    });
  };

  const handleDeleteStudent = (student: Student) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Student Profile",
      message: `Are you sure you want to delete ${student.name}? All associated admissions records will be archived and they will not be able to log in.`,
      confirmText: "Are you sure you want to delete this student?",
      variant: "danger",
      action: async () => {
        await studentsApi.delete(student.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        fetchStudents();
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Admissions Directory</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Active Caseload</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Student Management & Profiles
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {students.length} Total
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Student Applicant
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter (All, Blocked, Unblocked) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
          >
            <option value="all">Status: All Records</option>
            <option value="unblocked">Status: Active (Unblocked)</option>
            <option value="blocked">Status: Blocked Only</option>
          </select>

          {/* Lifecycle Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
          >
            <option value="All">Stage: All Stages</option>
            <option value="Lead">Lead</option>
            <option value="Counselling">Counselling</option>
            <option value="Documents">Documents</option>
            <option value="Application">Application</option>
            <option value="Offer">Offer</option>
            <option value="Visa">Visa</option>
            <option value="Enrollment">Enrollment</option>
          </select>

          {/* Operating Country Filter */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
          >
            <option value="All">Destination: All Countries</option>
            {operatingCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading active students...</span>
        </div>
      ) : students.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No students found</p>
          <p className="text-xs text-slate-500">Create a student or adjust your search filter criteria.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name & Contact</TableHead>
              <TableHead>Lifecycle Stage</TableHead>
              <TableHead>Target Destinations</TableHead>
              <TableHead>Intake & Degree</TableHead>
              <TableHead>Assigned Counselors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className={student.isBlocked ? "bg-rose-50/30" : undefined}>
                {/* Student */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={student.avatar} name={student.name} size="sm" />
                    <div>
                      <Link
                        href={`/dashboard/students/${student.id}`}
                        className="font-bold text-slate-900 hover:text-teal-700 transition-colors block"
                      >
                        {student.name}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{student.email}</span>
                        <span>•</span>
                        <span>{student.phone}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Lifecycle Stage */}
                <TableCell>
                  <StatusBadge status={student.currentStage} />
                </TableCell>

                {/* Destinations */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {student.preferredCountries?.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/60"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </TableCell>

                {/* Intake & Degree */}
                <TableCell>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">{student.intake}</span>
                    <span className="text-[11px] text-slate-500">{student.targetDegree}</span>
                  </div>
                </TableCell>

                {/* Counselor(s) */}
                <TableCell>
                  <div className="space-y-0.5">
                    {student.assignedCounselorName && (
                      <span className="text-xs font-semibold text-slate-800 block">
                        {student.assignedCounselorName}
                      </span>
                    )}
                    {student.assignedCounselors && student.assignedCounselors.length > 1 && (
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200 inline-block font-semibold">
                        +{student.assignedCounselors.length - 1} Co-Counselors
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Blocked Status */}
                <TableCell>
                  {student.isBlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200">
                      Blocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      Active
                    </span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/dashboard/students/${student.id}`}>
                      <Button variant="outline" size="xs" leftIcon={<Eye className="w-3 h-3" />}>
                        View
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => openEditModal(student)}
                      title="Edit student"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                    </Button>

                    {student.isBlocked ? (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleUnblockStudent(student)}
                        title="Unblock account"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleBlockStudent(student)}
                        title="Block student"
                      >
                        <Ban className="w-3.5 h-3.5 text-amber-600" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDeleteStudent(student)}
                      title="Delete student"
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

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Student Profile & Applicant Account"
        description="Fill in the student's study preferences and set their login password. Dynamic email notifications will be sent automatically."
      >
        {modalError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {modalError}
          </div>
        )}

        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student Full Name"
              placeholder="e.g. Farhan Rahman"
              required
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              required
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Login Password"
              type="password"
              placeholder="Minimum 6 characters"
              required
              value={newStudent.password}
              onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              required
              value={newStudent.confirmPassword}
              onChange={(e) => setNewStudent({ ...newStudent, confirmPassword: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="+44 7700 900142"
              required
              value={newStudent.phone}
              onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
            />
            <Input
              label="Nationality"
              placeholder="e.g. Bangladeshi"
              value={newStudent.nationality}
              onChange={(e) => setNewStudent({ ...newStudent, nationality: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Free text Study Level / Target Degree (Requirement 3) */}
            <Input
              label="Study Level / Target Degree"
              placeholder="e.g. Master's Degree, Bachelor of Science, PhD, Postgrad Diploma"
              required
              value={newStudent.targetDegree}
              onChange={(e) => setNewStudent({ ...newStudent, targetDegree: e.target.value })}
            />

            {/* Target Intake Month+Year DatePicker (Requirement 3) */}
            <DatePicker
              label="Target Intake"
              mode="month-year"
              value={newStudent.intake}
              onChange={(val) => setNewStudent({ ...newStudent, intake: val })}
              required
            />
          </div>

          {/* Multiple Target Countries from Agency Operating Countries (Requirement 3) */}
          <TagInput
            label="Target Countries (Multi-Country)"
            tags={newStudent.preferredCountries}
            onChange={(tags) => setNewStudent({ ...newStudent, preferredCountries: tags })}
            placeholder="Add target country..."
            options={operatingCountries}
            helperText="Select or type target countries configured in Agency Settings."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Preferred Subject Area / Course"
              placeholder="e.g. MSc Data Science & AI"
              value={newStudent.preferredCourse}
              onChange={(e) => setNewStudent({ ...newStudent, preferredCourse: e.target.value })}
            />

            {/* Multiple Assigned Counselors */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Assigned Counselors (Multi-Select)
              </label>
              <select
                multiple
                value={newStudent.assignedCounselors}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  setNewStudent({ ...newStudent, assignedCounselors: selected });
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all min-h-[72px]"
              >
                {counselorTeamMembers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.role})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">Hold Ctrl / Cmd to select multiple counselors.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Create Student Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal (Requirement 5) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Information"
        description="Update profile details and counselor allocations. Note: Email and Password cannot be changed from general student edit."
      >
        <form onSubmit={handleUpdateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student Full Name"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <Input
              label="Phone Number"
              required
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nationality"
              value={editForm.nationality}
              onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })}
            />
            {/* Free text Study Level / Target Degree */}
            <Input
              label="Study Level / Target Degree"
              placeholder="e.g. Master's Degree, PhD"
              value={editForm.targetDegree}
              onChange={(e) => setEditForm({ ...editForm, targetDegree: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Target Intake"
              mode="month-year"
              value={editForm.intake}
              onChange={(val) => setEditForm({ ...editForm, intake: val })}
            />
            <Input
              label="Preferred Subject Area / Course"
              value={editForm.preferredCourse}
              onChange={(e) => setEditForm({ ...editForm, preferredCourse: e.target.value })}
            />
          </div>

          {/* Multiple Target Countries */}
          <TagInput
            label="Preferred Destinations / Target Countries"
            tags={editForm.preferredCountries}
            onChange={(tags) => setEditForm({ ...editForm, preferredCountries: tags })}
            placeholder="Add country..."
            options={operatingCountries}
          />

          {/* Assigned Counselors */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Assigned Counselors (Multi-Select)
            </label>
            <select
              multiple
              value={editForm.assignedCounselors}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                setEditForm({ ...editForm, assignedCounselors: selected });
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all min-h-[72px]"
            >
              {counselorTeamMembers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.role})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
      />
    </div>
  );
}
