"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  Clock,
  Video,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { appointmentsApi } from "@/lib/api/appointments";
import { studentsApi } from "@/lib/api/students";
import { usersApi } from "@/lib/api/users";
import { Appointment, AppointmentType, Student, TeamMember } from "@/types";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    aptId: string;
    aptTitle: string;
  }>({
    isOpen: false,
    aptId: "",
    aptTitle: "",
  });

  // New Appointment form
  const [newApt, setNewApt] = useState({
    title: "",
    studentId: "",
    counselorName: "Senior Counselor",
    date: "2027-09-25",
    time: "02:00 PM",
    duration: "45 mins",
    type: "Counselling" as AppointmentType,
    location: "Zoom Video Call",
    notes: "",
  });

  // Edit Appointment form
  const [editApt, setEditApt] = useState({
    id: "",
    title: "",
    date: "",
    time: "",
    duration: "45 mins",
    type: "Counselling" as AppointmentType,
    location: "",
    status: "Upcoming" as any,
    notes: "",
  });

  const fetchApts = useCallback(async () => {
    try {
      setLoading(true);
      const [aptsData, studentsData, teamData] = await Promise.all([
        appointmentsApi.getAll({
          type: typeFilter !== "All" ? typeFilter : undefined,
        }),
        studentsApi.getAll().catch(() => []),
        usersApi.getTeam().catch(() => []),
      ]);
      setAppointments(aptsData);
      setStudents(studentsData);
      setTeamMembers(teamData);
      if (studentsData.length > 0 && !newApt.studentId) {
        setNewApt((prev) => ({ ...prev, studentId: studentsData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    fetchApts();
  }, [fetchApts]);

  const handleCreateApt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await appointmentsApi.create({
        title: newApt.title || `${newApt.type} Session`,
        studentId: newApt.studentId,
        counselorName: newApt.counselorName,
        date: newApt.date,
        time: newApt.time,
        duration: newApt.duration,
        type: newApt.type,
        location: newApt.location,
        notes: newApt.notes,
      });

      setAppointments([created, ...appointments]);
      setIsAddModalOpen(false);
      setNewApt({
        title: "",
        studentId: students[0]?.id || "",
        counselorName: "Senior Counselor",
        date: "2027-09-25",
        time: "02:00 PM",
        duration: "45 mins",
        type: "Counselling",
        location: "Zoom Video Call",
        notes: "",
      });
    } catch (err) {
      console.error("Failed to create appointment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (apt: Appointment) => {
    setSelectedApt(apt);
    setEditApt({
      id: apt.id,
      title: apt.title,
      date: apt.date || "",
      time: apt.time || "02:00 PM",
      duration: apt.duration || "45 mins",
      type: (apt.type as AppointmentType) || "Counselling",
      location: apt.location || "Zoom Video Call",
      status: apt.status || "Upcoming",
      notes: apt.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateApt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editApt.id) return;
    setSubmitting(true);
    try {
      const updated = await appointmentsApi.update(editApt.id, {
        title: editApt.title,
        date: editApt.date,
        time: editApt.time,
        duration: editApt.duration,
        type: editApt.type,
        location: editApt.location,
        status: editApt.status,
        notes: editApt.notes,
      });

      setAppointments(appointments.map((a) => (a.id === editApt.id ? updated : a)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update appointment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteApt = async () => {
    if (!confirmDelete.aptId) return;
    try {
      await appointmentsApi.delete(confirmDelete.aptId);
      setAppointments(appointments.filter((a) => a.id !== confirmDelete.aptId));
      setConfirmDelete({ isOpen: false, aptId: "", aptTitle: "" });
    } catch (err) {
      console.error("Failed to delete appointment", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Calendar & Counseling</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Scheduled Sessions</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Appointments & Consultation Desk
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {appointments.length} Sessions
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Book Consultation Session
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or counselor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
        >
          <option value="All">All Session Types</option>
          <option value="Counselling">Counselling</option>
          <option value="Document Review">Document Review</option>
          <option value="Application Review">Application Review</option>
          <option value="Visa Consultation">Visa Consultation</option>
          <option value="Follow-up">Follow-up</option>
        </select>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading scheduled sessions...</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No appointments scheduled</p>
          <p className="text-xs text-slate-500">Book a new counseling session or consultation with a student.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200 uppercase tracking-wider">
                      {apt.type}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">{apt.title}</h3>
                  </div>
                  <StatusBadge status={apt.status || "Upcoming"} />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.date} • {apt.time} ({apt.duration})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.location || "Zoom Meeting"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Student: <strong className="text-slate-800">{apt.studentName}</strong></span>
                  <span>Counselor: <strong className="text-slate-800">{apt.counselorName}</strong></span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => openEditModal(apt)}
                  title="Edit appointment"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() =>
                    setConfirmDelete({
                      isOpen: true,
                      aptId: apt.id,
                      aptTitle: `${apt.title} (${apt.studentName})`,
                    })
                  }
                  title="Delete appointment"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Session Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Consultation Session"
        description="Book a video or in-person counseling meeting with student."
      >
        <form onSubmit={handleCreateApt} className="space-y-4">
          <Input
            label="Session Title"
            placeholder="e.g. Visa SOP Review Session"
            value={newApt.title}
            onChange={(e) => setNewApt({ ...newApt, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Student Applicant"
              value={newApt.studentId}
              onChange={(e) => setNewApt({ ...newApt, studentId: e.target.value })}
              options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` }))}
              required
            />

            <Select
              label="Counselor In-Charge"
              value={newApt.counselorName}
              onChange={(e) => setNewApt({ ...newApt, counselorName: e.target.value })}
              options={teamMembers.map((t) => ({ value: t.name, label: `${t.name} (${t.role})` }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DatePicker
              label="Session Date"
              mode="date"
              value={newApt.date}
              onChange={(val) => setNewApt({ ...newApt, date: val })}
              required
            />

            <Input
              label="Time Slot"
              placeholder="e.g. 02:00 PM"
              value={newApt.time}
              onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
            />

            <Select
              label="Session Type"
              value={newApt.type}
              onChange={(e) => setNewApt({ ...newApt, type: e.target.value as AppointmentType })}
              options={[
                { value: "Counselling", label: "Counselling" },
                { value: "Document Review", label: "Document Review" },
                { value: "Application Review", label: "Application Review" },
                { value: "Visa Consultation", label: "Visa Consultation" },
                { value: "Follow-up", label: "Follow-up" },
              ]}
            />
          </div>

          <Input
            label="Meeting Location / Video Link"
            placeholder="e.g. https://zoom.us/j/902847192"
            value={newApt.location}
            onChange={(e) => setNewApt({ ...newApt, location: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Consultation Session"
        description="Reschedule session time or update meeting notes."
      >
        <form onSubmit={handleUpdateApt} className="space-y-4">
          <Input
            label="Session Title"
            value={editApt.title}
            onChange={(e) => setEditApt({ ...editApt, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Session Date"
              mode="date"
              value={editApt.date}
              onChange={(val) => setEditApt({ ...editApt, date: val })}
            />

            <Input
              label="Time"
              value={editApt.time}
              onChange={(e) => setEditApt({ ...editApt, time: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Session Status"
              value={editApt.status}
              onChange={(e) => setEditApt({ ...editApt, status: e.target.value })}
              options={[
                { value: "Upcoming", label: "Upcoming" },
                { value: "Completed", label: "Completed" },
                { value: "Cancelled", label: "Cancelled" },
              ]}
            />

            <Input
              label="Location / Meeting URL"
              value={editApt.location}
              onChange={(e) => setEditApt({ ...editApt, location: e.target.value })}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save Session Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, aptId: "", aptTitle: "" })}
        onConfirm={handleDeleteApt}
        title="Delete Appointment"
        message={`Are you sure you want to delete session "${confirmDelete.aptTitle}"?`}
        confirmText="Are you sure you want to delete this appointment?"
      />
    </div>
  );
}
