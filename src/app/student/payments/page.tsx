"use client";

import React, { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { paymentsApi } from "@/lib/api/payments";
import { PaymentRecord } from "@/types";

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await paymentsApi.getMyPayments();
        setPayments(data);
      } catch (err) {
        console.error("Failed to load my payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span>Student Portal</span>
          <span>•</span>
          <span className="text-teal-700 font-semibold">Invoices & Receipts</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Payment Ledger & Service Invoices
        </h1>
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading your fee ledger...</span>
        </div>
      ) : payments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No invoices on file</p>
          <p className="text-xs text-slate-500">Invoices issued by your agency will be listed here.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Service Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono font-bold text-xs text-teal-800">
                  {p.invoiceNumber}
                </TableCell>
                <TableCell>
                  <span className="font-bold text-slate-900 text-xs">{p.type}</span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-slate-900 text-xs">
                    ${p.amount.toLocaleString()} {p.currency}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-600">{p.dueDate}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="xs" leftIcon={<Download className="w-3 h-3" />}>
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
