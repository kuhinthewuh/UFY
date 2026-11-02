"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  MailOpen,
  CheckCircle,
  Trash2,
  Award,
  Home,
  Archive,
  Plus,
} from "lucide-react";

interface AdminLetterItem {
  id: string;
  authorName: string;
  recipientTag: string;
  message: string;
  stationeryColor: string;
  stampStyle: string;
  volunteerId?: string | null;
  volunteer?: {
    id: string;
    fullName: string;
    email: string;
    schoolOrOrg?: string | null;
  } | null;
  minutesSpent: number;
  hoursAwarded: number;
  hoursStatus: string;
  status: string;
  heartsCount: number;
  isFeaturedOnHome: boolean;
  createdAt: string;
}

export default function LettersAdminPage() {
  const [letters, setLetters] = useState<AdminLetterItem[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PENDING_HOURS" | "PENDING_MOD" | "HOME">("ALL");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newAuthor, setNewAuthor] = useState("Up for Youth Team");
  const [newRecipient, setNewRecipient] = useState("For Hospitalized Youth");
  const [newMessage, setNewMessage] = useState("");
  const [newColor, setNewColor] = useState("#f8f4fe");

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const res = await fetch("/api/letters?scope=admin");
      const data = await res.json();
      if (data.letters) setLetters(data.letters);
    } catch {}
  };

  const handlePatch = async (id: string, updates: Record<string, any>, toast?: string) => {
    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.letter) {
        setLetters((prev) =>
          prev.map((l) => (l.id === id ? { ...l, ...data.letter } : l))
        );
        if (toast) {
          setSavedMsg(toast);
          setTimeout(() => setSavedMsg(null), 3000);
        }
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this virtual letter?")) return;
    await fetch(`/api/letters/${id}`, { method: "DELETE" });
    setLetters((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCreateSeedLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName: newAuthor,
        recipientTag: newRecipient,
        message: newMessage,
        stationeryColor: newColor,
        stampStyle: "heart",
      }),
    });
    if (res.ok) {
      setNewMessage("");
      setShowCreate(false);
      fetchLetters();
      setSavedMsg("Added new affirmation envelope to public wall!");
      setTimeout(() => setSavedMsg(null), 3000);
    }
  };

  const filtered = letters.filter((l) => {
    if (filter === "PENDING_HOURS") return l.hoursStatus === "PENDING";
    if (filter === "PENDING_MOD") return l.status === "PENDING";
    if (filter === "HOME") return l.isFeaturedOnHome && l.status === "APPROVED";
    return true;
  });

  return (
    <div>
      <AdminHeader
        title="Virtual Letters & Affirmation Wall"
        subtitle="Moderate community affirmation envelopes, feature notes on the homepage, and verify volunteer service hours"
        actions={
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="btn btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.85rem" }}
          >
            <Plus size={16} />
            <span>Post New Envelope</span>
          </button>
        }
      />

      <div style={{ padding: "32px", maxWidth: "1240px" }}>
        {savedMsg && (
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
            <span>{savedMsg}</span>
          </div>
        )}

        {showCreate && (
          <form
            onSubmit={handleCreateSeedLetter}
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-200)",
              borderRadius: "20px",
              padding: "24px",
              marginBottom: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Post Official Affirmation Envelope</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: "12px" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Author name"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
              />
              <select
                className="form-select"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
              >
                <option value="For Hospitalized Youth">For Hospitalized Youth</option>
                <option value="For Someone Having a Tough Day">For Someone Having a Tough Day</option>
                <option value="For Fellow Students">For Fellow Students</option>
                <option value="Open Sunshine">Open Sunshine</option>
              </select>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <textarea
              required
              rows={3}
              className="form-textarea"
              placeholder="Write a warm, uplifting affirmation message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button type="button" onClick={() => setShowCreate(false)} className="btn btn-outline-purple">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Publish Envelope
              </button>
            </div>
          </form>
        )}

        {/* Filter Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
          {[
            { key: "ALL", label: `All Letters (${letters.length})` },
            {
              key: "PENDING_HOURS",
              label: `Pending Volunteer Hours (${letters.filter((l) => l.hoursStatus === "PENDING").length})`,
            },
            {
              key: "PENDING_MOD",
              label: `Awaiting Wall Approval (${letters.filter((l) => l.status === "PENDING").length})`,
            },
            {
              key: "HOME",
              label: `Featured on Homepage (${letters.filter((l) => l.isFeaturedOnHome && l.status === "APPROVED").length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={filter === tab.key ? "btn btn-primary" : "btn btn-outline-purple"}
              style={{ padding: "7px 16px", fontSize: "0.82rem" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Letters Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filtered.length === 0 ? (
            <div style={{ backgroundColor: "#ffffff", padding: "48px", borderRadius: "20px", textAlign: "center" }}>
              <MailOpen size={40} style={{ margin: "0 auto 10px auto", color: "var(--ufy-primary)", opacity: 0.5 }} />
              <div style={{ fontWeight: 700 }}>No virtual letters match this filter.</div>
            </div>
          ) : (
            filtered.map((letter) => (
              <div
                key={letter.id}
                style={{
                  backgroundColor: letter.stationeryColor || "#ffffff",
                  border: "1.5px solid #140529",
                  borderRadius: "20px",
                  padding: "22px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: "999px",
                        backgroundColor: letter.status === "APPROVED" ? "#dcfce7" : "#fef3c7",
                        color: letter.status === "APPROVED" ? "#166534" : "#92400e",
                      }}
                    >
                      Wall: {letter.status}
                    </span>

                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#7629f0" }}>
                      {letter.recipientTag}
                    </span>

                    <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                      • Signed: <strong>{letter.authorName}</strong> • ❤️ {letter.heartsCount}
                    </span>

                    {letter.volunteer && (
                      <span
                        style={{
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: "999px",
                          backgroundColor: "#ebdffe",
                          color: "#5416b3",
                        }}
                      >
                        Volunteer: {letter.volunteer.fullName} ({letter.volunteer.email}) • {letter.hoursAwarded}h ({letter.hoursStatus})
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: "0.76rem", color: "#64748b" }}>
                    {new Date(letter.createdAt).toLocaleString()}
                  </span>
                </div>

                <p style={{ fontSize: "0.98rem", fontWeight: 600, color: "#140529", lineHeight: 1.55 }}>
                  &ldquo;{letter.message}&rdquo;
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", paddingTop: "8px", borderTop: "1px solid rgba(20,5,41,0.1)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {letter.status !== "APPROVED" ? (
                      <button
                        onClick={() => handlePatch(letter.id, { status: "APPROVED" }, "Letter approved on public wall!")}
                        className="btn btn-primary"
                        style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                      >
                        <CheckCircle size={14} />
                        <span>Approve to Wall</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePatch(letter.id, { status: "ARCHIVED" }, "Letter archived.")}
                        className="btn btn-outline-purple"
                        style={{ padding: "6px 14px", fontSize: "0.8rem", backgroundColor: "#ffffff" }}
                      >
                        <Archive size={14} />
                        <span>Archive</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handlePatch(
                          letter.id,
                          { isFeaturedOnHome: !letter.isFeaturedOnHome },
                          letter.isFeaturedOnHome ? "Removed from homepage strip" : "Featured on homepage strip!"
                        )
                      }
                      className={letter.isFeaturedOnHome ? "btn btn-primary" : "btn btn-outline-purple"}
                      style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                    >
                      <Home size={14} />
                      <span>{letter.isFeaturedOnHome ? "On Homepage Strip" : "Pin to Homepage"}</span>
                    </button>

                    {letter.volunteerId && letter.hoursStatus !== "VERIFIED" && (
                      <button
                        onClick={() =>
                          handlePatch(
                            letter.id,
                            { hoursStatus: "VERIFIED", status: "APPROVED" },
                            `Verified +${letter.hoursAwarded}h for ${letter.volunteer?.fullName || "volunteer"}!`
                          )
                        }
                        className="btn btn-primary"
                        style={{ padding: "6px 14px", fontSize: "0.8rem", backgroundColor: "#059669" }}
                      >
                        <Award size={14} />
                        <span>Verify +{letter.hoursAwarded} Volunteer Hours</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(letter.id)}
                    className="btn btn-outline-purple"
                    style={{ padding: "6px 10px", backgroundColor: "#ffffff" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

