import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Users,
  Compass,
  Inbox,
  BarChart3,
  Edit3,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Eye,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getOverviewData() {
  const [
    teamCount,
    programsCount,
    ideasTotal,
    ideasNew,
    pageviewsCount,
    uniqueSessions,
    latestIdeas,
    settings,
  ] = await Promise.all([
    prisma.teamMember.count({ where: { isPublished: true } }),
    prisma.program.count({ where: { isPublished: true } }),
    prisma.ideaSubmission.count(),
    prisma.ideaSubmission.count({ where: { status: "NEW" } }),
    prisma.analyticsEvent.count({ where: { eventType: "page_view" } }),
    prisma.analyticsEvent.findMany({
      select: { sessionId: true },
      distinct: ["sessionId"],
    }),
    prisma.ideaSubmission.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.siteSettings.findUnique({ where: { id: "global" } }),
  ]);

  return {
    teamCount,
    programsCount,
    ideasTotal,
    ideasNew,
    pageviewsCount,
    uniqueVisitors: uniqueSessions.length,
    latestIdeas,
    settings,
  };
}

export default async function AdminOverviewPage() {
  const data = await getOverviewData();

  const statCards = [
    {
      title: "Page Views (Real)",
      value: data.pageviewsCount,
      subtitle: `${data.uniqueVisitors} unique sessions recorded`,
      icon: Eye,
      link: "/admin/analytics",
    },
    {
      title: "Community Proposals",
      value: data.ideasTotal,
      subtitle: `${data.ideasNew} awaiting moderation review`,
      icon: Inbox,
      link: "/admin/inbox",
      badge: data.ideasNew > 0 ? `${data.ideasNew} New` : null,
    },
    {
      title: "Active Initiatives",
      value: data.programsCount,
      subtitle: "Published workshops & libraries",
      icon: Compass,
      link: "/admin/programs",
    },
    {
      title: "Team Members",
      value: data.teamCount,
      subtitle: `Configured limit: ${data.settings?.teamDisplayCount || 6}`,
      icon: Users,
      link: "/admin/team",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Administrative Overview"
        subtitle="Real-time site health, community engagement & quick management shortcuts"
      />

      <div style={{ padding: "32px" }}>
        {/* Metric Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.link}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid var(--ufy-purple-100)",
                  borderRadius: "18px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  transition: "all var(--transition-fast)",
                  boxShadow: "var(--shadow-subtle)",
                }}
                className="overview-stat-card"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--ufy-purple-800)" }}>
                    {stat.title}
                  </span>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundColor: "var(--ufy-purple-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--ufy-primary)",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                  <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                    {stat.value}
                  </span>
                  {stat.badge && (
                    <span
                      style={{
                        backgroundColor: "var(--ufy-primary)",
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {stat.badge}
                    </span>
                  )}
                </div>

                <span style={{ fontSize: "0.82rem", color: "var(--ufy-purple-700)" }}>{stat.subtitle}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Shortcuts & Inbox Preview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "28px",
          }}
          className="overview-split"
        >
          {/* Latest Ideas for Review */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                  Recent Community Proposals
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--ufy-purple-700)" }}>
                  Latest ideas submitted by young people & community members
                </p>
              </div>

              <Link
                href="/admin/inbox"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "var(--ufy-primary)",
                }}
              >
                <span>View Inbox</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {data.latestIdeas.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--ufy-purple-700)", fontSize: "0.9rem" }}>
                  No proposals submitted yet. Visitors can submit ideas through the public portal!
                </div>
              ) : (
                data.latestIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    style={{
                      border: "1px solid var(--ufy-purple-100)",
                      backgroundColor: "var(--ufy-purple-25)",
                      borderRadius: "12px",
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "14px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            backgroundColor: idea.status === "NEW" ? "var(--ufy-primary)" : "var(--ufy-purple-200)",
                            color: idea.status === "NEW" ? "#ffffff" : "var(--ufy-purple-900)",
                          }}
                        >
                          {idea.status}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-700)", fontWeight: 500 }}>
                          {idea.category}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                        {idea.title}
                      </div>
                    </div>

                    <Link
                      href="/admin/inbox"
                      className="btn btn-outline-purple"
                      style={{ padding: "6px 14px", fontSize: "0.82rem", whiteSpace: "nowrap" }}
                    >
                      Review
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Launch & Security Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Quick Actions */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1.5px solid var(--ufy-purple-100)",
                borderRadius: "20px",
                padding: "28px",
              }}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "16px" }}>
                Quick Actions
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  href="/admin/editor"
                  className="btn btn-primary"
                  style={{ justifyContent: "flex-start", padding: "12px 18px" }}
                >
                  <Edit3 size={18} />
                  <span>Open Visual Website Builder</span>
                </Link>

                <Link
                  href="/admin/team"
                  className="btn btn-outline-purple"
                  style={{ justifyContent: "flex-start", padding: "12px 18px" }}
                >
                  <Users size={18} />
                  <span>Manage Team Members ({data.teamCount})</span>
                </Link>

                <Link
                  href="/admin/programs"
                  className="btn btn-outline-purple"
                  style={{ justifyContent: "flex-start", padding: "12px 18px" }}
                >
                  <Compass size={18} />
                  <span>Manage Programs & Workshops</span>
                </Link>

                <Link
                  href="/admin/theme"
                  className="btn btn-outline-purple"
                  style={{ justifyContent: "flex-start", padding: "12px 18px" }}
                >
                  <Sparkles size={18} />
                  <span>Customize Fonts & Theme</span>
                </Link>
              </div>
            </div>

            {/* Launch Readiness Card */}
            <div
              style={{
                backgroundColor: "var(--ufy-purple-50)",
                border: "1.5px solid var(--ufy-purple-200)",
                borderRadius: "20px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <ShieldCheck size={20} style={{ color: "var(--ufy-primary)" }} />
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                  Platform Health
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--ufy-purple-900)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle size={15} style={{ color: "var(--ufy-primary)" }} />
                  <span>SQLite database synced and persistent</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle size={15} style={{ color: "var(--ufy-primary)" }} />
                  <span>Strict UFY palette enforced (#7629f0 & #ffffff)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle size={15} style={{ color: "var(--ufy-primary)" }} />
                  <span>Session auth active with HTTP-only cookies</span>
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <Link
                  href="/admin/settings"
                  style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ufy-primary)", textDecoration: "underline" }}
                >
                  Open Launch Checklist →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

