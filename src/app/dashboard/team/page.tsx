"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import {
  UserCog,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Lock,
  Loader2,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { usersApi } from "@/lib/api/users";
import { TeamMember } from "@/types";

export default function TeamPage() {
  const { role, currentUser } = useRole();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
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

  // New Team Member state (Requirement 15: Branch as text input)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Senior Counselor",
    roleType: "COUNSELOR",
    branch: "London HQ",
    password: "",
    confirmPassword: "",
  });

  // Edit Team Member state (excludes email & password)
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    phone: "",
    roleTitle: "",
    branch: "",
  });

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersApi.getTeam();
      setTeam(data);
    } catch (err) {
      console.error("Failed to load team members", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === "admin") {
      fetchTeam();
    }
  }, [fetchTeam, role]);

  if (role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          Staff & Team Management is an administrative module reserved exclusively for Agency Directors.
        </p>
        <Link href={role === "student" ? "/student" : "/dashboard"}>
          <Button variant="primary" size="sm">
            {role === "student" ? "Return to Student Portal" : "Return to Dashboard"}
          </Button>
        </Link>
      </div>
    );
  }


  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (newMember.password.length < 6) {
      setModalError("Password must be at least 6 characters long.");
      return;
    }

    if (newMember.password !== newMember.confirmPassword) {
      setModalError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await usersApi.inviteTeamMember({
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        role: newMember.roleType,
        roleTitle: newMember.role,
        branch: newMember.branch,
        password: newMember.password,
      });

      setIsAddModalOpen(false);
      setNewMember({
        name: "",
        email: "",
        phone: "",
        role: "Senior Counselor",
        roleType: "COUNSELOR",
        branch: "London HQ",
        password: "",
        confirmPassword: "",
      });
      fetchTeam();
    } catch (err: any) {
      setModalError(err.message || "Failed to add team member.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setEditForm({
      id: member.id,
      name: member.name,
      phone: member.phone || "",
      roleTitle: member.role || "Senior Counselor",
      branch: member.branch || "Headquarters",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await usersApi.updateTeamMember(editForm.id, {
        name: editForm.name,
        phone: editForm.phone,
        role: editForm.roleTitle,
        branch: editForm.branch,
      });
      setIsEditModalOpen(false);
      fetchTeam();
    } catch (err: any) {
      setModalError(err.message || "Failed to update staff member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlockMember = (member: TeamMember) => {
    if (member.id === currentUser.id || member.email === currentUser.email) {
      alert("You cannot block your own Admin account.");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "Block Staff Account",
      message: `Are you sure you want to block ${member.name}? They will immediately be denied access to the workspace.`,
      confirmText: "Yes, Block Account",
      variant: "warning",
      action: async () => {
        await usersApi.blockTeamMember(member.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        fetchTeam();
      },
    });
  };

  const handleUnblockMember = (member: TeamMember) => {
    setConfirmDialog({
      isOpen: true,
      title: "Unblock Staff Account",
      message: `Unblock ${member.name} to restore access to counseling cases.`,
      confirmText: "Yes, Unblock",
      variant: "primary",
      action: async () => {
        await usersApi.unblockTeamMember(member.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        fetchTeam();
      },
    });
  };

  const handleDeleteMember = (member: TeamMember) => {
    if (member.id === currentUser.id || member.email === currentUser.email) {
      alert("You cannot delete your own Admin account.");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "Delete Staff Account",
      message: `Are you sure you want to delete ${member.name}? They will be removed from your agency team.`,
      confirmText: "Are you sure you want to delete this staff member?",
      variant: "danger",
      action: async () => {
        await usersApi.deleteTeamMember(member.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        fetchTeam();
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Agency Operations</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Team Directory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Staff Members & Counselor Roster
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {team.length} Active Staff
            </span>
          </h1>
        </div>

        {role === "admin" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Team Member
          </Button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
        >
          <option value="All">All Roles</option>
          <option value="AGENCY_ADMIN">Agency Admin</option>
          <option value="COUNSELOR">Counselors</option>
        </select>
      </div>

      {/* Team Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading agency team...</span>
        </div>
      ) : team.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No team members found</p>
          <p className="text-xs text-slate-500">Invite counselors and branch staff to your agency workspace.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member & Contact</TableHead>
              <TableHead>Role Title</TableHead>
              <TableHead>Branch Location</TableHead>
              <TableHead>Active Caseload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((member) => {
              const isOwnAccount = member.id === currentUser.id || member.email === currentUser.email;

              return (
                <TableRow key={member.id} className={member.status === "Inactive" ? "bg-rose-50/20" : undefined}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={member.avatar} name={member.name} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-slate-900">{member.name}</p>
                          {isOwnAccount && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{member.email}</span>
                          <span>•</span>
                          <span>{member.phone || "No phone"}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                      {member.role}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-slate-700 font-medium">
                    {member.branch || "Headquarters"}
                  </TableCell>

                  <TableCell className="text-xs text-slate-600">
                    <span className="font-bold text-slate-900">{member.activeStudents || 0}</span> students assigned
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={member.status || "Active"} />
                  </TableCell>

                  <TableCell className="text-right">
                    {role === "admin" && (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => openEditModal(member)}
                          title="Edit staff member"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                        </Button>

                        {!isOwnAccount && (
                          <>
                            {member.status === "Inactive" ? (
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => handleUnblockMember(member)}
                                title="Unblock account"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => handleBlockMember(member)}
                                title="Block staff account"
                              >
                                <Ban className="w-3.5 h-3.5 text-amber-600" />
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleDeleteMember(member)}
                              title="Delete staff account"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add Team Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Invite New Staff / Counselor"
        description="Create credentials for a counselor or staff member to join your agency workspace."
      >
        {modalError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {modalError}
          </div>
        )}

        <form onSubmit={handleCreateMember} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Staff Full Name"
              placeholder="e.g. Sarah Jenkins"
              required
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
            <Input
              label="Official Email Address"
              type="email"
              placeholder="Enter your email"
              required
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Login Password"
              type="password"
              placeholder="Minimum 6 characters"
              required
              value={newMember.password}
              onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              required
              value={newMember.confirmPassword}
              onChange={(e) => setNewMember({ ...newMember, confirmPassword: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="+44 7700 900255"
              value={newMember.phone}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
            />

            {/* Branch Office is a TEXT INPUT (Requirement 15) */}
            <Input
              label="Branch Office (Type Any Branch)"
              placeholder="e.g. London HQ, Dhaka Branch, Toronto Office"
              required
              value={newMember.branch}
              onChange={(e) => setNewMember({ ...newMember, branch: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="System Governance Role"
              value={newMember.roleType}
              onChange={(e) => {
                const val = e.target.value;
                setNewMember({
                  ...newMember,
                  roleType: val,
                  role: val === "AGENCY_ADMIN" ? "Agency Co-Director" : "Senior Counselor",
                });
              }}
              options={[
                { value: "COUNSELOR", label: "Counselor / Admissions Officer" },
                { value: "AGENCY_ADMIN", label: "Agency Admin / Manager" },
              ]}
            />

            <Input
              label="Role Display Title"
              placeholder="e.g. Senior Admissions Counselor"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Create Staff Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Team Member Modal (Requirement 15: Excludes Email & Password) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Staff Information"
        description="Update staff profile details. Email and password cannot be edited from this interface."
      >
        <form onSubmit={handleUpdateMember} className="space-y-4">
          <Input
            label="Staff Full Name"
            required
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />

            {/* Branch is TEXT INPUT */}
            <Input
              label="Branch Office"
              placeholder="e.g. London HQ, Dhaka Branch"
              value={editForm.branch}
              onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
            />
          </div>

          <Input
            label="Role Display Title"
            value={editForm.roleTitle}
            onChange={(e) => setEditForm({ ...editForm, roleTitle: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save Staff Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog for Block / Delete */}
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
