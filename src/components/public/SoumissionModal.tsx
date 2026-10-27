"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { X, Check, ArrowRight, ArrowLeft, Sparkles, AlertCircle, HeartHandshake } from "lucide-react";

interface SoumissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export default function SoumissionModal({ isOpen, onClose, initialCategory }: SoumissionModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Who you are
    fullName: "",
    organization: "",
    submitterEmail: "",
    phone: "",
    city: "Montreal",
    
    // Step 2: Initiative selection
    category: initialCategory || "First Aid & Health Workshop",
    collaborationType: "Youth Workshop Series",

    // Step 3: Project description
    title: "",
    problemAddressed: "",
    description: "",
    proposedApproach: "",
    timeline: "Within 1-3 Months",
    honeypot: "",
  });

  const initiativeOptions = [
    {
      id: "first-aid",
      category: "First Aid & Health Workshop",
      label: "First Aid & CPR Training",
      desc: "Peer-led emergency response & lifesaving pediatric workshops.",
      tag: "Skill Building",
    },
    {
      id: "libraries",
      category: "Little Libraries & Books",
      label: "Little Free Health Library",
      desc: "Install an outdoor mini-library with curated pediatric literature.",
      tag: "Literacy",
    },
    {
      id: "zines",
      category: "Educational Cards & Zines",
      label: "Pediatric Health Zines",
      desc: "Youth-illustrated comic primers and quick health action guides.",
      tag: "Publication",
    },
    {
      id: "incubator",
      category: "Youth Well-Being Event",
      label: "Community Idea Incubator",
      desc: "Launch your own grassroots youth-driven well-being initiative.",
      tag: "Grants & Seed",
    },
    {
      id: "school-tour",
      category: "Community Partnership",
      label: "School & Campus Tour",
      desc: "Bring interactive health leadership stations to your students.",
      tag: "Outreach",
    },
    {
      id: "volunteer",
      category: "Other Community Proposal",
      label: "Spontaneous Application / Join Team",
      desc: "Join our Montreal youth council, instructors, or design crew.",
      tag: "Join UFY",
    },
  ];

  // Check URL query param `?gf_page_3=1` or `?soumission=1` on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("gf_page_3") === "1" || params.get("soumission") === "1") {
        // Auto open if linked directly like TOK Communications
      }
    }
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError("Please provide your name.");
      return false;
    }
    if (!formData.submitterEmail.trim()) {
      setError("Please enter your contact email.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.submitterEmail.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!formData.category) {
      setError("Please select at least one initiative type.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handlePrev = () => {
    setError(null);
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Please provide a title for your proposal or initiative.");
      return;
    }
    if (!formData.problemAddressed.trim() || formData.problemAddressed.trim().length < 5) {
      setError("Please describe the problem or community need (at least 5 characters).");
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setError("Please provide a brief description of your proposal (at least 10 characters).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        problemAddressed: formData.problemAddressed,
        description: formData.description,
        proposedApproach: `Submitter: ${formData.fullName} (${formData.organization || "Independent"}) | Phone: ${formData.phone || "N/A"} | City: ${formData.city} | Timeline: ${formData.timeline} \n\nProposed Approach: ${formData.proposedApproach || "Standard collaboration"}`,
        submitterEmail: formData.submitterEmail,
        honeypot: formData.honeypot,
      };

      const res = await fetch("/api/ideas/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7629f0", "#8e48ff", "#ffffff"],
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setFormData({
      fullName: "",
      organization: "",
      submitterEmail: "",
      phone: "",
      city: "Montreal",
      category: "First Aid & Health Workshop",
      collaborationType: "Youth Workshop Series",
      title: "",
      problemAddressed: "",
      description: "",
      proposedApproach: "",
      timeline: "Within 1-3 Months",
      honeypot: "",
    });
    onClose();
  };

  const getProgressPercentage = () => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  };

  if (!isOpen) return null;

  return (
    <div
      className={`tok-soumission-modal ${isOpen ? "tok-soumission-modal--open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="soumission-title"
    >
      <div className="tok-soumission-drawer">
        {/* Header */}
        <div className="tok-soumission-drawer__header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="tok-tag">MODULE // SOUMISSION</span>
            <span style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
              UFY 360° INITIATIVE
            </span>
          </div>
          <button
            type="button"
            className="tok-soumission-drawer__close"
            onClick={onClose}
            aria-label="Close Proposal Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        {!submitted && (
          <div className="tok-soumission-progress">
            <div className="tok-soumission-progress__header">
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                STEP 0{step} OF 03
              </span>
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ufy-purple-bright)", fontWeight: 700 }}>
                {getProgressPercentage()}% COMPLETED
              </span>
            </div>
            <div className="tok-soumission-progress__bar">
              <div
                className="tok-soumission-progress__fill"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="tok-soumission-body">
          {submitted ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(118, 41, 240, 0.2)",
                  border: "2px solid var(--ufy-purple)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Sparkles size={36} color="var(--ufy-purple-bright)" />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2.4rem",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  marginBottom: 16,
                }}
              >
                PROPOSAL RECEIVED
              </h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "1.1rem",
                  maxWidth: 480,
                  margin: "0 auto 32px",
                  lineHeight: 1.6,
                }}
              >
                Thank you for pitching your vision to UFY. Our youth board and program leads review all
                proposals within 48 hours to assess community impact and schedule next steps.
              </p>
              <button type="button" className="tok-btn-primary" onClick={resetForm}>
                RETURN TO UFY HOMEPAGE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Spam Trap Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              {error && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.35)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 18px",
                    color: "#fca5a5",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div>
                  <h2 id="soumission-title" className="tok-soumission-step-title">
                    TELL US WHO YOU ARE
                  </h2>
                  <p className="tok-soumission-step-desc">
                    Whether you are an individual youth, school educator, community organizer, or partner, introduce yourself to our team.
                  </p>

                  <div className="tok-input-group">
                    <label className="tok-input-label">Full Name *</label>
                    <input
                      type="text"
                      className="tok-input"
                      placeholder="e.g. Maya Tremblay"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="tok-input-group">
                    <label className="tok-input-label">School, Organization or Independent</label>
                    <input
                      type="text"
                      className="tok-input"
                      placeholder="e.g. Jean-de-Brébeuf High School / Community Youth Hub"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="tok-input-group">
                      <label className="tok-input-label">Email Address *</label>
                      <input
                        type="email"
                        className="tok-input"
                        placeholder="maya@example.ca"
                        value={formData.submitterEmail}
                        onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                        required
                      />
                    </div>
                    <div className="tok-input-group">
                      <label className="tok-input-label">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        className="tok-input"
                        placeholder="+1 (514) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="tok-input-group">
                    <label className="tok-input-label">City or Borough</label>
                    <input
                      type="text"
                      className="tok-input"
                      placeholder="e.g. Montreal, QC / Laval / Longueuil"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: INITIATIVE SELECTION */}
              {step === 2 && (
                <div>
                  <h2 className="tok-soumission-step-title">
                    WHAT CAN WE BUILD TOGETHER?
                  </h2>
                  <p className="tok-soumission-step-desc">
                    Select the program or collaboration track that best matches your proposal.
                  </p>

                  <div className="tok-choices-grid">
                    {initiativeOptions.map((opt) => {
                      const isSelected = formData.category === opt.category;
                      return (
                        <div
                          key={opt.id}
                          className={`tok-choice-card ${isSelected ? "tok-choice-card--selected" : ""}`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              category: opt.category,
                              collaborationType: opt.label,
                            })
                          }
                        >
                          <div className="tok-choice-card__indicator">
                            {isSelected && <Check size={14} color="#ffffff" />}
                          </div>
                          <div>
                            <span className="tok-tag" style={{ fontSize: 9, padding: "2px 8px", marginBottom: 6 }}>
                              {opt.tag}
                            </span>
                            <div className="tok-choice-card__title">{opt.label}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                              {opt.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="tok-input-group" style={{ marginTop: 24 }}>
                    <label className="tok-input-label">Estimated Timeline</label>
                    <select
                      className="tok-input"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    >
                      <option value="Immediate (Next 2-4 Weeks)">Immediate (Next 2-4 Weeks)</option>
                      <option value="Within 1-3 Months">Within 1-3 Months</option>
                      <option value="Next Academic Semester">Next Academic Semester</option>
                      <option value="Exploratory / Long-Term">Exploratory / Long-Term</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: SCOPE & VISION */}
              {step === 3 && (
                <div>
                  <h2 className="tok-soumission-step-title">
                    DESCRIBE YOUR PROJECT VISION
                  </h2>
                  <p className="tok-soumission-step-desc">
                    Tell us what community need or youth challenge you are tackling and how UFY can help make it happen.
                  </p>

                  <div className="tok-input-group">
                    <label className="tok-input-label">Proposal Title *</label>
                    <input
                      type="text"
                      className="tok-input"
                      placeholder="e.g. Free Hands-on CPR Training for Mile End Teen Athletes"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="tok-input-group">
                    <label className="tok-input-label">What Problem or Need Does This Address? *</label>
                    <textarea
                      className="tok-input tok-textarea"
                      placeholder="Describe who is impacted and why this initiative matters in your community..."
                      value={formData.problemAddressed}
                      onChange={(e) => setFormData({ ...formData, problemAddressed: e.target.value })}
                      required
                    />
                  </div>

                  <div className="tok-input-group">
                    <label className="tok-input-label">Detailed Proposal Description *</label>
                    <textarea
                      className="tok-input tok-textarea"
                      placeholder="Outline what you envision: number of participants, locations, resources needed, or any specific ideas..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="tok-input-group">
                    <label className="tok-input-label">Proposed Approach & How UFY Can Help</label>
                    <input
                      type="text"
                      className="tok-input"
                      placeholder="e.g. Provide certified instructors, Little Library materials, design zines..."
                      value={formData.proposedApproach}
                      onChange={(e) => setFormData({ ...formData, proposedApproach: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Navigation */}
        {!submitted && (
          <div className="tok-soumission-drawer__footer">
            {step > 1 ? (
              <button
                type="button"
                className="tok-btn-secondary"
                onClick={handlePrev}
                disabled={loading}
              >
                <ArrowLeft size={16} style={{ marginRight: 8 }} />
                PREVIOUS STEP
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                className="tok-btn-primary"
                onClick={handleNext}
              >
                NEXT STEP
                <ArrowRight size={16} style={{ marginLeft: 8 }} />
              </button>
            ) : (
              <button
                type="button"
                className="tok-btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "TRANSMITTING..." : "SUBMIT PROPOSAL"}
                {!loading && <Sparkles size={16} style={{ marginLeft: 8 }} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
