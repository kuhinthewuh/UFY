import React from "react";
import prisma from "@/lib/prisma";
import { getPublicChromeData } from "@/lib/site-data";
import UfyNavbar from "@/components/ufy/UfyNavbar";
import UfyFooter from "@/components/ufy/UfyFooter";
import WireHangingGalleryClient from "./WireHangingGalleryClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Dome Gallery | UFY — Up for Youth",
  description:
    "Explore our interactive 3D Dome Gallery showcasing Up for Youth workshops, hospital card deliveries, and community smiles.",
};

export default async function GalleryPage() {
  const [{ settings, navItems }, photos] = await Promise.all([
    getPublicChromeData(),
    prisma.galleryPhoto.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  const title = settings?.galleryTitle || "Moments in Motion";
  const subtitle =
    settings?.gallerySubtitle ||
    "Spin, drag, and tap through our interactive 3D Dome Gallery of hospital care visits, youth CPR certifications, and Up for Youth changemakers in Manteca and beyond.";

  return (
    <div className="min-h-screen text-[#140529] font-sans antialiased selection:bg-[#7629f0] selection:text-white flex flex-col justify-between">
      <UfyNavbar settings={settings} navItems={navItems} />

      <main className="w-full pt-28 pb-20 overflow-hidden">
        <WireHangingGalleryClient title={title} subtitle={subtitle} initialPhotos={photos} />
      </main>

      <UfyFooter settings={settings} />
    </div>
  );
}
