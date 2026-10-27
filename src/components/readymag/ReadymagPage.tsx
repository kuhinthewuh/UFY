"use client";

import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import SpeakersSection from "./SpeakersSection";
import SignupsClosedSection from "./SignupsClosedSection";
import Footer from "./Footer";

export default function ReadymagPage() {
  return (
    <div className="min-h-screen bg-[#e5e5e5] text-[#003227] font-sans antialiased selection:bg-[#D51F1F] selection:text-white">
      {/* Floating Readymag Navbar */}
      <Navbar />

      <main className="w-full overflow-hidden">
        {/* Hero Section with repeating Milan typography and tilted stickers */}
        <HeroSection />

        {/* Speakers Section with asymmetric duotone cards and custom titles */}
        <SpeakersSection />

        {/* Closed Sign-ups Notification & Vector Cut-Out */}
        <SignupsClosedSection />
      </main>

      {/* 5-Column Dark Readymag Footer */}
      <Footer />
    </div>
  );
}
