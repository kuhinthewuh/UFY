"use client";

import React from "react";
import { Sparkles, HeartPulse, BookOpen, Users } from "lucide-react";
import { PageSectionData } from "@/lib/types";

interface MissionSectionProps {
  section?: PageSectionData;
}

export default function MissionSection({ section }: MissionSectionProps) {
  let content = {
    eyebrow: "Why UFY Exists",
    title: "Knowledge Belongs in the Hands of Young People.",
    leadParagraph:
      "UFY was founded on a simple conviction: young people shouldn't just be recipients of community decisions; they should be equipped to protect, educate, and lead their peers. Through practical health education, tangible first aid skills, and neighborhood literacy projects, we bridge the gap between classroom theory and community well-being.",
    pillars: [
      {
        title: "Peer Health & First Aid",
        description:
          "Practical, hands-on workshops covering CPR fundamentals, wound management, and basic emergency response designed specifically for teenagers.",
      },
      {
        title: "Community Little Libraries",
        description:
          "Building and stocking accessible outdoor mini-libraries with curated health, science, and creative books to foster reading culture in public parks.",
      },
      {
        title: "Youth Idea Incubator",
        description:
          "Providing direct mentorship, materials, and coordination to help student-proposed initiatives become reality in their neighborhoods.",
      },
    ],
  };

  if (section?.contentJson) {
    try {
      content = { ...content, ...JSON.parse(section.contentJson) };
    } catch {}
  }

  const icons = [HeartPulse, BookOpen, Users];

  return (
    <section
      id="mission"
      className="section-padding"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--ufy-purple-100)",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: "780px", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span className="ufy-badge badge-purple">
              <Sparkles size={14} />
              {content.eyebrow}
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--ufy-purple-950)",
              lineHeight: 1.15,
              marginBottom: "20px",
            }}
          >
            {content.title}
          </h2>

          <p
            style={{
              fontSize: "1.15rem",
              lineHeight: 1.7,
              color: "var(--ufy-purple-800)",
            }}
          >
            {content.leadParagraph}
          </p>
        </div>

        {/* Pillars Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
            gap: "28px",
          }}
        >
          {content.pillars.map((pillar, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: "var(--ufy-purple-25)",
                  border: "1.5px solid var(--ufy-purple-100)",
                  borderRadius: "18px",
                  padding: "36px 30px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "all var(--transition-normal)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "var(--ufy-purple-300)";
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--ufy-purple-100)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "var(--ufy-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    boxShadow: "0 6px 16px rgba(118, 41, 240, 0.25)",
                  }}
                >
                  <Icon size={24} />
                </div>

                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "var(--ufy-purple-900)",
                  }}
                >
                  {pillar.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.98rem",
                    lineHeight: 1.6,
                    color: "var(--ufy-purple-800)",
                  }}
                >
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
