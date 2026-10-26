"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Layers, Save, Eye, EyeOff, CheckCircle } from "lucide-react";
import { PageSectionData } from "@/lib/types";

export default function PageSectionsPage() {
  const [sections, setSections] = useState<PageSectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/sections");
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
      }
    } catch {}
    setLoading(false);
  };

  const handleUpdate = (id: string, field: keyof PageSectionData, value: any) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSaveSection = async (section: PageSectionData) => {
    setSavingId(section.id);
    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      if (res.ok) {
        setSavedId(section.id);
        setTimeout(() => setSavedId(null), 3000);
      }
    } catch {}
    setSavingId(null);
  };

  return (
    <div>
      <AdminHeader
        title="Page Sections Manager"
        subtitle="Configure content, background treatments, and layouts for every website component"
      />

      <div style={{ padding: "32px", maxWidth: "1100px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
            Loading sections...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {sections.map((section, idx) => (
              <div
                key={section.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid var(--ufy-purple-100)",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                {/* Section Top Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    borderBottom: "1px solid var(--ufy-purple-50)",
                    paddingBottom: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        backgroundColor: "var(--ufy-primary)",
                        color: "#ffffff",
                        padding: "3px 10px",
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      #{idx + 1} • {section.sectionKey}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--ufy-purple-700)", fontWeight: 600 }}>
                      Display Order: {section.displayOrder}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => handleUpdate(section.id, "isVisible", !section.isVisible)}
                      className={`btn ${section.isVisible ? "btn-outline-purple" : "btn-white"}`}
                      style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                    >
                      {section.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>{section.isVisible ? "Published" : "Hidden"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveSection(section)}
                      disabled={savingId === section.id}
                      className="btn btn-primary"
                      style={{ padding: "7px 18px", fontSize: "0.85rem" }}
                    >
                      {savedId === section.id ? (
                        <>
                          <CheckCircle size={15} />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save size={15} />
                          <span>{savingId === section.id ? "Saving..." : "Save Section"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Heading / Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={section.title}
                      onChange={(e) => handleUpdate(section.id, "title", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Background Treatment</label>
                    <select
                      className="form-select"
                      value={section.backgroundMode}
                      onChange={(e) => handleUpdate(section.id, "backgroundMode", e.target.value)}
                    >
                      <option value="white">Pure White (#ffffff)</option>
                      <option value="purple">Saturated UFY Purple (#7629f0)</option>
                      <option value="subtle-tint">Subtle Purple Tint (#f8f4fe)</option>
                      <option value="dark-purple">Deep Purple (#140529)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subtitle / Eyebrow Text</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    value={section.subtitle || ""}
                    onChange={(e) => handleUpdate(section.id, "subtitle", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Content JSON (Component Highlights, Custom Keys, Action URLs)</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                    value={section.contentJson}
                    onChange={(e) => handleUpdate(section.id, "contentJson", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
