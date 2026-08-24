"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Award,
  Search,
  Plus,
  Building2,
  Calendar as CalendarIcon,
  Eye,
  Loader2,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  UploadCloud,
  FileCheck,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FilePreviewModal } from "@/components/ui/FilePreviewModal";
import { offersApi } from "@/lib/api/offers";
import { applicationsApi } from "@/lib/api/applications";
import { Offer, OfferType, Application } from "@/types";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // File Preview Modal
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

  // Confirm delete dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    offerId: string;
    offerTitle: string;
  }>({
    isOpen: false,
    offerId: "",
    offerTitle: "",
  });

  // Form states
  const [newOffer, setNewOffer] = useState({
    applicationId: "",
    offerType: "Conditional" as OfferType,
    deadline: "2027-10-15",
    tuitionFee: 24000,
    depositAmount: 3000,
    conditions: "Submit final official undergraduate transcript and proof of financial funds.",
    offerLetterFile: null as File | null,
  });

  const [editOffer, setEditOffer] = useState({
    id: "",
    offerType: "Conditional" as OfferType,
    deadline: "",
    tuitionFee: 24000,
    depositAmount: 0,
    conditions: "",
    acceptanceStatus: "Pending" as any,
    currentLetterUrl: "",
    currentLetterFileName: "",
    offerLetterFile: null as File | null,
  });

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      const [offersData, appsData] = await Promise.all([
        offersApi.getAll({
          offerType: typeFilter !== "All" ? typeFilter : undefined,
          acceptanceStatus: statusFilter !== "All" ? statusFilter : undefined,
          search: searchQuery || undefined,
        }),
        applicationsApi.getAll().catch(() => []),
      ]);
      setOffers(offersData);
      setApplications(appsData);
      if (appsData.length > 0 && !newOffer.applicationId) {
        setNewOffer((prev) => ({ ...prev, applicationId: appsData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load offers", err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.applicationId) return;

    setSubmitting(true);
    try {
      let created: Offer;
      if (newOffer.offerLetterFile) {
        const formData = new FormData();
        formData.append("applicationId", newOffer.applicationId);
        formData.append("offerType", newOffer.offerType);
        formData.append("deadline", newOffer.deadline);
        formData.append("tuitionFee", String(newOffer.tuitionFee));
        formData.append("depositAmount", String(newOffer.depositAmount));
        formData.append("conditions", newOffer.conditions);
        formData.append("offerLetter", newOffer.offerLetterFile);
        created = await offersApi.create(formData);
      } else {
        created = await offersApi.create({
          applicationId: newOffer.applicationId,
          offerType: newOffer.offerType,
          deadline: newOffer.deadline,
          tuitionFee: Number(newOffer.tuitionFee),
          depositAmount: Number(newOffer.depositAmount),
          conditionsSummary: newOffer.conditions,
        });
      }

      setOffers([created, ...offers]);
      setIsAddModalOpen(false);
      setNewOffer({
        applicationId: applications[0]?.id || "",
        offerType: "Conditional",
        deadline: "2027-10-15",
        tuitionFee: 24000,
        depositAmount: 3000,
        conditions: "Submit final official undergraduate transcript and proof of financial funds.",
        offerLetterFile: null,
      });
    } catch (err) {
      console.error("Failed to create offer", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (offer: Offer) => {
    setSelectedOffer(offer);
    const resolvedType = ((offer.offerType as OfferType) || (offer.type as OfferType) || "Conditional") as OfferType;
    const resolvedDeadline = offer.deadline || offer.conditionsDeadline || offer.depositDeadline || "2027-10-15";
    const resolvedConditions = Array.isArray(offer.conditions)
      ? offer.conditions.map((c) => c.text).join("; ")
      : offer.conditionsSummary || "";

    setEditOffer({
      id: offer.id,
      offerType: resolvedType,
      deadline: resolvedDeadline,
      tuitionFee: offer.tuitionFee || 24000,
      depositAmount: offer.depositAmount || 0,
      conditions: resolvedConditions,
      acceptanceStatus: (offer.acceptanceStatus || "Pending") as any,
      currentLetterUrl: offer.offerLetterUrl || "",
      currentLetterFileName: offer.offerLetterFileName || "",
      offerLetterFile: null,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOffer.id) return;
    setSubmitting(true);
    try {
      let updated: Offer;
      if (editOffer.offerLetterFile) {
        const formData = new FormData();
        formData.append("offerType", editOffer.offerType);
        formData.append("deadline", editOffer.deadline);
        formData.append("tuitionFee", String(editOffer.tuitionFee));
        formData.append("depositAmount", String(editOffer.depositAmount));
        formData.append("conditions", editOffer.conditions);
        formData.append("acceptanceStatus", editOffer.acceptanceStatus);
        formData.append("offerLetter", editOffer.offerLetterFile);
        updated = await offersApi.update(editOffer.id, formData);
      } else {
        updated = await offersApi.update(editOffer.id, {
          offerType: editOffer.offerType,
          deadline: editOffer.deadline,
          tuitionFee: Number(editOffer.tuitionFee),
          depositAmount: Number(editOffer.depositAmount),
          conditionsSummary: editOffer.conditions,
          acceptanceStatus: editOffer.acceptanceStatus,
        });
      }

      setOffers(offers.map((o) => (o.id === editOffer.id ? updated : o)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update offer", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOffer = async () => {
    if (!confirmDelete.offerId) return;
    try {
      await offersApi.delete(confirmDelete.offerId);
      setOffers(offers.filter((o) => o.id !== confirmDelete.offerId));
      setConfirmDelete({ isOpen: false, offerId: "", offerTitle: "" });
    } catch (err) {
      console.error("Failed to delete offer", err);
    }
  };

  const handlePreviewOfferLetter = (offer: Offer) => {
    const isImg =
      offer.offerLetterMimeType?.includes("image") ||
      offer.offerLetterFileName?.match(/\.(png|jpg|jpeg|webp)$/i);

    setPreviewModal({
      isOpen: true,
      title: `${offer.universityName} - ${offer.offerType || offer.type || "Admission"} Offer Letter`,
      fileUrl: offer.offerLetterUrl || `/api/v1/offers/stream/${offer.id}`,
      fileBlob: null,
      fileType: isImg ? "IMAGE" : "PDF",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Admissions Decisions</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Offer Letters</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            University Offer Desk & Letter Vault
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {offers.length} Offers
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Record Offer Letter
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or university..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
          >
            <option value="All">All Offer Types</option>
            <option value="Unconditional">Unconditional</option>
            <option value="Conditional">Conditional</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
          >
            <option value="All">All Response Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Offers Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading university offers...</span>
        </div>
      ) : offers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No offer letters recorded</p>
          <p className="text-xs text-slate-500">Record an offer received for an active application.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student & Partner University</TableHead>
              <TableHead>Offer Type</TableHead>
              <TableHead>Decision / Deposit Deadline</TableHead>
              <TableHead>Deposit Required</TableHead>
              <TableHead>Response Status</TableHead>
              <TableHead>Offer Letter</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => {
              const currentOfferType = offer.offerType || offer.type || "Conditional";
              return (
                <TableRow key={offer.id}>
                  <TableCell>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{offer.studentName}</p>
                      <p className="text-[11px] text-slate-500">{offer.universityName} • {offer.courseName}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        currentOfferType === "Unconditional"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {currentOfferType}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-slate-700">
                    <div className="flex items-center gap-1.5 font-medium">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{offer.deadline || offer.conditionsDeadline || offer.depositDeadline || "Rolling Basis"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-extrabold text-slate-900">
                    {offer.depositAmount ? `${offer.currency || "$"}${offer.depositAmount.toLocaleString()}` : "N/A"}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={offer.acceptanceStatus} />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handlePreviewOfferLetter(offer)}
                        leftIcon={<Eye className="w-3 h-3" />}
                        className="text-[10px] py-1 px-2"
                      >
                        Preview
                      </Button>
                      {offer.offerLetterUrl && (
                        <a
                          href={offersApi.getDownloadUrl(offer.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-teal-600 hover:border-teal-300 transition-colors"
                          title="Download Offer Letter"
                        >
                          <Download className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => openEditModal(offer)}
                        title="Edit offer"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() =>
                          setConfirmDelete({
                            isOpen: true,
                            offerId: offer.id,
                            offerTitle: `${offer.studentName} - ${offer.universityName}`,
                          })
                        }
                        title="Delete offer"
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

      {/* Record Offer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record University Offer Letter"
        description="Log conditional or unconditional admission decision issued by university partner."
      >
        <form onSubmit={handleCreateOffer} className="space-y-4">
          <Select
            label="Linked Active Application"
            value={newOffer.applicationId}
            onChange={(e) => setNewOffer({ ...newOffer, applicationId: e.target.value })}
            options={applications.map((app) => ({
              value: app.id,
              label: `${app.studentName} → ${app.universityName} (${app.courseName})`,
            }))}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Offer Letter Type"
              value={newOffer.offerType}
              onChange={(e) => setNewOffer({ ...newOffer, offerType: e.target.value as OfferType })}
              options={[
                { value: "Conditional", label: "Conditional Offer" },
                { value: "Unconditional", label: "Unconditional Offer" },
              ]}
              required
            />

            <DatePicker
              label="Decision / Deposit Deadline"
              mode="date"
              value={newOffer.deadline}
              onChange={(val) => setNewOffer({ ...newOffer, deadline: val })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Year 1 Tuition Fee ($)"
              type="number"
              value={newOffer.tuitionFee.toString()}
              onChange={(e) => setNewOffer({ ...newOffer, tuitionFee: Number(e.target.value) })}
              required
            />

            <Input
              label="Seat Deposit Required ($)"
              type="number"
              value={newOffer.depositAmount.toString()}
              onChange={(e) => setNewOffer({ ...newOffer, depositAmount: Number(e.target.value) })}
              required
            />
          </div>

          <Textarea
            label="Offer Conditions & Required Proofs"
            placeholder="e.g. Provide original IELTS 6.5 TRF, Bank solvency certificate of £22,000."
            rows={2}
            value={newOffer.conditions}
            onChange={(e) => setNewOffer({ ...newOffer, conditions: e.target.value })}
          />

          {/* Offer Letter File Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Offer Letter File (PDF or Image)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setNewOffer((prev) => ({ ...prev, offerLetterFile: file }));
                  }}
                  className="hidden"
                />
                <div className="p-3 border-2 border-dashed border-slate-200 rounded-xl hover:border-teal-500/50 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs text-slate-600">
                  <UploadCloud className="w-4 h-4 text-teal-600" />
                  <span>
                    {newOffer.offerLetterFile
                      ? newOffer.offerLetterFile.name
                      : "Choose PDF or Image file (Max 15MB)"}
                  </span>
                </div>
              </label>
              {newOffer.offerLetterFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setNewOffer((prev) => ({ ...prev, offerLetterFile: null }))}
                  className="text-rose-600 hover:text-rose-700 text-[11px]"
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Supported formats: PDF, JPG, PNG, WEBP.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save & Log Offer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Offer Modal (Full Edit Flow) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Offer Decision"
        description="Update offer type, tuition, deposit, deadlines, conditions, or replace letter."
      >
        <form onSubmit={handleUpdateOffer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Offer Type"
              value={editOffer.offerType}
              onChange={(e) => setEditOffer({ ...editOffer, offerType: e.target.value as OfferType })}
              options={[
                { value: "Conditional", label: "Conditional Offer" },
                { value: "Unconditional", label: "Unconditional Offer" },
              ]}
              required
            />

            <DatePicker
              label="Decision / Deposit Deadline"
              mode="date"
              value={editOffer.deadline}
              onChange={(val) => setEditOffer({ ...editOffer, deadline: val })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Year 1 Tuition Fee ($)"
              type="number"
              value={editOffer.tuitionFee.toString()}
              onChange={(e) => setEditOffer({ ...editOffer, tuitionFee: Number(e.target.value) })}
              required
            />

            <Input
              label="Deposit Required ($)"
              type="number"
              value={editOffer.depositAmount.toString()}
              onChange={(e) => setEditOffer({ ...editOffer, depositAmount: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Response Status"
              value={editOffer.acceptanceStatus}
              onChange={(e) => setEditOffer({ ...editOffer, acceptanceStatus: e.target.value })}
              options={[
                { value: "Pending", label: "Pending Decision" },
                { value: "Accepted", label: "Accepted by Student" },
                { value: "Declined", label: "Declined" },
              ]}
              required
            />
          </div>

          <Textarea
            label="Offer Conditions & Required Proofs"
            placeholder="e.g. Provide original IELTS 6.5 TRF, Bank solvency certificate of £22,000."
            rows={2}
            value={editOffer.conditions}
            onChange={(e) => setEditOffer({ ...editOffer, conditions: e.target.value })}
          />

          {/* Offer Letter File Upload / Replace */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Offer Letter File (Replace or Upload PDF / Image)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setEditOffer((prev) => ({ ...prev, offerLetterFile: file }));
                  }}
                  className="hidden"
                />
                <div className="p-3 border-2 border-dashed border-slate-200 rounded-xl hover:border-teal-500/50 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs text-slate-600">
                  <UploadCloud className="w-4 h-4 text-teal-600" />
                  <span>
                    {editOffer.offerLetterFile
                      ? editOffer.offerLetterFile.name
                      : editOffer.currentLetterFileName
                      ? `Replace current: ${editOffer.currentLetterFileName}`
                      : "Upload new PDF or Image file"}
                  </span>
                </div>
              </label>
              {editOffer.offerLetterFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setEditOffer((prev) => ({ ...prev, offerLetterFile: null }))}
                  className="text-rose-600 hover:text-rose-700 text-[11px]"
                >
                  Clear File
                </Button>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Supported formats: PDF, JPG, PNG, WEBP.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save Offer Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, offerId: "", offerTitle: "" })}
        onConfirm={handleDeleteOffer}
        title="Delete Offer Letter"
        message={`Are you sure you want to delete offer for "${confirmDelete.offerTitle}"?`}
        confirmText="Are you sure you want to delete this offer?"
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        title={previewModal.title}
        fileUrl={previewModal.fileUrl}
        fileBlob={previewModal.fileBlob}
        fileType={previewModal.fileType}
      />
    </div>
  );
}
