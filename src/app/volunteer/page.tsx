import React from "react";
import prisma from "@/lib/prisma";
import { getPublicChromeData } from "@/lib/site-data";
import { getCurrentVolunteer } from "@/lib/auth";
import UfyNavbar from "@/components/ufy/UfyNavbar";
import UfyFooter from "@/components/ufy/UfyFooter";
import VolunteerPortalClient from "./VolunteerPortalClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Volunteer Sign-Up & Hours Portal | UFY — Up for Youth",
  description:
    "Sign up as an Up for Youth (UFY) volunteer, track verified service hours, write virtual letters for hospitalized youth, and join local workshops.",
};

export default async function VolunteerPage() {
  const [{ settings, navItems }, session] = await Promise.all([
    getPublicChromeData(),
    getCurrentVolunteer().catch(() => null),
  ]);

  let initialVolunteer = null;
  if (session) {
    const vol = await prisma.volunteer
      .findUnique({
        where: { id: session.id },
        include: {
          letters: {
            orderBy: { createdAt: "desc" },
          },
        },
      })
      .catch(() => null);
    if (vol) {
      const pendingHours = vol.letters
        .filter((l) => l.hoursStatus === "PENDING")
        .reduce((sum, l) => sum + (l.hoursAwarded || 0), 0);

      initialVolunteer = {
        id: vol.id,
        email: vol.email,
        fullName: vol.fullName,
        schoolOrOrg: vol.schoolOrOrg,
        city: vol.city,
        interests: vol.interests,
        status: vol.status,
        totalVerifiedHours: vol.totalVerifiedHours,
        bonusHours: vol.bonusHours,
        pendingHours: Number(pendingHours.toFixed(2)),
        createdAt: vol.createdAt.toISOString(),
        letters: vol.letters.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
        })),
      };
    }
  }

  const title = settings?.volunteerTitle || "Become an Up for Youth Volunteer";
  const subtitle =
    settings?.volunteerSubtitle ||
    "Create your free UFY Volunteer Account to join youth workshops, write virtual letters for hospitalized kids, and earn verified community service hours.";

  return (
    <div className="min-h-screen text-[#140529] font-sans antialiased selection:bg-[#7629f0] selection:text-white flex flex-col justify-between">
      <UfyNavbar settings={settings} navItems={navItems} />

      <main className="w-full pt-28 pb-20 overflow-hidden">
        <VolunteerPortalClient
          title={title}
          subtitle={subtitle}
          initialVolunteer={initialVolunteer}
          hoursPerLetter={settings?.hoursPerLetter ?? 0.25}
        />
      </main>

      <UfyFooter settings={settings} />
    </div>
  );
}

