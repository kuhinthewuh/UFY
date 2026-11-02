"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  HeartHandshake,
  Mail,
  Users,
} from "lucide-react";

interface SoumissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export default function SoumissionModal({
  isOpen,
  onClose,
  initialCategory,
}: SoumissionModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    organization: "",
    submitterEmail: "",
    phone: "",
    city: "Manteca, CA",
    category: initialCategory || "First Aid & Health Workshop",
    collaborationType: "Youth Workshop Series",
    title: "",
    problemAddressed: "",
    description: "",
    proposedApproach: "",
    timeline: "Within 1-3 Months",
    honeypot: "",
  });

  const initiativeOptions = [
    {
      id: "letters",
      category: "Pediatric Hospital Care",
      label: "Hospital Letters & Affirmations",
      desc: "Organize a card-writing circle or send virtual letters to hospitalized kids.",
      tag: "Compassion",
    },
    {
      id: "first-aid",
      category: "First Aid & Health Workshop",
      label: "First-Aid & CPR Training",
      desc: "Peer-led emergency response & lifesaving CPR workshops for schools.",
      tag: "Skill Building",
    },
    {
      id: "libraries",
      category: "Little Libraries & Books",
      label: "Little Free Library & Book Drive",
      desc: "Install or restock a neighborhood micro-library with youth books.",
      tag: "Literacy",
    },
    {
      id: "videos",
      category: "Educational Cards & Zines",
      label: "Educational Videos & Health Zines",
      desc: "Collaborate on peer-taught YouTube lessons or illustrated pocket guides.",
      tag: "Education",
    },
    {
      id: "school-chapter",
      category: "Community Partnership",
      label: "Start a School UFY Chapter",
      desc: "Launch an official Up for Youth chapter at your high school or campus.",
      tag: "Leadership",
    },
    {
      id: "volunteer",
      category: "Volunteer Application",
      label: "Join the Up for Youth Team",
      desc: "Become an active volunteer, workshop mentor, artist, or organizer.",
      tag: "Join UFY",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
      setError("Please enter your full name.");
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

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2) {
      setError(null);
      setStep(3);
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
      setError("Please provide a short headline for your request or idea.");
      return;
    }
    if (!formData.problemAddressed.trim() || formData.problemAddressed.trim().length < 5) {
      setError("Please briefly describe the community need (at least 5 characters).");
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setError("Please share a few details about what you have in mind (at least 10 characters).");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        problemAddressed: formData.problemAddressed,
        description: formData.description,
        proposedApproach: `Submitter: ${formData.fullName} (${
          formData.organization || "Independent"
        }) | Phone: ${formData.phone || "N/A"} | City: ${formData.city} | Timeline: ${
          formData.timeline
        }\n\nNotes: ${formData.proposedApproach || "Standard Up for Youth collaboration"}`,
        submitterEmail: formData.submitterEmail,
        honeypot: formData.honeypot,
      };

      const res = await fetch("/api/ideas/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed. Please try again.");

      setSubmitted(true);
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#7629f0", "#8e48ff", "#140529", "#ebdffe"],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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
      city: "Manteca, CA",
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

  if (!isOpen) return null;

  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#140529]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ufy-modal-title"
    >
      <div className="bg-white text-[#140529] w-full max-w-2xl rounded-3xl border-2 border-[#140529] shadow-[12px_16px_0px_rgba(118,41,240,0.45)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-[#140529] text-white px-6 sm:px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#7629f0] text-white font-mono text-xs font-extrabold tracking-wider uppercase">
              UP FOR YOUTH
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#d4b8fc]">
              Collaborate · Propose · Volunteer
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Modal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Fast-Track Shortcuts Banner */}
        {!submitted && (
          <div className="bg-[#f8f4fe] px-6 sm:px-8 py-3 border-b border-[#ebdffe] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[#5416b3]">
              Want to earn verified hours writing virtual letters right now?
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/volunteer"
                onClick={onClose}
                className="inline-flex items-center gap-1 font-extrabold text-[#7629f0] hover:underline"
              >
                <Users size={13} />
                <span>Volunteer Sign-Up</span>
              </Link>
              <span className="text-[#d4b8fc]">•</span>
              <Link
                href="/letters"
                onClick={onClose}
                className="inline-flex items-center gap-1 font-extrabold text-[#7629f0] hover:underline"
              >
                <Mail size={13} />
                <span>Write a Virtual Letter</span>
              </Link>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {!submitted && (
          <div className="px-6 sm:px-8 pt-4 pb-2 shrink-0 bg-white">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#5416b3] mb-1.5">
              <span>STEP 0{step} OF 03</span>
              <span className="text-[#7629f0]">{progressPct}% COMPLETE</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#ebdffe] overflow-hidden">
              <div
                className="h-full bg-[#7629f0] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 bg-white text-[#140529]">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-full bg-[#f8f4fe] border-2 border-[#7629f0] text-[#7629f0] flex items-center justify-center mx-auto mb-5 shadow-md">
                <HeartHandshake size={38} />
              </div>
              <h2 className="text-3xl font-black text-[#140529] mb-3">
                Received by Up for Youth!
              </h2>
              <p className="text-sm sm:text-base text-[#5416b3] max-w-md mx-auto leading-relaxed mb-8 font-medium">
                Thank you for stepping up for youth in your community. Our student organizers review all submissions within 48 hours and will follow up directly.
              </p>
              <button type="button" onClick={resetForm} className="btn-primary px-8 py-3">
                <span>Back to Up for Youth</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2.5">
                  <AlertCircle size={18} className="shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 id="ufy-modal-title" className="text-2xl font-black text-[#140529]">
                      Tell Us Who You Are
                    </h2>
                    <p className="text-sm text-[#5416b3] mt-1">
                      Whether you’re a student, teacher, hospital coordinator, or neighbor—we’d love to connect.
                    </p>
                  </div>

                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Maya Tremblay"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">School, Organization, or Independent</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dawson College / Local High School"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="you@example.com"
                        value={formData.submitterEmail}
                        onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+1 (514) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">City / Neighborhood</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Manteca, CA"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#140529]">
                      How Would You Like to Get Involved?
                    </h2>
                    <p className="text-sm text-[#5416b3] mt-1">
                      Choose the Up for Youth track that best fits your idea or request.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {initiativeOptions.map((opt) => {
                      const isSelected = formData.category === opt.category;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              category: opt.category,
                              collaborationType: opt.label,
                            })
                          }
                          className={`text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                            isSelected
                              ? "border-[#7629f0] bg-[#f8f4fe] shadow-sm"
                              : "border-[#ebdffe] bg-white hover:border-[#d4b8fc]"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                              isSelected
                                ? "bg-[#7629f0] border-[#7629f0] text-white"
                                : "border-[#d4b8fc] bg-white"
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                          </div>
                          <div>
                            <span className="inline-block text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebdffe] text-[#7629f0] mb-1">
                              {opt.tag}
                            </span>
                            <div className="font-extrabold text-sm text-[#140529]">{opt.label}</div>
                            <div className="text-xs text-[#5416b3] mt-0.5 leading-snug">
                              {opt.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="form-label">Preferred Timeline</label>
                    <select
                      className="form-select"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    >
                      <option value="Immediate (Next 2-4 Weeks)">Immediate (Next 2-4 Weeks)</option>
                      <option value="Within 1-3 Months">Within 1-3 Months</option>
                      <option value="Next Academic Semester">Next Academic Semester</option>
                      <option value="Flexible / Ongoing">Flexible / Ongoing</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#140529]">
                      Share Your Vision
                    </h2>
                    <p className="text-sm text-[#5416b3] mt-1">
                      Tell our youth coordinators how we can bring this to life together.
                    </p>
                  </div>

                  <div>
                    <label className="form-label">Headline / Request Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Hands-On CPR Workshop for Westmount Student Athletes"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Who Will This Help? *</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      placeholder="Describe the students, hospital ward, or neighborhood this supports..."
                      value={formData.problemAddressed}
                      onChange={(e) => setFormData({ ...formData, problemAddressed: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Details &amp; Ideas *</label>
                    <textarea
                      rows={3}
                      className="form-textarea"
                      placeholder="Estimated group size, location, or any creative details..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">How Can Up for Youth Support You? (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Bring CPR mannequins, supply card stationery, mentor our club..."
                      value={formData.proposedApproach}
                      onChange={(e) => setFormData({ ...formData, proposedApproach: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Bottom Navigation Footer */}
        {!submitted && (
          <div className="px-6 sm:px-8 py-4 bg-[#f8f4fe] border-t border-[#ebdffe] flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="btn-outline-purple text-xs sm:text-sm"
              >
                <ArrowLeft size={15} />
                <span>Previous</span>
              </button>
            ) : (
              <span className="text-xs text-[#5416b3] font-medium">
                100% Youth-Led · Confidential
              </span>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary text-xs sm:text-sm px-6 py-2.5"
              >
                <span>Next Step</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary text-xs sm:text-sm px-6 py-2.5"
              >
                <span>{loading ? "Sending..." : "Submit to Up for Youth"}</span>
                {!loading && <ArrowRight size={15} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
