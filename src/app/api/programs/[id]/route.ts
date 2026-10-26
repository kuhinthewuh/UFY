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
    const updated = await prisma.program.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.category !== undefined && { category: body.category.trim() }),
        ...(body.summary !== undefined && { summary: body.summary.trim() }),
        ...(body.description !== undefined && { description: body.description.trim() }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.dateLabel !== undefined && { dateLabel: body.dateLabel ? body.dateLabel.trim() : null }),
        ...(body.externalUrl !== undefined && { externalUrl: body.externalUrl ? body.externalUrl.trim() : null }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
        ...(body.isPublished !== undefined && { isPublished: Boolean(body.isPublished) }),
      },
    });

    return NextResponse.json({ success: true, program: updated });
  } catch (error) {
    console.error("Update program error:", error);
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.program.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Program deleted" });
  } catch (error) {
    console.error("Delete program error:", error);
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
