"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Settings, CheckSquare, Square, ShieldCheck, Save, CheckCircle, Sparkles, HelpCircle } from "lucide-react";
import { SiteSettingsData } from "@/lib/types";

export default function SiteSettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // 9-Step Launch Checklist state (stored in localStorage for owner convenience)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: true, // Brand identity confirmed
    2: true, // Photographs/media ready
    3: true, // 6 Team members entered
    4: true, // Programs configured
    5: true, // Home page reviewed
    6: true, // Privacy notice configured
    7: true, // Idea submission tested
    8: true, // Analytics tracking verified
    9: false, // Final launch sign-off
  });

  useEffect(() => {
    fetchSettings();
    try {
      const stored = localStorage.getItem("ufy_checklist");
      if (stored) setCompletedSteps(JSON.parse(stored));
    } catch {}
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch {}
    setLoading(false);
  };

  const handleToggleStep = (stepNumber: number) => {
    const updated = { ...completedSteps, [stepNumber]: !completedSteps[stepNumber] };
    setCompletedSteps(updated);
    try {
      localStorage.setItem("ufy_checklist", JSON.stringify(updated));
    } catch {}
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
        setSavedMessage("Site configuration saved successfully!");
        setTimeout(() => setSavedMessage(null), 3500);
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

  const checklistItems = [
    { id: 1, title: "1. Confirm organization name & visual identity", desc: "UFY brand colors strictly set to #7629f0 and #ffffff with custom typography." },
    { id: 2, title: "2. Upload genuine UFY photographs & assets", desc: "Upload team portraits, workshop cards, and Little Library documentation." },
    { id: 3, title: "3. Enter verified team-member details", desc: "Verify names, roles, bios, and pronouns for the youth facilitators." },
    { id: 4, title: "4. Configure existing initiatives & workshops", desc: "Set up First Aid workshops, Little Libraries, and educational card series." },
    { id: 5, title: "5. Review the home page canvas", desc: "Check responsive layout across desktop, tablet, and mobile in Visual Builder." },
    { id: 6, title: "6. Configure contact & youth privacy statements", desc: "Ensure data minimization warnings and confidential email policies are active." },
    { id: 7, title: "7. Test the idea-submission workflow", desc: "Submit a proposal through the public form and verify it arrives in the inbox." },
    { id: 8, title: "8. Review publishing & analytics tracking", desc: "Confirm real pageview events and conversion metrics are reporting accurately." },
    { id: 9, title: "9. Complete launch sign-off", desc: "Publish latest revision and celebrate official public release!" },
  ];

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div>
      <AdminHeader
        title="Site Settings & Launch Checklist"
        subtitle="Manage global metadata, SEO defaults, accessibility options, and launch milestones"
      />

      <div style={{ padding: "32px", maxWidth: "1150px" }}>
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
              fontWeight: 600,
            }}
          >
            <CheckCircle size={18} style={{ color: "var(--ufy-primary)" }} />
            <span>{savedMessage}</span>
          </div>
        )}

        {/* 9-Step Launch Checklist Section */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--ufy-purple-100)",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "36px",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <Sparkles size={20} style={{ color: "var(--ufy-primary)" }} />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                  First-Time Administrator Launch Checklist
                </h2>
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--ufy-purple-700)" }}>
                Follow these 9 milestones to ensure production readiness and authentic content presentation.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "var(--ufy-purple-50)",
                border: "1px solid var(--ufy-purple-200)",
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--ufy-primary)",
              }}
            >
              {completedCount} of 9 Milestones Complete
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {checklistItems.map((item) => {
              const isDone = completedSteps[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleStep(item.id)}
                  style={{
                    backgroundColor: isDone ? "var(--ufy-purple-25)" : "#ffffff",
                    border: isDone ? "1.5px solid var(--ufy-purple-300)" : "1.5px solid var(--ufy-purple-100)",
                    borderRadius: "14px",
                    padding: "16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      color: isDone ? "var(--ufy-primary)" : "var(--ufy-purple-300)",
                      marginTop: "2px",
                    }}
                  >
                    {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>

                  <div>
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: isDone ? "var(--ufy-purple-950)" : "var(--ufy-purple-800)",
                        textDecoration: isDone ? "line-through" : "none",
                        opacity: isDone ? 0.8 : 1,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--ufy-purple-700)", marginTop: "2px" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Metadata & Accessibility Settings Form */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "32px",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "20px" }}>
              Search Engine Optimization (SEO) & Metadata
            </h3>

            <div className="form-group">
              <label className="form-label">Global Website Title</label>
              <input
                type="text"
                className="form-input"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meta Description (Shown in Google & Social Previews)</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "32px",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "20px" }}>
              Accessibility & Experience Controls
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                backgroundColor: "var(--ufy-purple-25)",
                borderRadius: "14px",
                border: "1px solid var(--ufy-purple-100)",
              }}
            >
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                  Prefer Reduced Motion by Default
                </h4>
                <p style={{ fontSize: "0.82rem", color: "var(--ufy-purple-700)" }}>
                  Honors visitors with vestibular sensitivities by softening animations site-wide
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.enableReducedMotion}
                onChange={(e) => setSettings({ ...settings, enableReducedMotion: e.target.checked })}
                style={{ width: "20px", height: "20px", accentColor: "var(--ufy-primary)" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: "12px 28px" }}>
              <Save size={18} />
              <span>{saving ? "Saving Changes..." : "Save Site Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
