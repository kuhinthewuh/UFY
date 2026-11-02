"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Plus, MoveUp, MoveDown, Trash2, Edit2, Save, CheckCircle } from "lucide-react";
import { TeamMemberData } from "@/lib/types";

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMemberData[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(6);
  const [presentationStyle, setPresentationStyle] = useState<string>("editorial");
  const [editingMember, setEditingMember] = useState<TeamMemberData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamAndSettings();
  }, []);

  const fetchTeamAndSettings = async () => {
    try {
      const [teamRes, settingsRes] = await Promise.all([
        fetch("/api/team"),
        fetch("/api/settings"),
      ]);
      const teamData = await teamRes.json();
      const settingsData = await settingsRes.json();

      if (teamData.team) setMembers(teamData.team);
      if (settingsData.settings) {
        setDisplayCount(settingsData.settings.teamDisplayCount || 6);
        setPresentationStyle(settingsData.settings.teamPresentationStyle || "editorial");
      }
    } catch {}
  };

  const handleMoveUp = async (idx: number) => {
    if (idx === 0) return;
    const reordered = [...members];
    const temp = reordered[idx - 1];
    reordered[idx - 1] = reordered[idx];
    reordered[idx] = temp;
    setMembers(reordered);

    await Promise.all([
      fetch(`/api/team/${reordered[idx - 1].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: idx }),
      }),
      fetch(`/api/team/${reordered[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: idx + 1 }),
      }),
    ]);
  };

  const handleMoveDown = async (idx: number) => {
    if (idx === members.length - 1) return;
    const reordered = [...members];
    const temp = reordered[idx + 1];
    reordered[idx + 1] = reordered[idx];
    reordered[idx] = temp;
    setMembers(reordered);

    await Promise.all([
      fetch(`/api/team/${reordered[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: idx + 1 }),
      }),
      fetch(`/api/team/${reordered[idx + 1].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: idx + 2 }),
      }),
    ]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      await fetch(`/api/team/${id}`, { method: "DELETE" });
      setMembers((prev) => prev.filter((m) => m.id !== id));
      if (editingMember?.id === id) setEditingMember(null);
    } catch {}
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setSaving(true);

    try {
      if (isNew) {
        const res = await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingMember),
        });
        const data = await res.json();
        if (data.member) setMembers((prev) => [...prev, data.member]);
      } else {
        const res = await fetch(`/api/team/${editingMember.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingMember),
        });
        const data = await res.json();
        if (data.member) {
          setMembers((prev) => prev.map((m) => (m.id === data.member.id ? data.member : m)));
        }
      }

      setEditingMember(null);
      setIsNew(false);
      setSavedMessage("Team member & clothespin polaroid updated!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch {}
    setSaving(false);
  };

  const handleSaveSettings = async () => {
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamDisplayCount: Number(displayCount),
          teamPresentationStyle: presentationStyle,
        }),
      });
      setSavedMessage("Homepage leader display count updated!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch {}
  };

  const handleAddNew = () => {
    setIsNew(true);
    setEditingMember({
      id: "new",
      name: "",
      role: "",
      bio: "",
      pronouns: "",
      department: "Youth Organizing",
      photoUrl: "",
      pegColor: "#e0c7a8",
      focalPointX: 50,
      focalPointY: 50,
      linkUrl: "",
      linkType: "linkedin",
      displayOrder: members.length + 1,
      isPublished: true,
    });
  };

  const pegSwatches = [
    { label: "Natural Birch", hex: "#e0c7a8" },
    { label: "UFY Purple", hex: "#7629f0" },
    { label: "Bright Violet", hex: "#8e48ff" },
    { label: "Soft Lilac", hex: "#d4b8fc" },
    { label: "Warm Coral", hex: "#fb7185" },
  ];

  return (
    <div>
      <AdminHeader
        title="Our Team & Clothespin Polaroids"
        subtitle="Manage Up for Youth leaders, portraits, clothespin peg colors, focal points & bios"
        actions={
          <button onClick={handleAddNew} className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
            <Plus size={16} />
            <span>Add Team Member</span>
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

        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--ufy-purple-100)",
            borderRadius: "20px",
            padding: "22px 28px",
            marginBottom: "28px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <label className="form-label" style={{ marginBottom: "4px" }}>
                Leaders Displayed on Homepage
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="number"
                  min={1}
                  max={30}
                  className="form-input"
                  style={{ width: "90px", padding: "8px 12px" }}
                  value={displayCount}
                  onChange={(e) => setDisplayCount(Number(e.target.value))}
                />
                <span style={{ fontSize: "0.85rem", color: "var(--ufy-purple-700)" }}>
                  (All published members appear on <code>/team</code>)
                </span>
              </div>
            </div>
          </div>

          <button onClick={handleSaveSettings} className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.88rem" }}>
            <Save size={16} />
            <span>Save Homepage Count</span>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {members.map((member, idx) => (
            <div
              key={member.id}
              style={{
                backgroundColor: "#ffffff",
                border: "1.5px solid var(--ufy-purple-100)",
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    backgroundColor: "var(--ufy-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: `3px solid ${member.pegColor || "#e0c7a8"}`,
                  }}
                >
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                      {member.name}
                    </h3>
                    {member.pronouns && (
                      <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-600)" }}>
                        ({member.pronouns})
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        backgroundColor: member.isPublished ? "var(--ufy-purple-100)" : "var(--ufy-purple-50)",
                        color: member.isPublished ? "var(--ufy-purple-900)" : "var(--ufy-purple-600)",
                        fontWeight: 700,
                      }}
                    >
                      {member.isPublished ? "Published" : "Hidden"}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--ufy-primary)" }}>
                    {member.role} • {member.department || "Up for Youth"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                  disabled={idx === members.length - 1}
                  className="btn btn-outline-purple"
                  style={{ padding: "6px 10px", opacity: idx === members.length - 1 ? 0.3 : 1 }}
                >
                  <MoveDown size={15} />
                </button>

                <button
                  onClick={() => {
                    setIsNew(false);
                    setEditingMember(member);
                  }}
                  className="btn btn-outline-purple"
                  style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(member.id)}
                  className="btn btn-outline-purple"
                  style={{ padding: "6px 10px" }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingMember && (
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
                maxWidth: "620px",
                padding: "36px",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1.5px solid var(--ufy-purple-200)",
              }}
            >
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "20px" }}>
                {isNew ? "Add Team Member" : `Edit Team Member: ${editingMember.name}`}
              </h2>

              <form onSubmit={handleSaveMember} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "14px" }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Pronouns</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="she/her, he/him, they/them"
                      value={editingMember.pronouns || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, pronouns: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label className="form-label">Role or Position *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Department / Circle</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMember.department || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Short Biography *</label>
                  <textarea
                    rows={3}
                    required
                    className="form-textarea"
                    value={editingMember.bio}
                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "14px" }}>
                  <div>
                    <label className="form-label">Photo URL (or Media Library URL)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="/readymag_assets/speaker_1_giovanna.png"
                      value={editingMember.photoUrl || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, photoUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Clothespin Peg Color</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingTop: "4px" }}>
                      <input
                        type="color"
                        value={editingMember.pegColor || "#e0c7a8"}
                        onChange={(e) => setEditingMember({ ...editingMember, pegColor: e.target.value })}
                        style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                      />
                      {pegSwatches.map((s) => (
                        <button
                          key={s.hex}
                          type="button"
                          title={s.label}
                          onClick={() => setEditingMember({ ...editingMember, pegColor: s.hex })}
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "50%",
                            backgroundColor: s.hex,
                            border: editingMember.pegColor === s.hex ? "2.5px solid #140529" : "1px solid #cbd5e1",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Connect Link URL</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://linkedin.com/in/..."
                      value={editingMember.linkUrl || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, linkUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Link Type</label>
                    <select
                      className="form-select"
                      value={editingMember.linkType || "linkedin"}
                      onChange={(e) => setEditingMember({ ...editingMember, linkType: e.target.value })}
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="portfolio">Website</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Visibility</label>
                    <select
                      className="form-select"
                      value={editingMember.isPublished ? "true" : "false"}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, isPublished: e.target.value === "true" })
                      }
                    >
                      <option value="true">Published</option>
                      <option value="false">Hidden Draft</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setEditingMember(null)} className="btn btn-outline-purple">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    <span>{saving ? "Saving..." : "Save Member"}</span>
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
