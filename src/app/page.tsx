import React from "react";
import prisma from "@/lib/prisma";
import UfyMainPage from "@/components/ufy/UfyMainPage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, theme, navItems, sections, programs, teamMembers, impactMetrics, featuredLetters] =
    await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "global" } }).catch(() => null),
      prisma.themeSettings.findUnique({ where: { id: "global" } }).catch(() => null),
      prisma.navigationItem
        .findMany({
          where: { isVisible: true },
          orderBy: { displayOrder: "asc" },
        })
        .catch(() => []),
      prisma.pageSection
        .findMany({
          orderBy: { displayOrder: "asc" },
        })
        .catch(() => []),
      prisma.program
        .findMany({
          where: { isPublished: true },
          orderBy: { displayOrder: "asc" },
        })
        .catch(() => []),
      prisma.teamMember
        .findMany({
          where: { isPublished: true },
          orderBy: { displayOrder: "asc" },
        })
        .catch(() => []),
      prisma.impactMetric
        .findMany({
          where: { isPublished: true },
          orderBy: { displayOrder: "asc" },
        })
        .catch(() => []),
      prisma.affirmationLetter
        .findMany({
          where: { status: "APPROVED", isFeaturedOnHome: true },
          orderBy: { createdAt: "desc" },
          take: 8,
        })
        .catch(() => []),
    ]);

  const limit = settings?.teamDisplayCount || 6;
  const displayedTeam = teamMembers.slice(0, limit);

  return (
    <UfyMainPage
      settings={JSON.parse(JSON.stringify(settings))}
      theme={JSON.parse(JSON.stringify(theme))}
      navItems={JSON.parse(JSON.stringify(navItems))}
      sections={JSON.parse(JSON.stringify(sections))}
      programs={JSON.parse(JSON.stringify(programs))}
      teamMembers={JSON.parse(JSON.stringify(displayedTeam))}
      impactMetrics={JSON.parse(JSON.stringify(impactMetrics))}
      featuredLetters={JSON.parse(JSON.stringify(featuredLetters))}
    />
  );
}
