"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileCheck,
  UploadCloud,
  Eye,
  Plus,
  Loader2,
  Trash2,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { FilePreviewModal } from "@/components/ui/FilePreviewModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { documentsApi } from "@/lib/api/documents";
import { DocumentItem } from "@/types";

export default function StudentDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Academic Transcript");
  const [submitting, setSubmitting] = useState(false);

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

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    docId: string;
    docName: string;
  }>({
    isOpen: false,
    docId: "",
    docName: "",
  });

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await documentsApi.getMyDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load my documents", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("name", uploadName || uploadFile.name);
      formData.append("category", uploadCategory);

      const created = await documentsApi.upload(formData);
      setDocuments([created, ...documents]);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadName("");
      setUploadCategory("Academic Transcript");
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
            <span>Student Portal</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Document Vault</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            My Documents & Credentials
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {documents.length} Files
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading your document vault...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No documents uploaded yet</p>
          <p className="text-xs text-slate-500">Upload your academic certificates, transcripts, and passport copy.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{doc.name}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">{doc.fileSize} • {doc.fileType}</span>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} />
                </div>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                  <span>Category: <strong>{doc.category}</strong></span>
                </div>

                {doc.reviewNotes && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{doc.reviewNotes}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
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

                <div className="flex items-center gap-1">
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}

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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Student Compliance Document"
        description="Add identity, academic, or financial records to your admissions portfolio."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Input
            label="Document Title"
            placeholder="e.g. Higher Secondary Certificate"
            required
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
          />

          {/* Free text category (Requirement 18) */}
          <Input
            label="Document Category (Type Any Category)"
            placeholder="e.g. Academic Transcript, Bank Statement, IELTS Scorecard, Passport Copy"
            required
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
          />

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
                if (file && !uploadName) {
                  setUploadName(file.name.replace(/\.[^/.]+$/, ""));
                }
              }}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
            />
          </div>

          {/* Pre-upload preview trigger */}
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
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>

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
        message={`Are you sure you want to delete "${confirmDelete.docName}"? This will remove it from your admissions profile.`}
        confirmText="Are you sure you want to delete this document?"
      />
    </div>
  );
}
