import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const sections = await prisma.pageSection.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ sections });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Reorder action
    if (body.action === "reorder" && Array.isArray(body.orderedIds)) {
      for (let i = 0; i < body.orderedIds.length; i++) {
        await prisma.pageSection.update({
          where: { id: body.orderedIds[i] },
          data: { displayOrder: i + 1 },
        });
      }
      const updated = await prisma.pageSection.findMany({ orderBy: { displayOrder: "asc" } });
      return NextResponse.json({ success: true, sections: updated });
    }

    // Create new section
    const { sectionKey, title, subtitle, contentJson, layoutVariation, backgroundMode, displayOrder, isVisible } = body;
    if (!sectionKey || !title) {
      return NextResponse.json({ error: "Section key and title are required" }, { status: 400 });
    }

    const maxOrder = await prisma.pageSection.aggregate({ _max: { displayOrder: true } });
    const nextOrder = displayOrder !== undefined ? displayOrder : (maxOrder._max.displayOrder || 0) + 1;

    const section = await prisma.pageSection.create({
      data: {
        sectionKey: sectionKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : null,
        contentJson: typeof contentJson === "string" ? contentJson : JSON.stringify(contentJson || {}),
        layoutVariation: layoutVariation || "default",
        backgroundMode: backgroundMode || "white",
        displayOrder: nextOrder,
        isVisible: isVisible ?? true,
      },
    });

    return NextResponse.json({ success: true, section });
  } catch (error) {
    console.error("Create/reorder section error:", error);
    return NextResponse.json({ error: "Failed to manage sections" }, { status: 500 });
  }
}
