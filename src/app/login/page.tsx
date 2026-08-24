"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import {
  Compass,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi } from "@/lib/api/auth";

type SelectedRole = "admin" | "counselor" | "student";

export default function LoginPage() {
  const router = useRouter();
  const { setUserFromAuth } = useRole();
  const [selectedRole, setSelectedRole] = useState<SelectedRole>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleTabChange = (role: SelectedRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await authApi.login({ email, password });
      setUserFromAuth(res);

      if (res.user.role === "STUDENT" || res.user.role === "student") {
        router.push("/student");
      } else if (res.user.role === "AGENCY_ADMIN" || res.user.role === "admin" || res.user.role === "PLATFORM_SUPER_ADMIN") {
        if (res.hasActiveAccess === false) {
          router.push("/free-access");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Column: Brand Hero */}
      <div className="lg:w-1/2 bg-[#0b132b] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background glow elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-lg text-white">AbroadPath OS</span>
            <span className="block text-[10px] text-teal-300 -mt-0.5">Study Abroad Consultancy Platform</span>
          </div>
        </Link>

        {/* Middle Value Pitch */}
        <div className="my-12 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800/80 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free Access — Lifetime for Agencies</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            The Complete Operating System for Education Agencies.
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
            Manage your entire student journey from first lead counselling to university offers, visa compliance, and partner commissions.
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Multi-country admissions: UK, Canada, Australia, Germany, Malaysia</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Pre-built document verification vault & 28-day financial audit</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Integrated applicant portal for real-time student self-service</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between z-10">
          <span>Enterprise Grade Security</span>
          <span>Multi-Tenant Data Isolation</span>
        </div>
      </div>

      {/* Right Column: Role-Based Login Form */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your role below to sign in with your credentials.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Role Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => handleRoleTabChange("admin")}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedRole === "admin"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabChange("counselor")}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedRole === "counselor"
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>Counselor</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabChange("student")}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedRole === "student"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Student</span>
              </button>
            </div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              leftIcon={<Mail className="w-4 h-4" />}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              leftIcon={<Lock className="w-4 h-4" />}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span>Remember this device</span>
              </label>

              <Link
                href="/forgot-password"
                className="font-medium text-teal-700 hover:text-teal-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In as {selectedRole === "admin" ? "Agency Admin" : selectedRole === "counselor" ? "Counselor" : "Student"}
            </Button>
          </form>

          {/* Role-Specific Sign Up / Notice footer */}
          <div className="pt-2">
            {selectedRole === "admin" ? (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center text-xs text-slate-600 space-y-2">
                <p>New Agency Owner? Get lifetime free access for your entire consultancy.</p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 font-bold text-indigo-700 hover:text-indigo-800"
                >
                  <span>Sign Up for Free Agency Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : selectedRole === "counselor" ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Counselor accounts are provided by your Agency Admin.</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Student accounts are provided by your Consultancy Counselor.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
