"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/public/Header";
import HeroSection from "@/components/public/HeroSection";
import MissionSection from "@/components/public/MissionSection";
import ProgramsSection from "@/components/public/ProgramsSection";
import TeamSection from "@/components/public/TeamSection";
import AcceptedIdeasSection from "@/components/public/AcceptedIdeasSection";
import CommunityIdeaForm from "@/components/public/CommunityIdeaForm";
import Footer from "@/components/public/Footer";
import SoumissionModal from "@/components/public/SoumissionModal";
import AnalyticsTracker from "@/components/public/AnalyticsTracker";
import {
  SiteSettingsData,
  ThemeSettingsData,
  NavigationItemData,
  PageSectionData,
  TeamMemberData,
  ProgramData,
  IdeaSubmissionData,
} from "@/lib/types";

interface PublicPageClientProps {
  settings: SiteSettingsData;
  theme: ThemeSettingsData;
  navItems: NavigationItemData[];
  sections: PageSectionData[];
  team: TeamMemberData[];
  programs: ProgramData[];
  acceptedIdeas: IdeaSubmissionData[];
}

export default function PublicPageClient({
  settings,
  navItems,
  sections,
  team,
  programs,
  acceptedIdeas,
}: PublicPageClientProps) {
  const [soumissionOpen, setSoumissionOpen] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | undefined>(undefined);

  const searchParams = useSearchParams();

  // Handle TOK reverse engineered route `?gf_page_3=1` or `?soumission=1`
  useEffect(() => {
    if (searchParams.get("gf_page_3") === "1" || searchParams.get("soumission") === "1") {
      setSoumissionOpen(true);
    }
  }, [searchParams]);

  // Handle TOK preloader animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloaderDone(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenSoumission = (track?: string) => {
    if (track) setSelectedTrack(track);
    setSoumissionOpen(true);
  };

  return (
    <>
      {/* TOK Communications Preloader Animation */}
      <div
        className={`preloader ${preloaderDone ? "preloader--hide" : ""}`}
        aria-hidden={preloaderDone}
      >
        <div className="preloader__logo">
          ufy<span>.</span>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
          YOUTH HEALTH & ACTION // 2026
        </div>
        <div className="preloader__bar">
          <div className="preloader__bar-fill" />
        </div>
      </div>

      <AnalyticsTracker />

      {/* Header */}
      <Header
        settings={settings}
        navItems={navItems}
        onOpenSoumission={() => handleOpenSoumission()}
      />

      {/* Main Content Sections */}
      <main id="main-content">
        {sections.map((sec) => {
          switch (sec.sectionKey) {
            case "hero":
              return (
                <HeroSection
                  key={sec.id}
                  section={sec}
                  onOpenSoumission={() => handleOpenSoumission()}
                />
              );
            case "mission":
              return (
                <MissionSection
                  key={sec.id}
                  section={sec}
                  onSelectTrack={(track) => handleOpenSoumission(track)}
                />
              );
            case "programs":
              return (
                <ProgramsSection
                  key={sec.id}
                  programs={programs}
                  section={sec}
                  onOpenSoumission={() => handleOpenSoumission()}
                />
              );
            case "team":
              return (
                <TeamSection
                  key={sec.id}
                  team={team}
                  section={sec}
                  displayCount={settings.teamDisplayCount || 6}
                  presentationStyle={settings.teamPresentationStyle || "editorial"}
                  onOpenSoumission={() => handleOpenSoumission("Other Community Proposal")}
                />
              );
            case "accepted-ideas":
              return (
                <AcceptedIdeasSection
                  key={sec.id}
                  ideas={acceptedIdeas}
                  section={sec}
                  onOpenSoumission={() => handleOpenSoumission()}
                />
              );
            case "community-idea":
              return (
                <CommunityIdeaForm
                  key={sec.id}
                  section={sec}
                  onOpenSoumission={() => handleOpenSoumission()}
                />
              );
            default:
              return null;
          }
        })}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        navItems={navItems}
        onOpenSoumission={() => handleOpenSoumission()}
      />

      {/* Flagship TOK Multi-Step Proposal Drawer Modal */}
      <SoumissionModal
        isOpen={soumissionOpen}
        onClose={() => {
          setSoumissionOpen(false);
          setSelectedTrack(undefined);
        }}
        initialCategory={selectedTrack}
      />
    </>
  );
}
