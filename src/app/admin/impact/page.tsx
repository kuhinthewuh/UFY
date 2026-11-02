import React from "react";
import prisma from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import ImpactAdminClient from "./ImpactAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminImpactPage() {
  const metrics = await prisma.impactMetric
    .findMany({
      orderBy: { displayOrder: "asc" },
    })
    .catch(() => []);

  return (
    <div>
      <AdminHeader
        title="Impact Live Counters Manager"
        subtitle="Add, edit, and adjust numbers and metrics on the /impact live counters page"
      />
      <div style={{ padding: "32px", maxWidth: "1400px" }}>
        <ImpactAdminClient initialMetrics={metrics} />
      </div>
    </div>
  );
}
