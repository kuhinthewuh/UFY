import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (search && search.trim()) {
    where.OR = [
      { filename: { contains: search.trim() } },
      { originalName: { contains: search.trim() } },
      { altText: { contains: search.trim() } },
    ];
  }

  const assets = await prisma.mediaAsset.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ assets });
}
