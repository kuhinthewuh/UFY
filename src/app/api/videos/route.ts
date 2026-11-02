import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { getVideoThumbnailUrl } from "@/lib/site-data";

export async function GET() {
  const [videos, settings] = await Promise.all([
    prisma.educationalVideo.findMany({
      orderBy: { displayOrder: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { videosEducatedCount: true, videosGridColumns: true },
    }),
  ]);

  return NextResponse.json({
    videos,
    educatedCount: settings?.videosEducatedCount ?? 0,
    gridColumns: settings?.videosGridColumns ?? 3,
  });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      category,
      description,
      youtubeUrl,
      thumbnailUrl,
      duration,
      instructor,
      viewsCount,
      isFeatured,
      displayOrder,
      isPublished,
    } = body;

    if (!title || !youtubeUrl) {
      return NextResponse.json(
        { error: "Video title and YouTube URL are required" },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.educationalVideo.aggregate({
      _max: { displayOrder: true },
    });
    const nextOrder =
      displayOrder !== undefined
        ? Number(displayOrder)
        : (maxOrder._max.displayOrder || 0) + 1;

    const resolvedThumb =
      thumbnailUrl && thumbnailUrl.trim()
        ? thumbnailUrl.trim()
        : getVideoThumbnailUrl(youtubeUrl);

    const video = await prisma.educationalVideo.create({
      data: {
        title: title.trim(),
        category: category ? category.trim() : "First-Aid & CPR",
        description: description ? description.trim() : "",
        youtubeUrl: youtubeUrl.trim(),
        thumbnailUrl: resolvedThumb,
        duration: duration ? duration.trim() : "4:30",
        instructor: instructor ? instructor.trim() : "UFY Peer Educator",
        viewsCount: viewsCount !== undefined ? Number(viewsCount) : 0,
        isFeatured: Boolean(isFeatured),
        displayOrder: nextOrder,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error("Create video error:", error);
    return NextResponse.json(
      { error: "Failed to create educational video" },
      { status: 500 }
    );
  }
}

