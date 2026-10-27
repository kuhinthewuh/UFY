"use client";

import React, { useState } from "react";
import UfyNavbar from "./UfyNavbar";
import UfyHeroSection from "./UfyHeroSection";
import UfyInitiativesSection from "./UfyInitiativesSection";
import UfyLeadersSection from "./UfyLeadersSection";
import UfyImpactSection from "./UfyImpactSection";
import UfyFooter from "./UfyFooter";
import SoumissionModal from "@/components/public/SoumissionModal";
import AnalyticsTracker from "@/components/public/AnalyticsTracker";

export default function UfyMainPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f4fc] text-[#140529] font-sans antialiased selection:bg-[#7629f0] selection:text-white">
      <AnalyticsTracker />

      {/* Floating Pill Navbar */}
      <UfyNavbar onOpenModal={() => setModalOpen(true)} />

      <main className="w-full overflow-hidden">
        {/* Hero Section with Left-to-Right Scrolling "ufy" Cut-Out Typography and Tilted Cards */}
        <UfyHeroSection onOpenModal={() => setModalOpen(true)} />

        {/* The 3 Core Flagship Initiatives (Hospital Letters, First Aid, Book Donations) */}
        <UfyInitiativesSection onOpenModal={() => setModalOpen(true)} />

        {/* 4 Artsy Diagonalized Youth Leaders */}
        <UfyLeadersSection onOpenModal={() => setModalOpen(true)} />

        {/* Tangible Impact Counters & Callout */}
        <UfyImpactSection onOpenModal={() => setModalOpen(true)} />
      </main>

      {/* 5-Column Dark Violet Footer */}
      <UfyFooter onOpenModal={() => setModalOpen(true)} />

      {/* Interactive Volunteer, Proposal & Workshop Request Drawer */}
      <SoumissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
