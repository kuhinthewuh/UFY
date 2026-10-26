import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const revisions = await prisma.siteRevision.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: { name: true, email: true },
      },
    },
  });

  return NextResponse.json({ revisions });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description } = body;

    // Capture complete snapshot of current database state
    const [settings, theme, sections, team, programs, navigation] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "global" } }),
      prisma.themeSettings.findUnique({ where: { id: "global" } }),
      prisma.pageSection.findMany({ orderBy: { displayOrder: "asc" } }),
      prisma.teamMember.findMany({ orderBy: { displayOrder: "asc" } }),
      prisma.program.findMany({ orderBy: { displayOrder: "asc" } }),
      prisma.navigationItem.findMany({ orderBy: { displayOrder: "asc" } }),
    ]);

    const snapshot = {
      settings,
      theme,
      sections,
      team,
      programs,
      navigation,
      snapshotTimestamp: new Date().toISOString(),
    };

    const count = await prisma.siteRevision.count();

    const revision = await prisma.siteRevision.create({
      data: {
        revisionNumber: count + 1,
        title: title ? title.trim() : `Published Revision #${count + 1}`,
        description: description ? description.trim() : "Live website publication",
        snapshotJson: JSON.stringify(snapshot),
        createdById: admin.id,
      },
    });

    // Update published timestamp
    await prisma.siteSettings.update({
      where: { id: "global" },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, revision });
  } catch (error) {
    console.error("Publish revision error:", error);
    return NextResponse.json({ error: "Failed to publish revision" }, { status: 500 });
  }
}
