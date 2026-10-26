"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Send, ShieldAlert, CheckCircle, Info, Heart } from "lucide-react";
import { PageSectionData } from "@/lib/types";

interface CommunityIdeaFormProps {
  section?: PageSectionData;
}

export default function CommunityIdeaForm({ section }: CommunityIdeaFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "First Aid & Health Workshop",
    description: "",
    problemAddressed: "",
    proposedApproach: "",
    submitterEmail: "",
    honeypot: "", // hidden spam trap
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
        throw new Error(data.error || "Failed to submit proposal");
      }

      setSubmitted(true);

      // Playful celebration confetti burst in UFY purple and white tones!
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7629f0", "#ffffff", "#b483f8", "#ebdffe"],
        });
      } catch {}
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormStart = () => {
    // Track form start in analytics once
    if (!window.sessionStorage.getItem("ufy_form_started")) {
      window.sessionStorage.setItem("ufy_form_started", "true");
      const sessionId = window.sessionStorage.getItem("ufy_session_id") || "anon";
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "idea_form_start",
          path: "/",
          sectionId: "community-idea",
          sessionId,
        }),
      }).catch(() => {});
    }
  };

  return (
    <section
      id="submit-idea"
      className="section-padding bg-ufy-pattern"
      style={{
        backgroundColor: "var(--ufy-primary)",
        color: "#ffffff",
        position: "relative",
      }}
    >
      <div className="container">
        <div
          style={{
            maxWidth: "840px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            color: "var(--ufy-purple-950)",
            borderRadius: "28px",
            padding: "48px 40px",
            boxShadow: "0 24px 60px rgba(20, 5, 41, 0.28)",
          }}
          className="idea-form-card"
        >
          {submitted ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "var(--ufy-purple-100)",
                  color: "var(--ufy-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle size={44} />
              </div>

              <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ufy-purple-950)" }}>
                Proposal Received! Thank You!
              </h2>

              <p
                style={{
                  fontSize: "1.1rem",
                  lineHeight: 1.65,
                  color: "var(--ufy-purple-800)",
                  maxWidth: "540px",
                }}
              >
                Your proposal has been logged to the UFY moderation inbox. Our youth coordinators review every submission
                during our weekly planning circle to evaluate feasibility, safety, and community impact.
              </p>

              <div
                style={{
                  backgroundColor: "var(--ufy-purple-50)",
                  border: "1.5px solid var(--ufy-purple-150, #e6d8fd)",
                  borderRadius: "14px",
                  padding: "16px 24px",
                  fontSize: "0.92rem",
                  color: "var(--ufy-purple-850)",
                  maxWidth: "500px",
                }}
              >
                💡 <strong>Privacy Reminder:</strong> Your submission remains strictly private during internal review.
                Only accepted proposals without personal details may ever appear in the public showcase.
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    title: "",
                    category: "First Aid & Health Workshop",
                    description: "",
                    problemAddressed: "",
                    proposedApproach: "",
                    submitterEmail: "",
                    honeypot: "",
                  });
                }}
                className="btn btn-outline-purple"
                style={{ marginTop: "12px" }}
              >
                Submit Another Proposal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} onFocus={handleFormStart}>
              {/* Form Header */}
              <div style={{ textAlign: "center", marginBottom: "36px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span className="ufy-badge badge-purple">
                    <Sparkles size={14} />
                    Community Proposals
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 3.4vw, 2.5rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "var(--ufy-purple-950)",
                    marginBottom: "10px",
                  }}
                >
                  {section?.title || "Have an Idea for UFY?"}
                </h2>

                <p style={{ fontSize: "1.05rem", color: "var(--ufy-purple-800)", maxWidth: "600px", margin: "0 auto" }}>
                  {section?.subtitle ||
                    "Help shape what comes next. Propose an activity, workshop topic, book drive, or health resource for our community."}
                </p>
              </div>

              {/* Privacy Notice Alert */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  backgroundColor: "var(--ufy-purple-50)",
                  border: "1.5px solid var(--ufy-purple-200)",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  marginBottom: "28px",
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
                  color: "var(--ufy-purple-900)",
                }}
              >
                <ShieldAlert size={20} style={{ color: "var(--ufy-primary)", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Youth Privacy Notice:</strong> We do not require your real name, phone number, address, or
                  school. Please do not submit medical histories, health conditions, or private information about
                  yourself or other individuals.
                </div>
              </div>

              {/* Error Feedback */}
              {error && (
                <div
                  style={{
                    backgroundColor: "var(--ufy-purple-100)",
                    border: "1.5px solid var(--ufy-purple-400)",
                    color: "var(--ufy-purple-950)",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    marginBottom: "24px",
                    fontSize: "0.92rem",
                    fontWeight: 600,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Spam Trap Field (Hidden from real users) */}
              <input
                type="text"
                name="ufy_hp"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                style={{ display: "none" }}
                aria-hidden="true"
              />

              {/* Title & Category Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.8fr",
                  gap: "20px",
                }}
                className="form-grid-row"
              >
                <div className="form-group">
                  <label htmlFor="idea-title" className="form-label">
                    Idea Title <span style={{ color: "var(--ufy-primary)" }}>*</span>
                  </label>
                  <input
                    id="idea-title"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Neighborhood Bicycle First Aid Station"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="idea-category" className="form-label">
                    Category <span style={{ color: "var(--ufy-primary)" }}>*</span>
                  </label>
                  <select
                    id="idea-category"
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Problem Addressed */}
              <div className="form-group">
                <label htmlFor="idea-problem" className="form-label">
                  What problem does this address or who could it help?{" "}
                  <span style={{ color: "var(--ufy-primary)" }}>*</span>
                </label>
                <textarea
                  id="idea-problem"
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the community need or student challenge you noticed..."
                  value={formData.problemAddressed}
                  onChange={(e) => setFormData({ ...formData, problemAddressed: e.target.value })}
                  required
                />
              </div>

              {/* Proposal Description */}
              <div className="form-group">
                <label htmlFor="idea-description" className="form-label">
                  Proposal Description <span style={{ color: "var(--ufy-primary)" }}>*</span>
                </label>
                <textarea
                  id="idea-description"
                  className="form-textarea"
                  rows={4}
                  placeholder="Share details of what you'd like UFY to create, organize, or build..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* Optional Implementation Approach */}
              <div className="form-group">
                <label htmlFor="idea-approach" className="form-label">
                  Proposed Approach / Ideas on How to Execute (Optional)
                </label>
                <textarea
                  id="idea-approach"
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Location ideas, materials needed, or partner groups you're familiar with..."
                  value={formData.proposedApproach}
                  onChange={(e) => setFormData({ ...formData, proposedApproach: e.target.value })}
                />
              </div>

              {/* Optional Submitter Email */}
              <div className="form-group">
                <label htmlFor="idea-email" className="form-label">
                  Your Email Address (Optional — only if you'd like updates on this proposal)
                </label>
                <input
                  id="idea-email"
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                />
                <span style={{ fontSize: "0.82rem", color: "var(--ufy-purple-700)", marginTop: "4px" }}>
                  Your email is strictly confidential and will never be shared, published, or sold.
                </span>
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: "28px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "1.05rem",
                    justifyContent: "center",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <Send size={18} />
                  <span>{loading ? "Submitting Proposal..." : "Submit Proposal to UFY"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

