"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { Compass, Building2, User, Mail, Lock, Users, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { authApi } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { setUserFromAuth } = useRole();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    agencyName: "",
    country: "United Kingdom",
    teamSize: "5-15 Counselors",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    plan: "LIFETIME_FREE",
  });

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      if (!form.agencyName.trim()) {
        setErrorMsg("Please enter your consultancy/agency name.");
        return;
      }
      setErrorMsg(null);
      setStep(2);
    } else {
      if (form.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setErrorMsg("Passwords do not match. Please verify.");
        return;
      }

      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await authApi.registerAgency({
          agencyName: form.agencyName,
          country: form.country,
          teamSize: form.teamSize,
          adminName: form.adminName,
          adminEmail: form.adminEmail,
          password: form.password,
          plan: "LIFETIME_FREE",
        });
        setUserFromAuth(res);
        router.push("/free-access");
      } catch (err: any) {
        setErrorMsg(err.message || "Registration failed. Please check your details.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Pitch Banner */}
      <div className="lg:w-5/12 bg-[#0b132b] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />

        <Link href="/" className="flex items-center gap-2.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg text-white">AbroadPath OS</span>
        </Link>

        <div className="my-12 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800 text-teal-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free Access — Lifetime</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Register Your Agency Workspace in Under 2 Minutes.
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Instantly unlock lead pipelines, document verification workflows, university partner catalogs, and applicant portals with zero subscription fees.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Full platform access with unlimited students & counselors</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Strict database-level multi-tenant agency data isolation</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Automated email engine configured with live SMTP delivery</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between z-10">
          <span>Enterprise Grade Security</span>
          <span>100% Free Lifetime Access</span>
        </div>
      </div>

      {/* Right Form Wizard */}
      <div className="lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Step {step} of 2
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {step === 1 ? "Agency Profile & Location" : "Admin Credentials & Activation"}
              </h1>
            </div>

            <div className="flex gap-1.5">
              <span className={`w-8 h-2 rounded-full ${step >= 1 ? "bg-teal-600" : "bg-slate-200"}`} />
              <span className={`w-8 h-2 rounded-full ${step >= 2 ? "bg-teal-600" : "bg-slate-200"}`} />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleNext} className="space-y-4">
            {step === 1 ? (
              <>
                <Input
                  label="Consultancy / Agency Name"
                  placeholder="e.g. Apex Global Education Services"
                  leftIcon={<Building2 className="w-4 h-4" />}
                  required
                  value={form.agencyName}
                  onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Headquarters Country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    options={[
                      { value: "United Kingdom", label: "United Kingdom" },
                      { value: "United Arab Emirates", label: "United Arab Emirates" },
                      { value: "Canada", label: "Canada" },
                      { value: "Bangladesh", label: "Bangladesh" },
                      { value: "India", label: "India" },
                      { value: "Malaysia", label: "Malaysia" },
                      { value: "Nigeria", label: "Nigeria" },
                      { value: "Australia", label: "Australia" },
                    ]}
                  />

                  <Select
                    label="Team Size"
                    value={form.teamSize}
                    onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                    options={[
                      { value: "1-4 Counselors", label: "1-4 Counselors" },
                      { value: "5-15 Counselors", label: "5-15 Counselors" },
                      { value: "16-50 Counselors", label: "16-50 Counselors" },
                      { value: "50+ Enterprise", label: "50+ Multi-Branch" },
                    ]}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Admin Setup
                </Button>
              </>
            ) : (
              <>
                <Input
                  label="Agency Director / Administrator Name"
                  placeholder="e.g. Alexandria Vance"
                  leftIcon={<User className="w-4 h-4" />}
                  required
                  value={form.adminName}
                  onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                />

                <Input
                  label="Work Email Address"
                  type="email"
                  placeholder="alexandria@agency.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  value={form.adminEmail}
                  onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    leftIcon={<Lock className="w-4 h-4" />}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Repeat password"
                    leftIcon={<Lock className="w-4 h-4" />}
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 text-xs text-teal-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    License: Free Access — Lifetime
                  </p>
                  <p className="text-[11px] text-teal-700">
                    Unlimited counselors, unlimited students, document vault, and full CRM modules included.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    isLoading={loading}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Create Agency Workspace
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="pt-4 text-center text-xs text-slate-500">
            Already have an agency account?{" "}
            <Link href="/login" className="font-bold text-teal-700 hover:text-teal-800">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
