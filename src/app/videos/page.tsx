import React from "react";
import prisma from "@/lib/prisma";
import { getPublicChromeData } from "@/lib/site-data";
import UfyNavbar from "@/components/ufy/UfyNavbar";
import UfyFooter from "@/components/ufy/UfyFooter";
import EducationalVideosClient from "./EducationalVideosClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Educational Videos — Youth Health & First-Aid Library | UFY — Up for Youth",
  description:
    "Watch bite-sized, youth-led educational videos on Hands-Only CPR, emergency readiness, mental wellness, and community care by Up for Youth.",
};

export default async function EducationalVideosPage() {
  const [{ settings, navItems }, videos] = await Promise.all([
    getPublicChromeData(),
    prisma.educationalVideo
      .findMany({
        where: { isPublished: true },
        orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }],
      })
      .catch(() => []),
  ]);

  const title = settings?.videosTitle || "Educational Videos";
  const subtitle =
    settings?.videosSubtitle ||
    "Bite-sized, youth-led lessons on first-aid readiness, Hands-Only CPR, mental wellness, and compassionate community care.";
  const initialEducatedCount = settings?.videosEducatedCount ?? 0;
  const defaultColumns = settings?.videosGridColumns === 2 ? 2 : 3;

  return (
    <div className="min-h-screen text-[#140529] font-sans antialiased selection:bg-[#7629f0] selection:text-white flex flex-col justify-between">
      <UfyNavbar settings={settings} navItems={navItems} />

      <main className="w-full pt-28 pb-20 overflow-hidden">
        <EducationalVideosClient
          title={title}
          subtitle={subtitle}
          initialVideos={videos}
          initialEducatedCount={initialEducatedCount}
          defaultColumns={defaultColumns}
        />
      </main>

      <UfyFooter settings={settings} />
    </div>
  );
}

