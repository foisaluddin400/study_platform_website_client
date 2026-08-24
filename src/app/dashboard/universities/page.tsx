"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Plus,
  ExternalLink,
  Eye,
  MapPin,
  Loader2,
  Edit,
  Trash2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { TagInput } from "@/components/ui/TagInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { universitiesApi } from "@/lib/api/universities";
import { agenciesApi } from "@/lib/api/agencies";
import { University } from "@/types";

const SUGGESTED_DEGREES = [
  "Bachelor's",
  "Master's",
  "Doctorate / PhD",
  "Postgraduate Diploma",
  "Undergraduate Diploma",
  "Foundation Certificate",
  "Pre-Master's",
];

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [operatingCountries, setOperatingCountries] = useState<string[]>([
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "United States",
    "Malaysia",
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Confirm delete state
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    uniId: string;
    uniName: string;
  }>({
    isOpen: false,
    uniId: "",
    uniName: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    country: "United Kingdom",
    city: "",
    website: "",
    ranking: "QS Top 100",
    agentStatus: "Direct Partner" as any,
    applicationFee: 50,
    currency: "GBP",
    avgTuition: "£20,000 - £28,000 / year",
    degrees: ["Bachelor's", "Master's", "Doctorate / PhD"] as string[],
    overview: "",
    requirementsSummary: "",
  });

  const fetchUnis = useCallback(async () => {
    try {
      setLoading(true);
      const [data, agencyData] = await Promise.all([
        universitiesApi.getAll({
          country: countryFilter !== "All" ? countryFilter : undefined,
          search: searchQuery || undefined,
        }),
        agenciesApi.getProfile().catch(() => null),
      ]);
      setUniversities(data);
      if (agencyData?.operatingCountries && agencyData.operatingCountries.length > 0) {
        setOperatingCountries(agencyData.operatingCountries);
      }
    } catch (err) {
      console.error("Failed to load universities", err);
    } finally {
      setLoading(false);
    }
  }, [countryFilter, searchQuery]);

  useEffect(() => {
    fetchUnis();
  }, [fetchUnis]);

  const handleOpenAdd = () => {
    setFormData({
      id: "",
      name: "",
      country: operatingCountries[0] || "United Kingdom",
      city: "",
      website: "",
      ranking: "QS Top 100",
      agentStatus: "Direct Partner",
      applicationFee: 50,
      currency: "GBP",
      avgTuition: "£20,000 - £28,000 / year",
      degrees: ["Bachelor's", "Master's", "Doctorate / PhD"],
      overview: "",
      requirementsSummary: "Min 65% in prior academics; IELTS 6.5 minimum",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (uni: University) => {
    setSelectedUni(uni);
    setFormData({
      id: uni.id,
      name: uni.name,
      country: uni.country,
      city: uni.city || "",
      website: uni.website || "",
      ranking: uni.ranking || "QS Top 100",
      agentStatus: uni.agentStatus,
      applicationFee: uni.applicationFee || 0,
      currency: uni.currency || "USD",
      avgTuition: uni.avgTuition || "",
      degrees: uni.degrees || ["Bachelor's", "Master's"],
      overview: uni.overview || "",
      requirementsSummary: uni.requirementsSummary || "",
    });
    setIsEditModalOpen(true);
  };

  const handleCreateUni = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await universitiesApi.create({
        name: formData.name,
        logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80",
        country: formData.country,
        city: formData.city || "Capital City",
        website: formData.website || "https://university.edu",
        ranking: formData.ranking,
        agentStatus: formData.agentStatus,
        activeCoursesCount: 1,
        applicationFee: Number(formData.applicationFee),
        currency: formData.currency,
        status: "Active",
        overview: formData.overview,
        requirementsSummary: formData.requirementsSummary,
        avgTuition: formData.avgTuition,
        degrees: formData.degrees,
        intakes: ["September 2027", "January 2028"],
        scholarshipsSummary: "Merit-based scholarships available for international students",
        commissionRate: "12% of Year 1 Tuition",
      });

      setUniversities([created, ...universities]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to create university partner", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;
    setSubmitting(true);
    try {
      const updated = await universitiesApi.update(formData.id, {
        name: formData.name,
        country: formData.country,
        city: formData.city,
        website: formData.website,
        ranking: formData.ranking,
        agentStatus: formData.agentStatus,
        applicationFee: Number(formData.applicationFee),
        currency: formData.currency,
        avgTuition: formData.avgTuition,
        degrees: formData.degrees,
        overview: formData.overview,
        requirementsSummary: formData.requirementsSummary,
      });

      setUniversities(universities.map((u) => (u.id === formData.id ? updated : u)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update university", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUni = async () => {
    if (!confirmDelete.uniId) return;
    try {
      await universitiesApi.delete(confirmDelete.uniId);
      setUniversities(universities.filter((u) => u.id !== confirmDelete.uniId));
      setConfirmDelete({ isOpen: false, uniId: "", uniName: "" });
    } catch (err) {
      console.error("Failed to delete university", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Global Institutional Network</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">University Partners</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            University Partners & Representation
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {universities.length} Institutions
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Partner University
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search university or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>

        {/* Operating Country Filter (Requirement 8) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
          >
            <option value="All">All Operating Countries</option>
            {operatingCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Universities Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading university partners...</span>
        </div>
      ) : universities.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No partner universities found</p>
          <p className="text-xs text-slate-500">Add a university or adjust your operating country filter.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution Name & Location</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Degree Levels Offered</TableHead>
              <TableHead>Contract Type</TableHead>
              <TableHead>App Fee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {universities.map((uni) => (
              <TableRow key={uni.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{uni.name}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{uni.city || "Campus"}, {uni.country}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="font-semibold text-xs text-slate-700">{uni.country}</span>
                </TableCell>

                {/* Degree tags */}
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {uni.degrees && uni.degrees.length > 0 ? (
                      uni.degrees.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold"
                        >
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400">All Degree Levels</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                    {uni.agentStatus}
                  </span>
                </TableCell>

                <TableCell className="text-xs font-semibold text-slate-700">
                  {uni.applicationFee ? `${uni.currency} ${uni.applicationFee}` : "Free Waiver"}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {uni.website && (
                      <a
                        href={uni.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Open Official Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleOpenEdit(uni)}
                      title="Edit University"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        setConfirmDelete({
                          isOpen: true,
                          uniId: uni.id,
                          uniName: uni.name,
                        })
                      }
                      title="Delete University"
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

      {/* Add / Edit University Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? "Add University Partner" : `Edit ${formData.name}`}
        description="Configure institutional profile, degree programs, and admissions requirements."
      >
        <form onSubmit={isAddModalOpen ? handleCreateUni : handleUpdateUni} className="space-y-4">
          <Input
            label="Institution Official Name"
            placeholder="e.g. University of Manchester"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country from Operating Countries (Requirement 8) */}
            <Select
              label="Country (Operating Countries)"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              options={operatingCountries.map((c) => ({ value: c, label: c }))}
              required
            />

            <Input
              label="Campus City / Location"
              placeholder="e.g. Manchester"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          {/* Degrees tag / multi-value input (Requirement 8) */}
          <TagInput
            label="Degrees Offered (Tag / Multi-Value)"
            tags={formData.degrees}
            onChange={(tags) => setFormData({ ...formData, degrees: tags })}
            placeholder="Type degree level and press Enter (e.g. Bachelor's, Master's, PhD)..."
            options={SUGGESTED_DEGREES}
            helperText="Press Enter or comma to add degree tags. These feed into dynamic Course Finder filters."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Partnership Agreement Type"
              value={formData.agentStatus}
              onChange={(e) => setFormData({ ...formData, agentStatus: e.target.value as any })}
              options={[
                { value: "Direct Partner", label: "Direct Partner" },
                { value: "Aggregator Agreement", label: "Aggregator Agreement" },
                { value: "Sub-Agent", label: "Sub-Agent Contract" },
                { value: "Pending Contract", label: "Pending Contract" },
              ]}
            />

            <Input
              label="Application Fee"
              type="number"
              value={formData.applicationFee.toString()}
              onChange={(e) => setFormData({ ...formData, applicationFee: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Official Website URL"
            placeholder="https://manchester.ac.uk"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />

          {/* Rich text / formatted overview & requirements */}
          <Textarea
            label="University Overview & Highlights"
            placeholder="Russell Group member, top research facilities, student satisfaction..."
            rows={3}
            value={formData.overview}
            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
          />

          <Textarea
            label="Entry Requirements Summary"
            placeholder="e.g. Minimum GPA 3.0 or 60% in Bachelor's. IELTS 6.5 with no band less than 6.0."
            rows={2}
            value={formData.requirementsSummary}
            onChange={(e) => setFormData({ ...formData, requirementsSummary: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              {isAddModalOpen ? "Create Partner Profile" : "Save University Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, uniId: "", uniName: "" })}
        onConfirm={handleDeleteUni}
        title="Delete University Partner"
        message={`Are you sure you want to delete "${confirmDelete.uniName}"? All linked courses will be removed.`}
        confirmText="Are you sure you want to delete this university?"
      />
    </div>
  );
}
