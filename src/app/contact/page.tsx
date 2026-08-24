"use client";

import React, { useState } from "react";
import { MarketingNavbar } from "@/components/marketing/Navbar";
import { MarketingFooter } from "@/components/marketing/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    teamSize: "5-15 Counselors",
    targetDestinations: "UK & Canada",
    preferredDemoDate: "2026-08-25",
    message: "",
  });

  const offices = [
    {
      city: "London HQ",
      address: "88 Kingsway, Holborn, London WC2B 6AA, UK",
      phone: "+44 20 7946 0912",
      email: "london@abroadpath.com",
    },
    {
      city: "Dubai Regional Hub",
      address: "Office 1402, Al Saada Tower, Business Bay, Dubai, UAE",
      phone: "+971 4 392 8471",
      email: "dubai@abroadpath.com",
    },
    {
      city: "Toronto Operations",
      address: "200 Bay Street, Suite 2400, Toronto, ON M5J 2J1, Canada",
      phone: "+1 416 820 9410",
      email: "toronto@abroadpath.com",
    },
    {
      city: "Dhaka Desk",
      address: "Level 9, Banani Commercial Center, Road 11, Dhaka 1213",
      phone: "+880 171 294 8830",
      email: "dhaka@abroadpath.com",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-slate-900 text-white py-16 sm:py-20 text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3.5 py-1.5 rounded-full border border-teal-800">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Speak with Our Education SaaS Specialists
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Schedule a personalized walkthrough or discuss enterprise multi-branch deployment.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact / Demo Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Demo Scheduled Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold">{formData.contactName || "Partner"}</span>. Our senior agency onboarding advisor will contact you at <span className="font-semibold">{formData.email || "your email"}</span> with calendar coordinates.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">
                      Book a Customized Agency Demo
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fill out your agency parameters for a tailored session.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Agency Name"
                      placeholder="e.g. Global Pathways Education"
                      required
                      value={formData.agencyName}
                      onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    />
                    <Input
                      label="Your Full Name"
                      placeholder="e.g. Tariqul Alam"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Work Email"
                      type="email"
                      placeholder="tariqul@agency.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                      label="Phone / WhatsApp"
                      placeholder="+44 20 7946 0912"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Counselor Team Size"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      options={[
                        { value: "1-4 Counselors", label: "1-4 Counselors (Boutique)" },
                        { value: "5-15 Counselors", label: "5-15 Counselors (Growth)" },
                        { value: "16-50 Counselors", label: "16-50 Counselors (Multi-Branch)" },
                        { value: "50+ Enterprise", label: "50+ Enterprise Agency" },
                      ]}
                    />
                    <Select
                      label="Primary Destination Focus"
                      value={formData.targetDestinations}
                      onChange={(e) => setFormData({ ...formData, targetDestinations: e.target.value })}
                      options={[
                        { value: "UK & Canada", label: "UK & Canada" },
                        { value: "Australia & New Zealand", label: "Australia & New Zealand" },
                        { value: "Germany & Europe", label: "Germany & Europe" },
                        { value: "Malaysia & Asia", label: "Malaysia & Asia" },
                        { value: "All Major Destinations", label: "All Major Destinations" },
                      ]}
                    />
                  </div>

                  <Textarea
                    label="Current Pain Points or Questions"
                    placeholder="e.g. Currently tracking 80+ student applications in Excel, need automated document verification and commission splits..."
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Confirm & Schedule Demo
                  </Button>
                </form>
              )}
            </div>

            {/* Global Offices */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Global Support Hubs</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our regional partner success teams operate across 4 key timezones to support your admissions cycles.
                </p>
              </div>

              <div className="space-y-4">
                {offices.map((off) => (
                  <div
                    key={off.city}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>{off.city}</span>
                    </div>
                    <p className="text-xs text-slate-600 flex items-start gap-2 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{off.address}</span>
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{off.phone}</span>
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{off.email}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
