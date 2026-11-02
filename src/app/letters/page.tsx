import React from "react";
import prisma from "@/lib/prisma";
import { getPublicChromeData } from "@/lib/site-data";
import { getCurrentVolunteer } from "@/lib/auth";
import UfyNavbar from "@/components/ufy/UfyNavbar";
import UfyFooter from "@/components/ufy/UfyFooter";
import VirtualLettersClient from "./VirtualLettersClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Virtual Letters & Words of Affirmation | UFY — Up for Youth",
  description:
    "Write uplifting virtual letters for hospitalized youth to earn verified Up for Youth volunteer hours, or open a sweet affirmation envelope to brighten your day.",
};

export default async function VirtualLettersPage() {
  const [{ settings, navItems }, letters, volunteerSession] = await Promise.all([
    getPublicChromeData(),
    prisma.affirmationLetter.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 48,
    }),
    getCurrentVolunteer(),
  ]);

  let currentVolunteer = null;
  if (volunteerSession) {
    currentVolunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerSession.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        totalVerifiedHours: true,
      },
    });
  }

  const title = settings?.lettersTitle || "Virtual Letters & Affirmations";
  const subtitle =
    settings?.lettersSubtitle ||
    "Send a virtual envelope of encouragement to hospitalized youth and fellow students—or sign in with your UFY Volunteer Account to earn verified volunteer hours for heartfelt letters.";

  const serializedLetters = letters.map((l) => ({
    ...l,
    hoursStatus: l.hoursStatus as "NONE" | "PENDING" | "VERIFIED" | "REJECTED",
    status: l.status as "PENDING" | "APPROVED" | "ARCHIVED",
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen text-[#140529] font-sans antialiased selection:bg-[#7629f0] selection:text-white flex flex-col justify-between">
      <UfyNavbar settings={settings} navItems={navItems} />

      <main className="w-full pt-28 pb-20 overflow-hidden">
        <VirtualLettersClient
          title={title}
          subtitle={subtitle}
          initialLetters={serializedLetters}
          currentVolunteer={currentVolunteer}
          hoursPerLetter={settings?.hoursPerLetter ?? 0.25}
        />
      </main>

      <UfyFooter settings={settings} />
    </div>
  );
}
