"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Building2,
  Calendar as CalendarIcon,
  Eye,
  ShieldCheck,
  Loader2,
  Edit,
  Trash2,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  X,
} from "lucide-react";
import { Passport } from "@/components/ui/PassportIcon";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { visaCasesApi } from "@/lib/api/visaCases";
import { studentsApi } from "@/lib/api/students";
import { agenciesApi } from "@/lib/api/agencies";
import { VisaCase, Student, VisaStatus, VisaFeaturedDocument, VisaDocumentStatus } from "@/types";

export default function VisaPage() {
  const [visaCases, setVisaCases] = useState<VisaCase[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
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
  const [countryFilter, setCountryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<VisaCase | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // New document input inside modal
  const [newDocName, setNewDocName] = useState("");
  const [newDocStatus, setNewDocStatus] = useState<VisaDocumentStatus>("Pending");

  // Confirm delete state
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    caseId: string;
    caseTitle: string;
  }>({
    isOpen: false,
    caseId: "",
    caseTitle: "",
  });

  // New Visa form
  const [newVisa, setNewVisa] = useState({
    studentId: "",
    country: "United Kingdom",
    visaType: "Student Visa (Subclass 500 / Tier 4 / Study Permit)",
    targetIntake: "September 2027",
    institutionName: "University of Manchester",
    casNumber: "",
    biometricsDate: "",
    submissionDate: "",
    decisionDate: "",
    notes: "",
    featuredDocuments: [
      { id: "fd-1", name: "Valid International Passport & Bio Page", status: "Submitted" as VisaDocumentStatus, required: true },
      { id: "fd-2", name: "Official CAS / COE / Unconditional Offer Letter", status: "Submitted" as VisaDocumentStatus, required: true },
      { id: "fd-3", name: "28-Day Bank Solvency Statement & Financial Affidavit", status: "Pending" as VisaDocumentStatus, required: true },
      { id: "fd-4", name: "TB Medical Clearance Certificate", status: "Pending" as VisaDocumentStatus, required: true },
      { id: "fd-5", name: "Police Clearance & Academic Attestations", status: "Pending" as VisaDocumentStatus, required: false },
    ] as VisaFeaturedDocument[],
  });

  // Edit Visa form (ALL fields editable)
  const [editVisa, setEditVisa] = useState({
    id: "",
    studentName: "",
    country: "United Kingdom",
    institutionName: "",
    visaType: "",
    targetIntake: "",
    status: "Document Preparation" as VisaStatus,
    casNumber: "",
    biometricsDate: "",
    submissionDate: "",
    decisionDate: "",
    notes: "",
    featuredDocuments: [] as VisaFeaturedDocument[],
  });

  const fetchVisas = useCallback(async () => {
    try {
      setLoading(true);
      const [visaData, studentsData, agencyData] = await Promise.all([
        visaCasesApi.getAll({
          country: countryFilter !== "All" ? countryFilter : undefined,
          status: statusFilter !== "All" ? statusFilter : undefined,
          search: searchQuery || undefined,
        }),
        studentsApi.getAll().catch(() => []),
        agenciesApi.getProfile().catch(() => null),
      ]);
      setVisaCases(visaData);
      setStudents(studentsData);
      if (agencyData?.operatingCountries && agencyData.operatingCountries.length > 0) {
        setOperatingCountries(agencyData.operatingCountries);
      }
      if (studentsData.length > 0 && !newVisa.studentId) {
        setNewVisa((prev) => ({
          ...prev,
          studentId: studentsData[0].id,
          institutionName: studentsData[0].preferredCourse || "University Partner",
        }));
      }
    } catch (err) {
      console.error("Failed to load visa cases", err);
    } finally {
      setLoading(false);
    }
  }, [countryFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchVisas();
  }, [fetchVisas]);

  const handleCreateVisa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisa.studentId) return;

    setSubmitting(true);
    try {
      const created = await visaCasesApi.create({
        studentId: newVisa.studentId,
        country: newVisa.country,
        visaType: newVisa.visaType,
        targetIntake: newVisa.targetIntake,
        institutionName: newVisa.institutionName,
        casNumber: newVisa.casNumber || undefined,
        biometricsDate: newVisa.biometricsDate || undefined,
        submissionDate: newVisa.submissionDate || undefined,
        decisionDate: newVisa.decisionDate || undefined,
        notes: newVisa.notes || undefined,
        featuredDocuments: newVisa.featuredDocuments,
      });

      setVisaCases([created, ...visaCases]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to create visa case", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (v: VisaCase) => {
    setSelectedVisa(v);
    const existingDocs = v.featuredDocuments && v.featuredDocuments.length > 0
      ? v.featuredDocuments
      : [
          { id: "fd-1", name: "Valid International Passport & Bio Page", status: "Submitted" as VisaDocumentStatus, required: true },
          { id: "fd-2", name: "Official CAS / COE / Unconditional Offer Letter", status: "Submitted" as VisaDocumentStatus, required: true },
          { id: "fd-3", name: "28-Day Bank Solvency Statement & Financial Affidavit", status: "Pending" as VisaDocumentStatus, required: true },
          { id: "fd-4", name: "TB Medical Clearance Certificate", status: "Pending" as VisaDocumentStatus, required: true },
          { id: "fd-5", name: "Police Clearance & Academic Attestations", status: "Pending" as VisaDocumentStatus, required: false },
        ];

    setEditVisa({
      id: v.id,
      studentName: v.studentName || "Student",
      country: v.country || "United Kingdom",
      institutionName: v.institutionName || "",
      visaType: v.visaType || "Student Visa (Subclass 500 / Tier 4 / Study Permit)",
      targetIntake: v.targetIntake || "September 2027",
      status: v.status,
      casNumber: v.casNumber || v.casOrCoeNumber || "",
      biometricsDate: v.biometricsDate || "",
      submissionDate: v.submissionDate || "",
      decisionDate: v.decisionDate || "",
      notes: v.notes || "",
      featuredDocuments: existingDocs,
    });
    setNewDocName("");
    setIsEditModalOpen(true);
  };

  const handleUpdateVisa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVisa.id) return;
    setSubmitting(true);
    try {
      const updated = await visaCasesApi.update(editVisa.id, {
        country: editVisa.country,
        institutionName: editVisa.institutionName,
        visaType: editVisa.visaType,
        targetIntake: editVisa.targetIntake,
        status: editVisa.status,
        casNumber: editVisa.casNumber,
        biometricsDate: editVisa.biometricsDate,
        submissionDate: editVisa.submissionDate,
        decisionDate: editVisa.decisionDate,
        notes: editVisa.notes,
        featuredDocuments: editVisa.featuredDocuments,
      });

      setVisaCases(visaCases.map((v) => (v.id === editVisa.id ? updated : v)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update visa case", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVisa = async () => {
    if (!confirmDelete.caseId) return;
    try {
      await visaCasesApi.delete(confirmDelete.caseId);
      setVisaCases(visaCases.filter((v) => v.id !== confirmDelete.caseId));
      setConfirmDelete({ isOpen: false, caseId: "", caseTitle: "" });
    } catch (err) {
      console.error("Failed to delete visa file", err);
    }
  };

  // Add document handler
  const handleAddFeaturedDoc = (isEdit: boolean) => {
    if (!newDocName.trim()) return;
    const newDoc: VisaFeaturedDocument = {
      id: `fd-${Date.now()}`,
      name: newDocName.trim(),
      status: newDocStatus,
      required: true,
    };

    if (isEdit) {
      setEditVisa((prev) => ({
        ...prev,
        featuredDocuments: [...prev.featuredDocuments, newDoc],
      }));
    } else {
      setNewVisa((prev) => ({
        ...prev,
        featuredDocuments: [...prev.featuredDocuments, newDoc],
      }));
    }
    setNewDocName("");
  };

  // Remove document handler
  const handleRemoveFeaturedDoc = (id: string, isEdit: boolean) => {
    if (isEdit) {
      setEditVisa((prev) => ({
        ...prev,
        featuredDocuments: prev.featuredDocuments.filter((d) => d.id !== id),
      }));
    } else {
      setNewVisa((prev) => ({
        ...prev,
        featuredDocuments: prev.featuredDocuments.filter((d) => d.id !== id),
      }));
    }
  };

  // Update document status handler
  const handleDocStatusChange = (id: string, status: VisaDocumentStatus, isEdit: boolean) => {
    if (isEdit) {
      setEditVisa((prev) => ({
        ...prev,
        featuredDocuments: prev.featuredDocuments.map((d) =>
          d.id === id ? { ...d, status } : d
        ),
      }));
    } else {
      setNewVisa((prev) => ({
        ...prev,
        featuredDocuments: prev.featuredDocuments.map((d) =>
          d.id === id ? { ...d, status } : d
        ),
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Immigration Compliance</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Visa Casework</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Visa Desk & Embassy Tracking
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {visaCases.length} Active Files
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Initialize Visa File
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name, institution, or CAS ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Operating Country Filter */}
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
          >
            <option value="All">All Visa Statuses</option>
            <option value="Document Preparation">Document Preparation</option>
            <option value="Ready to Submit">Ready to Submit</option>
            <option value="Submitted">Submitted to Embassy</option>
            <option value="Biometrics">Biometrics</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Refused">Refused</option>
          </select>
        </div>
      </div>

      {/* Visa Cases Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Tracking embassy files...</span>
        </div>
      ) : visaCases.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <Passport className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No visa cases found</p>
          <p className="text-xs text-slate-500">Initialize a visa file for students with accepted offers.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Applicant & Institution</TableHead>
              <TableHead>Destination & Intake</TableHead>
              <TableHead>CAS / COE / I-20 #</TableHead>
              <TableHead>Key Dates</TableHead>
              <TableHead>Featured Documents</TableHead>
              <TableHead>Visa Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visaCases.map((vc) => {
              const docs = vc.featuredDocuments || [];
              const approvedCount = docs.filter((d) => d.status === "Approved").length;
              const submittedCount = docs.filter((d) => d.status === "Submitted").length;
              const pendingCount = docs.filter((d) => d.status === "Pending").length;

              return (
                <TableRow key={vc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                        <Passport className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{vc.studentName}</p>
                        <p className="text-[11px] text-slate-500">{vc.institutionName}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">{vc.country}</span>
                      <span className="text-[11px] text-slate-500">{vc.targetIntake || "September 2027"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-xs text-slate-700">
                    {vc.casNumber || vc.casOrCoeNumber || "Pending Issuance"}
                  </TableCell>

                  <TableCell className="text-xs text-slate-600">
                    <div className="space-y-0.5 text-[11px]">
                      {vc.submissionDate && (
                        <div>
                          <span className="text-slate-400">Sub: </span>
                          <span className="font-medium text-slate-700">{vc.submissionDate}</span>
                        </div>
                      )}
                      {vc.biometricsDate && (
                        <div>
                          <span className="text-slate-400">Bio: </span>
                          <span className="font-medium text-slate-700">{vc.biometricsDate}</span>
                        </div>
                      )}
                      {vc.decisionDate && (
                        <div>
                          <span className="text-slate-400">Dec: </span>
                          <span className="font-medium text-slate-700">{vc.decisionDate}</span>
                        </div>
                      )}
                      {!vc.submissionDate && !vc.biometricsDate && !vc.decisionDate && (
                        <span className="text-slate-400 italic">Dates pending</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {approvedCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            {approvedCount} Approved
                          </span>
                        )}
                        {submittedCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                            {submittedCount} Submitted
                          </span>
                        )}
                        {pendingCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                            {pendingCount} Pending
                          </span>
                        )}
                        {docs.length === 0 && (
                          <span className="text-[11px] text-slate-400">5 Default Items</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {docs.length} required features
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={vc.status} />
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => openEditModal(vc)}
                        title="Edit visa case"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() =>
                          setConfirmDelete({
                            isOpen: true,
                            caseId: vc.id,
                            caseTitle: `${vc.studentName} - ${vc.country}`,
                          })
                        }
                        title="Delete visa file"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Initialize Visa Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Initialize Visa Filing Casework"
        description="Prepare embassy submission dossier and set required featured documents."
      >
        <form onSubmit={handleCreateVisa} className="space-y-4">
          <Select
            label="Student Applicant"
            value={newVisa.studentId}
            onChange={(e) => setNewVisa({ ...newVisa, studentId: e.target.value })}
            options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` }))}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Destination Country"
              value={newVisa.country}
              onChange={(e) => setNewVisa({ ...newVisa, country: e.target.value })}
              options={operatingCountries.map((c) => ({ value: c, label: c }))}
              required
            />

            {/* Responsive Target Intake DatePicker */}
            <DatePicker
              label="Target Intake"
              mode="month-year"
              value={newVisa.targetIntake}
              onChange={(val) => setNewVisa({ ...newVisa, targetIntake: val })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Institution"
              placeholder="e.g. University of Manchester"
              value={newVisa.institutionName}
              onChange={(e) => setNewVisa({ ...newVisa, institutionName: e.target.value })}
              required
            />

            <Input
              label="CAS / COE / I-20 Reference #"
              placeholder="e.g. E4G90291X"
              value={newVisa.casNumber}
              onChange={(e) => setNewVisa({ ...newVisa, casNumber: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Biometrics Slot Date"
              mode="date"
              value={newVisa.biometricsDate}
              onChange={(val) => setNewVisa({ ...newVisa, biometricsDate: val })}
            />

            <DatePicker
              label="Embassy Submission Date"
              mode="date"
              value={newVisa.submissionDate}
              onChange={(val) => setNewVisa({ ...newVisa, submissionDate: val })}
            />
          </div>

          {/* Featured Required Documents */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Featured Required Visa Documents ({newVisa.featuredDocuments.length})
              </label>
              <span className="text-[11px] text-slate-500">Student Checklist</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {newVisa.featuredDocuments.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-slate-500 text-[11px]">{idx + 1}.</span>
                    <span className="font-semibold text-slate-800 truncate">{doc.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={doc.status}
                      onChange={(e) =>
                        handleDocStatusChange(doc.id, e.target.value as VisaDocumentStatus, false)
                      }
                      className="px-2 py-1 text-[10px] font-bold rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveFeaturedDoc(doc.id, false)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new doc row */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add custom required document/feature..."
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <select
                value={newDocStatus}
                onChange={(e) => setNewDocStatus(e.target.value as VisaDocumentStatus)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700"
              >
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
              </select>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleAddFeaturedDoc(false)}
              >
                Add
              </Button>
            </div>
          </div>

          <Textarea
            label="Internal Notes"
            placeholder="e.g. Student holds £28,000 in designated sponsor account."
            rows={2}
            value={newVisa.notes}
            onChange={(e) => setNewVisa({ ...newVisa, notes: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Open Visa File
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Visa Modal (ALL FIELDS EDITABLE) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Visa Casework: ${editVisa.studentName}`}
        description="Update country, institution, intake, CAS reference, dates, file status, and required featured documents."
      >
        <form onSubmit={handleUpdateVisa} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Visa File Status"
              value={editVisa.status}
              onChange={(e) => setEditVisa({ ...editVisa, status: e.target.value as VisaStatus })}
              options={[
                { value: "Document Preparation", label: "Document Preparation" },
                { value: "Ready to Submit", label: "Ready to Submit" },
                { value: "Submitted", label: "Submitted to Embassy" },
                { value: "Biometrics", label: "Biometrics Appointment Done" },
                { value: "Under Review", label: "Under Review" },
                { value: "Approved", label: "Visa Approved" },
                { value: "Refused", label: "Visa Refused" },
              ]}
              required
            />

            <Select
              label="Destination Country"
              value={editVisa.country}
              onChange={(e) => setEditVisa({ ...editVisa, country: e.target.value })}
              options={operatingCountries.map((c) => ({ value: c, label: c }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Institution"
              value={editVisa.institutionName}
              onChange={(e) => setEditVisa({ ...editVisa, institutionName: e.target.value })}
              required
            />

            {/* Responsive Target Intake DatePicker */}
            <DatePicker
              label="Target Intake"
              mode="month-year"
              value={editVisa.targetIntake}
              onChange={(val) => setEditVisa({ ...editVisa, targetIntake: val })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="CAS / COE / I-20 Number"
              value={editVisa.casNumber}
              onChange={(e) => setEditVisa({ ...editVisa, casNumber: e.target.value })}
            />

            <Input
              label="Visa Type"
              value={editVisa.visaType}
              onChange={(e) => setEditVisa({ ...editVisa, visaType: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DatePicker
              label="Embassy Submission"
              mode="date"
              value={editVisa.submissionDate}
              onChange={(val) => setEditVisa({ ...editVisa, submissionDate: val })}
            />

            <DatePicker
              label="Biometrics Date"
              mode="date"
              value={editVisa.biometricsDate}
              onChange={(val) => setEditVisa({ ...editVisa, biometricsDate: val })}
            />

            <DatePicker
              label="Decision Date"
              mode="date"
              value={editVisa.decisionDate}
              onChange={(val) => setEditVisa({ ...editVisa, decisionDate: val })}
            />
          </div>

          {/* Featured Required Documents Manager */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Featured Required Visa Documents ({editVisa.featuredDocuments.length})
              </label>
              <span className="text-[11px] text-slate-500">Student Visa Tracker Items</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {editVisa.featuredDocuments.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-slate-500 text-[11px]">{idx + 1}.</span>
                    <span className="font-semibold text-slate-800 truncate">{doc.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={doc.status}
                      onChange={(e) =>
                        handleDocStatusChange(doc.id, e.target.value as VisaDocumentStatus, true)
                      }
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg border ${
                        doc.status === "Approved"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : doc.status === "Submitted"
                          ? "bg-teal-50 text-teal-800 border-teal-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveFeaturedDoc(doc.id, true)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new doc row */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add custom required document/feature..."
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <select
                value={newDocStatus}
                onChange={(e) => setNewDocStatus(e.target.value as VisaDocumentStatus)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700"
              >
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
              </select>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleAddFeaturedDoc(true)}
              >
                Add
              </Button>
            </div>
          </div>

          <Textarea
            label="Internal Notes"
            rows={2}
            value={editVisa.notes}
            onChange={(e) => setEditVisa({ ...editVisa, notes: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save All Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, caseId: "", caseTitle: "" })}
        onConfirm={handleDeleteVisa}
        title="Delete Visa Casework File"
        message={`Are you sure you want to delete the visa file for "${confirmDelete.caseTitle}"?`}
        confirmText="Are you sure you want to delete this visa file?"
      />
    </div>
  );
}
