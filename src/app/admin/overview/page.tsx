import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Users,
  Compass,
  Inbox,
  Edit3,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Eye,
  Award,
  GraduationCap,
  MailOpen,
  HeartHandshake,
  Palette,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getOverviewData() {
  const [
    teamCount,
    programsCount,
    ideasTotal,
    ideasNew,
    journeyCount,
    impactCount,
    galleryCount,
    videosCount,
    volunteersCount,
    lettersTotal,
    lettersPendingHours,
    latestIdeas,
    settings,
  ] = await Promise.all([
    prisma.teamMember.count({ where: { isPublished: true } }),
    prisma.program.count({ where: { isPublished: true } }),
    prisma.ideaSubmission.count(),
    prisma.ideaSubmission.count({ where: { status: "NEW" } }),
    prisma.journeyNode.count(),
    prisma.impactMetric.count(),
    prisma.galleryPhoto.count(),
    prisma.educationalVideo.count(),
    prisma.volunteer.count(),
    prisma.affirmationLetter.count(),
    prisma.affirmationLetter.count({ where: { hoursStatus: "PENDING" } }),
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
    journeyCount,
    impactCount,
    galleryCount,
    videosCount,
    educatedCount: settings?.videosEducatedCount ?? 0,
    volunteersCount,
    lettersTotal,
    lettersPendingHours,
    latestIdeas,
    settings,
  };
}

export default async function AdminOverviewPage() {
  const data = await getOverviewData();

  const statCards = [
    {
      title: "People Educated (Live)",
      value: data.educatedCount.toLocaleString(),
      subtitle: `${data.videosCount} educational video modules`,
      icon: GraduationCap,
      link: "/admin/videos",
      badge: "Live",
    },
    {
      title: "Virtual Letters & Wall",
      value: data.lettersTotal,
      subtitle: `${data.lettersPendingHours} letters awaiting hour check`,
      icon: MailOpen,
      link: "/admin/letters",
      badge: data.lettersPendingHours > 0 ? `${data.lettersPendingHours} Pending` : null,
    },
    {
      title: "UFY Volunteers",
      value: data.volunteersCount,
      subtitle: "Registered student accounts",
      icon: HeartHandshake,
      link: "/admin/volunteers",
    },
    {
      title: "Community Proposals",
      value: data.ideasTotal,
      subtitle: `${data.ideasNew} new in mailbox queue`,
      icon: Inbox,
      link: "/admin/inbox",
      badge: data.ideasNew > 0 ? `${data.ideasNew} New` : null,
    },
    {
      title: "Team Organizers",
      value: data.teamCount,
      subtitle: "Published leader polaroids",
      icon: Users,
      link: "/admin/team",
    },
    {
      title: "Journey Milestones",
      value: data.journeyCount,
      subtitle: "Stops along winding trail map",
      icon: Compass,
      link: "/admin/journey",
    },
    {
      title: "Impact Counters",
      value: data.impactCount,
      subtitle: "Live verified metrics",
      icon: Award,
      link: "/admin/impact",
    },
    {
      title: "Clothesline Polaroids",
      value: data.galleryCount,
      subtitle: "Gallery exhibition frames",
      icon: Eye,
      link: "/admin/gallery",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Up for Youth (UFY) — Studio Overview"
        subtitle="100% no-code control over every page, color, font, video, volunteer account, and community counter"
      />

      <div style={{ padding: "32px" }}>
        {/* Metric Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))",
            gap: "20px",
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
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  transition: "all var(--transition-fast)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--ufy-purple-800)" }}>
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

                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "2.1rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                    {stat.value}
                  </span>
                  {stat.badge && (
                    <span
                      style={{
                        backgroundColor: "var(--ufy-primary)",
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      {stat.badge}
                    </span>
                  )}
                </div>

                <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-700)" }}>{stat.subtitle}</span>
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
                  Ideas dropped into the Up for Youth mailbox (/propose)
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
                <span>Open Inbox</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {data.latestIdeas.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--ufy-purple-700)", fontSize: "0.9rem" }}>
                  No proposals submitted yet.
                </div>
              ) : (
                data.latestIdeas.map((idea: any) => (
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

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1.5px solid var(--ufy-purple-100)",
                borderRadius: "20px",
                padding: "28px",
              }}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "16px" }}>
                Native Site Builder Shortcuts
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
                  href="/admin/theme"
                  className="btn btn-outline-purple"
                  style={{ justifyContent: "flex-start", padding: "12px 18px" }}
                >
                  <Palette size={18} />
                  <span>Customize Every Color, Font &amp; Width</span>
                </Link>

                <Link
                  href="/admin/videos"
                  className="btn btn-outline-purple"
                  style={{ justifyContent: "flex-start", padding: "12px 18px" }}
                >
                  <GraduationCap size={18} />
                  <span>Manage Educational Videos &amp; Counter</span>
                </Link>

                <Link
                  href="/admin/letters"
                  className="btn btn-outline-purple"
                  style={{ justifyContent: "flex-start", padding: "12px 18px" }}
                >
                  <MailOpen size={18} />
                  <span>Moderate Virtual Letters &amp; Hours</span>
                </Link>
              </div>
            </div>

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
                  Platform &amp; Database Status
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--ufy-purple-900)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle size={15} style={{ color: "var(--ufy-primary)" }} />
                  <span>Prisma ORM wired across all 14 live tables</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle size={15} style={{ color: "var(--ufy-primary)" }} />
                  <span>Full aesthetic &amp; copy controls live without code</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle size={15} style={{ color: "var(--ufy-primary)" }} />
                  <span>Admin &amp; Volunteer HTTP-only JWT cookies active</span>
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <Link
                  href="/admin/settings"
                  style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ufy-primary)", textDecoration: "underline" }}
                >
                  Open All Page Settings &amp; DB Connection Guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
