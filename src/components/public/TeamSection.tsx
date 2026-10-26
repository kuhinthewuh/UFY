"use client";

import React from "react";
import { Sparkles, Linkedin, Globe, Mail, User } from "lucide-react";
import { TeamMemberData, PageSectionData } from "@/lib/types";

interface TeamSectionProps {
  team: TeamMemberData[];
  section?: PageSectionData;
  displayCount?: number;
  presentationStyle?: "editorial" | "grid" | "offset";
}

export default function TeamSection({
  team,
  section,
  displayCount = 6,
  presentationStyle = "editorial",
}: TeamSectionProps) {
  // Filter published and slice by display count
  const published = team.filter((m) => m.isPublished);
  const displayedMembers = published.slice(0, displayCount);

  let content = {
    eyebrow: "Meet Our Team",
    noteText: "Our core team is composed of passionate youth leaders and mentors dedicated to community health education.",
  };

  if (section?.contentJson) {
    try {
      content = { ...content, ...JSON.parse(section.contentJson) };
    } catch {}
  }

  return (
    <section
      id="team"
      className="section-padding"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--ufy-purple-100)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: "720px", marginBottom: "52px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span className="ufy-badge badge-purple">
              <Sparkles size={14} />
              {content.eyebrow}
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
            {section?.title || "The Youth Behind UFY"}
          </h2>

          <p style={{ fontSize: "1.08rem", color: "var(--ufy-purple-800)", lineHeight: 1.6 }}>
            {section?.subtitle || content.noteText}
          </p>
        </div>

        {/* Presentation Styles: 1) Editorial, 2) Grid, 3) Offset */}
        {presentationStyle === "editorial" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "36px",
            }}
          >
            {displayedMembers.map((member) => (
              <div
                key={member.id}
                style={{
                  backgroundColor: "var(--ufy-purple-25)",
                  border: "1.5px solid var(--ufy-purple-100)",
                  borderRadius: "20px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
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
                {/* Member Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <div
                    style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "16px",
                      backgroundColor: "var(--ufy-primary)",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                    }}
                  >
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: `${member.focalPointX}% ${member.focalPointY}%`,
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                        {member.name}
                      </h3>
                      {member.pronouns && (
                        <span style={{ fontSize: "0.8rem", color: "var(--ufy-purple-600)", fontWeight: 500 }}>
                          ({member.pronouns})
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--ufy-primary)", marginTop: "2px" }}>
                      {member.role}
                    </p>

                    {member.department && (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          color: "var(--ufy-purple-700)",
                        }}
                      >
                        {member.department}
                      </span>
                    )}
                  </div>
                </div>

                {/* Biography */}
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--ufy-purple-800)", flexGrow: 1 }}>
                  {member.bio}
                </p>

                {/* Social / Link */}
                {member.linkUrl && (
                  <div style={{ borderTop: "1px solid var(--ufy-purple-100)", paddingTop: "14px" }}>
                    <a
                      href={member.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--ufy-primary)",
                      }}
                    >
                      {member.linkType === "linkedin" ? (
                        <Linkedin size={16} />
                      ) : member.linkType === "email" ? (
                        <Mail size={16} />
                      ) : (
                        <Globe size={16} />
                      )}
                      <span>Connect with {member.name.split(" ")[0]}</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {presentationStyle === "grid" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "28px",
            }}
          >
            {displayedMembers.map((member) => (
              <div
                key={member.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid var(--ufy-purple-100)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-subtle)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    height: "190px",
                    backgroundColor: "var(--ufy-primary)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                  }}
                >
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: `${member.focalPointX}% ${member.focalPointY}%`,
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <User size={54} />
                    </div>
                  )}
                </div>

                <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1 }}>
                  <div>
                    <h3 style={{ fontSize: "1.18rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                      {member.name}
                    </h3>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--ufy-primary)" }}>{member.role}</p>
                  </div>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ufy-purple-800)" }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {presentationStyle === "offset" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "36px",
            }}
          >
            {displayedMembers.map((member, idx) => (
              <div
                key={member.id}
                style={{
                  backgroundColor: idx % 2 === 0 ? "var(--ufy-purple-25)" : "#ffffff",
                  border: "1.5px solid var(--ufy-purple-150, #e6d8fd)",
                  borderRadius: "24px",
                  padding: "32px",
                  marginTop: idx % 2 === 1 ? "24px" : "0px",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "14px",
                      backgroundColor: "var(--ufy-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "1.3rem",
                      fontWeight: 800,
                    }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ufy-purple-950)" }}>
                      {member.name}
                    </h3>
                    <p style={{ fontSize: "0.88rem", color: "var(--ufy-primary)", fontWeight: 600 }}>{member.role}</p>
                  </div>
                </div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--ufy-purple-800)" }}>{member.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
