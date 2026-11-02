"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Palette, RotateCcw, Save, CheckCircle } from "lucide-react";
import { ThemeSettingsData } from "@/lib/types";

export default function ThemeStudioPage() {
  const [theme, setTheme] = useState<ThemeSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const res = await fetch("/api/theme");
      const data = await res.json();
      if (data.theme) setTheme(data.theme);
    } catch {}
    setLoading(false);
  };

  const handleSave = async () => {
    if (!theme) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });
      if (res.ok) {
        setSaved(true);
        setMessage("All colors, fonts, marquee speed, and layout widths are now live across the public website!");
        setTimeout(() => setSaved(false), 3500);
      }
    } catch {
      setMessage("Failed to save theme settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    if (
      !confirm(
        "Reset all colors, fonts, and layout settings to the Up for Youth signature palette (#f7f4fc lilac, #7629f0 purple, 100% edge-to-edge)?"
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      const data = await res.json();
      if (data.theme) {
        setTheme(data.theme);
        setSaved(true);
        setMessage("Restored Up for Youth signature aesthetic defaults!");
        setTimeout(() => setSaved(false), 3500);
      }
    } catch {}
    setSaving(false);
  };

  if (loading || !theme) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
        Loading Aesthetic &amp; Color Studio...
      </div>
    );
  }

  const colorControls: Array<{
    key: keyof ThemeSettingsData;
    label: string;
    hint: string;
    fallback: string;
  }> = [
    {
      key: "bgColor",
      label: "Page Canvas Background",
      hint: "Dotted lilac canvas behind all pages",
      fallback: "#f7f4fc",
    },
    {
      key: "primaryColor",
      label: "Primary Brand Color",
      hint: "Buttons, cutout outlines, badges & wires",
      fallback: "#7629f0",
    },
    {
      key: "accentColor",
      label: "Bright Accent Color",
      hint: "Marquee highlights, trails & hover states",
      fallback: "#8e48ff",
    },
    {
      key: "darkColor",
      label: "Primary Ink / Heading Color",
      hint: "Headings, card borders & shadows",
      fallback: "#140529",
    },
    {
      key: "cardBgColor",
      label: "Card & Polaroid Surface",
      hint: "Background of cards, modals & frames",
      fallback: "#ffffff",
    },
    {
      key: "footerBgColor",
      label: "Footer Background",
      hint: "Full-bleed footer surface color",
      fallback: "#140529",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Colors, Fonts & Aesthetic Studio"
        subtitle="Customize every color, typeface, marquee speed, polaroid filter, and edge-to-edge width across Up for Youth"
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={handleRestore}
              className="btn btn-outline-purple"
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              <RotateCcw size={15} />
              <span>Restore UFY Palette</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
              style={{ padding: "8px 20px", fontSize: "0.85rem" }}
            >
              {saved ? (
                <>
                  <CheckCircle size={15} />
                  <span>Saved Live!</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>{saving ? "Saving..." : "Save Aesthetic"}</span>
                </>
              )}
            </button>
          </div>
        }
      />

      <div style={{ padding: "32px" }}>
        {message && (
          <div
            style={{
              backgroundColor: "var(--ufy-purple-100)",
              border: "1.5px solid var(--ufy-purple-300)",
              color: "var(--ufy-purple-950)",
              borderRadius: "14px",
              padding: "14px 20px",
              marginBottom: "24px",
              fontSize: "0.92rem",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* Full Global Color Palette Pickers */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--ufy-purple-100)",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "28px",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <Palette size={20} style={{ color: "var(--ufy-primary)" }} />
            <h2 style={{ fontSize: "1.22rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              Global Color Palette Controls
            </h2>
          </div>
          <p style={{ fontSize: "0.86rem", color: "var(--ufy-purple-700)", marginBottom: "22px" }}>
            Click any swatch or enter a HEX value to recolor the entire Up for Youth website instantaneously via CSS variables.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
            }}
          >
            {colorControls.map((ctrl) => {
              const currentVal = (theme[ctrl.key] as string) || ctrl.fallback;
              return (
                <div
                  key={ctrl.key}
                  style={{
                    border: "1.5px solid var(--ufy-purple-100)",
                    borderRadius: "16px",
                    padding: "16px",
                    backgroundColor: "var(--ufy-purple-25)",
                  }}
                >
                  <label className="form-label" style={{ marginBottom: "2px" }}>
                    {ctrl.label}
                  </label>
                  <p style={{ fontSize: "0.76rem", color: "var(--ufy-purple-700)", marginBottom: "10px" }}>
                    {ctrl.hint}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="color"
                      value={currentVal}
                      onChange={(e) => setTheme({ ...theme, [ctrl.key]: e.target.value })}
                      style={{
                        width: "44px",
                        height: "42px",
                        borderRadius: "10px",
                        border: "1.5px solid #cbd5e1",
                        cursor: "pointer",
                        padding: "2px",
                        backgroundColor: "#ffffff",
                      }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={currentVal}
                      onChange={(e) => setTheme({ ...theme, [ctrl.key]: e.target.value })}
                      style={{ fontFamily: "monospace", fontWeight: 700 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
            gap: "28px",
          }}
        >
          {/* Typography Panel */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              Typography &amp; Type Scale
            </h2>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Display / Headline Font</label>
              <select
                className="form-select"
                value={theme.headingFont}
                onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (UFY Signature Geometric)</option>
                <option value="Space Grotesk">Space Grotesk (Editorial &amp; Expressive)</option>
                <option value="Outfit">Outfit (Clean &amp; Rounded)</option>
                <option value="Syne">Syne (Bold &amp; Avant-Garde)</option>
                <option value="Inter">Inter (Crisp Neo-Grotesque)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Body Text Font</label>
              <select
                className="form-select"
                value={theme.bodyFont}
                onChange={(e) => setTheme({ ...theme, bodyFont: e.target.value })}
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Warm &amp; Cohesive)</option>
                <option value="Inter">Inter (Ultra-Crisp Reading)</option>
                <option value="Outfit">Outfit (Friendly &amp; Clean)</option>
                <option value="Space Grotesk">Space Grotesk (Playful Editorial)</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label className="form-label">Headline Letter Spacing</label>
                <select
                  className="form-select"
                  value={theme.headingLetterSpacing || "-0.03em"}
                  onChange={(e) => setTheme({ ...theme, headingLetterSpacing: e.target.value })}
                >
                  <option value="-0.04em">Super Tight (-0.04em)</option>
                  <option value="-0.03em">UFY Signature (-0.03em)</option>
                  <option value="-0.02em">Editorial Crisp (-0.02em)</option>
                  <option value="0em">Normal (0em)</option>
                  <option value="0.03em">Wide (+0.03em)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Type Scale</label>
                <select
                  className="form-select"
                  value={theme.typeScale}
                  onChange={(e) => setTheme({ ...theme, typeScale: e.target.value })}
                >
                  <option value="expressive">Expressive (Bold Display)</option>
                  <option value="balanced">Balanced (Standard)</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
            </div>
          </div>

          {/* Layout Width, Marquee Speed & Polaroid Treatments */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              Edge-to-Edge Layout, Motion &amp; Polaroids
            </h2>

            <div>
              <label className="form-label">Site Container Max Width</label>
              <select
                className="form-select"
                value={theme.containerMaxWidth}
                onChange={(e) => setTheme({ ...theme, containerMaxWidth: e.target.value })}
              >
                <option value="100%">100% — True Edge-to-Edge Full Span (Recommended)</option>
                <option value="1680px">1680px — Ultra-Wide Studio Canvas</option>
                <option value="1440px">1440px — Wide Editorial</option>
                <option value="1280px">1280px — Framed Container</option>
              </select>
            </div>

            <div>
              <label className="form-label">Button Corner Radius</label>
              <select
                className="form-select"
                value={theme.buttonRadius}
                onChange={(e) => setTheme({ ...theme, buttonRadius: e.target.value })}
              >
                <option value="9999px">9999px (Full Pill — UFY Signature)</option>
                <option value="16px">16px (Rounded Soft)</option>
                <option value="10px">10px (Architectural)</option>
                <option value="0px">0px (Sharp Brutalist)</option>
              </select>
            </div>

            <div>
              <label
                className="form-label"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>Hero Auto-Scroll Sign Speed (Seconds per Loop)</span>
                <span style={{ color: "var(--ufy-primary)", fontFamily: "monospace" }}>
                  {theme.marqueeSpeed ?? 28}s
                </span>
              </label>
              <input
                type="range"
                min={10}
                max={60}
                step={2}
                value={theme.marqueeSpeed ?? 28}
                onChange={(e) => setTheme({ ...theme, marqueeSpeed: Number(e.target.value) })}
                style={{ width: "100%", accentColor: "var(--ufy-primary)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}>
                <span>10s (Fast Energetic)</span>
                <span>60s (Calm Drift)</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: "14px",
                backgroundColor: "var(--ufy-purple-25)",
                border: "1px solid var(--ufy-purple-100)",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ufy-purple-950)" }}>
                  Artistic Purple Duotone on Leader Polaroids
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--ufy-purple-700)" }}>
                  Toggle between Readymag purple duotone portraits or full natural color photos
                </div>
              </div>
              <input
                type="checkbox"
                checked={theme.enableDuotone ?? true}
                onChange={(e) => setTheme({ ...theme, enableDuotone: e.target.checked })}
                style={{ width: "20px", height: "20px", accentColor: "var(--ufy-primary)", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        {/* Live Interactive Preview Strip */}
        <div
          style={{
            marginTop: "28px",
            padding: "32px",
            borderRadius: "24px",
            backgroundColor: theme.bgColor || "#f7f4fc",
            border: `2px dashed ${theme.primaryColor || "#7629f0"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Palette size={16} style={{ color: theme.primaryColor || "#7629f0" }} />
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: theme.primaryColor || "#7629f0",
              }}
            >
              Live Aesthetic Preview
            </span>
          </div>

          <div
            style={{
              backgroundColor: theme.cardBgColor || "#ffffff",
              borderRadius: "22px",
              padding: "28px",
              border: `2px solid ${theme.darkColor || "#140529"}`,
              boxShadow: `6px 8px 0px ${theme.darkColor || "#140529"}`,
            }}
          >
            <h3
              style={{
                fontFamily: theme.headingFont,
                letterSpacing: theme.headingLetterSpacing || "-0.03em",
                fontSize: "2rem",
                fontWeight: 900,
                color: theme.darkColor || "#140529",
                marginBottom: "8px",
              }}
            >
              Up for Youth — Compassion in Motion.
            </h3>
            <p
              style={{
                fontFamily: theme.bodyFont,
                fontSize: "0.98rem",
                color: theme.darkColor || "#140529",
                opacity: 0.82,
                marginBottom: "18px",
                maxWidth: "700px",
              }}
            >
              Every hue, typeface, container width, and button curve you adjust above updates the entire public website dynamically.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <span
                style={{
                  backgroundColor: theme.primaryColor || "#7629f0",
                  color: "#ffffff",
                  padding: "10px 22px",
                  borderRadius: theme.buttonRadius || "9999px",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                }}
              >
                Primary CTA Preview
              </span>
              <span
                style={{
                  backgroundColor: "transparent",
                  color: theme.primaryColor || "#7629f0",
                  border: `2px solid ${theme.primaryColor || "#7629f0"}`,
                  padding: "8px 20px",
                  borderRadius: theme.buttonRadius || "9999px",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                }}
              >
                Secondary Outline Preview
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
