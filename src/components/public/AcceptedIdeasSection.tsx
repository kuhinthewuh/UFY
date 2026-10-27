"use client";

import React from "react";
import { Sparkles, CheckCircle, ArrowUpRight } from "lucide-react";
import { IdeaSubmissionData, PageSectionData } from "@/lib/types";

interface AcceptedIdeasProps {
  ideas: IdeaSubmissionData[];
  section?: PageSectionData;
  onOpenSoumission?: () => void;
}

export default function AcceptedIdeasSection({ ideas, section, onOpenSoumission }: AcceptedIdeasProps) {
  // Only public approved ideas
  const displayed = ideas.filter((i) => i.isPubliclyDisplayed && i.status === "ACCEPTED");

  // Fallback approved community initiatives if none in DB
  const fallbackIdeas = [
    {
      id: "idea-1",
      title: "Bilingual CPR Handbooks for Teen Immigrants",
      category: "Educational Cards & Zines",
      problemAddressed: "Language barriers prevent newly arrived youth from accessing certified emergency response resources.",
      description: "Translated, culturally attuned quick-reference resuscitation guides published in French, English, and Arabic.",
      linkedOutcome: "Batch 01 printed and distributed to 6 community centers in Saint-Michel.",
    },
    {
      id: "idea-2",
      title: "Mile End Skatepark First-Aid Drop Box",
      category: "First Aid & Health Workshop",
      problemAddressed: "High rates of minor sprains, abrasions, and concussions at local skateparks without immediate sterile supplies.",
      description: "Installing a weatherproof, publicly accessible emergency trauma kit and first-aid guide at the outdoor park.",
      linkedOutcome: "Station installed and adopted by local youth crew.",
    },
  ];

  const ideasToShow = displayed.length > 0 ? displayed : fallbackIdeas;

  return (
    <section id="accepted-ideas" className="tok-projects" style={{ background: "var(--bg-deep)" }}>
      {/* Section Header */}
      <div className="tok-section-head">
        <div>
          <span className="tok-tag">COMMUNITY // APPROVED INITIATIVES</span>
        </div>
        <h2 className="tok-section-title">
          {section?.title || "YOUTH IDEAS MOVING FORWARD."}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", maxWidth: 740, lineHeight: 1.6 }}>
          Proposals submitted by local students and neighbors that have been reviewed, greenlit, and integrated into UFY's active pipeline.
        </p>
      </div>

      {/* Grid of accepted ideas */}
      <div className="tok-services-grid">
        {ideasToShow.map((idea) => (
          <article
            key={idea.id}
            className="tok-service-card"
            style={{ minHeight: "auto", background: "var(--bg-surface)" }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span className="tok-tag" style={{ fontSize: 9 }}>{idea.category}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: "var(--ufy-purple-bright)",
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle size={13} />
                  APPROVED
                </span>
              </div>

              <h3 className="tok-service-card__title" style={{ fontSize: "1.4rem" }}>
                {idea.title}
              </h3>

              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-dim)", textTransform: "uppercase" }}>
                  COMMUNITY NEED:
                </span>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {idea.problemAddressed}
                </p>
              </div>

              {idea.linkedOutcome && (
                <div
                  style={{
                    background: "rgba(118, 41, 240, 0.08)",
                    borderLeft: "2px solid var(--ufy-purple)",
                    padding: "10px 14px",
                    borderRadius: "0 8px 8px 0",
                    marginTop: 14,
                  }}
                >
                  <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--ufy-purple-bright)", fontWeight: 700, textTransform: "uppercase" }}>
                    ACTIVE STATUS:
                  </span>
                  <div style={{ fontSize: "0.85rem", color: "#ffffff", marginTop: 2 }}>
                    {idea.linkedOutcome}
                  </div>
                </div>
              )}
            </div>

            <div className="tok-service-card__bottom" style={{ marginTop: 24 }}>
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
                VERIFIED SUBMISSION
              </span>
              <button
                type="button"
                onClick={onOpenSoumission}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--ufy-purple-bright)",
                  fontFamily: "var(--font-heading)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                PITCH YOURS
                <ArrowUpRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
