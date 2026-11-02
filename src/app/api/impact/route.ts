import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const admin = all ? await getCurrentAdmin() : null;
    const where = admin ? {} : { isPublished: true };

    const metrics = await prisma.impactMetric.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Error fetching impact metrics:", error);
    return NextResponse.json({ error: "Failed to fetch impact metrics" }, { status: 500 });
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
      label,
      targetValue,
      currentValue,
      prefix,
      suffix,
      subtitle,
      icon,
      color,
      isLive,
      displayOrder,
      isPublished,
    } = body;

    if (!label) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    const newMetric = await prisma.impactMetric.create({
      data: {
        label: label.trim(),
        targetValue: targetValue !== undefined ? Number(targetValue) : 0,
        currentValue: currentValue !== undefined ? Number(currentValue) : (targetValue !== undefined ? Number(targetValue) : 0),
        prefix: prefix !== undefined ? prefix : "",
        suffix: suffix !== undefined ? suffix : "",
        subtitle: subtitle ? subtitle.trim() : null,
        icon: icon || "Heart",
        color: color || "#7629f0",
        isLive: isLive !== undefined ? Boolean(isLive) : true,
        displayOrder: Number(displayOrder) || 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return NextResponse.json({ success: true, metric: newMetric });
  } catch (error) {
    console.error("Error creating impact metric:", error);
    return NextResponse.json({ error: "Failed to create impact metric" }, { status: 500 });
  }
}
