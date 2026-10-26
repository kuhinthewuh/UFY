"use client";

import React from "react";
import { ArrowRight, HeartPulse, BookOpen, Sparkles, ShieldCheck } from "lucide-react";
import { PageSectionData } from "@/lib/types";

interface HeroSectionProps {
  section?: PageSectionData;
}

export default function HeroSection({ section }: HeroSectionProps) {
  let content = {
    badgeText: "UFY Youth Action Initiative",
    headlineStart: "Where Young Voices",
    headlineHighlight: "Build Real Health",
    headlineEnd: "& Stronger Communities.",
    description: "We equip young people with hands-on first-aid workshops, accessible health education tools, and community mini-libraries designed by youth, for youth.",
    primaryButtonText: "Propose an Idea",
    primaryButtonLink: "#submit-idea",
    secondaryButtonText: "Explore Initiatives",
    secondaryButtonLink: "#programs",
    statsNote: "Youth-Led • Strictly Community-Focused",
  };

  if (section?.contentJson) {
    try {
      content = { ...content, ...JSON.parse(section.contentJson) };
    } catch {}
  }

  const bgMode = section?.backgroundMode || "purple";
  const isPurpleBg = bgMode === "purple" || bgMode === "dark-purple";

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        backgroundColor: isPurpleBg ? "var(--ufy-primary)" : "var(--bg-primary)",
        color: isPurpleBg ? "#ffffff" : "var(--text-primary)",
        paddingTop: "90px",
        paddingBottom: "110px",
        overflow: "hidden",
      }}
      className={isPurpleBg ? "bg-ufy-pattern" : ""}
    >
      {/* Decorative Geometric Rings */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-15%",
          right: "-8%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          border: isPurpleBg ? "1.5px solid rgba(255, 255, 255, 0.12)" : "1.5px solid var(--ufy-purple-100)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-5%",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: isPurpleBg ? "1.5px solid rgba(255, 255, 255, 0.08)" : "1.5px solid var(--ufy-purple-100)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "54px",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left Column: Headlines & Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Tag Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                className={`ufy-badge ${isPurpleBg ? "badge-white" : "badge-purple"}`}
              >
                <Sparkles size={14} />
                {content.badgeText}
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(2.5rem, 5.2vw, 4.4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.035em",
                color: isPurpleBg ? "#ffffff" : "var(--ufy-purple-900)",
              }}
            >
              {content.headlineStart}{" "}
              <span
                style={{
                  display: "inline-block",
                  position: "relative",
                  color: isPurpleBg ? "#ffffff" : "var(--ufy-primary)",
                  textDecoration: "underline",
                  textDecorationColor: isPurpleBg ? "rgba(255, 255, 255, 0.4)" : "var(--ufy-purple-300)",
                  textUnderlineOffset: "8px",
                }}
              >
                {content.headlineHighlight}
              </span>{" "}
              {content.headlineEnd}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "1.18rem",
                lineHeight: 1.65,
                color: isPurpleBg ? "rgba(255, 255, 255, 0.9)" : "var(--ufy-purple-800)",
                maxWidth: "580px",
              }}
            >
              {content.description}
            </p>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "16px",
                marginTop: "12px",
              }}
            >
              <a
                href={content.primaryButtonLink}
                className={`btn ${isPurpleBg ? "btn-white" : "btn-primary"}`}
                style={{ padding: "16px 32px", fontSize: "1.05rem", fontWeight: 700 }}
              >
                <span>{content.primaryButtonText}</span>
                <ArrowRight size={18} />
              </a>

              <a
                href={content.secondaryButtonLink}
                className={`btn ${isPurpleBg ? "btn-outline-white" : "btn-outline-purple"}`}
                style={{ padding: "16px 28px", fontSize: "1.05rem" }}
              >
                <span>{content.secondaryButtonText}</span>
              </a>
            </div>

            {/* Community Note */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "8px",
                fontSize: "0.88rem",
                color: isPurpleBg ? "rgba(255, 255, 255, 0.75)" : "var(--ufy-purple-700)",
                fontWeight: 500,
              }}
            >
              <ShieldCheck size={16} />
              <span>{content.statsNote}</span>
            </div>
          </div>

          {/* Right Column: Bespoke Composition */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
            className="hero-composition"
          >
            {/* Top Interactive Card */}
            <div
              style={{
                backgroundColor: isPurpleBg ? "rgba(255, 255, 255, 0.12)" : "#ffffff",
                backdropFilter: "blur(14px)",
                border: isPurpleBg ? "1.5px solid rgba(255, 255, 255, 0.25)" : "1.5px solid var(--ufy-purple-100)",
                borderRadius: "20px",
                padding: "28px",
                color: isPurpleBg ? "#ffffff" : "var(--ufy-purple-900)",
                boxShadow: isPurpleBg ? "0 18px 45px rgba(0, 0, 0, 0.18)" : "var(--shadow-card)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: isPurpleBg ? "rgba(255, 255, 255, 0.2)" : "var(--ufy-purple-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isPurpleBg ? "#ffffff" : "var(--ufy-primary)",
                  }}
                >
                  <HeartPulse size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Peer First Aid Training</h2>
                  <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>Certified hands-on workshops</p>
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.55, opacity: 0.9 }}>
                Equipping middle and high schoolers with real CPR, choking recovery, and emergency response procedures.
              </p>
            </div>

            {/* Bottom Offset Card */}
            <div
              style={{
                marginLeft: "auto",
                width: "90%",
                backgroundColor: isPurpleBg ? "rgba(255, 255, 255, 0.98)" : "var(--ufy-purple-50)",
                borderRadius: "20px",
                padding: "24px 28px",
                color: "var(--ufy-purple-950)",
                boxShadow: "0 18px 40px rgba(0, 0, 0, 0.15)",
                border: isPurpleBg ? "none" : "1.5px solid var(--ufy-purple-200)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "var(--ufy-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                  }}
                >
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ufy-purple-900)" }}>
                    Little Libraries Project
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "var(--ufy-purple-700)" }}>Youth-built book kiosks</p>
                </div>
              </div>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.5, color: "var(--ufy-purple-800)" }}>
                Placing community book sharing kiosks focused on health, science, and youth storytelling in local public spaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

