"use client";

import { MarketingNavbar } from "@/components/marketing/Navbar";
import { MarketingHero } from "@/components/marketing/Hero";
import { TrustedTicker } from "@/components/marketing/TrustedTicker";
import { ProblemSolution } from "@/components/marketing/ProblemSolution";
import { WorkflowSection } from "@/components/marketing/WorkflowSection";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { Testimonials } from "@/components/marketing/Testimonials";
import { PricingTable } from "@/components/marketing/PricingTable";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { MarketingFooter } from "@/components/marketing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNavbar />
      <main className="flex-1">
        <MarketingHero />
        <TrustedTicker />
        <ProblemSolution />
        <WorkflowSection />
        <FeatureGrid />
        <Testimonials />
        <PricingTable />
        <FAQSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </div>
  );
}
