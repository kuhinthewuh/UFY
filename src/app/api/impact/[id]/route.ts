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
    const updated = await prisma.impactMetric.update({
      where: { id: params.id },
      data: {
        ...(body.label !== undefined && { label: body.label.trim() }),
        ...(body.targetValue !== undefined && { targetValue: Number(body.targetValue) }),
        ...(body.currentValue !== undefined && { currentValue: Number(body.currentValue) }),
        ...(body.prefix !== undefined && { prefix: body.prefix }),
        ...(body.suffix !== undefined && { suffix: body.suffix }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle ? body.subtitle.trim() : null }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.isLive !== undefined && { isLive: Boolean(body.isLive) }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
        ...(body.isPublished !== undefined && { isPublished: Boolean(body.isPublished) }),
      },
    });

    return NextResponse.json({ success: true, metric: updated });
  } catch (error) {
    console.error("Error updating impact metric:", error);
    return NextResponse.json({ error: "Failed to update impact metric" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.impactMetric.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Metric deleted" });
  } catch (error) {
    console.error("Error deleting impact metric:", error);
    return NextResponse.json({ error: "Failed to delete impact metric" }, { status: 500 });
  }
}
