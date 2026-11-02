"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  HeartHandshake,
  Award,
  CheckCircle,
  Download,
  Trash2,
} from "lucide-react";

interface AdminVolunteerRow {
  id: string;
  email: string;
  fullName: string;
  schoolOrOrg?: string | null;
  city: string;
  interests: string;
  status: string;
  totalVerifiedHours: number;
  bonusHours: number;
  pendingHours: number;
  lettersCount: number;
  createdAt: string;
}

export default function VolunteersAdminPage() {
  const [volunteers, setVolunteers] = useState<AdminVolunteerRow[]>([]);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [bonusEdits, setBonusEdits] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("/api/volunteers");
      const data = await res.json();
      if (data.volunteers) {
        setVolunteers(data.volunteers);
        const map: Record<string, number> = {};
        data.volunteers.forEach((v: AdminVolunteerRow) => {
          map[v.id] = v.bonusHours || 0;
        });
        setBonusEdits(map);
      }
    } catch {}
  };

  const handleUpdateVolunteer = async (id: string, payload: Record<string, any>, toast: string) => {
    const res = await fetch(`/api/volunteers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchVolunteers();
      setSavedMsg(toast);
      setTimeout(() => setSavedMsg(null), 3200);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this volunteer account?")) return;
    await fetch(`/api/volunteers/${id}`, { method: "DELETE" });
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
  };

  const handleExportCsv = () => {
    const header = [
      "Full Name",
      "Email",
      "School / Org",
      "City",
      "Interests",
      "Letters Written",
      "Workshop/Bonus Hours",
      "Total Verified Hours",
      "Pending Hours",
      "Joined Date",
    ];
    const rows = volunteers.map((v) => [
      `"${v.fullName.replace(/"/g, '""')}"`,
      `"${v.email}"`,
      `"${(v.schoolOrOrg || "").replace(/"/g, '""')}"`,
      `"${v.city.replace(/"/g, '""')}"`,
      `"${v.interests.replace(/"/g, '""')}"`,
      v.lettersCount,
      v.bonusHours,
      v.totalVerifiedHours,
      v.pendingHours,
      new Date(v.createdAt).toLocaleDateString(),
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ufy-volunteers-hours-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminHeader
        title="UFY Volunteers & Service Hours"
        subtitle="Manage registered student volunteers, verify virtual letter hours, award in-person workshop hours & export official CSV logs"
        actions={
          <button
            onClick={handleExportCsv}
            className="btn btn-outline-purple"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
          >
            <Download size={15} />
            <span>Export Hours CSV</span>
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

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {volunteers.length === 0 ? (
            <div style={{ backgroundColor: "#ffffff", padding: "50px", borderRadius: "20px", textAlign: "center" }}>
              <HeartHandshake size={42} style={{ margin: "0 auto 12px auto", color: "var(--ufy-primary)" }} />
              <h3 style={{ fontWeight: 800, fontSize: "1.1rem" }}>No registered volunteers yet</h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b", marginTop: "4px" }}>
                Students can create free Up for Youth accounts on <code>/volunteer</code>.
              </p>
            </div>
          ) : (
            volunteers.map((vol) => (
              <div
                key={vol.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid var(--ufy-purple-100)",
                  borderRadius: "20px",
                  padding: "24px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div style={{ maxWidth: "460px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                      {vol.fullName}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "999px",
                        backgroundColor: vol.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                        color: vol.status === "ACTIVE" ? "#166534" : "#991b1b",
                      }}
                    >
                      {vol.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--ufy-purple-700)", fontWeight: 600 }}>
                    {vol.email} {vol.schoolOrOrg ? `• ${vol.schoolOrOrg}` : ""} • {vol.city}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "6px" }}>
                    Interests: {vol.interests}
                  </div>
                </div>

                {/* Hours Summary & Controls */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: "14px",
                      backgroundColor: "var(--ufy-purple-25)",
                      border: "1px solid var(--ufy-purple-100)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--ufy-primary)" }}>
                      {vol.totalVerifiedHours}h
                    </div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569" }}>
                      Verified ({vol.lettersCount} letters)
                    </div>
                  </div>

                  {/* Workshop / Bonus Hours Input */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, marginBottom: "4px" }}>
                      Workshop / Event Hours
                    </label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input
                        type="number"
                        step="0.5"
                        min={0}
                        className="form-input"
                        style={{ width: "86px", padding: "6px 10px" }}
                        value={bonusEdits[vol.id] ?? vol.bonusHours}
                        onChange={(e) =>
                          setBonusEdits({ ...bonusEdits, [vol.id]: Number(e.target.value) })
                        }
                      />
                      <button
                        onClick={() =>
                          handleUpdateVolunteer(
                            vol.id,
                            { bonusHours: bonusEdits[vol.id] ?? 0 },
                            `Updated workshop hours for ${vol.fullName}!`
                          )
                        }
                        className="btn btn-outline-purple"
                        style={{ padding: "6px 12px", fontSize: "0.78rem" }}
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {vol.pendingHours > 0 && (
                    <button
                      onClick={() =>
                        handleUpdateVolunteer(
                          vol.id,
                          { verifyAllPendingLetters: true },
                          `Verified +${vol.pendingHours}h pending letter hours for ${vol.fullName}!`
                        )
                      }
                      className="btn btn-primary"
                      style={{ backgroundColor: "#059669", padding: "8px 14px", fontSize: "0.8rem" }}
                    >
                      <Award size={14} />
                      <span>Verify +{vol.pendingHours}h Pending</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(vol.id)}
                    className="btn btn-outline-purple"
                    style={{ padding: "8px 10px" }}
                  >
                    <Trash2 size={15} />
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

