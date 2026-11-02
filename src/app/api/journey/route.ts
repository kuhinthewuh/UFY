import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const admin = all ? await getCurrentAdmin() : null;
    const where = admin ? {} : { isPublished: true };

    const nodes = await prisma.journeyNode.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ nodes });
  } catch (error) {
    console.error("Error fetching journey nodes:", error);
    return NextResponse.json({ error: "Failed to fetch journey nodes" }, { status: 500 });
  }
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
      dateLabel,
      location,
      category,
      description,
      stats,
      imageUrl,
      badgeLabel,
      isHighlight,
      displayOrder,
      isPublished,
    } = body;

    if (!title || !dateLabel || !location || !description) {
      return NextResponse.json(
        { error: "Title, date, location, and description are required" },
        { status: 400 }
      );
    }

    const newNode = await prisma.journeyNode.create({
      data: {
        title: title.trim(),
        dateLabel: dateLabel.trim(),
        location: location.trim(),
        category: category?.trim() || "Hospital Action",
        description: description.trim(),
        stats: stats ? stats.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        badgeLabel: badgeLabel ? badgeLabel.trim() : null,
        isHighlight: Boolean(isHighlight),
        displayOrder: Number(displayOrder) || 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return NextResponse.json({ success: true, node: newNode });
  } catch (error) {
    console.error("Error creating journey node:", error);
    return NextResponse.json({ error: "Failed to create journey event node" }, { status: 500 });
  }
}
