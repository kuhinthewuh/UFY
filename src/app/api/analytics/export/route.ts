import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.analyticsEvent.findMany({
    orderBy: { timestamp: "desc" },
    take: 5000,
  });

  const headers = ["Timestamp", "Event Type", "Path", "Section", "Target Label", "Device Category", "Referrer"];
  const rows = events.map((e) => [
    e.timestamp.toISOString(),
    `"${(e.eventType || "").replace(/"/g, '""')}"`,
    `"${(e.path || "").replace(/"/g, '""')}"`,
    `"${(e.sectionId || "").replace(/"/g, '""')}"`,
    `"${(e.targetLabel || "").replace(/"/g, '""')}"`,
    `"${(e.deviceCategory || "").replace(/"/g, '""')}"`,
    `"${(e.referrer || "").replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ufy-analytics-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
