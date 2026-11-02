import React from "react";
import prisma from "@/lib/prisma";
import { getPublicChromeData } from "@/lib/site-data";
import UfyNavbar from "@/components/ufy/UfyNavbar";
import UfyFooter from "@/components/ufy/UfyFooter";
import ProposeIdeaMailboxClient from "./ProposeIdeaMailboxClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Propose an Idea — Up for Youth Community Mailbox | UFY",
  description:
    "Drop your community health, pediatric care, or local literacy proposal into the official Up for Youth (UFY) team mailbox.",
};

export default async function ProposePage() {
  const [{ settings, navItems }, acceptedIdeas] = await Promise.all([
    getPublicChromeData(),
    prisma.ideaSubmission.findMany({
      where: { status: "ACCEPTED" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const inboxEmail = settings?.ufyInboxEmail || settings?.contactEmail || "ideas@upforyouth.org";
  const title = settings?.proposeTitle || "UFY Community Mailbox";
  const subtitle =
    settings?.proposeSubtitle ||
    "Drop your boldest youth-led initiative, workshop proposal, or school collaboration directly into the Up for Youth organizing inbox.";

  return (
    <div className="min-h-screen text-[#140529] font-sans antialiased selection:bg-[#7629f0] selection:text-white flex flex-col justify-between">
      <UfyNavbar settings={settings} navItems={navItems} />

      <main className="w-full pt-28 pb-20 overflow-hidden">
        <ProposeIdeaMailboxClient
          inboxEmail={inboxEmail}
          title={title}
          subtitle={subtitle}
          acceptedIdeas={acceptedIdeas}
        />
      </main>

      <UfyFooter settings={settings} />
    </div>
  );
}
