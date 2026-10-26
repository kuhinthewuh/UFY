import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ideas = await prisma.ideaSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "ID",
    "Created Date",
    "Status",
    "Category",
    "Title",
    "Description",
    "Problem Addressed",
    "Proposed Approach",
    "Linked Outcome",
    "Publicly Displayed",
    "Submitter Contact",
  ];

  const rows = ideas.map((i) => [
    `"${i.id}"`,
    `"${i.createdAt.toISOString()}"`,
    `"${i.status}"`,
    `"${(i.category || "").replace(/"/g, '""')}"`,
    `"${(i.title || "").replace(/"/g, '""')}"`,
    `"${(i.description || "").replace(/"/g, '""')}"`,
    `"${(i.problemAddressed || "").replace(/"/g, '""')}"`,
    `"${(i.proposedApproach || "").replace(/"/g, '""')}"`,
    `"${(i.linkedOutcome || "").replace(/"/g, '""')}"`,
    `"${i.isPubliclyDisplayed ? "YES" : "NO"}"`,
    `"${(i.submitterEmail || "Not provided").replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ufy-community-ideas-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
