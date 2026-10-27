"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, HeartPulse, ShieldCheck, BookOpen } from "lucide-react";
import { PageSectionData } from "@/lib/types";

interface HeroSectionProps {
  section?: PageSectionData;
  onOpenSoumission?: () => void;
}

export default function HeroSection({ section, onOpenSoumission }: HeroSectionProps) {
  let content = {
    badgeText: "360° YOUTH ACTION INITIATIVE",
    headlineStart: "WE CREATE WHAT",
    headlineHighlight: "MOVES YOUTH.",
    headlineEnd: "UFY EMPOWERS HEALTH.",
    description:
      "A youth-driven platform dedicated to hands-on first-aid workshops, accessible pediatric health literacy, outdoor mini-libraries, and student-proposed community initiatives.",
    primaryButtonText: "PROPOSE AN IDEA",
    secondaryButtonText: "EXPLORE PROJECTS",
  };

  if (section?.contentJson) {
    try {
      content = { ...content, ...JSON.parse(section.contentJson) };
    } catch {}
  }

  const tickerItems = [
    "FIRST AID & CPR FOR YOUTH",
    "LITTLE FREE LIBRARIES",
    "PEDIATRIC HEALTH ZINES",
    "COMMUNITY IDEA INCUBATOR",
    "PEER-TO-PEER WORKSHOPS",
    "HEALTH LITERACY FOR ALL",
    "MONTREAL & BEYOND",
  ];

  return (
    <section id="hero" className="tok-hero">
      <div>
        {/* Top Tag Badges */}
        <div className="tok-hero__badge-row">
          <span className="tok-tag">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--ufy-purple-bright)",
              }}
            />
            {content.badgeText}
          </span>
          <span className="tok-tag-white">MONTREAL // EST. 2026</span>
          <span className="tok-tag-white">NON-PROFIT // YOUTH-LED</span>
        </div>

        {/* Giant Editorial Typography (TOK Agency Style) */}
        <h1 className="tok-hero__title">
          <span>{content.headlineStart} </span>
          <span className="tok-hero__title-purple">{content.headlineHighlight}</span>
          <br />
          <span className="tok-hero__title-accent">WHERE YOUNG VOICES </span>
          <span>BUILD HEALTH.</span>
        </h1>

        <p className="tok-hero__subtitle">{content.description}</p>

        {/* Action Buttons */}
        <div className="tok-hero__actions">
          <button
            type="button"
            className="tok-btn-primary"
            onClick={onOpenSoumission}
          >
            {content.primaryButtonText}
            <Sparkles size={16} style={{ marginLeft: 10 }} />
          </button>

          <Link href="#programs" className="tok-btn-secondary">
            {content.secondaryButtonText}
            <ArrowRight size={16} style={{ marginLeft: 10 }} />
          </Link>
        </div>
      </div>

      {/* Ticker / Marquee Banner */}
      <div className="tok-ticker-container" aria-hidden="true">
        <div className="tok-ticker">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="tok-ticker-item">
              <span className="tok-ticker-dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
