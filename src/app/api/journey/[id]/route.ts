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
    const updated = await prisma.journeyNode.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.dateLabel !== undefined && { dateLabel: body.dateLabel.trim() }),
        ...(body.location !== undefined && { location: body.location.trim() }),
        ...(body.category !== undefined && { category: body.category.trim() }),
        ...(body.description !== undefined && { description: body.description.trim() }),
        ...(body.stats !== undefined && { stats: body.stats ? body.stats.trim() : null }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl ? body.imageUrl.trim() : null }),
        ...(body.badgeLabel !== undefined && { badgeLabel: body.badgeLabel ? body.badgeLabel.trim() : null }),
        ...(body.isHighlight !== undefined && { isHighlight: Boolean(body.isHighlight) }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
        ...(body.isPublished !== undefined && { isPublished: Boolean(body.isPublished) }),
      },
    });

    return NextResponse.json({ success: true, node: updated });
  } catch (error) {
    console.error("Error updating journey node:", error);
    return NextResponse.json({ error: "Failed to update journey node" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.journeyNode.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Node deleted" });
  } catch (error) {
    console.error("Error deleting journey node:", error);
    return NextResponse.json({ error: "Failed to delete journey node" }, { status: 500 });
  }
}
