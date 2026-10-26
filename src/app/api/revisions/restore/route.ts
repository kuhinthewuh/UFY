import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { revisionId } = await req.json();
    if (!revisionId) {
      return NextResponse.json({ error: "Revision ID is required" }, { status: 400 });
    }

    const revision = await prisma.siteRevision.findUnique({
      where: { id: revisionId },
    });

    if (!revision || !revision.snapshotJson) {
      return NextResponse.json({ error: "Revision snapshot not found" }, { status: 404 });
    }

    const snapshot = JSON.parse(revision.snapshotJson);

    // Restore Settings
    if (snapshot.settings) {
      const { id: _, ...settingsData } = snapshot.settings;
      await prisma.siteSettings.upsert({
        where: { id: "global" },
        update: settingsData,
        create: { id: "global", ...settingsData },
      });
    }

    // Restore Theme
    if (snapshot.theme) {
      const { id: _, ...themeData } = snapshot.theme;
      await prisma.themeSettings.upsert({
        where: { id: "global" },
        update: themeData,
        create: { id: "global", ...themeData },
      });
    }

    // Restore Sections
    if (Array.isArray(snapshot.sections)) {
      for (const s of snapshot.sections) {
        await prisma.pageSection.upsert({
          where: { sectionKey: s.sectionKey },
          update: {
            title: s.title,
            subtitle: s.subtitle,
            contentJson: s.contentJson,
            layoutVariation: s.layoutVariation,
            displayOrder: s.displayOrder,
            isVisible: s.isVisible,
            backgroundMode: s.backgroundMode,
          },
          create: {
            sectionKey: s.sectionKey,
            title: s.title,
            subtitle: s.subtitle,
            contentJson: s.contentJson,
            layoutVariation: s.layoutVariation,
            displayOrder: s.displayOrder,
            isVisible: s.isVisible,
            backgroundMode: s.backgroundMode,
          },
        });
      }
    }

    // Restore Team Members
    if (Array.isArray(snapshot.team)) {
      await prisma.teamMember.deleteMany({});
      for (const member of snapshot.team) {
        const { id: _, createdAt: __, updatedAt: ___, ...memberData } = member;
        await prisma.teamMember.create({ data: memberData });
      }
    }

    // Restore Programs
    if (Array.isArray(snapshot.programs)) {
      await prisma.program.deleteMany({});
      for (const prog of snapshot.programs) {
        const { id: _, createdAt: __, updatedAt: ___, ...progData } = prog;
        await prisma.program.create({ data: progData });
      }
    }

    // Restore Navigation
    if (Array.isArray(snapshot.navigation)) {
      await prisma.navigationItem.deleteMany({});
      for (const nav of snapshot.navigation) {
        const { id: _, createdAt: __, updatedAt: ___, ...navData } = nav;
        await prisma.navigationItem.create({ data: navData });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully restored site to Revision #${revision.revisionNumber} ("${revision.title}")`,
    });
  } catch (error) {
    console.error("Restore revision error:", error);
    return NextResponse.json({ error: "Failed to restore revision" }, { status: 500 });
  }
}
