"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  BarChart3,
  Download,
  Calendar,
  Eye,
  Users,
  MousePointer,
  Sparkles,
  Inbox,
  Percent,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?period=${period}`);
      const json = await res.json();
      setData(json);
    } catch {}
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
        Loading real-time analytics...
      </div>
    );
  }

  const { metrics, deviceCounts, sectionCounts, dailyTrends, ideaStats } = data;

  const maxDailyViews = Math.max(...(dailyTrends.map((d: any) => d.views) || [1]), 1);

  return (
    <div>
      <AdminHeader
        title="Analytics & Reach Dashboard"
        subtitle="100% verified server-backed events and community conversion measurements"
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid var(--ufy-purple-200)", padding: "2px" }}>
              {["7d", "30d", "90d", "all"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    backgroundColor: period === p ? "var(--ufy-primary)" : "transparent",
                    color: period === p ? "#ffffff" : "var(--ufy-purple-800)",
                  }}
                >
                  {p === "all" ? "All Time" : `Last ${p.toUpperCase()}`}
                </button>
              ))}
            </div>

            <a
              href="/api/analytics/export"
              download
              className="btn btn-outline-purple"
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              <Download size={15} />
              <span>Export CSV</span>
            </a>
          </div>
        }
      />

      <div style={{ padding: "32px", maxWidth: "1200px" }}>
        {/* Core Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ufy-purple-700)" }}>Total Views</span>
              <Eye size={18} style={{ color: "var(--ufy-primary)" }} />
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              {metrics.pageviews}
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-600)" }}>Real page impressions</span>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ufy-purple-700)" }}>Unique Sessions</span>
              <Users size={18} style={{ color: "var(--ufy-primary)" }} />
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              {metrics.uniqueSessions}
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-600)" }}>Deduplicated browser sessions</span>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ufy-purple-700)" }}>CTA Clicks</span>
              <MousePointer size={18} style={{ color: "var(--ufy-primary)" }} />
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              {metrics.ctaClicks}
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-600)" }}>Action button interactions</span>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ufy-purple-700)" }}>Form Starts</span>
              <Inbox size={18} style={{ color: "var(--ufy-primary)" }} />
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              {metrics.formStarts}
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-600)" }}>Idea proposals initiated</span>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ufy-purple-700)" }}>Submissions</span>
              <Sparkles size={18} style={{ color: "var(--ufy-primary)" }} />
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              {metrics.formSubmissions}
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--ufy-primary)", fontWeight: 700 }}>
              {metrics.conversionRate}% conversion
            </span>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--ufy-purple-100)",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                Daily Traffic & Interaction Trends
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--ufy-purple-700)" }}>
                Verified pageviews and proposal submissions recorded over time
              </p>
            </div>
          </div>

          {dailyTrends.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
              No event traffic recorded in this timeframe. Visit the public page or submit an idea to generate data.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "12px",
                height: "220px",
                paddingTop: "20px",
                borderBottom: "1px solid var(--ufy-purple-100)",
              }}
            >
              {dailyTrends.map((day: any) => {
                const heightPercent = Math.max(Math.round((day.views / maxDailyViews) * 180), 8);
                return (
                  <div
                    key={day.date}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ufy-purple-900)" }}>
                      {day.views}
                    </div>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "40px",
                        height: `${heightPercent}px`,
                        backgroundColor: "var(--ufy-primary)",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.3s ease",
                      }}
                      title={`${day.date}: ${day.views} views, ${day.submissions} proposals`}
                    />
                    <div style={{ fontSize: "0.72rem", color: "var(--ufy-purple-700)", whiteSpace: "nowrap" }}>
                      {day.date.slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Breakdown Split: Devices & Idea Lifecycle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }} className="analytics-split">
          {/* Device Categories */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "16px" }}>
              Device Categories
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Desktop", count: deviceCounts.desktop || 0, icon: Monitor },
                { label: "Mobile", count: deviceCounts.mobile || 0, icon: Smartphone },
                { label: "Tablet", count: deviceCounts.tablet || 0, icon: Tablet },
              ].map((dev) => {
                const Icon = dev.icon;
                const total = (deviceCounts.desktop || 0) + (deviceCounts.mobile || 0) + (deviceCounts.tablet || 0) || 1;
                const pct = Math.round((dev.count / total) * 100);
                return (
                  <div key={dev.label}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Icon size={16} style={{ color: "var(--ufy-primary)" }} />
                        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ufy-purple-950)" }}>
                          {dev.label}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ufy-purple-800)" }}>
                        {dev.count} ({pct}%)
                      </span>
                    </div>
                    <div style={{ width: "100%", height: "8px", backgroundColor: "var(--ufy-purple-50)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "var(--ufy-primary)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Proposal Moderation Funnel */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "16px" }}>
              Proposal Moderation Pipeline
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ backgroundColor: "var(--ufy-purple-25)", padding: "14px", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-700)", fontWeight: 600 }}>Total Received</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                  {ideaStats.total}
                </div>
              </div>

              <div style={{ backgroundColor: "var(--ufy-purple-50)", padding: "14px", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--ufy-primary)", fontWeight: 700 }}>New & Unreviewed</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--ufy-primary)" }}>
                  {ideaStats.new}
                </div>
              </div>

              <div style={{ backgroundColor: "var(--ufy-purple-25)", padding: "14px", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-700)", fontWeight: 600 }}>Under Review</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                  {ideaStats.under_review}
                </div>
              </div>

              <div style={{ backgroundColor: "var(--ufy-purple-100)", padding: "14px", borderRadius: "12px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-900)", fontWeight: 700 }}>Approved</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--ufy-purple-900)" }}>
                  {ideaStats.accepted}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

