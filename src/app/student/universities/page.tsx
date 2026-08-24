"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Search,
  ExternalLink,
  Eye,
  MapPin,
  Loader2,
  GraduationCap,
  Award,
  Globe,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { universitiesApi } from "@/lib/api/universities";
import { agenciesApi } from "@/lib/api/agencies";
import { University } from "@/types";

export default function StudentUniversitiesPage() {
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
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

  const handleOpenDetails = (uni: University) => {
    setSelectedUni(uni);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Partner Universities</h1>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-200">
              View Only Directory
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Explore verified international partner institutions, available degree programs, tuition fees, and admission requirements.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search universities by name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Country Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer w-full md:w-auto"
          >
            <option value="All">All Countries</option>
            {operatingCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Universities Grid */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading university directory...</span>
        </div>
      ) : universities.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No partner universities found</p>
          <p className="text-xs text-slate-500">Try changing your search query or selecting a different country filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 flex-1 space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 p-2 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                      {uni.logo ? (
                        <img src={uni.logo} alt={uni.name} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-6 h-6 text-teal-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-teal-600 transition-colors line-clamp-1">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>
                          {uni.city ? `${uni.city}, ` : ""}
                          {uni.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {uni.ranking && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200/80 flex items-center gap-1">
                      <Award className="w-2.5 h-2.5" />
                      {uni.ranking}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-200/80">
                    {uni.agentStatus || "Direct Partner"}
                  </span>
                </div>

                {/* Overview Snippet */}
                {uni.overview && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {uni.overview}
                  </p>
                )}

                {/* Offered Study Levels */}
                {uni.degrees && uni.degrees.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Offered Degrees
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {uni.degrees.slice(0, 3).map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/60"
                        >
                          {d}
                        </span>
                      ))}
                      {uni.degrees.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium">
                          +{uni.degrees.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Avg Tuition</span>
                    <span className="font-semibold text-slate-800 text-[11px] truncate block">
                      {uni.avgTuition || "Inquire with Counselor"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Application Fee</span>
                    <span className="font-semibold text-slate-800 text-[11px] block">
                      {uni.applicationFee ? `${uni.currency || "USD"} ${uni.applicationFee}` : "Fee Waiver Available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleOpenDetails(uni)}
                  leftIcon={<Eye className="w-3 h-3" />}
                  className="flex-1 text-[11px]"
                >
                  View Requirements
                </Button>
                {uni.website && (
                  <a
                    href={uni.website.startsWith("http") ? uni.website : `https://${uni.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-teal-600 hover:border-teal-300 transition-colors"
                    title="Official Website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* University Details Modal (View Only) */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={selectedUni?.name || "University Details"}
        description={`${selectedUni?.city ? `${selectedUni.city}, ` : ""}${selectedUni?.country || ""}`}
      >
        {selectedUni && (
          <div className="space-y-5">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 p-2 overflow-hidden shadow-2xs">
                {selectedUni.logo ? (
                  <img src={selectedUni.logo} alt={selectedUni.name} className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-8 h-8 text-teal-600" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base leading-tight">{selectedUni.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedUni.city ? `${selectedUni.city}, ` : ""}{selectedUni.country}
                  </span>
                  {selectedUni.ranking && (
                    <>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">{selectedUni.ranking}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Overview */}
            {selectedUni.overview && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">About Institution</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  {selectedUni.overview}
                </p>
              </div>
            )}

            {/* Admission Requirements */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                Admission & Entry Requirements
              </h4>
              <div className="p-3.5 rounded-xl bg-teal-50/40 border border-teal-100 text-xs text-slate-700 leading-relaxed">
                {selectedUni.requirementsSummary ||
                  "General Entry: Minimum 60-65% in relevant previous academic qualifications. English requirement: IELTS 6.0 - 6.5 overall (or equivalent TOEFL/PTE). Contact your assigned counselor for course-specific prerequisites."}
              </div>
            </div>

            {/* Offered Degrees */}
            {selectedUni.degrees && selectedUni.degrees.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                  Available Degree Levels
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUni.degrees.map((degree) => (
                    <span
                      key={degree}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                    >
                      {degree}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Average Annual Tuition</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedUni.avgTuition || "Contact Counselor"}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Standard Application Fee</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedUni.applicationFee
                    ? `${selectedUni.currency || "USD"} ${selectedUni.applicationFee}`
                    : "No Fee / Waiver Available"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              {selectedUni.website && (
                <a
                  href={selectedUni.website.startsWith("http") ? selectedUni.website : `https://${selectedUni.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit University Website
                </a>
              )}
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsDetailsModalOpen(false)}
                className="ml-auto"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
