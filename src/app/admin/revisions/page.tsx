"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { History, UploadCloud, RotateCcw, CheckCircle, Clock, ShieldCheck, Eye } from "lucide-react";
import { SiteRevisionData } from "@/lib/types";

export default function RevisionsAdminPage() {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [selectedRevision, setSelectedRevision] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [publishTitle, setPublishTitle] = useState("");
  const [publishDescription, setPublishDescription] = useState("");

  useEffect(() => {
    fetchRevisions();
  }, []);

  const fetchRevisions = async () => {
    try {
      const res = await fetch("/api/revisions");
      const data = await res.json();
      if (data.revisions) {
        setRevisions(data.revisions);
        if (data.revisions.length > 0 && !selectedRevision) {
          setSelectedRevision(data.revisions[0]);
        }
      }
    } catch {}
    setLoading(false);
  };

  const handlePublishNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: publishTitle || `Release #${revisions.length + 1}`,
          description: publishDescription || "Production site publication",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Successfully published Revision #${data.revision.revisionNumber}!`);
        setPublishTitle("");
        setPublishDescription("");
        fetchRevisions();
      }
    } catch {
      setMessage("Failed to publish revision");
    } finally {
      setPublishing(false);
    }
  };

  const handleRestore = async (revisionId: string, revisionNumber: number) => {
    if (!confirm(`Are you sure you want to rollback the live website to Revision #${revisionNumber}? This will restore all section layouts, programs, and theme settings from that snapshot.`)) {
      return;
    }

    setRestoring(true);
    setMessage(null);
    try {
      const res = await fetch("/api/revisions/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || `Restored site to Revision #${revisionNumber}`);
        setTimeout(() => setMessage(null), 4000);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(err.message || "Failed to restore revision");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Publishing & Revisions History"
        subtitle="Manage live publications, review immutable database snapshots & perform instant rollbacks"
      />

      <div style={{ padding: "32px", maxWidth: "1200px" }}>
        {message && (
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
            <span>{message}</span>
          </div>
        )}

        {/* Publish Live Form */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--ufy-purple-100)",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "32px",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <UploadCloud size={20} style={{ color: "var(--ufy-primary)" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
              Publish Current Website Snapshot
            </h2>
          </div>

          <form onSubmit={handlePublishNew} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "16px" }} className="publish-grid">
              <div className="form-group">
                <label className="form-label">Revision Label / Version</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={`e.g. Release v1.${revisions.length + 1}`}
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Change Notes / Summary</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Added First Aid CPR updates and adjusted hero typography"
                  value={publishDescription}
                  onChange={(e) => setPublishDescription(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" disabled={publishing} className="btn btn-primary" style={{ padding: "10px 24px" }}>
                <UploadCloud size={16} />
                <span>{publishing ? "Creating Snapshot..." : "Create & Publish Live Revision"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Revisions History List & Snapshot Inspector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }} className="revisions-split">
          {/* History List */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--ufy-purple-950)", marginBottom: "4px" }}>
              Publication History ({revisions.length})
            </h3>

            {revisions.map((rev, idx) => {
              const isSelected = selectedRevision?.id === rev.id;
              const isLatest = idx === 0;

              return (
                <div
                  key={rev.id}
                  onClick={() => setSelectedRevision(rev)}
                  style={{
                    backgroundColor: isSelected ? "var(--ufy-purple-50)" : "#ffffff",
                    border: isSelected ? "2px solid var(--ufy-primary)" : "1px solid var(--ufy-purple-100)",
                    borderRadius: "14px",
                    padding: "18px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          backgroundColor: isLatest ? "var(--ufy-primary)" : "var(--ufy-purple-100)",
                          color: isLatest ? "#ffffff" : "var(--ufy-purple-900)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                        }}
                      >
                        Rev #{rev.revisionNumber} {isLatest && "• LIVE"}
                      </span>
                      <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                        {rev.title}
                      </span>
                    </div>

                    <span style={{ fontSize: "0.78rem", color: "var(--ufy-purple-700)" }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.88rem", color: "var(--ufy-purple-800)" }}>
                    {rev.description || "Website snapshot"}
                  </p>

                  <div style={{ fontSize: "0.78rem", color: "var(--ufy-purple-600)" }}>
                    Published by: {rev.createdBy?.name || "System Admin"} ({rev.createdBy?.email || "admin"})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Snapshot Inspector & Rollback Trigger */}
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
            {selectedRevision ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                      Revision #{selectedRevision.revisionNumber} Snapshot
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--ufy-purple-700)" }}>
                      Recorded on {new Date(selectedRevision.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRestore(selectedRevision.id, selectedRevision.revisionNumber)}
                    disabled={restoring}
                    className="btn btn-outline-purple"
                    style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    <RotateCcw size={15} />
                    <span>{restoring ? "Restoring..." : "Restore This Version"}</span>
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Immutable Snapshot Data (JSON)</label>
                  <textarea
                    readOnly
                    rows={14}
                    className="form-textarea"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                      backgroundColor: "var(--ufy-purple-25)",
                    }}
                    value={
                      (() => {
                        try {
                          return JSON.stringify(JSON.parse(selectedRevision.snapshotJson), null, 2);
                        } catch {
                          return selectedRevision.snapshotJson;
                        }
                      })()
                    }
                  />
                </div>
              </>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
                Select a revision from the left to inspect its snapshot or restore.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

