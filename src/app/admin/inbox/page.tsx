"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Inbox,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { IdeaSubmissionData } from "@/lib/types";

export default function IdeaInboxPage() {
  const [ideas, setIdeas] = useState<IdeaSubmissionData[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<IdeaSubmissionData | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, [statusFilter, search]);

  const fetchIdeas = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (search) params.append("search", search);

      const res = await fetch(`/api/ideas?${params.toString()}`);
      const data = await res.json();
      if (data.ideas) {
        setIdeas(data.ideas);
        if (data.ideas.length > 0 && !selectedIdea) {
          setSelectedIdea(data.ideas[0]);
        }
      }
    } catch {}
    setLoading(false);
  };

  const handleUpdateIdea = async (id: string, updates: Partial<IdeaSubmissionData>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/ideas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.idea) {
        setIdeas((prev) => prev.map((i) => (i.id === id ? data.idea : i)));
        setSelectedIdea(data.idea);
        setSavedMessage("Moderation status and notes saved!");
        setTimeout(() => setSavedMessage(null), 3000);
      }
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this submission?")) return;
    try {
      await fetch(`/api/ideas/${id}`, { method: "DELETE" });
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      setSelectedIdea(null);
    } catch {}
  };

  const statuses = [
    "NEW",
    "UNDER_REVIEW",
    "NEEDS_CLARIFICATION",
    "ACCEPTED",
    "IN_PROGRESS",
    "COMPLETED",
    "DECLINED",
  ];

  return (
    <div>
      <AdminHeader
        title="Community Idea Inbox"
        subtitle="Review, moderate, and advance community proposals from local youth & neighbors"
        actions={
          <a
            href="/api/ideas/export"
            download
            className="btn btn-outline-purple"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </a>
        }
      />

      <div style={{ padding: "32px" }}>
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

        {/* Filters Toolbar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <button
              onClick={() => setStatusFilter("ALL")}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.82rem",
                fontWeight: 700,
                backgroundColor: statusFilter === "ALL" ? "var(--ufy-primary)" : "#ffffff",
                color: statusFilter === "ALL" ? "#ffffff" : "var(--ufy-purple-900)",
                border: "1px solid var(--ufy-purple-200)",
              }}
            >
              All Submissions ({ideas.length})
            </button>

            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  backgroundColor: statusFilter === "st" ? "var(--ufy-primary)" : "#ffffff",
                  color: statusFilter === st ? "var(--ufy-primary)" : "var(--ufy-purple-800)",
                  border: statusFilter === st ? "2px solid var(--ufy-primary)" : "1px solid var(--ufy-purple-200)",
                }}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ width: "280px", position: "relative" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search proposals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "38px", paddingRight: "14px", paddingBottom: "9px", paddingTop: "9px" }}
            />
            <Search
              size={16}
              style={{ position: "absolute", left: "12px", top: "11px", color: "var(--ufy-purple-400)" }}
            />
          </div>
        </div>

        {/* Inbox Split View: List on left, Full Inspector on right */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: "28px" }} className="inbox-split">
          {/* Submissions List */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              height: "calc(100vh - 280px)",
              overflowY: "auto",
            }}
          >
            {ideas.length === 0 ? (
              <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ufy-purple-700)" }}>
                <Inbox size={44} style={{ margin: "0 auto 12px auto", opacity: 0.3 }} />
                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--ufy-purple-950)" }}>
                  No Proposals in this View
                </div>
                <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                  Try clearing the status filter or submit an idea via the public form!
                </p>
              </div>
            ) : (
              ideas.map((idea) => {
                const isSelected = selectedIdea?.id === idea.id;
                return (
                  <div
                    key={idea.id}
                    onClick={() => setSelectedIdea(idea)}
                    style={{
                      backgroundColor: isSelected ? "var(--ufy-purple-50)" : "#ffffff",
                      border: isSelected ? "2px solid var(--ufy-primary)" : "1px solid var(--ufy-purple-100)",
                      borderRadius: "14px",
                      padding: "16px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: "6px",
                          backgroundColor:
                            idea.status === "NEW"
                              ? "var(--ufy-primary)"
                              : idea.status === "ACCEPTED"
                              ? "var(--ufy-purple-800)"
                              : "var(--ufy-purple-100)",
                          color:
                            idea.status === "NEW" || idea.status === "ACCEPTED"
                              ? "#ffffff"
                              : "var(--ufy-purple-900)",
                        }}
                      >
                        {idea.status.replace(/_/g, " ")}
                      </span>

                      <span style={{ fontSize: "0.78rem", color: "var(--ufy-purple-700)" }}>
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                      {idea.title}
                    </h4>

                    <span style={{ fontSize: "0.82rem", color: "var(--ufy-purple-700)" }}>
                      Category: {idea.category}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Full Idea Detail & Moderation Controls */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--ufy-purple-100)",
              borderRadius: "20px",
              padding: "32px",
              height: "calc(100vh - 280px)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {selectedIdea ? (
              <>
                {/* Header & Status Selector */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                  <div>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "var(--ufy-primary)",
                      }}
                    >
                      {selectedIdea.category} • Submitted on {new Date(selectedIdea.createdAt).toLocaleString()}
                    </span>
                    <h2
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "var(--ufy-purple-950)",
                        marginTop: "6px",
                        lineHeight: 1.25,
                      }}
                    >
                      {selectedIdea.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedIdea.id)}
                    className="btn btn-outline-purple"
                    style={{ padding: "8px 12px" }}
                    title="Delete proposal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Status Selector */}
                <div
                  style={{
                    backgroundColor: "var(--ufy-purple-25)",
                    border: "1.5px solid var(--ufy-purple-150, #e6d8fd)",
                    borderRadius: "16px",
                    padding: "20px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label className="form-label" style={{ marginBottom: "4px" }}>
                      Moderation Status
                    </label>
                    <select
                      className="form-select"
                      style={{ padding: "8px 14px", width: "210px" }}
                      value={selectedIdea.status}
                      onChange={(e) => handleUpdateIdea(selectedIdea.id, { status: e.target.value as any })}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ marginBottom: "4px" }}>
                      Public Showcase Display
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateIdea(selectedIdea.id, {
                          isPubliclyDisplayed: !selectedIdea.isPubliclyDisplayed,
                        })
                      }
                      className={`btn ${selectedIdea.isPubliclyDisplayed ? "btn-primary" : "btn-outline-purple"}`}
                      style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                    >
                      {selectedIdea.isPubliclyDisplayed ? <Eye size={15} /> : <EyeOff size={15} />}
                      <span>
                        {selectedIdea.isPubliclyDisplayed ? "Displayed in Approved Showcase" : "Not Displayed Publicly"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Submitter Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ufy-purple-900)", marginBottom: "4px" }}>
                      Community Need / Problem Addressed
                    </h4>
                    <p
                      style={{
                        backgroundColor: "var(--ufy-purple-50)",
                        padding: "16px",
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "var(--ufy-purple-950)",
                      }}
                    >
                      {selectedIdea.problemAddressed}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ufy-purple-900)", marginBottom: "4px" }}>
                      Proposal Details
                    </h4>
                    <p
                      style={{
                        backgroundColor: "var(--ufy-purple-50)",
                        padding: "16px",
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "var(--ufy-purple-950)",
                      }}
                    >
                      {selectedIdea.description}
                    </p>
                  </div>

                  {selectedIdea.proposedApproach && (
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ufy-purple-900)", marginBottom: "4px" }}>
                        Suggested Implementation Approach
                      </h4>
                      <p
                        style={{
                          backgroundColor: "var(--ufy-purple-50)",
                          padding: "16px",
                          borderRadius: "12px",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                          color: "var(--ufy-purple-950)",
                        }}
                      >
                        {selectedIdea.proposedApproach}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ufy-purple-900)", marginBottom: "4px" }}>
                      Submitter Contact (Strictly Confidential)
                    </h4>
                    <div style={{ fontSize: "0.92rem", color: "var(--ufy-purple-800)" }}>
                      {selectedIdea.submitterEmail ? (
                        <a
                          href={`mailto:${selectedIdea.submitterEmail}`}
                          style={{ color: "var(--ufy-primary)", textDecoration: "underline" }}
                        >
                          {selectedIdea.submitterEmail}
                        </a>
                      ) : (
                        <span style={{ fontStyle: "italic", opacity: 0.7 }}>
                          Anonymous submission (no email provided)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Private Internal Notes & Linked Outcome */}
                <div
                  style={{
                    borderTop: "1.5px dashed var(--ufy-purple-200)",
                    paddingTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div className="form-group">
                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Lock size={14} style={{ color: "var(--ufy-primary)" }} />
                      <span>Internal Private Team Notes (Never visible publicly)</span>
                    </label>
                    <textarea
                      rows={3}
                      className="form-textarea"
                      placeholder="Add review feedback, materials budget, or mentor assignments..."
                      value={selectedIdea.internalNotes || ""}
                      onChange={(e) => setSelectedIdea({ ...selectedIdea, internalNotes: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Linked Initiative / Community Outcome
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Approved and scheduled for Spring 2026 CPR Workshop"
                      value={selectedIdea.linkedOutcome || ""}
                      onChange={(e) => setSelectedIdea({ ...selectedIdea, linkedOutcome: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() =>
                        handleUpdateIdea(selectedIdea.id, {
                          internalNotes: selectedIdea.internalNotes,
                          linkedOutcome: selectedIdea.linkedOutcome,
                        })
                      }
                      disabled={saving}
                      className="btn btn-primary"
                    >
                      <span>{saving ? "Saving Notes..." : "Save Internal Notes & Outcome"}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "var(--ufy-purple-700)", padding: "40px", fontSize: "0.95rem" }}>
                Select a proposal from the inbox on the left to inspect and moderate.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

