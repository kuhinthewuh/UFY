"use client";

import React from "react";
import { ArrowUpRight, HeartPulse, BookOpen, Sparkles, Shield, Compass, Lightbulb } from "lucide-react";
import { PageSectionData } from "@/lib/types";

interface MissionSectionProps {
  section?: PageSectionData;
  onSelectTrack?: (track: string) => void;
}

export default function MissionSection({ section, onSelectTrack }: MissionSectionProps) {
  let content = {
    eyebrow: "AGENCY // 360° SERVICES",
    title: "WE DELIVER MEASURABLE YOUTH IMPACT.",
    leadParagraph:
      "UFY operates across five core domains to bridge the gap between medical knowledge and grassroots youth action. Every service is peer-facilitated, clinically guided, and open to all.",
  };

  if (section?.contentJson) {
    try {
      content = { ...content, ...JSON.parse(section.contentJson) };
    } catch {}
  }

  const services = [
    {
      num: "01",
      title: "First Aid & CPR Training",
      category: "First Aid & Health Workshop",
      desc: "Hands-on emergency resuscitation, choking relief, and rapid wound care workshops tailored for high schoolers and student athletes.",
      tag: "LIFESAVING SKILLS",
      icon: HeartPulse,
    },
    {
      num: "02",
      title: "Little Free Health Libraries",
      category: "Little Libraries & Books",
      desc: "Architecturally distinct outdoor book micro-stations placed in public parks and community centers, stocked with curated wellness literature.",
      tag: "COMMUNITY LITERACY",
      icon: BookOpen,
    },
    {
      num: "03",
      title: "Pediatric Health Zines",
      category: "Educational Cards & Zines",
      desc: "Youth-illustrated comic primers and infographic pocket cards that demystify chronic conditions, allergies, and pediatric first-response.",
      tag: "CREATIVE ADVOCACY",
      icon: Sparkles,
    },
    {
      num: "04",
      title: "School Workshops & Tours",
      category: "Community Partnership",
      desc: "Interactive classroom interventions and school assemblies where student instructors train entire cohorts in life-saving confidence.",
      tag: "ACADEMIC OUTREACH",
      icon: Compass,
    },
    {
      num: "05",
      title: "Youth Idea Incubator",
      category: "Youth Well-Being Event",
      desc: "Providing seed materials, logistics, and board mentorship to bring student-conceived health interventions to life.",
      tag: "GRASSROOTS INCUBATION",
      icon: Lightbulb,
    },
    {
      num: "06",
      title: "Community Well-Being Labs",
      category: "Other Community Proposal",
      desc: "Safe, inclusive neighborhood spaces addressing adolescent mental resilience, nutrition literacy, and peer care support networks.",
      tag: "HOLISTIC WELLNESS",
      icon: Shield,
    },
  ];

  return (
    <section id="mission" className="tok-services">
      {/* Section Header */}
      <div className="tok-section-head">
        <div>
          <span className="tok-tag">{content.eyebrow}</span>
        </div>
        <h2 className="tok-section-title">{content.title}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", maxWidth: 740, lineHeight: 1.6 }}>
          {content.leadParagraph}
        </p>
      </div>

      {/* 360° Services Grid */}
      <div className="tok-services-grid">
        {services.map((srv) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.num}
              className="tok-service-card"
              onClick={() => onSelectTrack?.(srv.category)}
              role="button"
              tabIndex={0}
              aria-label={`Learn more about ${srv.title}`}
            >
              <div>
                <div className="tok-service-card__top">
                  <span className="tok-service-card__num">{srv.num}</span>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: "rgba(118, 41, 240, 0.12)",
                      border: "1px solid var(--ufy-purple-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--ufy-purple-bright)",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                </div>

                <div className="tok-tag" style={{ fontSize: 10, padding: "3px 10px", marginBottom: 14 }}>
                  {srv.tag}
                </div>

                <h3 className="tok-service-card__title">{srv.title}</h3>
                <p className="tok-service-card__desc">{srv.desc}</p>
              </div>

              <div className="tok-service-card__bottom">
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-white)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  COLLABORATE
                  <ArrowUpRight size={16} color="var(--ufy-purple-bright)" />
                </span>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
                  UFY // TRACK
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
