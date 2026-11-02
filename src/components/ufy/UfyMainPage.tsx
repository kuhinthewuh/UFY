"use client";

import React, { useState } from "react";
import UfyNavbar, { NavLinkItem } from "./UfyNavbar";
import UfyHeroSection from "./UfyHeroSection";
import UfyInitiativesSection from "./UfyInitiativesSection";
import UfyAffirmationsStrip from "./UfyAffirmationsStrip";
import UfyLeadersSection from "./UfyLeadersSection";
import UfyImpactSection from "./UfyImpactSection";
import UfyFooter from "./UfyFooter";
import CutoutTypography from "./CutoutTypography";
import SoumissionModal from "@/components/public/SoumissionModal";
import AnalyticsTracker from "@/components/public/AnalyticsTracker";
import {
  AffirmationLetterData,
  PageSectionData,
  ProgramData,
  TeamMemberData,
} from "@/lib/types";

interface UfyMainPageProps {
  settings?: any;
  theme?: any;
  navItems?: NavLinkItem[];
  sections?: PageSectionData[];
  programs?: ProgramData[];
  teamMembers?: TeamMemberData[];
  impactMetrics?: any[];
  featuredLetters?: AffirmationLetterData[];
}

export default function UfyMainPage({
  settings,
  theme,
  navItems,
  sections = [],
  programs = [],
  teamMembers = [],
  impactMetrics = [],
  featuredLetters = [],
}: UfyMainPageProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // Determine ordered sections if configured in Admin Visual Website Builder, otherwise render default UFY sequence
  const visibleSections =
    sections && sections.length > 0
      ? sections.filter((s) => s.isVisible !== false)
      : null;

  const getSectionBgStyle = (mode?: string): React.CSSProperties => {
    switch (mode) {
      case "white":
        return { backgroundColor: "#ffffff" };
      case "purple":
        return { backgroundColor: "rgba(118, 41, 240, 0.08)" };
      case "subtle-tint":
        return { backgroundColor: "rgba(212, 184, 252, 0.16)" };
      case "dark-purple":
        return { backgroundColor: "#140529", color: "#ffffff" };
      default:
        return {};
    }
  };

  const renderSectionByKey = (sec: PageSectionData) => {
    const key = sec.sectionKey;

    if (key === "hero") {
      return (
        <div key={sec.id} style={getSectionBgStyle(sec.backgroundMode)}>
          <UfyHeroSection
            onOpenModal={() => setModalOpen(true)}
            eyebrow={settings?.heroEyebrow}
            marqueeText={settings?.heroMarqueeText}
            sticker1={settings?.heroSticker1}
            sticker2={settings?.heroSticker2}
            sticker2Url={settings?.heroSticker2Url}
            sticker3={settings?.heroSticker3}
          />
        </div>
      );
    }

    if (key === "programs" || key === "initiatives") {
      return (
        <div key={sec.id} style={getSectionBgStyle(sec.backgroundMode)}>
          <UfyInitiativesSection
            onOpenModal={() => setModalOpen(true)}
            title={sec.title || "initiatives"}
            subtitle={sec.subtitle}
            programs={programs}
          />
        </div>
      );
    }

    if (key === "affirmations") {
      return (
        <div key={sec.id} style={getSectionBgStyle(sec.backgroundMode)}>
          <UfyAffirmationsStrip
            letters={featuredLetters}
            title={sec.title || "words of affirmation"}
            subtitle={sec.subtitle}
          />
        </div>
      );
    }

    if (key === "team" || key === "leaders") {
      return (
        <div key={sec.id} style={getSectionBgStyle(sec.backgroundMode)}>
          <UfyLeadersSection
            onOpenModal={() => setModalOpen(true)}
            title={sec.title || "leaders"}
            subtitle={sec.subtitle}
            members={teamMembers}
            enableDuotone={theme?.enableDuotone ?? true}
          />
        </div>
      );
    }

    if (key === "impact" || key === "community-idea") {
      return (
        <div key={sec.id} style={getSectionBgStyle(sec.backgroundMode)}>
          <UfyImpactSection
            onOpenModal={() => setModalOpen(true)}
            bannerText={settings?.impactBannerText}
            title={sec.title || "join the movement"}
            subtitle={sec.subtitle || "action over words"}
            metrics={impactMetrics}
            instagramUrl={settings?.socialInstagram}
          />
        </div>
      );
    }

    // Ignore legacy duplicate keys if already rendered, or render custom sections built in Visual Builder!
    if (key === "mission" || key === "accepted-ideas") {
      return null;
    }

    // Custom section added via Visual Website Builder!
    let customBody = "";
    let customButtonText = "";
    let customButtonUrl = "";
    try {
      const parsed = JSON.parse(sec.contentJson || "{}");
      customBody = parsed.text || parsed.leadParagraph || parsed.description || "";
      customButtonText = parsed.buttonText || parsed.ctaButton || "";
      customButtonUrl = parsed.buttonUrl || "";
    } catch {}

    return (
      <section key={sec.id} className="py-12 w-full" style={getSectionBgStyle(sec.backgroundMode)}>
        <div className="w-full px-3 sm:px-6 lg:px-10">
          <div className="w-full flex flex-col items-center justify-center text-center mb-[-20px] z-20 relative">
            <CutoutTypography text={sec.title.toLowerCase()} size="md" />
          </div>
          <div className="ufy-dashed-box w-full px-6 sm:px-14 py-12 text-center rounded-[4px] flex flex-col items-center justify-center">
            {sec.subtitle && (
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#140529] max-w-3xl mx-auto mb-4 text-center">
                {sec.subtitle}
              </h3>
            )}
            {customBody && (
              <p className="text-sm sm:text-base text-[#5416b3] max-w-3xl mx-auto leading-relaxed mb-6 text-center">
                {customBody}
              </p>
            )}
            {customButtonText && (
              <a
                href={customButtonUrl || "/volunteer"}
                className="btn-primary text-sm px-6 py-3 mx-auto"
              >
                {customButtonText}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  };

  const hasAffirmationsInSections = visibleSections?.some((s) => s.sectionKey === "affirmations");

  return (
    <div className="min-h-screen flex flex-col justify-between antialiased">
      <AnalyticsTracker />

      <UfyNavbar
        onOpenModal={() => setModalOpen(true)}
        navItems={navItems}
        brandTagline={settings?.brandTagline || "Up for Youth"}
        logoUrl={settings?.logoUrl}
        logoHeight={settings?.logoHeight || 36}
        ctaLabel={settings?.primaryCtaLabel || "Volunteer"}
        ctaUrl={settings?.primaryCtaUrl || "/volunteer"}
        ctaVisible={settings?.primaryCtaVisible ?? true}
      />

      <main className="w-full overflow-x-hidden">
        {visibleSections ? (
          <>
            {visibleSections.map((sec) => renderSectionByKey(sec))}
            {!hasAffirmationsInSections && (
              <UfyAffirmationsStrip letters={featuredLetters} />
            )}
          </>
        ) : (
          <>
            <UfyHeroSection
              onOpenModal={() => setModalOpen(true)}
              eyebrow={settings?.heroEyebrow}
              marqueeText={settings?.heroMarqueeText}
              sticker1={settings?.heroSticker1}
              sticker2={settings?.heroSticker2}
              sticker2Url={settings?.heroSticker2Url}
              sticker3={settings?.heroSticker3}
            />
            <UfyInitiativesSection
              onOpenModal={() => setModalOpen(true)}
              programs={programs}
            />
            <UfyAffirmationsStrip letters={featuredLetters} />
            <UfyLeadersSection
              onOpenModal={() => setModalOpen(true)}
              members={teamMembers}
              enableDuotone={theme?.enableDuotone ?? true}
            />
            <UfyImpactSection
              onOpenModal={() => setModalOpen(true)}
              bannerText={settings?.impactBannerText}
              metrics={impactMetrics}
              instagramUrl={settings?.socialInstagram}
            />
          </>
        )}
      </main>

      <UfyFooter onOpenModal={() => setModalOpen(true)} settings={settings} />

      <SoumissionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
