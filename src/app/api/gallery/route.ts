import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const admin = all ? await getCurrentAdmin() : null;
    const where = admin ? {} : { isPublished: true };

    const photos = await prisma.galleryPhoto.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching gallery photos:", error);
    return NextResponse.json({ error: "Failed to fetch gallery photos" }, { status: 500 });
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
      imageUrl,
      caption,
      dateLabel,
      location,
      orientation,
      tiltAngle,
      pegColor,
      displayOrder,
      isPublished,
    } = body;

    if (!imageUrl || !caption) {
      return NextResponse.json(
        { error: "Image URL and caption are required" },
        { status: 400 }
      );
    }

    const newPhoto = await prisma.galleryPhoto.create({
      data: {
        imageUrl: imageUrl.trim(),
        caption: caption.trim(),
        dateLabel: dateLabel ? dateLabel.trim() : null,
        location: location ? location.trim() : null,
        orientation: orientation === "landscape" ? "landscape" : "portrait",
        tiltAngle: Number(tiltAngle) || 0,
        pegColor: pegColor || "#e0c7a8",
        displayOrder: Number(displayOrder) || 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return NextResponse.json({ success: true, photo: newPhoto });
  } catch (error) {
    console.error("Error creating gallery photo:", error);
    return NextResponse.json({ error: "Failed to create gallery photo" }, { status: 500 });
  }
}
