"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CreditCard,
  Search,
  Plus,
  Loader2,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { paymentsApi } from "@/lib/api/payments";
import { studentsApi } from "@/lib/api/students";
import { PaymentRecord, Student, PaymentStatus } from "@/types";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    paymentId: string;
    paymentTitle: string;
  }>({
    isOpen: false,
    paymentId: "",
    paymentTitle: "",
  });

  // New Payment form state (Requirement 14)
  const [newPayment, setNewPayment] = useState({
    studentId: "",
    type: "Agency Consultation Service Fee",
    amount: 750,
    dueDate: "2027-10-15",
  });

  // Edit Payment form state
  const [editPayment, setEditPayment] = useState({
    id: "",
    type: "",
    amount: 0,
    dueDate: "",
    status: "Due" as PaymentStatus,
  });

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const [paymentsData, studentsData] = await Promise.all([
        paymentsApi.getAll({
          status: statusFilter !== "All" ? statusFilter : undefined,
          search: searchQuery || undefined,
        }),
        studentsApi.getAll().catch(() => []),
      ]);
      setPayments(paymentsData);
      setStudents(studentsData);
      if (studentsData.length > 0 && !newPayment.studentId) {
        setNewPayment((prev) => ({ ...prev, studentId: studentsData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.studentId) return;

    setSubmitting(true);
    try {
      const created = await paymentsApi.create({
        studentId: newPayment.studentId,
        type: newPayment.type,
        amount: Number(newPayment.amount),
        dueDate: newPayment.dueDate,
        status: "Due",
      });

      setPayments([created, ...payments]);
      setIsAddModalOpen(false);
      setNewPayment({
        studentId: students[0]?.id || "",
        type: "Agency Consultation Service Fee",
        amount: 750,
        dueDate: "2027-10-15",
      });
    } catch (err) {
      console.error("Failed to create payment invoice", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (p: PaymentRecord) => {
    setSelectedPayment(p);
    setEditPayment({
      id: p.id,
      type: p.type,
      amount: p.amount,
      dueDate: p.dueDate,
      status: p.status,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPayment.id) return;
    setSubmitting(true);
    try {
      const updated = await paymentsApi.update(editPayment.id, {
        type: editPayment.type,
        amount: Number(editPayment.amount),
        dueDate: editPayment.dueDate,
        status: editPayment.status,
      });

      setPayments(payments.map((p) => (p.id === editPayment.id ? updated : p)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update payment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!confirmDelete.paymentId) return;
    try {
      await paymentsApi.delete(confirmDelete.paymentId);
      setPayments(payments.filter((p) => p.id !== confirmDelete.paymentId));
      setConfirmDelete({ isOpen: false, paymentId: "", paymentTitle: "" });
    } catch (err) {
      console.error("Failed to delete invoice", err);
    }
  };

  const totalCollected = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "Due" || p.status === "Overdue")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Finance & Billing</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Student Invoices</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Student Invoices & Fee Ledger
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {payments.length} Invoices
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Student Invoice
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Collected"
          value={`$${totalCollected.toLocaleString()}`}
          change="Received in full"
          isPositive={true}
          icon={<CreditCard className="w-5 h-5" />}
        />
        <StatCard
          title="Outstanding Receivables"
          value={`$${totalPending.toLocaleString()}`}
          change="Pending due date"
          isPositive={false}
          icon={<DollarSign className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Total Invoiced"
          value={`$${(totalCollected + totalPending).toLocaleString()}`}
          change="All recorded billings"
          isPositive={true}
          icon={<CreditCard className="w-5 h-5 text-indigo-600" />}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or fee category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
        >
          <option value="All">All Invoices</option>
          <option value="Paid">Paid</option>
          <option value="Due">Due</option>
          <option value="Overdue">Overdue</option>
          <option value="Partial">Partial</option>
        </select>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading invoices ledger...</span>
        </div>
      ) : payments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No invoices found</p>
          <p className="text-xs text-slate-500">Create an invoice for student service fees or deposits.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice # & Student</TableHead>
              <TableHead>Fee Category / Service</TableHead>
              <TableHead>Billed Amount</TableHead>
              <TableHead>Payment Due Date</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div>
                    <p className="font-bold text-xs text-slate-900">{p.studentName}</p>
                    <span className="font-mono text-[10px] text-slate-400">{p.invoiceNumber || `INV-${p.id.slice(-5).toUpperCase()}`}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                    {p.type}
                  </span>
                </TableCell>

                <TableCell className="font-extrabold text-xs text-slate-900">
                  ${p.amount.toLocaleString()}
                </TableCell>

                <TableCell className="text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{p.dueDate}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => openEditModal(p)}
                      title="Edit invoice"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        setConfirmDelete({
                          isOpen: true,
                          paymentId: p.id,
                          paymentTitle: `${p.studentName} - ${p.type} ($${p.amount})`,
                        })
                      }
                      title="Delete invoice"
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

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Student Fee Invoice"
        description="Issue official invoice to student applicant."
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <Select
            label="Target Student Applicant"
            value={newPayment.studentId}
            onChange={(e) => setNewPayment({ ...newPayment, studentId: e.target.value })}
            options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` }))}
            required
          />

          {/* Fee Category is a TEXT INPUT (Requirement 14) */}
          <Input
            label="Fee Category / Purpose (Type Any Purpose)"
            placeholder="e.g. Agency Consultation Service Fee, IELTS Mock Test Voucher, Tuition Deposit Advance"
            required
            value={newPayment.type}
            onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Invoice Amount ($)"
              type="number"
              required
              value={newPayment.amount.toString()}
              onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
            />

            {/* Payment Due Date uses DatePicker (Requirement 14) */}
            <DatePicker
              label="Payment Due Date"
              mode="date"
              value={newPayment.dueDate}
              onChange={(val) => setNewPayment({ ...newPayment, dueDate: val })}
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Issue Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Invoice"
        description="Update invoice fee type, amount, due date, or payment status."
      >
        <form onSubmit={handleUpdatePayment} className="space-y-4">
          <Input
            label="Fee Category / Purpose"
            required
            value={editPayment.type}
            onChange={(e) => setEditPayment({ ...editPayment, type: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Amount ($)"
              type="number"
              value={editPayment.amount.toString()}
              onChange={(e) => setEditPayment({ ...editPayment, amount: Number(e.target.value) })}
            />

            <DatePicker
              label="Due Date"
              mode="date"
              value={editPayment.dueDate}
              onChange={(val) => setEditPayment({ ...editPayment, dueDate: val })}
            />

            <Select
              label="Payment Status"
              value={editPayment.status}
              onChange={(e) => setEditPayment({ ...editPayment, status: e.target.value as PaymentStatus })}
              options={[
                { value: "Due", label: "Due" },
                { value: "Paid", label: "Paid" },
                { value: "Partial", label: "Partial" },
                { value: "Overdue", label: "Overdue" },
              ]}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save Invoice Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, paymentId: "", paymentTitle: "" })}
        onConfirm={handleDeletePayment}
        title="Delete Student Invoice"
        message={`Are you sure you want to delete invoice "${confirmDelete.paymentTitle}"?`}
        confirmText="Are you sure you want to delete this invoice?"
      />
    </div>
  );
}
