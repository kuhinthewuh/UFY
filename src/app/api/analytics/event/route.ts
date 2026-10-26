import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventType, path, sectionId, targetLabel, sessionId, deviceCategory, referrer } = body;

    if (!eventType || !sessionId) {
      return NextResponse.json({ error: "Missing required analytics event parameters" }, { status: 400 });
    }

    // Basic deduplication: don't record the exact same event from the same session within 5 seconds
    const recentDuplicate = await prisma.analyticsEvent.findFirst({
      where: {
        sessionId,
        eventType,
        path: path || "/",
        sectionId: sectionId || null,
        targetLabel: targetLabel || null,
        timestamp: {
          gte: new Date(Date.now() - 5000),
        },
      },
    });

    if (recentDuplicate) {
      return NextResponse.json({ success: true, deduped: true });
    }

    const recorded = await prisma.analyticsEvent.create({
      data: {
        eventType: String(eventType).slice(0, 50),
        path: String(path || "/").slice(0, 200),
        sectionId: sectionId ? String(sectionId).slice(0, 50) : null,
        targetLabel: targetLabel ? String(targetLabel).slice(0, 100) : null,
        sessionId: String(sessionId).slice(0, 64),
        deviceCategory: ["desktop", "mobile", "tablet"].includes(deviceCategory) ? deviceCategory : "desktop",
        referrer: referrer ? String(referrer).slice(0, 250) : null,
      },
    });

    return NextResponse.json({ success: true, eventId: recorded.id });
  } catch (error) {
    console.error("Analytics event tracking error:", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
