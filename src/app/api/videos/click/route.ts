import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const videoId = body?.videoId as string | undefined;

    // Increment global "People Educated" live counter in SiteSettings
    const updatedSettings = await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {
        videosEducatedCount: {
          increment: 1,
        },
      },
      create: {
        id: "global",
        videosEducatedCount: 1,
      },
    });

    let updatedVideoViews: number | undefined;
    if (videoId) {
      try {
        const vid = await prisma.educationalVideo.update({
          where: { id: videoId },
          data: {
            viewsCount: {
              increment: 1,
            },
          },
        });
        updatedVideoViews = vid.viewsCount;
      } catch {
        // Ignore if videoId no longer exists
      }
    }

    return NextResponse.json({
      success: true,
      educatedCount: updatedSettings.videosEducatedCount,
      videoViews: updatedVideoViews,
    });
  } catch (error) {
    console.error("Increment educated counter error:", error);
    return NextResponse.json(
      { error: "Failed to update live counter" },
      { status: 500 }
    );
  }
}

