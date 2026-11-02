import React from "react";
import prisma from "@/lib/prisma";
import { getPublicChromeData } from "@/lib/site-data";
import UfyNavbar from "@/components/ufy/UfyNavbar";
import UfyFooter from "@/components/ufy/UfyFooter";
import TeamGalleryClient from "./TeamGalleryClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Team — Meet the Up for Youth Leaders | UFY",
  description:
    "Meet the passionate student organizers, health educators, and community leaders driving Up for Youth (UFY) initiatives.",
};

export default async function TeamPage() {
  const [{ settings, theme, navItems }, members] = await Promise.all([
    getPublicChromeData(),
    prisma.teamMember.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  const title = settings?.teamTitle || "Meet Our Youth Leaders";
  const subtitle =
    settings?.teamSubtitle ||
    "Passionate young organizers leading compassionate health literacy, pediatric hospital care, and community solidarity at Up for Youth.";

  return (
    <div className="min-h-screen text-[#140529] font-sans antialiased selection:bg-[#7629f0] selection:text-white flex flex-col justify-between">
      <UfyNavbar settings={settings} navItems={navItems} />

      <main className="w-full pt-28 pb-20 overflow-hidden">
        <TeamGalleryClient
          title={title}
          subtitle={subtitle}
          initialMembers={members}
          enableDuotone={theme?.enableDuotone ?? true}
        />
      </main>

      <UfyFooter settings={settings} />
    </div>
  );
}
