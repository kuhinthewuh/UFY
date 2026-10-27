import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import PublicPageClient from "@/components/public/PublicPageClient";
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

  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#08090e" }} />}>
      <PublicPageClient
        settings={settings}
        theme={theme}
        navItems={navItems}
        sections={sections}
        team={team}
        programs={programs}
        acceptedIdeas={acceptedIdeas}
      />
    </Suspense>
  );
}
