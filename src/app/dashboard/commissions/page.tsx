"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import {
  Percent,
  Search,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { commissionsApi } from "@/lib/api/commissions";
import { CommissionRecord } from "@/types";

export default function CommissionsPage() {
  const { role } = useRole();
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await commissionsApi.getAll({
        status: statusFilter !== "All" ? statusFilter : undefined,
        search: searchQuery || undefined,
      });
      setCommissions(data);
    } catch (err) {
      console.error("Failed to load commissions ledger", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    if (role === "admin") {
      fetchCommissions();
    }
  }, [fetchCommissions, role]);

  // Admin access guard check
  if (role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          The University Commission Ledger is an executive module restricted exclusively to Agency Directors.
        </p>
        <Link href={role === "student" ? "/student" : "/dashboard"}>
          <Button variant="primary" size="sm">
            {role === "student" ? "Return to Student Portal" : "Return to Dashboard"}
          </Button>
        </Link>
      </div>
    );
  }


  const expectedTotal = commissions.reduce((s, c) => s + (c.expectedCommission || 0), 0);
  const receivedTotal = commissions.reduce((s, c) => s + (c.receivedCommission || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Executive Financials</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Institutional Commissions</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            University Commission Payout Ledger
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {commissions.length} Agreements
            </span>
          </h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Expected Commissions"
          value={`£${expectedTotal.toLocaleString()}`}
          trend={{ value: 16.4, isPositive: true }}
          icon={<Percent className="w-4 h-4" />}
          colorScheme="teal"
        />
        <StatCard
          title="Received Payouts"
          value={`£${receivedTotal.toLocaleString()}`}
          icon={<Percent className="w-4 h-4" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Pending Settlement"
          value={`£${(expectedTotal - receivedTotal).toLocaleString()}`}
          description="Due upon university census"
          icon={<Percent className="w-4 h-4" />}
          colorScheme="amber"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search commissions by student, university, counselor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Expected">Expected</option>
          <option value="Received">Received</option>
          <option value="Paid">Paid Out</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading commission ledger...</span>
        </div>
      ) : commissions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No commission records found</p>
          <p className="text-xs text-slate-500">Commissions will be tracked automatically as university offers are issued.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>University & Intake</TableHead>
              <TableHead>Year 1 Tuition</TableHead>
              <TableHead>Expected Commission</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Agency / Counselor Split</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((comm) => (
              <TableRow key={comm.id}>
                <TableCell className="font-bold text-xs text-slate-900">{comm.studentName}</TableCell>
                <TableCell>
                  <span className="font-bold text-xs text-slate-900 block">{comm.universityName}</span>
                  <span className="text-[11px] text-slate-500">{comm.intake} • {comm.country}</span>
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-800">
                  {comm.currency || "£"}{comm.tuitionFee?.toLocaleString()}
                </TableCell>
                <TableCell className="font-bold text-xs text-teal-700">
                  {comm.currency || "£"}{comm.expectedCommission?.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-800">
                  {comm.currency || "£"}{comm.receivedCommission?.toLocaleString() || 0}
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {comm.agencySharePercentage}% / {comm.counselorSharePercentage}% ({comm.counselorName})
                </TableCell>
                <TableCell><StatusBadge status={comm.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
