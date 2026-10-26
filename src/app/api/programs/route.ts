import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const programs = await prisma.program.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ programs });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, category, summary, description, imageUrl, status, dateLabel, externalUrl, displayOrder, isPublished } = body;

    if (!title || !category || !summary) {
      return NextResponse.json({ error: "Title, category, and summary are required" }, { status: 400 });
    }

    const maxOrder = await prisma.program.aggregate({ _max: { displayOrder: true } });
    const nextOrder = displayOrder !== undefined ? displayOrder : (maxOrder._max.displayOrder || 0) + 1;

    const program = await prisma.program.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        summary: summary.trim(),
        description: description ? description.trim() : summary.trim(),
        imageUrl: imageUrl || null,
        status: status || "active",
        dateLabel: dateLabel ? dateLabel.trim() : null,
        externalUrl: externalUrl ? externalUrl.trim() : null,
        displayOrder: nextOrder,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, program });
  } catch (error) {
    console.error("Create program error:", error);
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}
