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
    const updated = await prisma.pageSection.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle ? body.subtitle.trim() : null }),
        ...(body.contentJson !== undefined && {
          contentJson: typeof body.contentJson === "string" ? body.contentJson : JSON.stringify(body.contentJson),
        }),
        ...(body.layoutVariation !== undefined && { layoutVariation: body.layoutVariation }),
        ...(body.backgroundMode !== undefined && { backgroundMode: body.backgroundMode }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
        ...(body.isVisible !== undefined && { isVisible: Boolean(body.isVisible) }),
      },
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (error) {
    console.error("Update section error:", error);
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.pageSection.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Section removed" });
  } catch (error) {
    console.error("Delete section error:", error);
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}
