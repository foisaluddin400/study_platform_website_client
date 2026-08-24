"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  UserCheck,
  GraduationCap,
  MessageSquare,
  FileCheck,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Input";
import { leadsApi } from "@/lib/api/leads";
import { Lead } from "@/types";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNoteText, setNewNoteText] = useState("");
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const data = await leadsApi.getById(leadId);
        setLead(data);
      } catch (err) {
        console.error("Failed to load lead details", err);
      } finally {
        setLoading(false);
      }
    };
    if (leadId) fetchLead();
  }, [leadId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !lead) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: "Senior Counselor",
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      text: newNoteText.trim(),
    };

    const newTimelineItem = {
      id: `t-${Date.now()}`,
      title: "Counselling Note Added",
      description: newNoteText.trim(),
      timestamp: "Just now",
      type: "note" as const,
    };

    const updatedNotes = [newNote, ...(lead.notes || [])];
    const updatedTimeline = [newTimelineItem, ...(lead.timeline || [])];

    try {
      const updated = await leadsApi.update(lead.id, {
        notes: updatedNotes,
        timeline: updatedTimeline,
      });
      setLead(updated);
      setNewNoteText("");
    } catch (err) {
      console.error("Failed to update notes", err);
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    if (!lead) return;
    try {
      const updated = await leadsApi.update(lead.id, { status: newStatus });
      setLead(updated);
    } catch (err) {
      console.error("Failed to change status", err);
    }
  };

  const handleConfirmConvert = async () => {
    if (!lead) return;
    setIsConverting(true);
    try {
      const res = await leadsApi.convert(lead.id);
      setIsConvertModalOpen(false);
      if (res.student && res.student.id) {
        router.push(`/dashboard/students/${res.student.id}`);
      } else {
        router.push("/dashboard/students");
      }
    } catch (err) {
      console.error("Failed to convert lead", err);
      setIsConverting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-xs text-slate-500 font-medium">Loading lead dossier...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-slate-700 font-bold">Lead record not found</p>
        <Link href="/dashboard/leads">
          <Button variant="outline" size="sm">
            Back to Leads
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top back nav and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/leads"
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Leads</span>
              <span>•</span>
              <span className="text-teal-700 font-semibold">{lead.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {lead.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status selector */}
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none shadow-2xs cursor-pointer"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Counselling">Counselling</option>
            <option value="Interested">Interested</option>
            <option value="Documents Pending">Documents Pending</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          {lead.status !== "Converted" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsConvertModalOpen(true)}
              leftIcon={<UserCheck className="w-4 h-4" />}
            >
              Convert to Student
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: 2 Cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (1 span): Lead Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-100">
              <Avatar src={lead.avatar} name={lead.name} size="lg" />
              <div>
                <h2 className="font-bold text-lg text-slate-900">{lead.name}</h2>
                <p className="text-xs text-slate-500">{lead.studyLevel} Prospect</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>

            {/* Contact Details */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block">
                Contact Information
              </span>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Target Intake: <strong>{lead.intake}</strong></span>
              </div>
            </div>

            {/* Academic Preferences */}
            <div className="space-y-3 text-xs pt-4 border-t border-slate-100">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block">
                Academic Preferences
              </span>
              <div>
                <span className="text-slate-500 block text-[11px]">Preferred Course:</span>
                <span className="font-semibold text-slate-800">{lead.preferredCourse}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Destinations:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lead.countryInterest?.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-100"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">GPA / Score:</span>
                  <span className="font-semibold text-slate-800">{lead.gpa || "3.6 / 4.0"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">IELTS / English:</span>
                  <span className="font-semibold text-slate-800">{lead.ieltsScore || "7.0"}</span>
                </div>
              </div>
            </div>

            {/* Assigned Counselor */}
            <div className="space-y-2 text-xs pt-4 border-t border-slate-100">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block">
                Counselor in Charge
              </span>
              <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Avatar name={lead.assignedCounselorName || "Senior Counselor"} size="sm" />
                <div>
                  <p className="font-bold text-slate-900 text-xs">
                    {lead.assignedCounselorName || "Senior Counselor"}
                  </p>
                  <p className="text-[10px] text-slate-500">Admissions Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (2 spans): Timeline & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add note input card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Add Counselling Note or Log Activity
            </h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <Textarea
                placeholder="Log counselling call outcomes, document readiness, student budget constraints..."
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  disabled={!newNoteText.trim()}
                >
                  Post Note
                </Button>
              </div>
            </form>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Lead Activity & History
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {lead.timeline?.map((item, idx) => (
                <div key={item.id || idx} className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 z-10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Convert to Student Modal */}
      <Modal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        title="Convert Lead to Active Student"
        description="This will promote this lead into a fully enrolled student profile with document vault and application tracker."
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            You are converting <strong>{lead.name}</strong> into an official student applicant.
          </p>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 space-y-1">
            <p className="font-bold">What happens next?</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
              <li>Student profile will appear in the Student Directory.</li>
              <li>A personal document checklist will be initialized.</li>
              <li>You can start creating university applications directly.</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConvertModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isConverting}
              onClick={handleConfirmConvert}
            >
              Confirm & Convert
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
