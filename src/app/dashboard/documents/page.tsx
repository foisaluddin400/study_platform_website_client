"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileCheck,
  Search,
  UploadCloud,
  Eye,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Loader2,
  Trash2,
  Download,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { FilePreviewModal } from "@/components/ui/FilePreviewModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { documentsApi } from "@/lib/api/documents";
import { studentsApi } from "@/lib/api/students";
import { DocumentItem, Student } from "@/types";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [selectedDocForAudit, setSelectedDocForAudit] = useState<DocumentItem | null>(null);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    title: string;
    fileUrl?: string;
    fileBlob?: File | null;
    fileType?: string;
  }>({
    isOpen: false,
    title: "",
    fileUrl: "",
    fileBlob: null,
    fileType: "PDF",
  });

  const [reviewNote, setReviewNote] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Confirm dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    docId: string;
    docName: string;
  }>({
    isOpen: false,
    docId: "",
    docName: "",
  });

  // Free text category for upload
  const [newUpload, setNewUpload] = useState({
    studentId: "",
    name: "",
    category: "Academic Transcript",
  });

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      const [docsData, studentsData] = await Promise.all([
        documentsApi.getAll({
          category: categoryFilter !== "All" ? categoryFilter : undefined,
          status: statusFilter !== "All" ? statusFilter : undefined,
          search: searchQuery || undefined,
        }),
        studentsApi.getAll().catch(() => []),
      ]);
      setDocuments(docsData);
      setStudents(studentsData);
      if (studentsData.length > 0 && !newUpload.studentId) {
        setNewUpload((prev) => ({ ...prev, studentId: studentsData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleAuditAction = async (newStatus: string) => {
    if (!selectedDocForAudit) return;
    try {
      const updated = await documentsApi.updateStatus(selectedDocForAudit.id, {
        status: newStatus,
        reviewNotes: reviewNote || undefined,
      });

      setDocuments(documents.map((d) => (d.id === selectedDocForAudit.id ? updated : d)));
      setSelectedDocForAudit(null);
      setReviewNote("");
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("name", newUpload.name || uploadFile.name);
      formData.append("category", newUpload.category);
      if (newUpload.studentId) {
        formData.append("studentId", newUpload.studentId);
      }

      const created = await documentsApi.upload(formData);
      setDocuments([created, ...documents]);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setNewUpload({
        studentId: students[0]?.id || "",
        name: "",
        category: "Academic Transcript",
      });
    } catch (err) {
      console.error("Failed to upload document", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoc = async () => {
    if (!confirmDelete.docId) return;
    try {
      await documentsApi.delete(confirmDelete.docId);
      setDocuments((prev) => prev.filter((d) => d.id !== confirmDelete.docId));
      setConfirmDelete({ isOpen: false, docId: "", docName: "" });
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Admissions Audit</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Document Vault</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Verification & Compliance Vault
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {documents.length} Files
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          leftIcon={<UploadCloud className="w-4 h-4" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
          >
            <option value="All">Status: All Statuses</option>
            <option value="Uploaded">Uploaded</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Correction Required">Correction Required</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Auditing document vault...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No documents found</p>
          <p className="text-xs text-slate-500">Upload a student document or adjust your search filter criteria.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document File & Student</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>File Type & Size</TableHead>
              <TableHead>Uploaded Date</TableHead>
              <TableHead>Audit Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{doc.name}</p>
                      <p className="text-[11px] text-slate-500">{doc.studentName || "Student Applicant"}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                    {doc.category}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-slate-600 uppercase font-bold">{doc.fileType}</span>
                  <span className="text-[11px] text-slate-400 block">{doc.fileSize}</span>
                </TableCell>

                <TableCell className="text-xs text-slate-500">
                  {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : "Recent"}
                </TableCell>

                <TableCell>
                  <StatusBadge status={doc.status} />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() =>
                        setPreviewModal({
                          isOpen: true,
                          title: doc.name,
                          fileUrl: doc.fileUrl,
                          fileType: doc.fileType || "PDF",
                        })
                      }
                      leftIcon={<Eye className="w-3 h-3" />}
                    >
                      Preview
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setSelectedDocForAudit(doc)}
                      title="Audit document status"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        setConfirmDelete({
                          isOpen: true,
                          docId: doc.id,
                          docName: doc.name,
                        })
                      }
                      title="Delete document"
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

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Student Compliance Document"
        description="Upload verification records to the agency secure vault."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Select
            label="Target Student Applicant"
            value={newUpload.studentId}
            onChange={(e) => setNewUpload({ ...newUpload, studentId: e.target.value })}
            options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` }))}
            required
          />

          <Input
            label="Document Title"
            placeholder="e.g. Official Bachelor Degree Certificate"
            required
            value={newUpload.name}
            onChange={(e) => setNewUpload({ ...newUpload, name: e.target.value })}
          />

          {/* Free Text Document Category (Requirement 7) */}
          <Input
            label="Document Category (Type Any Category)"
            placeholder="e.g. Academic Transcript, Bank Statement, IELTS Scorecard, Passport Copy"
            required
            value={newUpload.category}
            onChange={(e) => setNewUpload({ ...newUpload, category: e.target.value })}
          />

          {/* File input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Select Document File (PDF, JPG, PNG) <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              required
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setUploadFile(file);
                if (file && !newUpload.name) {
                  setNewUpload((prev) => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, "") }));
                }
              }}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
            />
          </div>

          {/* Pre-upload preview trigger button */}
          {uploadFile && (
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-teal-900 font-semibold truncate max-w-xs">{uploadFile.name}</span>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() =>
                  setPreviewModal({
                    isOpen: true,
                    title: uploadFile.name,
                    fileBlob: uploadFile,
                    fileType: uploadFile.type,
                  })
                }
              >
                Pre-Upload Preview
              </Button>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Upload & Encrypt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Audit Decision Modal */}
      {selectedDocForAudit && (
        <Modal
          isOpen={Boolean(selectedDocForAudit)}
          onClose={() => setSelectedDocForAudit(null)}
          title={`Audit Document: ${selectedDocForAudit.name}`}
          description="Review compliance status and log verification remarks."
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p>Student: <strong>{selectedDocForAudit.studentName}</strong></p>
              <p>Category: <strong>{selectedDocForAudit.category}</strong></p>
            </div>

            <Textarea
              label="Review Remarks & Auditor Notes"
              placeholder="e.g. Scanned copy is legible. Meets Tier-4 UKVI financial standards."
              rows={3}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAuditAction("Correction Required")}
              >
                Request Correction
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleAuditAction("Rejected")}
              >
                Reject Document
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAuditAction("Approved")}
              >
                Approve Document
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Preview Modal */}
      <FilePreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        title={previewModal.title}
        fileUrl={previewModal.fileUrl}
        fileBlob={previewModal.fileBlob}
        fileType={previewModal.fileType}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, docId: "", docName: "" })}
        onConfirm={handleDeleteDoc}
        title="Delete Document File"
        message={`Are you sure you want to delete "${confirmDelete.docName}"? This action permanently removes the file from the database and storage.`}
        confirmText="Are you sure you want to delete this document?"
      />
    </div>
  );
}
