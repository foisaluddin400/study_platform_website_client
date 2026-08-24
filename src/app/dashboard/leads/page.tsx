"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { leadsApi } from "@/lib/api/leads";
import { usersApi } from "@/lib/api/users";
import { Lead, TeamMember } from "@/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [countryFilter, setCountryFilter] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const [leadsData, teamData] = await Promise.all([
        leadsApi.getAll({
          status: statusFilter !== "All" ? statusFilter : undefined,
          country: countryFilter !== "All" ? countryFilter : undefined,
          search: searchQuery || undefined,
        }),
        usersApi.getTeam().catch(() => []),
      ]);
      setLeads(leadsData);
      setTeamMembers(teamData);
    } catch (err) {
      console.error("Failed to load leads", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, countryFilter, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // New Lead Form state
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    studyLevel: "Master's" as const,
    countryInterest: "United Kingdom",
    preferredCourse: "",
    intake: "September 2027",
    assignedCounselorId: "",
    leadSource: "Website Form" as const,
    gpa: "",
    notes: "",
  });

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await leadsApi.create({
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        studyLevel: newLead.studyLevel,
        countryInterest: [newLead.countryInterest],
        preferredCourse: newLead.preferredCourse || "General Engineering / Business",
        intake: newLead.intake,
        assignedCounselorId: newLead.assignedCounselorId || undefined,
        leadSource: newLead.leadSource,
        gpa: newLead.gpa || "3.5 / 4.0",
        notes: (newLead.notes as any),
      });

      setLeads([created, ...leads]);
      setIsAddModalOpen(false);
      setNewLead({
        name: "",
        email: "",
        phone: "",
        studyLevel: "Master's",
        countryInterest: "United Kingdom",
        preferredCourse: "",
        intake: "September 2027",
        assignedCounselorId: "",
        leadSource: "Website Form",
        gpa: "",
        notes: "",
      });
    } catch (err) {
      console.error("Failed to create lead", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>CRM</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Leads Directory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Prospect & Lead Management
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {leads.length} Leads
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Lead
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, email, course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Counselling">Counselling</option>
            <option value="Interested">Interested</option>
            <option value="Documents Pending">Documents Pending</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Country filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Country:</span>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="All">All Countries</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="Malaysia">Malaysia</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading leads from live backend...</span>
        </div>
      ) : leads.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No leads found</p>
          <p className="text-xs text-slate-500">Add a new prospect or adjust your search filters.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead Name & Contact</TableHead>
              <TableHead>Target Destinations</TableHead>
              <TableHead>Preferred Course & Level</TableHead>
              <TableHead>Intake</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Counselor</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                {/* Name & Contact */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={lead.avatar} name={lead.name} size="sm" />
                    <div>
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="font-bold text-slate-900 hover:text-teal-700 transition-colors"
                      >
                        {lead.name}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{lead.email}</span>
                        <span>•</span>
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Destinations */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {lead.countryInterest?.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </TableCell>

                {/* Course & Level */}
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">{lead.preferredCourse}</p>
                    <span className="text-[11px] text-slate-500">{lead.studyLevel}</span>
                  </div>
                </TableCell>

                {/* Intake */}
                <TableCell>
                  <span className="font-medium text-slate-700 text-xs">{lead.intake}</span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>

                {/* Counselor */}
                <TableCell>
                  <div className="text-xs font-medium text-slate-700">
                    {lead.assignedCounselorName || "Senior Counselor"}
                  </div>
                </TableCell>

                {/* Last contact */}
                <TableCell>
                  <span className="text-xs text-slate-500">{lead.lastContactDate || "Recent"}</span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/dashboard/leads/${lead.id}`}>
                      <Button variant="outline" size="xs" leftIcon={<Eye className="w-3 h-3" />}>
                        View
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Study Abroad Lead"
        description="Capture prospect academic background and assign to a counselor."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Tanzim Hasan"
              required
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="tanzim@example.com"
              required
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone / WhatsApp"
              placeholder="+880 1711 982341"
              required
              value={newLead.phone}
              onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
            />
            <Input
              label="Current GPA / Percentage"
              placeholder="e.g. 3.65 / 4.0 or 82%"
              value={newLead.gpa}
              onChange={(e) => setNewLead({ ...newLead, gpa: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Study Level"
              value={newLead.studyLevel}
              onChange={(e) => setNewLead({ ...newLead, studyLevel: e.target.value as any })}
              options={[
                { value: "Master's", label: "Master's" },
                { value: "Bachelor's", label: "Bachelor's" },
                { value: "Doctorate", label: "Doctorate" },
                { value: "Diploma", label: "Diploma / Pathway" },
              ]}
            />

            <Select
              label="Target Country"
              value={newLead.countryInterest}
              onChange={(e) => setNewLead({ ...newLead, countryInterest: e.target.value })}
              options={[
                { value: "United Kingdom", label: "United Kingdom" },
                { value: "Canada", label: "Canada" },
                { value: "Australia", label: "Australia" },
                { value: "Germany", label: "Germany" },
                { value: "Malaysia", label: "Malaysia" },
              ]}
            />

            <Select
              label="Target Intake"
              value={newLead.intake}
              onChange={(e) => setNewLead({ ...newLead, intake: e.target.value })}
              options={[
                { value: "September 2027", label: "September 2027" },
                { value: "January 2028", label: "January 2028" },
                { value: "February 2028", label: "February 2028" },
                { value: "October 2027", label: "October 2027" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Preferred Course / Field"
              placeholder="e.g. MSc Data Science & Analytics"
              value={newLead.preferredCourse}
              onChange={(e) => setNewLead({ ...newLead, preferredCourse: e.target.value })}
            />

            <Select
              label="Assign Counselor"
              value={newLead.assignedCounselorId}
              onChange={(e) => setNewLead({ ...newLead, assignedCounselorId: e.target.value })}
              options={[
                { value: "", label: "Select Counselor" },
                ...teamMembers.map((t) => ({ value: t.id, label: `${t.name} (${t.role})` })),
              ]}
            />
          </div>

          <Textarea
            label="Initial Counselling Notes / Remarks"
            placeholder="e.g. Student has £25k budget, father is sole sponsor, IELTS scheduled for next month."
            rows={2}
            value={newLead.notes}
            onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save & Create Lead
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
