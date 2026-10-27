"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Send, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react";
import { PageSectionData } from "@/lib/types";

interface CommunityIdeaFormProps {
  section?: PageSectionData;
  onOpenSoumission?: () => void;
}

export default function CommunityIdeaForm({ section, onOpenSoumission }: CommunityIdeaFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "First Aid & Health Workshop",
    description: "",
    problemAddressed: "",
    proposedApproach: "",
    submitterEmail: "",
    honeypot: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    "First Aid & Health Workshop",
    "Little Libraries & Books",
    "Educational Cards & Zines",
    "Community Partnership",
    "Youth Well-Being Event",
    "Other Community Proposal",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Please provide a title for your idea.");
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setError("Please describe your proposal in a bit more detail (at least 10 characters).");
      return;
    }
    if (!formData.problemAddressed.trim() || formData.problemAddressed.trim().length < 5) {
      setError("Please tell us what problem this addresses or who it could help.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/ideas/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please check required fields.");
      }

      setSubmitted(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#7629f0", "#8e48ff", "#ffffff"],
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="community-idea" className="tok-services" style={{ background: "var(--bg-surface)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Banner with 2-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <span className="tok-tag" style={{ marginBottom: 16 }}>MODULE // PROPOSALS</span>
            <h2 className="tok-section-title" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}>
              HAVE A VISION FOR YOUTH HEALTH?
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginTop: 20, lineHeight: 1.6 }}>
              Whether you are a student, teacher, or community advocate, UFY partners with you to provide materials, medical expertise, and funding to bring your ideas to life.
            </p>

            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ufy-purple-bright)" }} />
                <span style={{ color: "#ffffff", fontWeight: 600 }}>Reviewed within 48 hours by our youth council</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ufy-purple-bright)" }} />
                <span style={{ color: "#ffffff", fontWeight: 600 }}>Full logistical & micro-grant seed support</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ufy-purple-bright)" }} />
                <span style={{ color: "#ffffff", fontWeight: 600 }}>Public recognition or complete anonymity</span>
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <button
                type="button"
                className="tok-btn-primary"
                onClick={onOpenSoumission}
              >
                OPEN FULL 3-STEP PROPOSAL DRAWER
                <ArrowUpRight size={16} style={{ marginLeft: 8 }} />
              </button>
            </div>
          </div>

          {/* Quick submission card on page */}
          <div
            style={{
              background: "var(--bg-deep)",
              border: "1px solid var(--border-glass-bright)",
              borderRadius: "var(--radius-xl)",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 10px" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(118, 41, 240, 0.2)",
                    border: "2px solid var(--ufy-purple)",
                    color: "var(--ufy-purple-bright)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, marginBottom: 10 }}>
                  IDEA TRANSMITTED
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: 24 }}>
                  Thank you! Our youth leads will review your idea and reach out soon.
                </p>
                <button
                  type="button"
                  className="tok-btn-secondary"
                  onClick={() => setSubmitted(false)}
                >
                  SUBMIT ANOTHER IDEA
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                    QUICK TRANSMISSION FORM
                  </span>
                  <span className="tok-tag" style={{ fontSize: 9 }}>DIRECT PITCH</span>
                </div>

                {error && (
                  <div
                    style={{
                      background: "rgba(239, 68, 68, 0.12)",
                      border: "1px solid rgba(239, 68, 68, 0.35)",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 14px",
                      color: "#fca5a5",
                      fontSize: 13,
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Spam trap */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="tok-input-group">
                  <label className="tok-input-label">Idea Title *</label>
                  <input
                    type="text"
                    className="tok-input"
                    placeholder="e.g. Hands-on Epinephrine & Allergy Training"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="tok-input-group">
                  <label className="tok-input-label">Category</label>
                  <select
                    className="tok-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} style={{ background: "#0c0d14", color: "#fff" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="tok-input-group">
                  <label className="tok-input-label">Community Need *</label>
                  <input
                    type="text"
                    className="tok-input"
                    placeholder="Who does this help?"
                    value={formData.problemAddressed}
                    onChange={(e) => setFormData({ ...formData, problemAddressed: e.target.value })}
                    required
                  />
                </div>

                <div className="tok-input-group">
                  <label className="tok-input-label">Description *</label>
                  <textarea
                    className="tok-input"
                    style={{ minHeight: 90 }}
                    placeholder="Brief details of your vision..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="tok-input-group">
                  <label className="tok-input-label">Contact Email (Optional)</label>
                  <input
                    type="email"
                    className="tok-input"
                    placeholder="you@domain.ca"
                    value={formData.submitterEmail}
                    onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="tok-btn-primary"
                  style={{ width: "100%", marginTop: 8 }}
                  disabled={loading}
                >
                  {loading ? "TRANSMITTING..." : "SUBMIT COMMUNITY IDEA"}
                  <Send size={14} style={{ marginLeft: 8 }} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
