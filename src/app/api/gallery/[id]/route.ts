import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await prisma.galleryPhoto.update({
      where: { id: params.id },
      data: {
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl.trim() }),
        ...(body.caption !== undefined && { caption: body.caption.trim() }),
        ...(body.dateLabel !== undefined && { dateLabel: body.dateLabel ? body.dateLabel.trim() : null }),
        ...(body.location !== undefined && { location: body.location ? body.location.trim() : null }),
        ...(body.orientation !== undefined && { orientation: body.orientation }),
        ...(body.tiltAngle !== undefined && { tiltAngle: Number(body.tiltAngle) }),
        ...(body.pegColor !== undefined && { pegColor: body.pegColor }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
        ...(body.isPublished !== undefined && { isPublished: Boolean(body.isPublished) }),
      },
    });

    return NextResponse.json({ success: true, photo: updated });
  } catch (error) {
    console.error("Error updating gallery photo:", error);
    return NextResponse.json({ error: "Failed to update gallery photo" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.galleryPhoto.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Photo deleted" });
  } catch (error) {
    console.error("Error deleting gallery photo:", error);
    return NextResponse.json({ error: "Failed to delete gallery photo" }, { status: 500 });
  }
}
