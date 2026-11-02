"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Plus, MoveUp, MoveDown, Trash2, Edit2, CheckCircle } from "lucide-react";
import { ProgramData } from "@/lib/types";

export default function ProgramsAdminPage() {
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [editingProgram, setEditingProgram] = useState<ProgramData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await fetch("/api/programs");
      const data = await res.json();
      if (data.programs) setPrograms(data.programs);
    } catch {}
  };

  const handleMoveUp = async (idx: number) => {
    if (idx === 0) return;
    const reordered = [...programs];
    const temp = reordered[idx - 1];
    reordered[idx - 1] = reordered[idx];
    reordered[idx] = temp;
    setPrograms(reordered);

    await Promise.all([
      fetch(`/api/programs/${reordered[idx - 1].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: idx }),
      }),
      fetch(`/api/programs/${reordered[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: idx + 1 }),
      }),
    ]);
  };

  const handleMoveDown = async (idx: number) => {
    if (idx === programs.length - 1) return;
    const reordered = [...programs];
    const temp = reordered[idx + 1];
    reordered[idx + 1] = reordered[idx];
    reordered[idx] = temp;
    setPrograms(reordered);

    await Promise.all([
      fetch(`/api/programs/${reordered[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: idx + 1 }),
      }),
      fetch(`/api/programs/${reordered[idx + 1].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: idx + 2 }),
      }),
    ]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      await fetch(`/api/programs/${id}`, { method: "DELETE" });
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      if (editingProgram?.id === id) setEditingProgram(null);
    } catch {}
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    setSaving(true);

    try {
      if (isNew) {
        const res = await fetch("/api/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProgram),
        });
        const data = await res.json();
        if (data.program) setPrograms((prev) => [...prev, data.program]);
      } else {
        const res = await fetch(`/api/programs/${editingProgram.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProgram),
        });
        const data = await res.json();
        if (data.program) {
          setPrograms((prev) => prev.map((p) => (p.id === data.program.id ? data.program : p)));
        }
      }

      setEditingProgram(null);
      setIsNew(false);
      setSavedMessage("Initiative saved and updated on homepage!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch {}
    setSaving(false);
  };

  const handleAddNew = () => {
    setIsNew(true);
    setEditingProgram({
      id: "new",
      title: "",
      category: "Youth Health",
      summary: "",
      description: "",
      impactStat: "Active UFY Chapter Initiative",
      ctaLabel: "get involved",
      accentColor: "#7629f0",
      imageUrl: "",
      status: "active",
      dateLabel: "Ongoing",
      externalUrl: "/volunteer",
      displayOrder: programs.length + 1,
      isPublished: true,
    });
  };

  return (
    <div>
      <AdminHeader
        title="Programs & Initiatives"
        subtitle="Manage homepage initiative cards, impact badges, accent colors, and action links"
        actions={
          <button onClick={handleAddNew} className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
            <Plus size={16} />
            <span>Add Initiative</span>
          </button>
        }
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

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {programs.map((program, idx) => (
            <div
              key={program.id}
              style={{
                backgroundColor: "#ffffff",
                border: "1.5px solid var(--ufy-purple-100)",
                borderRadius: "18px",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "24px",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: program.accentColor || "#7629f0",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: "var(--ufy-purple-100)",
                      color: "var(--ufy-purple-900)",
                    }}
                  >
                    {program.category}
                  </span>
                  {program.impactStat && (
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ufy-primary)" }}>
                      • {program.impactStat}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                  {program.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--ufy-purple-800)", marginTop: "4px", maxWidth: "640px" }}>
                  {program.summary}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <button
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="btn btn-outline-purple"
                  style={{ padding: "6px 10px", opacity: idx === 0 ? 0.3 : 1 }}
                >
                  <MoveUp size={15} />
                </button>

                <button
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === programs.length - 1}
                  className="btn btn-outline-purple"
                  style={{ padding: "6px 10px", opacity: idx === programs.length - 1 ? 0.3 : 1 }}
                >
                  <MoveDown size={15} />
                </button>

                <button
                  onClick={() => {
                    setIsNew(false);
                    setEditingProgram(program);
                  }}
                  className="btn btn-outline-purple"
                  style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(program.id)}
                  className="btn btn-outline-purple"
                  style={{ padding: "6px 10px" }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingProgram && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(20, 5, 41, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99,
              padding: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "660px",
                padding: "36px",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1.5px solid var(--ufy-purple-200)",
              }}
            >
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "20px" }}>
                {isNew ? "Create New Initiative" : `Edit Initiative: ${editingProgram.title}`}
              </h2>

              <form onSubmit={handleSaveProgram} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "14px" }}>
                  <div>
                    <label className="form-label">Initiative Title *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editingProgram.title}
                      onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Card Accent Color</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="color"
                        value={editingProgram.accentColor || "#7629f0"}
                        onChange={(e) => setEditingProgram({ ...editingProgram, accentColor: e.target.value })}
                        style={{ width: "42px", height: "42px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={editingProgram.accentColor || "#7629f0"}
                        onChange={(e) => setEditingProgram({ ...editingProgram, accentColor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label className="form-label">Category *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editingProgram.category}
                      onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Impact Badge Stat</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 3,400+ Cards Delivered"
                      value={editingProgram.impactStat || ""}
                      onChange={(e) => setEditingProgram({ ...editingProgram, impactStat: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Card Summary (Homepage Card Text) *</label>
                  <textarea
                    rows={3}
                    required
                    className="form-textarea"
                    value={editingProgram.summary}
                    onChange={(e) => setEditingProgram({ ...editingProgram, summary: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">CTA Button Label</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProgram.ctaLabel || "get involved"}
                      onChange={(e) => setEditingProgram({ ...editingProgram, ctaLabel: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Action Link URL</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="/letters or /volunteer"
                      value={editingProgram.externalUrl || ""}
                      onChange={(e) => setEditingProgram({ ...editingProgram, externalUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Date / Frequency</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProgram.dateLabel || ""}
                      onChange={(e) => setEditingProgram({ ...editingProgram, dateLabel: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Optional Card Photo URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="/uploads/workshop.jpg"
                    value={editingProgram.imageUrl || ""}
                    onChange={(e) => setEditingProgram({ ...editingProgram, imageUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setEditingProgram(null)} className="btn btn-outline-purple">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    <span>{saving ? "Saving..." : "Save Initiative"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
