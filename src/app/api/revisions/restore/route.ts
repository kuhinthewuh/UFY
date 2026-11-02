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

    if (snapshot.settings) {
      const { id: _id, updatedAt: _u, ...settingsData } = snapshot.settings;
      await prisma.siteSettings.upsert({
        where: { id: "global" },
        update: settingsData,
        create: { id: "global", ...settingsData },
      });
    }

    if (snapshot.theme) {
      const { id: _id, updatedAt: _u, ...themeData } = snapshot.theme;
      await prisma.themeSettings.upsert({
        where: { id: "global" },
        update: themeData,
        create: { id: "global", ...themeData },
      });
    }

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

    if (Array.isArray(snapshot.team)) {
      await prisma.teamMember.deleteMany({});
      for (const member of snapshot.team) {
        const { id: _id, createdAt: _c, updatedAt: _u, ...memberData } = member;
        await prisma.teamMember.create({ data: memberData });
      }
    }

    if (Array.isArray(snapshot.programs)) {
      await prisma.program.deleteMany({});
      for (const prog of snapshot.programs) {
        const { id: _id, createdAt: _c, updatedAt: _u, ...progData } = prog;
        await prisma.program.create({ data: progData });
      }
    }

    if (Array.isArray(snapshot.navigation)) {
      await prisma.navigationItem.deleteMany({});
      for (const nav of snapshot.navigation) {
        const { id: _id, createdAt: _c, updatedAt: _u, ...navData } = nav;
        await prisma.navigationItem.create({ data: navData });
      }
    }

    if (Array.isArray(snapshot.journeyNodes)) {
      await prisma.journeyNode.deleteMany({});
      for (const node of snapshot.journeyNodes) {
        const { id: _id, createdAt: _c, updatedAt: _u, ...nodeData } = node;
        await prisma.journeyNode.create({ data: nodeData });
      }
    }

    if (Array.isArray(snapshot.impactMetrics)) {
      await prisma.impactMetric.deleteMany({});
      for (const metric of snapshot.impactMetrics) {
        const { id: _id, createdAt: _c, updatedAt: _u, ...metricData } = metric;
        await prisma.impactMetric.create({ data: metricData });
      }
    }

    if (Array.isArray(snapshot.galleryPhotos)) {
      await prisma.galleryPhoto.deleteMany({});
      for (const photo of snapshot.galleryPhotos) {
        const { id: _id, createdAt: _c, updatedAt: _u, ...photoData } = photo;
        await prisma.galleryPhoto.create({ data: photoData });
      }
    }

    if (Array.isArray(snapshot.educationalVideos)) {
      await prisma.educationalVideo.deleteMany({});
      for (const video of snapshot.educationalVideos) {
        const { id: _id, createdAt: _c, updatedAt: _u, ...videoData } = video;
        await prisma.educationalVideo.create({ data: videoData });
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
