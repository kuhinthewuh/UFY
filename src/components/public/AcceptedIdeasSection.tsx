"use client";

import React from "react";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { IdeaSubmissionData, PageSectionData } from "@/lib/types";

interface AcceptedIdeasProps {
  ideas: IdeaSubmissionData[];
  section?: PageSectionData;
}

export default function AcceptedIdeasSection({ ideas, section }: AcceptedIdeasProps) {
  // Only public approved ideas
  const displayed = ideas.filter((i) => i.isPubliclyDisplayed && i.status === "ACCEPTED");

  if (displayed.length === 0) {
    return null; // Don't show empty padding if none approved yet
  }

  return (
    <section
      id="accepted-ideas"
      className="section-padding"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--ufy-purple-100)",
      }}
    >
      <div className="container">
        <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span className="ufy-badge badge-purple">
              <Sparkles size={14} />
              Community Voice in Action
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 3.8vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--ufy-purple-950)",
              lineHeight: 1.15,
              marginBottom: "12px",
            }}
          >
            {section?.title || "Community Ideas Moving Forward"}
          </h2>

          <p style={{ fontSize: "1.08rem", color: "var(--ufy-purple-800)", lineHeight: 1.6 }}>
            {section?.subtitle ||
              "Proposals submitted by local students and neighbors that have been approved and integrated into UFY's active pipeline."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "28px",
          }}
        >
          {displayed.map((idea) => (
            <div
              key={idea.id}
              style={{
                backgroundColor: "var(--ufy-purple-25)",
                border: "1.5px solid var(--ufy-purple-100)",
                borderRadius: "20px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transition: "all var(--transition-normal)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--ufy-purple-300)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--ufy-purple-100)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                <span
                  style={{
                    backgroundColor: "var(--ufy-purple-100)",
                    color: "var(--ufy-purple-800)",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {idea.category}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--ufy-primary)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={16} />
                  Approved Idea
                </span>
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ufy-purple-950)", lineHeight: 1.3 }}>
                {idea.title}
              </h3>

              <div style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--ufy-purple-800)" }}>
                <strong style={{ color: "var(--ufy-purple-900)" }}>The Need: </strong>
                {idea.problemAddressed}
              </div>

              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--ufy-purple-800)", flexGrow: 1 }}>
                <strong style={{ color: "var(--ufy-purple-900)" }}>Proposal: </strong>
                {idea.description}
              </p>

              {idea.linkedOutcome && (
                <div
                  style={{
                    marginTop: "8px",
                    paddingTop: "14px",
                    borderTop: "1px dashed var(--ufy-purple-200)",
                    fontSize: "0.88rem",
                    color: "var(--ufy-primary)",
                    fontWeight: 600,
                  }}
                >
                  🚀 Outcome: {idea.linkedOutcome}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
