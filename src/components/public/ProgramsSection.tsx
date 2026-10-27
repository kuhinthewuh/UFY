"use client";

import React from "react";
import { ArrowUpRight, Sparkles, HeartPulse, BookOpen, ShieldCheck, Calendar, Users, Award } from "lucide-react";
import { ProgramData, PageSectionData } from "@/lib/types";

interface ProgramsSectionProps {
  programs: ProgramData[];
  section?: PageSectionData;
  onOpenSoumission?: () => void;
}

export default function ProgramsSection({ programs, section, onOpenSoumission }: ProgramsSectionProps) {
  const publishedPrograms = programs.filter((p) => p.isPublished);

  // Curated project initiatives inspired by TOK's module-projects
  const fallbackProjects: (Partial<ProgramData> & { stats: { val: string; label: string }[]; tag: string; year: string })[] = [
    {
      id: "prog-1",
      title: "Metro CPR & First Aid Blitz",
      category: "First Aid & CPR",
      summary: "Peer-led emergency CPR and first-aid training.",
      description: "An intensive peer-led initiative certifying high school students across Montreal in emergency CPR, automated external defibrillator (AED) operation, and severe bleed control.",
      stats: [
        { val: "540+", label: "Youth Certified" },
        { val: "18", label: "School Campuses" },
      ],
      tag: "EMERGENCY PREPAREDNESS",
      year: "2026",
    },
    {
      id: "prog-2",
      title: "Little Free Health Libraries Network",
      category: "Little Libraries",
      summary: "Handcrafted outdoor health library shelters.",
      description: "Designed, handcrafted, and weatherproofed outdoor community book shelters placed in neighborhood parks, stocked with curated pediatric health guides and youth literature.",
      stats: [
        { val: "14", label: "Active Libraries" },
        { val: "3,200+", label: "Books Circulated" },
      ],
      tag: "NEIGHBORHOOD LITERACY",
      year: "2026",
    },
    {
      id: "prog-3",
      title: "Illustrated Pediatric Comic Zines",
      category: "Health Zines",
      summary: "Youth-authored comic health pamphlets.",
      description: "Youth-authored and illustrated zines demystifying common childhood health emergencies, pediatric asthma, allergy anaphylaxis, and psychological first aid in accessible, jargon-free prose.",
      stats: [
        { val: "4,500+", label: "Copies Distributed" },
        { val: "3", label: "Published Editions" },
      ],
      tag: "CREATIVE PUBLISHING",
      year: "2026",
    },
  ];

  return (
    <section id="programs" className="tok-projects">
      {/* Section Header */}
      <div className="tok-section-head">
        <div>
          <span className="tok-tag">PROJECTS // CASE STUDIES</span>
        </div>
        <h2 className="tok-section-title">
          {section?.title || "FEATURED UFY INITIATIVES."}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", maxWidth: 740, lineHeight: 1.6 }}>
          Explore the projects conceptualized, built, and deployed by youth leaders across Montreal and surrounding communities.
        </p>
      </div>

      {/* Asymmetric Project Cards (TOK module-projects) */}
      <div className="tok-projects-list">
        {(publishedPrograms.length > 0 ? publishedPrograms : fallbackProjects).map((item, idx) => {
          const stats = "stats" in item && Array.isArray((item as any).stats)
            ? (item as any).stats
            : [
                { val: "100%", label: "Youth-Led" },
                { val: "2026", label: "Active Year" },
              ];

          return (
            <article key={item.id} className="tok-project-card">
              <div className="tok-project-card__content">
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="tok-tag">{item.category}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-dim)" }}>
                      INITIATIVE // 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="tok-project-card__title">{item.title}</h3>
                  <p className="tok-project-card__desc">{item.description || item.summary || ""}</p>
                </div>

                <div>
                  {/* Stats Grid */}
                  <div className="tok-project-card__stats">
                    {stats.map((s: any, sIdx: number) => (
                      <div key={sIdx}>
                        <div className="tok-project-card__stat-val">{s.val}</div>
                        <div className="tok-project-card__stat-lbl">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button
                      type="button"
                      className="tok-btn-secondary"
                      onClick={onOpenSoumission}
                      style={{ padding: "10px 22px", fontSize: 12 }}
                    >
                      REQUEST SIMILAR WORKSHOP
                      <ArrowUpRight size={14} style={{ marginLeft: 6 }} />
                    </button>
                    <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ufy-purple-bright)" }}>
                      COMMUNITY VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphic Visual Panel */}
              <div className="tok-project-card__visual">
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 60% 40%, rgba(118, 41, 240, 0.25), transparent 70%)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    zIndex: 1,
                    padding: 40,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      background: "rgba(118, 41, 240, 0.15)",
                      border: "2px solid var(--ufy-purple)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 35px var(--ufy-purple-glow)",
                    }}
                  >
                    {idx === 0 ? (
                      <HeartPulse size={42} color="#ffffff" />
                    ) : idx === 1 ? (
                      <BookOpen size={42} color="#ffffff" />
                    ) : (
                      <Award size={42} color="#ffffff" />
                    )}
                  </div>

                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                    UFY CASE STUDY // 0{idx + 1}
                  </div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 800 }}>
                    {item.title}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom CTA to propose */}
      <div
        style={{
          marginTop: 60,
          background: "var(--bg-deep)",
          border: "1px solid var(--border-glass-bright)",
          borderRadius: "var(--radius-xl)",
          padding: "50px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <span className="tok-tag" style={{ marginBottom: 12 }}>COLLABORATION CALL</span>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 800, marginTop: 8 }}>
            HAVE AN IDEA FOR YOUR NEIGHBORHOOD?
          </h3>
          <p style={{ color: "var(--text-muted)", maxWidth: 540, marginTop: 6 }}>
            Pitch your workshop or installation concept. UFY provides materials, medical certification, and logistical support.
          </p>
        </div>

        <button
          type="button"
          className="tok-btn-primary"
          onClick={onOpenSoumission}
        >
          SUBMIT INITIATIVE PROPOSAL
          <Sparkles size={16} style={{ marginLeft: 8 }} />
        </button>
      </div>
    </section>
  );
}
