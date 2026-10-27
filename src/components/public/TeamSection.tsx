"use client";

import React from "react";
import { Sparkles, ArrowUpRight, User, Plus } from "lucide-react";
import { TeamMemberData, PageSectionData } from "@/lib/types";

interface TeamSectionProps {
  team: TeamMemberData[];
  section?: PageSectionData;
  displayCount?: number;
  presentationStyle?: "editorial" | "grid" | "offset";
  onOpenSoumission?: () => void;
}

export default function TeamSection({
  team,
  section,
  displayCount = 6,
  onOpenSoumission,
}: TeamSectionProps) {
  const published = team.filter((m) => m.isPublished);
  const displayedMembers = published.slice(0, displayCount);

  // Fallback members if DB has few
  const fallbackMembers: (Partial<TeamMemberData> & { id: string; name: string; role: string; bio: string })[] = [
    {
      id: "mem-1",
      name: "Sophia Chen",
      role: "Executive Director & Peer Lead",
      pronouns: "she/her",
      bio: "Second-year health sciences student leading pediatric first-aid outreach and curriculum across Montreal schools.",
      department: "Leadership",
      photoUrl: null,
    },
    {
      id: "mem-2",
      name: "Alex Tremblay",
      role: "Director of First Aid Training",
      pronouns: "they/them",
      bio: "Certified Red Cross youth instructor who has trained over 400 teenagers in emergency resuscitation.",
      department: "Education",
      photoUrl: null,
    },
    {
      id: "mem-3",
      name: "Amina Diallo",
      role: "Lead Little Libraries Coordinator",
      pronouns: "she/her",
      bio: "Manages neighborhood mini-library construction, community partnerships, and public health book drops.",
      department: "Community",
      photoUrl: null,
    },
    {
      id: "mem-4",
      name: "Liam Patel",
      role: "Creative Director & Zine Editor",
      pronouns: "he/him",
      bio: "Graphic designer and youth advocate turning medical terminology into digestible, engaging graphic pamphlets.",
      department: "Creative",
      photoUrl: null,
    },
  ];

  const membersToDisplay = displayedMembers.length > 0 ? displayedMembers : fallbackMembers;

  return (
    <section id="team" className="tok-team">
      {/* Section Header */}
      <div className="tok-section-head">
        <div>
          <span className="tok-tag">AGENCY // YOUTH CREW</span>
        </div>
        <h2 className="tok-section-title">
          {section?.title || "THE MINDS BEHIND UFY."}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", maxWidth: 740, lineHeight: 1.6 }}>
          UFY is completely conceived and run by young changemakers in Montreal, supported by professional medical advisors.
        </p>
      </div>

      {/* Team Cards Grid (TOK agency-team) */}
      <div className="tok-team-grid">
        {membersToDisplay.map((member) => (
          <article key={member.id} className="tok-team-card">
            <div className="tok-team-card__image-wrap">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="tok-team-card__image"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(180deg, #161928 0%, #0d0f18 100%)",
                    color: "var(--ufy-purple-bright)",
                  }}
                >
                  <User size={64} style={{ opacity: 0.5 }} />
                </div>
              )}
            </div>

            <div className="tok-team-card__info">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="tok-tag" style={{ fontSize: 9, padding: "2px 8px" }}>
                  {member.department || "CORE CREW"}
                </span>
                {member.pronouns && (
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
                    {member.pronouns}
                  </span>
                )}
              </div>

              <h3 className="tok-team-card__name">{member.name}</h3>
              <div className="tok-team-card__role">{member.role}</div>
              <p className="tok-team-card__bio">{member.bio}</p>
            </div>
          </article>
        ))}

        {/* TOK Spontaneous Application Card */}
        <div
          className="tok-team-card"
          onClick={onOpenSoumission}
          style={{
            cursor: "pointer",
            border: "1px dashed var(--ufy-purple-border)",
            background: "rgba(118, 41, 240, 0.05)",
            justifyContent: "center",
            alignItems: "center",
            padding: 36,
            textAlign: "center",
            minHeight: 380,
          }}
          role="button"
          tabIndex={0}
          aria-label="Join the youth team"
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--ufy-purple)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 0 25px var(--ufy-purple-glow)",
            }}
          >
            <Plus size={28} color="#ffffff" />
          </div>

          <span className="tok-tag" style={{ marginBottom: 12 }}>RECRUITING</span>
          <h3 className="tok-team-card__name" style={{ fontSize: "1.4rem" }}>
            JOIN THE UFY CREW
          </h3>
          <p className="tok-team-card__bio" style={{ maxWidth: 240, margin: "12px auto 20px" }}>
            Spontaneous application: Become an instructor, zine illustrator, or neighborhood library steward.
          </p>

          <span
            className="tok-btn-secondary"
            style={{ padding: "8px 18px", fontSize: 12 }}
          >
            APPLY TO JOIN
            <ArrowUpRight size={14} style={{ marginLeft: 6 }} />
          </span>
        </div>
      </div>
    </section>
  );
}
