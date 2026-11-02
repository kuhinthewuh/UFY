"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Settings,
  Save,
  CheckCircle,
  Award,
  Database,
  Globe,
  Share2,
} from "lucide-react";
import { SiteSettingsData } from "@/lib/types";

export default function SiteSettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch {}
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSavedMessage("All Up for Youth site copy, hero stickers, counters, and page headings saved!");
        setTimeout(() => setSavedMessage(null), 4000);
      }
    } catch {}
    setSaving(false);
  };

  if (loading || !settings) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
        Loading site settings...
      </div>
    );
  }

  const pageConfigs: Array<{
    label: string;
    route: string;
    titleKey: keyof SiteSettingsData;
    subKey: keyof SiteSettingsData;
  }> = [
    {
      label: "1. Educational Videos Page",
      route: "/videos",
      titleKey: "videosTitle",
      subKey: "videosSubtitle",
    },
    {
      label: "2. Virtual Letters & Affirmations Page",
      route: "/letters",
      titleKey: "lettersTitle",
      subKey: "lettersSubtitle",
    },
    {
      label: "3. Volunteer Sign-Up & Portal Page",
      route: "/volunteer",
      titleKey: "volunteerTitle",
      subKey: "volunteerSubtitle",
    },
    {
      label: "4. Our Journey Trail Page",
      route: "/journey",
      titleKey: "journeyTitle",
      subKey: "journeySubtitle",
    },
    {
      label: "5. Our Impact Counters Page",
      route: "/impact",
      titleKey: "impactTitle",
      subKey: "impactSubtitle",
    },
    {
      label: "6. Our Team Page",
      route: "/team",
      titleKey: "teamTitle",
      subKey: "teamSubtitle",
    },
    {
      label: "7. Clothesline Gallery Page",
      route: "/gallery",
      titleKey: "galleryTitle",
      subKey: "gallerySubtitle",
    },
    {
      label: "8. Propose an Idea Mailbox Page",
      route: "/propose",
      titleKey: "proposeTitle",
      subKey: "proposeSubtitle",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="All Page Copy, Hero Sign & Site Settings"
        subtitle="Edit every single headline, hero sticker, marquee text, social link, counter, and footer detail without touching code"
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: "9px 22px", fontSize: "0.88rem" }}
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save All Settings"}</span>
          </button>
        }
      />

      <div style={{ padding: "32px", maxWidth: "1240px" }}>
        {savedMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "var(--ufy-purple-100)",
              border: "1.5px solid var(--ufy-purple-300)",
              color: "var(--ufy-purple-950)",
              borderRadius: "14px",
              padding: "14px 18px",
              marginBottom: "24px",
              fontSize: "0.92rem",
              fontWeight: 700,
            }}
          >
            <CheckCircle size={18} style={{ color: "var(--ufy-primary)" }} />
            <span>{savedMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* 1. Brand Identity & Navbar CTA */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <Globe size={20} style={{ color: "var(--ufy-primary)" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                Up for Youth Brand Identity, Logo &amp; Navbar Button
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div>
                <label className="form-label">Global Site Title (Browser Tab &amp; SEO)</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Brand Tagline (Next to UFY Logo)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Up for Youth"
                  value={settings.brandTagline || "Up for Youth"}
                  onChange={(e) => setSettings({ ...settings, brandTagline: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Custom Logo Image URL (Leave blank for UFY Cutout Wordmark)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="/uploads/ufy-logo.png"
                  value={settings.logoUrl || ""}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Meta Description (Google &amp; Social Link Preview)</label>
              <textarea
                rows={2}
                className="form-textarea"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "16px", alignItems: "end" }}>
              <div>
                <label className="form-label">Navbar Primary CTA Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.primaryCtaLabel}
                  onChange={(e) => setSettings({ ...settings, primaryCtaLabel: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Navbar Primary CTA Destination URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.primaryCtaUrl}
                  onChange={(e) => setSettings({ ...settings, primaryCtaUrl: e.target.value })}
                />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px", fontWeight: 700, fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={settings.primaryCtaVisible}
                  onChange={(e) => setSettings({ ...settings, primaryCtaVisible: e.target.checked })}
                  style={{ width: "18px", height: "18px", accentColor: "var(--ufy-primary)" }}
                />
                <span>Show CTA</span>
              </label>
            </div>
          </div>

          {/* 2. Homepage Edge-to-Edge Auto-Scrolling UFY Sign & Hero Stickers */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-200)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <Award size={20} style={{ color: "var(--ufy-primary)" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                Homepage Hero, Edge-to-Edge Auto-Scrolling Sign &amp; Stickers
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div>
                <label className="form-label">Hero Top Eyebrow Pill</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.heroEyebrow || "UFY · Up for Youth"}
                  onChange={(e) => setSettings({ ...settings, heroEyebrow: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Edge-to-Edge Auto-Scrolling Sign Wordmark</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ufy"
                  value={settings.heroMarqueeText || "ufy"}
                  onChange={(e) => setSettings({ ...settings, heroMarqueeText: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Impact Section Banner Callout</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.impactBannerText || ""}
                  onChange={(e) => setSettings({ ...settings, impactBannerText: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "16px" }}>
              <div>
                <label className="form-label">Hero Sticker #1 (Left Tilted Pill)</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.heroSticker1 || "by youth, for youth"}
                  onChange={(e) => setSettings({ ...settings, heroSticker1: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Hero Sticker #2 (Center Action Pill)</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.heroSticker2 || "volunteer with ufy →"}
                  onChange={(e) => setSettings({ ...settings, heroSticker2: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Hero Sticker #2 Link URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.heroSticker2Url || "/volunteer"}
                  onChange={(e) => setSettings({ ...settings, heroSticker2Url: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Hero Sticker #3 (Right Dark Pill)</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.heroSticker3 || "100% community powered"}
                  onChange={(e) => setSettings({ ...settings, heroSticker3: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 3. Educational Videos Counter & Virtual Letter Credit Rules */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-200)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <Settings size={20} style={{ color: "var(--ufy-primary)" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                Live &ldquo;People Educated&rdquo; Counter &amp; Volunteer Letter Hours Rules
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div>
                <label className="form-label">Live &ldquo;People Educated&rdquo; Counter</label>
                <input
                  type="number"
                  min={0}
                  className="form-input"
                  value={settings.videosEducatedCount ?? 0}
                  onChange={(e) =>
                    setSettings({ ...settings, videosEducatedCount: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="form-label">Default Video Grid Columns</label>
                <select
                  className="form-select"
                  value={settings.videosGridColumns ?? 3}
                  onChange={(e) =>
                    setSettings({ ...settings, videosGridColumns: Number(e.target.value) })
                  }
                >
                  <option value={3}>3 Videos per Row (Tabular Grid)</option>
                  <option value={2}>2 Videos per Row (Wide Cinema Cards)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Verified Hours per Virtual Letter</label>
                <input
                  type="number"
                  step="0.05"
                  min={0}
                  max={5}
                  className="form-input"
                  value={settings.hoursPerLetter ?? 0.25}
                  onChange={(e) =>
                    setSettings({ ...settings, hoursPerLetter: Number(e.target.value) })
                  }
                />
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  paddingTop: "24px",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.autoApproveLetters ?? true}
                  onChange={(e) =>
                    setSettings({ ...settings, autoApproveLetters: e.target.checked })
                  }
                  style={{ width: "18px", height: "18px", accentColor: "var(--ufy-primary)" }}
                />
                <span>Auto-publish public envelopes onto wall (hours still require admin verify)</span>
              </label>
            </div>
          </div>

          {/* 4. All 8 Public Page Headings & Subtitles */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-200)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "6px" }}>
              All 8 Public Page Titles &amp; Subtitles
            </h3>
            <p style={{ fontSize: "0.86rem", color: "var(--ufy-purple-700)", marginBottom: "20px" }}>
              Customize the headline and intro subtitle displayed at the top of every page on the website.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "16px" }}>
              {pageConfigs.map((cfg) => (
                <div
                  key={cfg.route}
                  style={{
                    padding: "16px",
                    backgroundColor: "var(--ufy-purple-25)",
                    borderRadius: "14px",
                    border: "1px solid var(--ufy-purple-100)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--ufy-primary)" }}>
                      {cfg.label}
                    </h4>
                    <code style={{ fontSize: "0.78rem", color: "var(--ufy-purple-700)" }}>{cfg.route}</code>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                      <label className="form-label" style={{ fontSize: "0.78rem" }}>Page Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(settings[cfg.titleKey] as string) || ""}
                        onChange={(e) => setSettings({ ...settings, [cfg.titleKey]: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: "0.78rem" }}>Page Subtitle</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(settings[cfg.subKey] as string) || ""}
                        onChange={(e) => setSettings({ ...settings, [cfg.subKey]: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Footer, Emails & Social Media */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <Share2 size={20} style={{ color: "var(--ufy-primary)" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                Mailbox Routing, Footer Mission &amp; Social Media Links
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label className="form-label">UFY Proposal Mailbox Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={settings.ufyInboxEmail || ""}
                  onChange={(e) => setSettings({ ...settings, ufyInboxEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Public Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={settings.contactEmail || ""}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Footer Location / Chapter Line</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.footerLocationText || ""}
                  onChange={(e) => setSettings({ ...settings, footerLocationText: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Footer Mission Statement</label>
              <textarea
                rows={2}
                className="form-textarea"
                value={settings.footerMissionText}
                onChange={(e) => setSettings({ ...settings, footerMissionText: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "16px" }}>
              <div>
                <label className="form-label">Instagram URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://instagram.com/..."
                  value={settings.socialInstagram || ""}
                  onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">YouTube Channel URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://youtube.com/@..."
                  value={settings.socialYoutube || ""}
                  onChange={(e) => setSettings({ ...settings, socialYoutube: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://linkedin.com/company/..."
                  value={settings.socialLinkedin || ""}
                  onChange={(e) => setSettings({ ...settings, socialLinkedin: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">X / Twitter URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://x.com/..."
                  value={settings.socialTwitter || ""}
                  onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="form-label">Copyright Line</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.copyrightText}
                  onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Youth Privacy Notice</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.privacyNotice}
                  onChange={(e) => setSettings({ ...settings, privacyNotice: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: "12px 28px" }}>
              <Save size={18} />
              <span>{saving ? "Saving Changes..." : "Save All Site Settings"}</span>
            </button>
          </div>
        </form>

        {/* Built-In Production Database Connection Reference */}
        <div
          style={{
            marginTop: "36px",
            backgroundColor: "#140529",
            color: "#ffffff",
            borderRadius: "22px",
            padding: "28px 32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <Database size={20} style={{ color: "#c084fc" }} />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff" }}>
              Connecting a Cloud Production Database (Supabase / Neon PostgreSQL)
            </h3>
          </div>
          <ol
            style={{
              fontSize: "0.86rem",
              lineHeight: 1.7,
              color: "#ebdffe",
              paddingLeft: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <li>
              <strong>Local Dev:</strong> Currently running out-of-the-box on SQLite (<code>DATABASE_URL=&quot;file:./dev.db&quot;</code>).
            </li>
            <li>
              <strong>Cloud PostgreSQL (Vercel / Railway / Netlify):</strong> Create a free Postgres project on <strong>Neon.tech</strong> or <strong>Supabase.com</strong> and copy your connection string.
            </li>
            <li>
              <strong>Switch Prisma Provider:</strong> In <code>prisma/schema.prisma</code>, change <code>provider = &quot;sqlite&quot;</code> to <code>provider = &quot;postgresql&quot;</code>, set <code>DATABASE_URL</code> + <code>JWT_SECRET</code> in your host&apos;s Environment Variables, and run <code>npx prisma db push &amp;&amp; npm run db:seed</code>!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
