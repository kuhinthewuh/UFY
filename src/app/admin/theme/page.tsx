"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Palette, RotateCcw, Save, CheckCircle, Sparkles } from "lucide-react";
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
      const data = await res.json();
      if (res.ok) {
        setSaved(true);
        setMessage("Theme settings saved! Published website reflects the new typography & styles.");
        setTimeout(() => setSaved(false), 3500);
      }
    } catch {
      setMessage("Failed to save theme settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm("Are you sure you want to reset all typography and theme styles to original UFY brand defaults?")) {
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
        setMessage("Restored original UFY brand defaults successfully!");
        setTimeout(() => setSaved(false), 3500);
      }
    } catch {}
    setSaving(false);
  };

  if (loading || !theme) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
        Loading theme studio...
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Typography & Theme Studio"
        subtitle="Control headline and body fonts, button radii, type scales, and brand presentation"
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={handleRestore}
              className="btn btn-outline-purple"
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              <RotateCcw size={15} />
              <span>Restore UFY Brand</span>
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
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>{saving ? "Saving..." : "Save Theme"}</span>
                </>
              )}
            </button>
          </div>
        }
      />

      <div style={{ padding: "32px", maxWidth: "1100px" }}>
        {message && (
          <div
            style={{
              backgroundColor: "var(--ufy-purple-100)",
              border: "1.5px solid var(--ufy-purple-300)",
              color: "var(--ufy-purple-950)",
              borderRadius: "14px",
              padding: "14px 20px",
              marginBottom: "28px",
              fontSize: "0.92rem",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* Brand Constraint Alert */}
        <div
          style={{
            backgroundColor: "var(--ufy-purple-50)",
            border: "1.5px solid var(--ufy-purple-200)",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--ufy-primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
              Strict Brand Color Palette Enforced
            </h4>
            <p style={{ fontSize: "0.88rem", color: "var(--ufy-purple-800)", marginTop: "2px" }}>
              Primary: <strong>#7629f0 (UFY Purple)</strong> • Secondary: <strong>#ffffff (White)</strong>.
              Arbitrary colors are restricted to maintain brand integrity and high visual prestige.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }} className="theme-grid">
          {/* Typography Panel */}
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
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              Typography System
            </h2>

            <div className="form-group">
              <label className="form-label">Display / Headline Font</label>
              <select
                className="form-select"
                value={theme.headingFont}
                onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}
              >
                <option value="Space Grotesk">Space Grotesk (Editorial & Expressive)</option>
                <option value="Syne">Syne (Bold, Geometric & Sculptural)</option>
                <option value="Outfit">Outfit (Clean, Modern & Friendly)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Contemporary Agency)</option>
                <option value="Inter">Inter (Functional & Ultra-Crisp)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Body Text Font</label>
              <select
                className="form-select"
                value={theme.bodyFont}
                onChange={(e) => setTheme({ ...theme, bodyFont: e.target.value })}
              >
                <option value="Inter">Inter (Recommended for High Readability)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Warm & Approachable)</option>
                <option value="Space Grotesk">Space Grotesk (Playful Tech)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Type Scale Multiplier</label>
              <select
                className="form-select"
                value={theme.typeScale}
                onChange={(e) => setTheme({ ...theme, typeScale: e.target.value })}
              >
                <option value="compact">Compact (Slightly Smaller Headings)</option>
                <option value="balanced">Balanced (Standard Proportions)</option>
                <option value="expressive">Expressive (Striking, Impactful Titles)</option>
              </select>
            </div>

            {/* Typography Live Preview */}
            <div
              style={{
                marginTop: "12px",
                padding: "20px",
                backgroundColor: "var(--ufy-purple-25)",
                border: "1px dashed var(--ufy-purple-200)",
                borderRadius: "14px",
              }}
            >
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ufy-primary)", textTransform: "uppercase" }}>
                Typography Preview
              </span>
              <h3 style={{ fontFamily: theme.headingFont, fontSize: "1.5rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginTop: "6px" }}>
                Youth Action. Real Knowledge.
              </h3>
              <p style={{ fontFamily: theme.bodyFont, fontSize: "0.92rem", color: "var(--ufy-purple-800)", marginTop: "6px", lineHeight: 1.5 }}>
                UFY equips young people with hands-on first-aid workshops and community mini-libraries.
              </p>
            </div>
          </div>

          {/* Component & UI Controls */}
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
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              UI & Component Styling
            </h2>

            <div className="form-group">
              <label className="form-label">Button Corner Radius</label>
              <select
                className="form-select"
                value={theme.buttonRadius}
                onChange={(e) => setTheme({ ...theme, buttonRadius: e.target.value })}
              >
                <option value="0px">0px (Sharp Brutalist Edges)</option>
                <option value="8px">8px (Subtle Rounded)</option>
                <option value="14px">14px (Recommended UFY Default)</option>
                <option value="24px">24px (Pronounced Rounded)</option>
                <option value="9999px">9999px (Full Pill)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Button Presentation Style</label>
              <select
                className="form-select"
                value={theme.buttonStyle}
                onChange={(e) => setTheme({ ...theme, buttonStyle: e.target.value })}
              >
                <option value="solid">Solid Saturated Purple</option>
                <option value="outline">Architectural Outline</option>
                <option value="soft">Soft Tinted Purple</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Container Max Width</label>
              <select
                className="form-select"
                value={theme.containerMaxWidth}
                onChange={(e) => setTheme({ ...theme, containerMaxWidth: e.target.value })}
              >
                <option value="1140px">1140px (Compact)</option>
                <option value="1240px">1240px (Standard UFY Spacing)</option>
                <option value="1360px">1360px (Expansive Canvas)</option>
              </select>
            </div>

            {/* Button Preview */}
            <div
              style={{
                marginTop: "12px",
                padding: "20px",
                backgroundColor: "var(--ufy-purple-25)",
                border: "1px dashed var(--ufy-purple-200)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <button
                className="btn btn-primary"
                style={{ borderRadius: theme.buttonRadius }}
              >
                Primary Button
              </button>
              <button
                className="btn btn-outline-purple"
                style={{ borderRadius: theme.buttonRadius }}
              >
                Outline Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

