import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await prisma.mediaAsset.update({
      where: { id: params.id },
      data: {
        ...(body.altText !== undefined && { altText: body.altText.trim() }),
        ...(body.caption !== undefined && { caption: body.caption ? body.caption.trim() : null }),
        ...(body.credit !== undefined && { credit: body.credit ? body.credit.trim() : null }),
        ...(body.focalPointX !== undefined && { focalPointX: Number(body.focalPointX) }),
        ...(body.focalPointY !== undefined && { focalPointY: Number(body.focalPointY) }),
      },
    });

    return NextResponse.json({ success: true, asset: updated });
  } catch (error) {
    console.error("Update asset error:", error);
    return NextResponse.json({ error: "Failed to update asset metadata" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Check usage across team, programs, and settings before deleting
    const inTeam = await prisma.teamMember.findFirst({ where: { photoUrl: asset.url } });
    const inPrograms = await prisma.program.findFirst({ where: { imageUrl: asset.url } });
    const inSettings = await prisma.siteSettings.findFirst({ where: { logoUrl: asset.url } });

    if (inTeam || inPrograms || inSettings) {
      return NextResponse.json(
        {
          error: "This asset is actively used on the website. Please replace it in the referencing section before deleting.",
          inUse: true,
        },
        { status: 409 }
      );
    }

    // Remove file from disk
    const filePath = path.join(process.cwd(), "public", "uploads", asset.filename);
    try {
      await unlink(filePath);
    } catch {
      // Ignore if already deleted on disk
    }

    await prisma.mediaAsset.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: "Asset deleted" });
  } catch (error) {
    console.error("Delete asset error:", error);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
