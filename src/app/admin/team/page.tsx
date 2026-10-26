"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Users, Plus, MoveUp, MoveDown, Trash2, Edit2, Save, CheckCircle, Copy, AlertCircle } from "lucide-react";
import { TeamMemberData } from "@/lib/types";

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMemberData[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(6);
  const [presentationStyle, setPresentationStyle] = useState<string>("editorial");
  const [editingMember, setEditingMember] = useState<TeamMemberData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
  };

  // Reorder Up
  const handleMoveUp = async (idx: number) => {
    if (idx === 0) return;
    const reordered = [...members];
    const temp = reordered[idx - 1];
    reordered[idx - 1] = reordered[idx];
    reordered[idx] = temp;

    setMembers(reordered);

    // Save order
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

  // Reorder Down
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

  // Delete Member
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      await fetch(`/api/team/${id}`, { method: "DELETE" });
      setMembers((prev) => prev.filter((m) => m.id !== id));
      if (editingMember?.id === id) setEditingMember(null);
    } catch {}
  };

  // Save Member Modal
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
        if (data.member) {
          setMembers((prev) => [...prev, data.member]);
        }
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
      setSavedMessage("Team member saved successfully!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch {}
    setSaving(false);
  };

  // Save Display Count & Style to SiteSettings
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
      setSavedMessage("Team display settings updated!");
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
      department: "Youth Programs",
      photoUrl: "",
      focalPointX: 50,
      focalPointY: 50,
      linkUrl: "",
      linkType: "linkedin",
      displayOrder: members.length + 1,
      isPublished: true,
    });
  };

  return (
    <div>
      <AdminHeader
        title="Team Management"
        subtitle="Manage dynamic youth team records, roles, photographs, bios & presentation styles"
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

        {/* Global Presentation Settings Bar */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--ufy-purple-100)",
            borderRadius: "20px",
            padding: "24px 28px",
            marginBottom: "32px",
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
                Members to Display on Public Site
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="number"
                  min={1}
                  max={50}
                  className="form-input"
                  style={{ width: "90px", padding: "8px 12px" }}
                  value={displayCount}
                  onChange={(e) => setDisplayCount(Number(e.target.value))}
                />
                <span style={{ fontSize: "0.85rem", color: "var(--ufy-purple-700)" }}>
                  (Default: 6 slots • Currently {members.length} total members in DB)
                </span>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: "4px" }}>
                Presentation Style
              </label>
              <select
                className="form-select"
                style={{ padding: "8px 14px", width: "220px" }}
                value={presentationStyle}
                onChange={(e) => setPresentationStyle(e.target.value)}
              >
                <option value="editorial">Editorial (Spacious & Typographic)</option>
                <option value="grid">Grid (Image-Led Cards)</option>
                <option value="offset">Offset (Playful Asymmetric Rhythm)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            className="btn btn-primary"
            style={{ padding: "10px 20px", fontSize: "0.88rem" }}
          >
            <Save size={16} />
            <span>Save Presentation</span>
          </button>
        </div>

        {/* Member Records List */}
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
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                {/* Avatar */}
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
                    {member.role} • {member.department || "Youth Team"}
                  </p>
                </div>
              </div>

              {/* Actions & Reordering */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="btn btn-outline-purple"
                  style={{ padding: "6px 10px", opacity: idx === 0 ? 0.3 : 1 }}
                  title="Move Up"
                >
                  <MoveUp size={15} />
                </button>

                <button
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === members.length - 1}
                  className="btn btn-outline-purple"
                  style={{ padding: "6px 10px", opacity: idx === members.length - 1 ? 0.3 : 1 }}
                  title="Move Down"
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
                  title="Delete member"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit / Add Member Modal */}
        {editingMember && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
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
                maxWidth: "600px",
                padding: "36px",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1.5px solid var(--ufy-purple-200)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              }}
            >
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "20px" }}>
                {isNew ? "Add New Team Member" : `Edit Team Member: ${editingMember.name}`}
              </h2>

              <form onSubmit={handleSaveMember} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "14px" }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pronouns</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. she/her, they/them"
                      value={editingMember.pronouns || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, pronouns: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div className="form-group">
                    <label className="form-label">Role or Position *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department / Focus</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMember.department || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Biography *</label>
                  <textarea
                    rows={4}
                    required
                    className="form-textarea"
                    value={editingMember.bio}
                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Photo URL (or choose from Media Library)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="/uploads/maya-portrait.jpg"
                    value={editingMember.photoUrl || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, photoUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div className="form-group">
                    <label className="form-label">Connect Link URL</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://linkedin.com/in/..."
                      value={editingMember.linkUrl || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, linkUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Link Type</label>
                    <select
                      className="form-select"
                      value={editingMember.linkType || "linkedin"}
                      onChange={(e) => setEditingMember({ ...editingMember, linkType: e.target.value })}
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="portfolio">Portfolio / Website</option>
                      <option value="email">Email Address</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Publication Status</label>
                  <select
                    className="form-select"
                    value={editingMember.isPublished ? "true" : "false"}
                    onChange={(e) => setEditingMember({ ...editingMember, isPublished: e.target.value === "true" })}
                  >
                    <option value="true">Published (Visible on site)</option>
                    <option value="false">Hidden (Draft)</option>
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "14px" }}>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="btn btn-outline-purple"
                  >
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
