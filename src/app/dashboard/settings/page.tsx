"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Bell,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Save,
  Plus,
  Loader2,
  Globe2,
  KeyRound,
  User,
  UploadCloud,
  ImageIcon,
  Camera,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { TagInput } from "@/components/ui/TagInput";
import { Avatar, getResolvedImageUrl } from "@/components/ui/Avatar";
import { agenciesApi, AgencyProfile, BranchItem } from "@/lib/api/agencies";
import { authApi } from "@/lib/api/auth";
import { useRole } from "@/context/RoleContext";

const STANDARD_GLOBAL_COUNTRIES = [
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "United States",
  "Malaysia",
  "Ireland",
  "New Zealand",
  "Sweden",
  "Netherlands",
  "France",
  "Italy",
  "United Arab Emirates",
  "Singapore",
  "Japan",
  "South Korea",
  "China",
];

export default function SettingsPage() {
  const { currentUser, role, updateCurrentUser, setAgency } = useRole();
  const [activeTab, setActiveTab] = useState("agency");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);

  // Agency Logo File state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // User Profile Avatar File state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<AgencyProfile>({
    id: "",
    name: "GlobalEd Consulting Partners LLC",
    displayName: "AbroadPath Global Admissions",
    email: "admissions@globaled.com",
    phone: "+44 20 7946 0912",
    address: "88 Kingsway, Holborn, London WC2B 6AA",
    website: "https://www.globaledpartners.com",
    logo: "",
    country: "United Kingdom",
    baseCurrency: "USD",
    operatingCountries: ["United Kingdom", "Canada", "Australia", "Germany", "United States", "Malaysia"],
    branches: [],
    notificationsConfig: {
      offerLetterAlert: true,
      documentCorrectionAlert: true,
      biometricsReminder: true,
    },
  });

  const [operatingCountries, setOperatingCountries] = useState<string[]>([
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "United States",
    "Malaysia",
  ]);

  const [newBranch, setNewBranch] = useState({
    name: "",
    type: "Regional",
    address: "",
    staffCount: 5,
    activeStudents: 20,
  });

  // Password & Profile state
  const [userProfile, setUserProfile] = useState({
    name: currentUser.name || "",
    phone: currentUser.phone || "",
    avatar: currentUser.avatar || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        setLoading(true);
        const data = await agenciesApi.getProfile();
        setProfile(data);
        if (data.operatingCountries && Array.isArray(data.operatingCountries) && data.operatingCountries.length > 0) {
          setOperatingCountries(data.operatingCountries);
        }
      } catch (err) {
        console.error("Failed to load agency settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgency();
  }, []);

  useEffect(() => {
    setUserProfile({
      name: currentUser.name || "",
      phone: currentUser.phone || "",
      avatar: currentUser.avatar || "",
    });
  }, [currentUser]);

  const isCounselor = role === "counselor";

  const tabs = [
    { id: "agency", label: "Agency Profile" },
    { id: "countries", label: "Operating Countries", count: operatingCountries.length },
    { id: "branches", label: "Regional Branches", count: profile.branches?.length },
    { id: "security", label: "My Profile & Password" },
    { id: "notifications", label: "Automated Alerts" },
    { id: "roles", label: "Role Governance" },
  ];

  // Handle Logo file selection
  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // Handle Avatar file selection
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCounselor) return;

    setSubmitting(true);
    try {
      let updated: AgencyProfile;
      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile);
        formData.append("name", profile.name);
        formData.append("displayName", profile.displayName || profile.name);
        formData.append("email", profile.email);
        formData.append("phone", profile.phone);
        if (profile.address) formData.append("address", profile.address);
        if (profile.website) formData.append("website", profile.website);
        if (profile.country) formData.append("country", profile.country);
        if (profile.baseCurrency) formData.append("baseCurrency", profile.baseCurrency);

        updated = await agenciesApi.updateProfile(formData);
      } else {
        updated = await agenciesApi.updateProfile({
          ...profile,
          operatingCountries,
        });
      }

      setProfile(updated);
      setAgency(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveCountries = async () => {
    if (isCounselor) return;
    setSubmitting(true);
    try {
      await agenciesApi.updateOperatingCountries(operatingCountries);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update operating countries", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleNotification = async (key: keyof typeof profile.notificationsConfig) => {
    if (isCounselor) return;
    const newConfig = {
      ...profile.notificationsConfig,
      [key]: !profile.notificationsConfig[key],
    };
    setProfile({ ...profile, notificationsConfig: newConfig });
    try {
      await agenciesApi.updateNotificationsConfig(newConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update notification settings", err);
    }
  };

  const handleAddBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCounselor) return;
    try {
      const updatedBranches = await agenciesApi.addBranch(newBranch);
      setProfile({ ...profile, branches: updatedBranches });
      setIsAddBranchModalOpen(false);
      setNewBranch({
        name: "",
        type: "Regional",
        address: "",
        staffCount: 5,
        activeStudents: 20,
      });
    } catch (err) {
      console.error("Failed to add branch", err);
    }
  };

  const handleUpdateUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let updatedUser: any;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        formData.append("name", userProfile.name);
        formData.append("phone", userProfile.phone);
        updatedUser = await authApi.updateProfile(formData);
      } else {
        updatedUser = await authApi.updateProfile(userProfile);
      }

      const newAvatar = updatedUser?.avatar || updatedUser?.data?.avatar || userProfile.avatar;
      setUserProfile((prev) => ({ ...prev, avatar: newAvatar }));
      updateCurrentUser({
        name: userProfile.name,
        phone: userProfile.phone,
        avatar: newAvatar,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update user profile", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    setPasswordLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>System Administration</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Agency Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Configuration & Workspace Governance
          </h1>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings Saved!
          </span>
        )}
      </div>

      {/* Counselor View-Only Notice Banner */}
      {isCounselor && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5 animate-in fade-in">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Counselor View-Only Access:</strong> You can view the agency configuration. Editing and uploading agency assets is restricted to Agency Directors.
          </span>
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Agency Profile */}
      {activeTab === "agency" && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 max-w-3xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Legal Entity & Agency Branding</h2>
              <p className="text-xs text-slate-500">Official consultancy information appearing across invoices, portals, and student offers.</p>
            </div>
          </div>

          {/* Agency Logo Upload & Preview Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-800 block">Agency Official Logo</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden flex items-center justify-center shrink-0">
                {logoPreview || profile.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview || getResolvedImageUrl(profile.logo)}
                    alt="Agency Logo"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoFileSelect}
                  accept=".png,.jpg,.jpeg,.webp"
                  className="hidden"
                  disabled={isCounselor}
                />

                {!isCounselor ? (
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => logoInputRef.current?.click()}
                      leftIcon={<UploadCloud className="w-3.5 h-3.5 text-teal-600" />}
                    >
                      {logoFile || profile.logo ? "Change Logo" : "Upload Logo"}
                    </Button>

                    {logoFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="Cancel selection"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">Logo managed by Agency Director.</p>
                )}

                <p className="text-[11px] text-slate-500">
                  Recommended size: 400x400px (PNG, JPG, or WEBP). Maximum 15MB.
                </p>
                {logoFile && (
                  <span className="inline-block text-[11px] font-bold text-teal-700">
                    Selected: {logoFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Registered Company / Legal Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
              disabled={isCounselor}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Brand Display Name"
                value={profile.displayName || profile.name}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                disabled={isCounselor}
              />
              <Input
                label="Website URL"
                placeholder="https://www.youragency.com"
                value={profile.website || ""}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                disabled={isCounselor}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Headquarters Jurisdiction"
                value={profile.country || "United Kingdom"}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                disabled={isCounselor}
                options={[
                  { value: "United Kingdom", label: "United Kingdom" },
                  { value: "United Arab Emirates", label: "United Arab Emirates" },
                  { value: "Canada", label: "Canada" },
                  { value: "Bangladesh", label: "Bangladesh" },
                  { value: "India", label: "India" },
                  { value: "Australia", label: "Australia" },
                  { value: "United States", label: "United States" },
                ]}
              />
              <Select
                label="Base Currency"
                value={profile.baseCurrency || "USD"}
                onChange={(e) => setProfile({ ...profile, baseCurrency: e.target.value })}
                disabled={isCounselor}
                options={[
                  { value: "USD", label: "USD ($)" },
                  { value: "GBP", label: "GBP (£)" },
                  { value: "EUR", label: "EUR (€)" },
                  { value: "CAD", label: "CAD ($)" },
                  { value: "AUD", label: "AUD ($)" },
                  { value: "BDT", label: "BDT (৳)" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Admissions Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
                disabled={isCounselor}
              />
              <Input
                label="Official Phone / Helpline"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
                disabled={isCounselor}
              />
            </div>

            <Textarea
              label="Headquarters Physical Address"
              rows={2}
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              disabled={isCounselor}
            />
          </div>

          {!isCounselor && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={submitting}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Configuration
              </Button>
            </div>
          )}
        </form>
      )}

      {/* Tab 2: Operating Countries */}
      {activeTab === "countries" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 max-w-3xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Active Study Destinations</h2>
              <p className="text-xs text-slate-500">Enable or remove destination countries supported by your agency.</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-700">Supported Country Destinations:</p>

            <div className="flex flex-wrap gap-2">
              {operatingCountries.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200"
                >
                  {c}
                  {!isCounselor && (
                    <button
                      type="button"
                      onClick={() => setOperatingCountries(operatingCountries.filter((x) => x !== c))}
                      className="hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {!isCounselor && (
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Add Operating Country:</label>
                <select
                  onChange={(e) => {
                    if (e.target.value && !operatingCountries.includes(e.target.value)) {
                      setOperatingCountries([...operatingCountries, e.target.value]);
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
                >
                  <option value="" disabled>Select country to add...</option>
                  {STANDARD_GLOBAL_COUNTRIES.filter((c) => !operatingCountries.includes(c)).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {!isCounselor && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveCountries}
                isLoading={submitting}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Destinations
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Regional Branches */}
      {activeTab === "branches" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 max-w-3xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">Regional Branch Network</h2>
                <p className="text-xs text-slate-500">Manage multi-city locations and operational centers.</p>
              </div>
            </div>

            {!isCounselor && (
              <Button
                variant="primary"
                size="xs"
                onClick={() => setIsAddBranchModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Branch
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {profile.branches && profile.branches.length > 0 ? (
              profile.branches.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                      {b.type}
                    </span>
                    <h3 className="font-bold text-xs text-slate-900 mt-1">{b.name}</h3>
                    <p className="text-[11px] text-slate-500">{b.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-700 block">{b.staffCount} Staff</span>
                    <span className="text-[11px] text-slate-400">{b.activeStudents} Active Students</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No regional branches registered yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: My Profile & Password (Admin & Counselor Profile Image Upload) */}
      {activeTab === "security" && (
        <div className="space-y-6 max-w-3xl">
          {/* User Profile Form */}
          <form onSubmit={handleUpdateUserProfile} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Personal Information & Profile Picture</h3>
                <p className="text-[11px] text-slate-500">Update your name, contact details, and account avatar.</p>
              </div>
            </div>

            {/* Profile Avatar Upload Component */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Avatar
                src={avatarPreview || userProfile.avatar}
                name={userProfile.name}
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
                    {avatarFile || userProfile.avatar ? "Change Picture" : "Upload Picture"}
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
                  PNG, JPG, or WEBP. Uploaded picture appears on your header, chat, and comments.
                </p>
                {avatarFile && (
                  <span className="inline-block text-[11px] font-bold text-teal-700">
                    Selected: {avatarFile.name}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                value={userProfile.phone}
                onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="sm" isLoading={submitting} leftIcon={<Save className="w-4 h-4" />}>
                Save Profile
              </Button>
            </div>
          </form>

          {/* Change Password */}
          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Change Account Password</h3>
                <p className="text-[11px] text-slate-500">Secure your account with bcrypt verified password encryption.</p>
              </div>
            </div>

            {passwordMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  passwordMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-rose-50 border border-rose-200 text-rose-700"
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <div className="space-y-3">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="sm" isLoading={passwordLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 5: Notifications */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 max-w-3xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Automated Email & Push Alerts</h2>
              <p className="text-xs text-slate-500">Configure notifications triggered by admissions milestones.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <p className="font-bold text-xs text-slate-900">University Offer Letter Alert</p>
                <p className="text-[11px] text-slate-500">Notify assigned counselor & student immediately when an offer is logged.</p>
              </div>
              <input
                type="checkbox"
                checked={profile.notificationsConfig?.offerLetterAlert}
                onChange={() => handleToggleNotification("offerLetterAlert")}
                disabled={isCounselor}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <p className="font-bold text-xs text-slate-900">Document Correction Required Alert</p>
                <p className="text-[11px] text-slate-500">Send an instant re-upload notification to student upon document rejection.</p>
              </div>
              <input
                type="checkbox"
                checked={profile.notificationsConfig?.documentCorrectionAlert}
                onChange={() => handleToggleNotification("documentCorrectionAlert")}
                disabled={isCounselor}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <p className="font-bold text-xs text-slate-900">Biometrics Slot Reminder</p>
                <p className="text-[11px] text-slate-500">Send SMS & email reminder 48 hours before scheduled embassy appointment.</p>
              </div>
              <input
                type="checkbox"
                checked={profile.notificationsConfig?.biometricsReminder}
                onChange={() => handleToggleNotification("biometricsReminder")}
                disabled={isCounselor}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Roles & RBAC */}
      {activeTab === "roles" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 max-w-3xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Role-Based Access Control (RBAC) Governance</h2>
              <p className="text-xs text-slate-500">Configured tenant permission boundaries.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <p className="font-bold text-slate-900">1. Agency Admin (Director)</p>
              <p className="text-slate-600">Full read/write permissions across all leads, commission payout ledger, staff management, and system governance.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <p className="font-bold text-slate-900">2. Senior Counselor / Officer</p>
              <p className="text-slate-600">Access to assigned leads, student application workflows, document auditing, task queue, and calendar booking.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <p className="font-bold text-slate-900">3. Student Applicant</p>
              <p className="text-slate-600">Self-service portal access restricted strictly to their personal applications, offer acceptances, document vault, and messaging.</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      <Modal
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
        title="Add Regional Branch Office"
        description="Expand multi-branch agency tracking."
      >
        <form onSubmit={handleAddBranchSubmit} className="space-y-4">
          <Input
            label="Branch Name"
            placeholder="e.g. Toronto Operations Office"
            required
            value={newBranch.name}
            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
          />

          <Input
            label="Office Address"
            placeholder="e.g. 150 King St West, Toronto, ON"
            required
            value={newBranch.address}
            onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddBranchModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Branch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
