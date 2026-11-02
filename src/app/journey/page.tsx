import React from "react";
import prisma from "@/lib/prisma";
import { getPublicChromeData } from "@/lib/site-data";
import UfyNavbar from "@/components/ufy/UfyNavbar";
import UfyFooter from "@/components/ufy/UfyFooter";
import JourneyTrailClient from "./JourneyTrailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Journey — Up for Youth Adventure Trail | UFY",
  description:
    "Follow the Up for Youth winding trail of hospital care visits, youth CPR certifications, and neighborhood literacy drives.",
};

export default async function JourneyPage() {
  const [{ settings, navItems }, nodes] = await Promise.all([
    getPublicChromeData(),
    prisma.journeyNode.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  const title = settings?.journeyTitle || "Our Community Journey";
  const subtitle =
    settings?.journeySubtitle ||
    "Follow Up for Youth's winding expedition trail of pediatric hospital visits, student CPR trainings, and neighborhood literacy campaigns.";

  return (
    <div className="min-h-screen text-[#140529] font-sans antialiased selection:bg-[#7629f0] selection:text-white flex flex-col justify-between">
      <UfyNavbar settings={settings} navItems={navItems} />

      <main className="w-full pt-28 pb-20 overflow-hidden">
        <JourneyTrailClient title={title} subtitle={subtitle} initialNodes={nodes} />
      </main>

      <UfyFooter settings={settings} />
    </div>
  );
}
