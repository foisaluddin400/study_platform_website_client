"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Save,
  CheckCircle2,
  GraduationCap,
  DollarSign,
  Globe,
  Loader2,
  Camera,
  X,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { studentsApi } from "@/lib/api/students";
import { useRole } from "@/context/RoleContext";
import { Student } from "@/types";

export default function StudentProfilePage() {
  const { currentUser, updateCurrentUser } = useRole();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Avatar file state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    currentAddress: "",
    highestDegree: "Bachelor of Science",
    institution: "University of Dhaka",
    passingYear: 2025,
    gpa: "3.78 / 4.0",
    testType: "IELTS" as const,
    overallScore: "7.5",
    sponsorName: "Tanvir Ahmed",
    sponsorRelationship: "Father",
    estimatedFunds: "£42,000",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await studentsApi.getMe();
        setStudent(data);
        if (data) {
          const academic = data.academicHistory?.[0];
          const eng = data.englishProficiency;
          const sponsor = data.sponsorDetails;

          setFormData({
            name: data.name || currentUser.name || "",
            email: data.email || currentUser.email || "",
            phone: data.phone || currentUser.phone || "",
            dateOfBirth: data.dateOfBirth || "2002-04-12",
            nationality: data.nationality || "Bangladeshi",
            passportNumber: data.passportNumber || "A08941298",
            currentAddress: data.currentAddress || "Flat 4B, 12 Elm Grove, London W5 3JH",
            highestDegree: academic?.degree || "Bachelor of Science",
            institution: academic?.institution || "University of Dhaka",
            passingYear: academic?.passingYear || 2025,
            gpa: academic?.gpa || "3.78 / 4.0",
            testType: (eng?.testType as any) || "IELTS",
            overallScore: eng?.overallScore || "7.5",
            sponsorName: sponsor?.name || "Tanvir Ahmed",
            sponsorRelationship: sponsor?.relationship || "Father",
            estimatedFunds: sponsor?.estimatedFunds || "£42,000",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setSaving(true);
    try {
      let updated: Student;

      if (avatarFile) {
        const payload = new FormData();
        payload.append("avatar", avatarFile);
        payload.append("name", formData.name);
        payload.append("phone", formData.phone);
        payload.append("dateOfBirth", formData.dateOfBirth);
        payload.append("nationality", formData.nationality);
        payload.append("passportNumber", formData.passportNumber);
        payload.append("currentAddress", formData.currentAddress);
        payload.append(
          "academicHistory",
          JSON.stringify([
            {
              degree: formData.highestDegree,
              institution: formData.institution,
              passingYear: Number(formData.passingYear) || 2025,
              gpa: formData.gpa,
              country: formData.nationality,
            },
          ])
        );
        payload.append(
          "englishProficiency",
          JSON.stringify({
            testType: formData.testType,
            overallScore: formData.overallScore,
            testDate: student.englishProficiency?.testDate || "2026-03-20",
          })
        );
        payload.append(
          "sponsorDetails",
          JSON.stringify({
            name: formData.sponsorName,
            relationship: formData.sponsorRelationship,
            occupation: student.sponsorDetails?.occupation || "Managing Director",
            estimatedFunds: formData.estimatedFunds,
            bankName: student.sponsorDetails?.bankName || "HSBC UK / Standard Chartered",
          })
        );

        updated = await studentsApi.update(student.id, payload);
      } else {
        updated = await studentsApi.update(student.id, {
          name: formData.name,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          passportNumber: formData.passportNumber,
          currentAddress: formData.currentAddress,
          academicHistory: [
            {
              degree: formData.highestDegree,
              institution: formData.institution,
              passingYear: Number(formData.passingYear) || 2025,
              gpa: formData.gpa,
              country: formData.nationality,
            },
          ],
          englishProficiency: {
            testType: formData.testType,
            overallScore: formData.overallScore,
            testDate: student.englishProficiency?.testDate || "2026-03-20",
          },
          sponsorDetails: {
            name: formData.sponsorName,
            relationship: formData.sponsorRelationship,
            occupation: student.sponsorDetails?.occupation || "Managing Director",
            estimatedFunds: formData.estimatedFunds,
            bankName: student.sponsorDetails?.bankName || "HSBC UK / Standard Chartered",
          },
        });
      }

      setStudent(updated);
      setAvatarFile(null);
      setAvatarPreview(null);
      updateCurrentUser({
        name: updated.name,
        phone: updated.phone,
        avatar: updated.avatar || "",
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        <span className="text-xs text-slate-500 font-medium">Loading applicant profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Applicant Profile</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Dossier Details</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My Student Profile & Academic History
          </h1>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Changes Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Picture Upload Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Camera className="w-4 h-4 text-teal-600" /> Profile Picture
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <Avatar
              src={avatarPreview || student?.avatar || currentUser.avatar}
              name={formData.name || student?.name || "Student Applicant"}
              size="xl"
            />

            <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarFileSelect}
                accept=".png,.jpg,.jpeg,.webp"
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => avatarInputRef.current?.click()}
                  leftIcon={<Camera className="w-3.5 h-3.5 text-teal-600" />}
                >
                  {avatarFile || student?.avatar || currentUser.avatar ? "Change Picture" : "Upload Picture"}
                </Button>

                {avatarFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                    title="Cancel selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-500">
                PNG, JPG, or WEBP. Upload a professional headshot for your admissions file.
              </p>
              {avatarFile && (
                <span className="inline-block text-[11px] font-bold text-teal-700">
                  Selected: {avatarFile.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Personal details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" /> Personal & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Full Legal Name (as on Passport)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              value={formData.email}
              disabled
              className="bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <Input
              label="Phone / WhatsApp"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <Input
              label="Nationality"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            />
            <Input
              label="Passport Number"
              value={formData.passportNumber}
              onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
            />
          </div>

          <Input
            label="Current Residential Address"
            value={formData.currentAddress}
            onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
          />
        </div>

        {/* Academic History */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" /> Academic Qualifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Highest Degree Earned"
              value={formData.highestDegree}
              onChange={(e) => setFormData({ ...formData, highestDegree: e.target.value })}
            />
            <Input
              label="University / College"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
            <Input
              label="Graduation Year"
              type="number"
              value={String(formData.passingYear)}
              onChange={(e) => setFormData({ ...formData, passingYear: parseInt(e.target.value, 10) || 2025 })}
            />
            <Input
              label="CGPA / Percentage"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
            />
          </div>
        </div>

        {/* English Proficiency */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-600" /> English Language Test
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            <Select
              label="Test Type"
              value={formData.testType}
              onChange={(e) => setFormData({ ...formData, testType: e.target.value as any })}
              options={[
                { value: "IELTS", label: "IELTS Academic" },
                { value: "PTE", label: "PTE Academic" },
                { value: "TOEFL", label: "TOEFL iBT" },
                { value: "Duolingo", label: "Duolingo English Test" },
              ]}
            />
            <Input
              label="Overall Score"
              value={formData.overallScore}
              onChange={(e) => setFormData({ ...formData, overallScore: e.target.value })}
            />
          </div>
        </div>

        {/* Sponsor details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Financial Sponsor Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Sponsor Name"
              value={formData.sponsorName}
              onChange={(e) => setFormData({ ...formData, sponsorName: e.target.value })}
            />
            <Input
              label="Relationship"
              value={formData.sponsorRelationship}
              onChange={(e) => setFormData({ ...formData, sponsorRelationship: e.target.value })}
            />
            <Input
              label="Estimated Available Funds"
              value={formData.estimatedFunds}
              onChange={(e) => setFormData({ ...formData, estimatedFunds: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={saving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Updates
          </Button>
        </div>
      </form>
    </div>
  );
}
