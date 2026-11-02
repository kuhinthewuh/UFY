import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { getVideoThumbnailUrl } from "@/lib/site-data";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const resolvedThumbnail =
      body.thumbnailUrl !== undefined
        ? body.thumbnailUrl && body.thumbnailUrl.trim()
          ? body.thumbnailUrl.trim()
          : body.youtubeUrl
          ? getVideoThumbnailUrl(body.youtubeUrl)
          : null
        : undefined;

    const updated = await prisma.educationalVideo.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.category !== undefined && { category: body.category.trim() }),
        ...(body.description !== undefined && { description: body.description.trim() }),
        ...(body.youtubeUrl !== undefined && { youtubeUrl: body.youtubeUrl.trim() }),
        ...(resolvedThumbnail !== undefined && { thumbnailUrl: resolvedThumbnail }),
        ...(body.duration !== undefined && { duration: body.duration ? body.duration.trim() : null }),
        ...(body.instructor !== undefined && { instructor: body.instructor ? body.instructor.trim() : null }),
        ...(body.viewsCount !== undefined && { viewsCount: Math.max(0, Number(body.viewsCount)) }),
        ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
        ...(body.isPublished !== undefined && { isPublished: Boolean(body.isPublished) }),
      },
    });

    return NextResponse.json({ success: true, video: updated });
  } catch (error) {
    console.error("Update video error:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.educationalVideo.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}

