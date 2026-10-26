import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/public/Header";
import HeroSection from "@/components/public/HeroSection";
import MissionSection from "@/components/public/MissionSection";
import ProgramsSection from "@/components/public/ProgramsSection";
import TeamSection from "@/components/public/TeamSection";
import AcceptedIdeasSection from "@/components/public/AcceptedIdeasSection";
import CommunityIdeaForm from "@/components/public/CommunityIdeaForm";
import Footer from "@/components/public/Footer";
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

export const dynamic = "force-dynamic";

async function getSiteData() {
  const [settings, theme, navItems, sections, team, programs, acceptedIdeas] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "global" } }),
    prisma.themeSettings.findUnique({ where: { id: "global" } }),
    prisma.navigationItem.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.pageSection.findMany({ where: { isVisible: true }, orderBy: { displayOrder: "asc" } }),
    prisma.teamMember.findMany({ where: { isPublished: true }, orderBy: { displayOrder: "asc" } }),
    prisma.program.findMany({ where: { isPublished: true }, orderBy: { displayOrder: "asc" } }),
    prisma.ideaSubmission.findMany({
      where: { status: "ACCEPTED", isPubliclyDisplayed: true },
      orderBy: { reviewedAt: "desc" },
    }),
  ]);

  return {
    settings: (settings || {}) as unknown as SiteSettingsData,
    theme: (theme || {}) as unknown as ThemeSettingsData,
    navItems: (navItems || []) as unknown as NavigationItemData[],
    sections: (sections || []) as unknown as PageSectionData[],
    team: (team || []) as unknown as TeamMemberData[],
    programs: (programs || []) as unknown as ProgramData[],
    acceptedIdeas: (acceptedIdeas || []) as unknown as IdeaSubmissionData[],
  };
}

export default async function HomePage() {
  const { settings, theme, navItems, sections, team, programs, acceptedIdeas } = await getSiteData();

  // Custom inline style variables from ThemeSettings
  const themeStyles: React.CSSProperties = {
    fontFamily: `var(--font-${theme.bodyFont === "Space Grotesk" ? "heading" : "body"})`,
  };

  return (
    <div style={themeStyles}>
      <AnalyticsTracker />
      <Header settings={settings} navItems={navItems} />

      <main id="main-content">
        {sections.map((sec) => {
          switch (sec.sectionKey) {
            case "hero":
              return <HeroSection key={sec.id} section={sec} />;
            case "mission":
              return <MissionSection key={sec.id} section={sec} />;
            case "programs":
              return <ProgramsSection key={sec.id} programs={programs} section={sec} />;
            case "team":
              return (
                <TeamSection
                  key={sec.id}
                  team={team}
                  section={sec}
                  displayCount={settings.teamDisplayCount || 6}
                  presentationStyle={settings.teamPresentationStyle || "editorial"}
                />
              );
            case "accepted-ideas":
              return <AcceptedIdeasSection key={sec.id} ideas={acceptedIdeas} section={sec} />;
            case "community-idea":
              return <CommunityIdeaForm key={sec.id} section={sec} />;
            default:
              return null;
          }
        })}
      </main>

      <Footer settings={settings} navItems={navItems} />
    </div>
  );
}
