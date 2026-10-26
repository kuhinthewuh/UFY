import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d, all

  let startDate: Date;
  const now = new Date();
  if (period === "7d") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "90d") {
    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  } else if (period === "all") {
    startDate = new Date(0);
  } else {
    // 30d default
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  try {
    // Total events in timeframe
    const events = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: "asc" },
    });

    const pageviews = events.filter((e) => e.eventType === "page_view").length;
    const uniqueSessions = new Set(events.map((e) => e.sessionId)).size;
    const ctaClicks = events.filter((e) => e.eventType === "cta_click").length;
    const formStarts = events.filter((e) => e.eventType === "idea_form_start").length;
    const formSubmissions = events.filter((e) => e.eventType === "idea_form_submit").length;

    const conversionRate = formStarts > 0 ? ((formSubmissions / formStarts) * 100).toFixed(1) : "0.0";

    // Top Sections / Targets
    const sectionCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };

    for (const e of events) {
      if (e.sectionId) {
        sectionCounts[e.sectionId] = (sectionCounts[e.sectionId] || 0) + 1;
      }
      if (e.deviceCategory && deviceCounts[e.deviceCategory] !== undefined) {
        deviceCounts[e.deviceCategory]++;
      }
    }

    // Daily breakdown for charts
    const dailyMap: Record<string, { date: string; views: number; interactions: number; submissions: number }> = {};
    for (const e of events) {
      const dateKey = e.timestamp.toISOString().split("T")[0];
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { date: dateKey, views: 0, interactions: 0, submissions: 0 };
      }
      if (e.eventType === "page_view") dailyMap[dateKey].views++;
      else if (e.eventType === "idea_form_submit") dailyMap[dateKey].submissions++;
      else dailyMap[dateKey].interactions++;
    }

    const dailyTrends = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    // Idea counts by status
    const ideaCountsByStatus = await prisma.ideaSubmission.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const ideaStats = {
      total: await prisma.ideaSubmission.count(),
      new: 0,
      under_review: 0,
      needs_clarification: 0,
      accepted: 0,
      in_progress: 0,
      completed: 0,
      declined: 0,
    };

    for (const item of ideaCountsByStatus) {
      const key = item.status.toLowerCase() as keyof typeof ideaStats;
      if (key in ideaStats) {
        ideaStats[key] = item._count.id;
      }
    }

    return NextResponse.json({
      metrics: {
        pageviews,
        uniqueSessions,
        ctaClicks,
        formStarts,
        formSubmissions,
        conversionRate,
      },
      deviceCounts,
      sectionCounts,
      dailyTrends,
      ideaStats,
      period,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
