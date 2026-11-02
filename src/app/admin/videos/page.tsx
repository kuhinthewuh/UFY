"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Plus,
  MoveUp,
  MoveDown,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { EducationalVideoData } from "@/lib/types";
import { getVideoThumbnailUrl } from "@/lib/site-data";

export default function VideosAdminPage() {
  const [videos, setVideos] = useState<EducationalVideoData[]>([]);
  const [educatedCount, setEducatedCount] = useState<number>(0);
  const [gridColumns, setGridColumns] = useState<number>(3);
  const [editingVideo, setEditingVideo] = useState<EducationalVideoData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      if (data.videos) setVideos(data.videos);
      if (typeof data.educatedCount === "number") setEducatedCount(data.educatedCount);
      if (typeof data.gridColumns === "number") setGridColumns(data.gridColumns);
    } catch {}
  };

  const handleSaveGlobalControls = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videosEducatedCount: Number(educatedCount),
          videosGridColumns: Number(gridColumns),
        }),
      });
      if (res.ok) {
        setSavedMessage("Live 'People Educated' counter and default row layout saved!");
        setTimeout(() => setSavedMessage(null), 3500);
      }
    } catch {}
    setSaving(false);
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= videos.length) return;
    const reordered = [...videos];
    const tmp = reordered[targetIdx];
    reordered[targetIdx] = reordered[idx];
    reordered[idx] = tmp;
    setVideos(reordered);

    await Promise.all([
      fetch(`/api/videos/${reordered[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: idx + 1 }),
      }),
      fetch(`/api/videos/${reordered[targetIdx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: targetIdx + 1 }),
      }),
    ]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this educational video module?")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    setSaving(true);

    try {
      if (isNew) {
        const res = await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingVideo),
        });
        const data = await res.json();
        if (data.video) setVideos((prev) => [...prev, data.video]);
      } else {
        const res = await fetch(`/api/videos/${editingVideo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingVideo),
        });
        const data = await res.json();
        if (data.video) {
          setVideos((prev) => prev.map((v) => (v.id === data.video.id ? data.video : v)));
        }
      }
      setEditingVideo(null);
      setIsNew(false);
      setSavedMessage("Educational video module saved!");
      setTimeout(() => setSavedMessage(null), 3500);
    } catch {}
    setSaving(false);
  };

  const handleAddNew = () => {
    setIsNew(true);
    setEditingVideo({
      id: "new",
      title: "",
      category: "First-Aid & CPR",
      description: "",
      youtubeUrl: "https://www.youtube.com/watch?v=M4ACYp75mjU",
      thumbnailUrl: "",
      duration: "4:15",
      instructor: "UFY Health Educator",
      viewsCount: 0,
      isFeatured: false,
      displayOrder: videos.length + 1,
      isPublished: true,
    });
  };

  return (
    <div>
      <AdminHeader
        title="Educational Videos & Live Counter"
        subtitle="Manage YouTube embeds, thumbnails, 2-vs-3 row columns, and the live 'People Educated' counter"
        actions={
          <button onClick={handleAddNew} className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
            <Plus size={16} />
            <span>Add YouTube Module</span>
          </button>
        }
      />

      <div style={{ padding: "32px", maxWidth: "1200px" }}>
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

        {/* Live Counter & Default Grid Columns Bar */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--ufy-purple-200)",
            borderRadius: "20px",
            padding: "24px 28px",
            marginBottom: "28px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "end",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <label className="form-label">Live &ldquo;People Educated&rdquo; Counter</label>
              <input
                type="number"
                min={0}
                className="form-input"
                style={{ width: "170px", fontWeight: 800 }}
                value={educatedCount}
                onChange={(e) => setEducatedCount(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="form-label">Default Tabular Grid Layout</label>
              <select
                className="form-select"
                style={{ width: "240px" }}
                value={gridColumns}
                onChange={(e) => setGridColumns(Number(e.target.value))}
              >
                <option value={3}>3 Videos per Row (Default)</option>
                <option value={2}>2 Videos per Row (Wide Cinema)</option>
              </select>
            </div>
          </div>

          <button onClick={handleSaveGlobalControls} disabled={saving} className="btn btn-primary">
            <Save size={16} />
            <span>Save Counter &amp; Grid Default</span>
          </button>
        </div>

        {/* Videos List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
          {videos.map((vid, idx) => {
            const thumb = getVideoThumbnailUrl(vid.youtubeUrl, vid.thumbnailUrl);
            return (
              <div
                key={vid.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid var(--ufy-purple-100)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div>
                  <div style={{ position: "relative", height: "185px", backgroundColor: "#140529" }}>
                    <img
                      src={thumb}
                      alt={vid.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        backgroundColor: "var(--ufy-primary)",
                        color: "#ffffff",
                        padding: "3px 10px",
                        borderRadius: "999px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                      }}
                    >
                      {vid.category}
                    </span>
                    {!vid.isPublished && (
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          backgroundColor: "#1e293b",
                          color: "#ffffff",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        Draft
                      </span>
                    )}
                  </div>

                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "6px" }}>
                      {vid.title}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--ufy-purple-700)", lineHeight: 1.5 }}>
                      {vid.description}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px 20px",
                    borderTop: "1px solid var(--ufy-purple-50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <a
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ufy-primary)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>YouTube</span>
                    <ExternalLink size={12} />
                  </a>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      className="btn btn-outline-purple"
                      style={{ padding: "5px 8px", opacity: idx === 0 ? 0.3 : 1 }}
                    >
                      <MoveUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === videos.length - 1}
                      className="btn btn-outline-purple"
                      style={{ padding: "5px 8px", opacity: idx === videos.length - 1 ? 0.3 : 1 }}
                    >
                      <MoveDown size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingVideo(vid);
                      }}
                      className="btn btn-outline-purple"
                      style={{ padding: "5px 12px", fontSize: "0.8rem" }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(vid.id)}
                      className="btn btn-outline-purple"
                      style={{ padding: "5px 8px" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add / Edit Video Modal */}
        {editingVideo && (
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
                maxWidth: "640px",
                padding: "36px",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1.5px solid var(--ufy-purple-200)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <GraduationCap size={22} style={{ color: "var(--ufy-primary)" }} />
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                  {isNew ? "Add Educational Video Module" : "Edit Video Module"}
                </h2>
              </div>

              <form onSubmit={handleSaveVideo} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <label className="form-label">Video Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Hands-Only CPR in 90 Seconds"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">YouTube Video URL (Auto-Embeds &amp; Pulls Thumbnail) *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={editingVideo.youtubeUrl}
                    onChange={(e) => setEditingVideo({ ...editingVideo, youtubeUrl: e.target.value })}
                  />
                </div>

                {/* Live Thumbnail Preview */}
                {editingVideo.youtubeUrl && (
                  <div
                    style={{
                      borderRadius: "14px",
                      overflow: "hidden",
                      height: "150px",
                      backgroundColor: "#140529",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <img
                      src={getVideoThumbnailUrl(editingVideo.youtubeUrl, editingVideo.thumbnailUrl)}
                      alt="Thumbnail preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Category Tab</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingVideo.category}
                      onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Duration Label</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="4:30"
                      value={editingVideo.duration || ""}
                      onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Instructor / Speaker</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingVideo.instructor || ""}
                      onChange={(e) => setEditingVideo({ ...editingVideo, instructor: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Module Description</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Optional Custom Thumbnail Image URL (Overrides YouTube Auto-Thumb)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Leave blank to use YouTube HD thumbnail automatically"
                    value={editingVideo.thumbnailUrl || ""}
                    onChange={(e) => setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", gap: "20px", paddingTop: "4px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.86rem", fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={editingVideo.isFeatured}
                      onChange={(e) => setEditingVideo({ ...editingVideo, isFeatured: e.target.checked })}
                      style={{ width: "17px", height: "17px", accentColor: "var(--ufy-primary)" }}
                    />
                    <span>Pin as Featured Video</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.86rem", fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={editingVideo.isPublished}
                      onChange={(e) => setEditingVideo({ ...editingVideo, isPublished: e.target.checked })}
                      style={{ width: "17px", height: "17px", accentColor: "var(--ufy-primary)" }}
                    />
                    <span>Published on /videos</span>
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setEditingVideo(null)} className="btn btn-outline-purple">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    <span>{saving ? "Saving..." : "Save Video Module"}</span>
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

