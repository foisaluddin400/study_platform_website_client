"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-4 sm:p-6">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md">
          <Compass className="w-6 h-6" />
        </div>
        <span className="font-bold text-lg text-slate-900">AbroadPath OS</span>
      </Link>

      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
        {submitted ? (
          <div className="text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Password Reset Link Sent</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an agency or student account exists for <span className="font-semibold text-slate-800">{email}</span>, you will receive password reset instructions shortly.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Reset Your Password</h2>
              <p className="text-xs text-slate-500">
                Enter your work or student email address and we&apos;ll send you a recovery link.
              </p>
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="alexandria.v@abroadpath.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={loading}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send Reset Link
            </Button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
