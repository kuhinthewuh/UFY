import React from "react";
import prisma from "@/lib/prisma";
import { getPublicChromeData } from "@/lib/site-data";
import UfyNavbar from "@/components/ufy/UfyNavbar";
import UfyFooter from "@/components/ufy/UfyFooter";
import ImpactCounterClient from "./ImpactCounterClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Impact — Live Community Counters | UFY — Up for Youth",
  description:
    "Real-time live counters measuring handcrafted cards delivered to pediatric patients, youth educated, and books donated by Up for Youth.",
};

export default async function ImpactPage() {
  const [{ settings, navItems }, metrics] = await Promise.all([
    getPublicChromeData(),
    prisma.impactMetric
      .findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: "asc" },
      })
      .catch(() => []),
  ]);

  const title = settings?.impactTitle || "Our Community Impact";
  const subtitle =
    settings?.impactSubtitle ||
    "Live metrics capturing thousands of smiles delivered, youth trained in emergency readiness, and neighborhood books distributed by Up for Youth.";

  return (
    <div className="min-h-screen text-[#140529] font-sans antialiased selection:bg-[#7629f0] selection:text-white flex flex-col justify-between">
      <UfyNavbar settings={settings} navItems={navItems} />

      <main className="w-full pt-28 pb-20 overflow-hidden">
        <ImpactCounterClient
          title={title}
          subtitle={subtitle}
          initialMetrics={metrics}
          educatedCount={settings?.videosEducatedCount ?? 0}
        />
      </main>

      <UfyFooter settings={settings} />
    </div>
  );
}
