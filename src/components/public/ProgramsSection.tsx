"use client";

import React from "react";
import { Sparkles, Calendar, ArrowRight, Tag, Bookmark } from "lucide-react";
import { ProgramData, PageSectionData } from "@/lib/types";

interface ProgramsSectionProps {
  programs: ProgramData[];
  section?: PageSectionData;
}

export default function ProgramsSection({ programs, section }: ProgramsSectionProps) {
  const publishedPrograms = programs.filter((p) => p.isPublished);

  let content = {
    eyebrow: "Our Initiatives",
    ctaTitle: "Have a proposal for our next workshop?",
    ctaButton: "Submit Your Proposal",
  };

  if (section?.contentJson) {
    try {
      content = { ...content, ...JSON.parse(section.contentJson) };
    } catch {}
  }

  return (
    <section
      id="programs"
      className="section-padding"
      style={{
        backgroundColor: "var(--ufy-purple-50)",
        borderBottom: "1px solid var(--ufy-purple-100)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: "700px", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span className="ufy-badge badge-purple">
              <Sparkles size={14} />
              {section?.subtitle || content.eyebrow}
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 3.8vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--ufy-purple-950)",
              lineHeight: 1.15,
            }}
          >
            {section?.title || "Real Community Initiatives & Workshops"}
          </h2>
        </div>

        {/* Dynamic Program Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: publishedPrograms.length === 2 ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
          }}
          className="programs-grid"
        >
          {publishedPrograms.map((program) => (
            <div
              key={program.id}
              style={{
                backgroundColor: "#ffffff",
                border: "1.5px solid var(--ufy-purple-100)",
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "all var(--transition-normal)",
                boxShadow: "var(--shadow-subtle)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "var(--ufy-purple-300)";
                e.currentTarget.style.boxShadow = "var(--shadow-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--ufy-purple-100)";
                e.currentTarget.style.boxShadow = "var(--shadow-subtle)";
              }}
            >
              {/* Optional Program Image / Placeholder Banner */}
              <div
                style={{
                  height: "170px",
                  backgroundColor: "var(--ufy-primary)",
                  backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)",
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "16px 20px",
                }}
              >
                {program.imageUrl ? (
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      opacity: 0.18,
                      color: "#ffffff",
                    }}
                  >
                    <Bookmark size={80} />
                  </div>
                )}

                {/* Category & Status Pill */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: "var(--ufy-purple-900)",
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {program.category}
                  </span>
                  <span
                    style={{
                      backgroundColor: "var(--ufy-purple-900)",
                      color: "#ffffff",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {program.status}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div
                style={{
                  padding: "26px",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  gap: "14px",
                }}
              >
                {program.dateLabel && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.85rem",
                      color: "var(--ufy-purple-700)",
                      fontWeight: 600,
                    }}
                  >
                    <Calendar size={14} />
                    <span>{program.dateLabel}</span>
                  </div>
                )}

                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "var(--ufy-purple-950)",
                    lineHeight: 1.25,
                  }}
                >
                  {program.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.96rem",
                    lineHeight: 1.6,
                    color: "var(--ufy-purple-800)",
                    flexGrow: 1,
                  }}
                >
                  {program.summary}
                </p>

                {program.externalUrl && (
                  <div style={{ marginTop: "8px" }}>
                    <a
                      href={program.externalUrl}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.92rem",
                        fontWeight: 700,
                        color: "var(--ufy-primary)",
                        transition: "gap var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
                      onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
                    >
                      <span>Participate or Learn More</span>
                      <ArrowRight size={16} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div
          style={{
            marginTop: "56px",
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--ufy-purple-200)",
            borderRadius: "18px",
            padding: "32px 36px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ufy-purple-950)", marginBottom: "4px" }}>
              {content.ctaTitle}
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--ufy-purple-800)" }}>
              We review community ideas every week and allocate materials and mentor hours to viable youth initiatives.
            </p>
          </div>
          <a href="#submit-idea" className="btn btn-primary">
            <span>{content.ctaButton}</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

