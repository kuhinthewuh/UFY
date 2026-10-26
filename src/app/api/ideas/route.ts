import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (status && status !== "ALL") {
    where.status = status;
  }
  if (category && category !== "ALL") {
    where.category = category;
  }
  if (search && search.trim()) {
    where.OR = [
      { title: { contains: search.trim() } },
      { description: { contains: search.trim() } },
      { problemAddressed: { contains: search.trim() } },
    ];
  }

  const ideas = await prisma.ideaSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ideas });
}
