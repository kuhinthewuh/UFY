"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Copy,
  Trash2,
  Plus,
  Undo2,
  Redo2,
  Save,
  CheckCircle,
  Settings,
  Sparkles,
} from "lucide-react";
import { PageSectionData } from "@/lib/types";

export default function VisualEditorPage() {
  const [sections, setSections] = useState<PageSectionData[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<PageSectionData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Fetch sections from API
  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/sections");
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
        setHistory([data.sections]);
        setHistoryIndex(0);
        if (data.sections.length > 0 && !selectedSectionId) {
          setSelectedSectionId(data.sections[0].id);
        }
      }
    } catch {}
    setLoading(false);
  };

  const pushHistory = (newSections: PageSectionData[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newSections);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setSections(newSections);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  // Reorder Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...sections];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    pushHistory(reordered);
  };

  // Reorder Down
  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const reordered = [...sections];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    pushHistory(reordered);
  };

  // Toggle Visibility
  const handleToggleVisibility = (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s));
    pushHistory(updated);
  };

  // Duplicate Section
  const handleDuplicate = (sectionToDup: PageSectionData) => {
    const newSection: PageSectionData = {
      ...sectionToDup,
      id: "temp-" + Date.now(),
      sectionKey: `${sectionToDup.sectionKey}-copy-${Date.now().toString(36).slice(-4)}`,
      title: `${sectionToDup.title} (Copy)`,
      displayOrder: sections.length + 1,
    };
    const updated = [...sections, newSection];
    pushHistory(updated);
    setSelectedSectionId(newSection.id);
  };

  // Delete Section
  const handleDelete = (id: string) => {
    if (sections.length <= 1) {
      alert("At least one section must remain on the page.");
      return;
    }
    const updated = sections.filter((s) => s.id !== id);
    pushHistory(updated);
    if (selectedSectionId === id) {
      setSelectedSectionId(updated[0]?.id || null);
    }
  };

  // Add New Custom Section
  const handleAddSection = () => {
    const key = `custom-${Date.now().toString(36).slice(-4)}`;
    const newSection: PageSectionData = {
      id: "temp-" + Date.now(),
      sectionKey: key,
      title: "New Community Section",
      subtitle: "Add an engaging subtitle or description here",
      contentJson: JSON.stringify({
        heading: "New Section",
        text: "Custom youth activity or workshop content block.",
      }),
      layoutVariation: "default",
      displayOrder: sections.length + 1,
      isVisible: true,
      backgroundMode: "white",
      updatedAt: new Date().toISOString(),
    };
    const updated = [...sections, newSection];
    pushHistory(updated);
    setSelectedSectionId(newSection.id);
  };

  // Update selected section property
  const handleUpdateSelected = (field: keyof PageSectionData, val: any) => {
    if (!selectedSectionId) return;
    const updated = sections.map((s) => (s.id === selectedSectionId ? { ...s, [field]: val } : s));
    pushHistory(updated);
  };

  // Save changes to persistent database
  const handleSaveDraft = async () => {
    setSaving(true);
    setSavedMessage(null);
    try {
      // 1. Reorder IDs
      await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          orderedIds: sections.map((s) => s.id),
        }),
      });

      // 2. Persist each section's properties
      for (const s of sections) {
        if (s.id.startsWith("temp-")) {
          // create in DB
          await fetch("/api/sections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(s),
          });
        } else {
          // update in DB
          await fetch(`/api/sections/${s.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(s),
          });
        }
      }

      setSavedMessage("All visual builder changes saved to database!");
      setTimeout(() => setSavedMessage(null), 3500);
      fetchSections();
    } catch {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // Canvas viewport width
  const canvasWidth = viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "390px";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <AdminHeader
        title="Visual Website Builder"
        subtitle="Live canvas with 3-panel component control, drag-and-drop & instant viewport previews"
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo change"
              className="btn btn-outline-purple"
              style={{ padding: "8px 12px", opacity: historyIndex <= 0 ? 0.4 : 1 }}
            >
              <Undo2 size={16} />
            </button>

            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo change"
              className="btn btn-outline-purple"
              style={{ padding: "8px 12px", opacity: historyIndex >= history.length - 1 ? 0.4 : 1 }}
            >
              <Redo2 size={16} />
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="btn btn-primary"
              style={{ padding: "9px 18px", fontSize: "0.88rem" }}
            >
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Canvas"}</span>
            </button>
          </div>
        }
      />

      {savedMessage && (
        <div
          style={{
            backgroundColor: "var(--ufy-purple-100)",
            color: "var(--ufy-purple-950)",
            borderBottom: "1px solid var(--ufy-purple-300)",
            padding: "10px 32px",
            fontSize: "0.88rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle size={16} style={{ color: "var(--ufy-primary)" }} />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* 3-Panel Workspace */}
      <div style={{ display: "flex", flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
        {/* PANEL 1: Left Library & Section Ordering */}
        <div
          style={{
            width: "310px",
            backgroundColor: "#ffffff",
            borderRight: "1px solid var(--ufy-purple-100)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--ufy-purple-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              Page Sections ({sections.length})
            </span>
            <button
              onClick={handleAddSection}
              className="btn btn-outline-purple"
              style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "8px" }}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          <div style={{ flexGrow: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {sections.map((section, idx) => {
              const isSelected = section.id === selectedSectionId;
              return (
                <div
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  style={{
                    backgroundColor: isSelected ? "var(--ufy-purple-50)" : "#ffffff",
                    border: isSelected ? "2px solid var(--ufy-primary)" : "1px solid var(--ufy-purple-100)",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--ufy-primary)" }}>
                      #{idx + 1} • {section.sectionKey}
                    </span>

                    {/* Quick Section Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleVisibility(section.id)}
                        title={section.isVisible ? "Hide section" : "Show section"}
                        style={{ padding: "4px", color: section.isVisible ? "var(--ufy-primary)" : "var(--ufy-purple-300)" }}
                      >
                        {section.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        title="Move Up"
                        style={{ padding: "4px", color: idx === 0 ? "#ccc" : "var(--ufy-purple-700)" }}
                      >
                        <MoveUp size={15} />
                      </button>

                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === sections.length - 1}
                        title="Move Down"
                        style={{ padding: "4px", color: idx === sections.length - 1 ? "#ccc" : "var(--ufy-purple-700)" }}
                      >
                        <MoveDown size={15} />
                      </button>

                      <button
                        onClick={() => handleDuplicate(section)}
                        title="Duplicate"
                        style={{ padding: "4px", color: "var(--ufy-purple-700)" }}
                      >
                        <Copy size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(section.id)}
                        title="Delete"
                        style={{ padding: "4px", color: "var(--ufy-primary)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                    {section.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: Center Live Canvas & Viewport Switcher */}
        <div
          style={{
            flexGrow: 1,
            backgroundColor: "var(--ufy-purple-50)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Viewport Toolbar */}
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "#ffffff",
              borderBottom: "1px solid var(--ufy-purple-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => setViewport("desktop")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  backgroundColor: viewport === "desktop" ? "var(--ufy-purple-100)" : "transparent",
                  color: viewport === "desktop" ? "var(--ufy-purple-950)" : "var(--ufy-purple-700)",
                }}
              >
                <Monitor size={16} />
                <span>Desktop (1240px)</span>
              </button>

              <button
                onClick={() => setViewport("tablet")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  backgroundColor: viewport === "tablet" ? "var(--ufy-purple-100)" : "transparent",
                  color: viewport === "tablet" ? "var(--ufy-purple-950)" : "var(--ufy-purple-700)",
                }}
              >
                <Tablet size={16} />
                <span>Tablet (768px)</span>
              </button>

              <button
                onClick={() => setViewport("mobile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  backgroundColor: viewport === "mobile" ? "var(--ufy-purple-100)" : "transparent",
                  color: viewport === "mobile" ? "var(--ufy-purple-950)" : "var(--ufy-purple-700)",
                }}
              >
                <Smartphone size={16} />
                <span>Mobile (390px)</span>
              </button>
            </div>

            <span style={{ fontSize: "0.82rem", color: "var(--ufy-purple-700)", fontWeight: 500 }}>
              Live interactive page canvas • Click any block to inspect
            </span>
          </div>

          {/* Canvas Scroll Area */}
          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: canvasWidth,
                backgroundColor: "#ffffff",
                boxShadow: "0 12px 40px rgba(118, 41, 240, 0.12)",
                borderRadius: viewport === "desktop" ? "8px" : "18px",
                overflow: "hidden",
                border: "1.5px solid var(--ufy-purple-200)",
                transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {sections.map((section, idx) => {
                const isSelected = section.id === selectedSectionId;
                const isPurple = section.backgroundMode === "purple" || section.backgroundMode === "dark-purple";

                return (
                  <div
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    style={{
                      position: "relative",
                      padding: "48px 36px",
                      backgroundColor: isPurple
                        ? "var(--ufy-primary)"
                        : section.backgroundMode === "subtle-tint"
                        ? "var(--ufy-purple-50)"
                        : "#ffffff",
                      color: isPurple ? "#ffffff" : "var(--ufy-purple-950)",
                      outline: isSelected ? "3px solid var(--ufy-primary)" : "none",
                      outlineOffset: "-3px",
                      opacity: section.isVisible ? 1 : 0.45,
                      cursor: "pointer",
                      transition: "outline 0.15s ease",
                    }}
                  >
                    {/* Selected Indicator Pill */}
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "16px",
                          backgroundColor: "#ffffff",
                          color: "var(--ufy-primary)",
                          padding: "4px 12px",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Settings size={12} />
                        <span>Active Selection</span>
                      </div>
                    )}

                    <div style={{ maxWidth: "680px" }}>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: isPurple ? "rgba(255, 255, 255, 0.8)" : "var(--ufy-primary)",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {section.sectionKey} section
                      </span>

                      <h2 style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "10px" }}>
                        {section.title}
                      </h2>

                      {section.subtitle && (
                        <p
                          style={{
                            fontSize: "1rem",
                            lineHeight: 1.6,
                            color: isPurple ? "rgba(255, 255, 255, 0.9)" : "var(--ufy-purple-800)",
                          }}
                        >
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PANEL 3: Right Contextual Property Inspector */}
        <div
          style={{
            width: "340px",
            backgroundColor: "#ffffff",
            borderLeft: "1px solid var(--ufy-purple-100)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--ufy-purple-100)",
              fontSize: "0.92rem",
              fontWeight: 800,
              color: "var(--ufy-purple-950)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Settings size={18} style={{ color: "var(--ufy-primary)" }} />
            <span>Component Properties</span>
          </div>

          {selectedSection ? (
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedSection.title}
                  onChange={(e) => handleUpdateSelected("title", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle / Description</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={selectedSection.subtitle || ""}
                  onChange={(e) => handleUpdateSelected("subtitle", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Background Treatment</label>
                <select
                  className="form-select"
                  value={selectedSection.backgroundMode}
                  onChange={(e) => handleUpdateSelected("backgroundMode", e.target.value)}
                >
                  <option value="white">Pure White (#ffffff)</option>
                  <option value="purple">Saturated UFY Purple (#7629f0)</option>
                  <option value="subtle-tint">Subtle Purple Tint (#f8f4fe)</option>
                  <option value="dark-purple">Deep Midnight Purple (#140529)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Layout Variation</label>
                <select
                  className="form-select"
                  value={selectedSection.layoutVariation}
                  onChange={(e) => handleUpdateSelected("layoutVariation", e.target.value)}
                >
                  <option value="default">Standard Responsive</option>
                  <option value="editorial">Split Editorial</option>
                  <option value="cards">Card Grid</option>
                  <option value="offset">Offset Asymmetric</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Visibility Status</label>
                <button
                  type="button"
                  onClick={() => handleUpdateSelected("isVisible", !selectedSection.isVisible)}
                  className={`btn ${selectedSection.isVisible ? "btn-primary" : "btn-outline-purple"}`}
                  style={{ width: "100%", justifyContent: "center", padding: "10px" }}
                >
                  {selectedSection.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  <span>{selectedSection.isVisible ? "Visible on Public Site" : "Hidden (Draft)"}</span>
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Raw Content JSON</label>
                <textarea
                  rows={6}
                  className="form-textarea"
                  style={{ fontSize: "0.82rem", fontFamily: "monospace" }}
                  value={selectedSection.contentJson}
                  onChange={(e) => handleUpdateSelected("contentJson", e.target.value)}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--ufy-purple-700)", marginTop: "4px" }}>
                  Fine-grained component parameters, button links & badge copy
                </span>
              </div>
            </div>
          ) : (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--ufy-purple-700)", fontSize: "0.9rem" }}>
              Select a section on the canvas or library to edit its properties.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
