import React from "react";
import prisma from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import JourneyAdminClient from "./JourneyAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminJourneyPage() {
  const nodes = await prisma.journeyNode.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      <AdminHeader
        title="Past Event Journey Manager"
        subtitle="Add, subtract, and reorder milestones along the winding adventure map trail"
      />
      <div style={{ padding: "32px", maxWidth: "1400px" }}>
        <JourneyAdminClient initialNodes={nodes} />
      </div>
    </div>
  );
}
