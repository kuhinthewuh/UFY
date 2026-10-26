"use client";

import React from "react";
import Link from "next/link";
import { Lock, Heart, ArrowUp } from "lucide-react";
import { SiteSettingsData, NavigationItemData } from "@/lib/types";

interface FooterProps {
  settings: SiteSettingsData;
  navItems: NavigationItemData[];
}

export default function Footer({ settings, navItems }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visibleNav = navItems.filter((i) => i.isVisible && !i.isCta);

  return (
    <footer
      style={{
        backgroundColor: "var(--ufy-purple-950)",
        color: "#ffffff",
        paddingTop: "72px",
        paddingBottom: "40px",
        borderTop: "1px solid var(--ufy-purple-900)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gap: "48px",
            marginBottom: "56px",
          }}
          className="footer-grid"
        >
          {/* Brand Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "var(--ufy-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "#ffffff",
                }}
              >
                U
              </div>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>
                UFY
              </span>
            </div>

            <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ufy-purple-100)", maxWidth: "380px" }}>
              {settings.footerMissionText ||
                "Equipping young changemakers with real first-aid training, interactive health learning kits, and community mini-libraries."}
            </p>

            {settings.contactEmail && (
              <p style={{ fontSize: "0.9rem", color: "var(--ufy-purple-200)" }}>
                Contact:{" "}
                <a
                  href={`mailto:${settings.contactEmail}`}
                  style={{ color: "#ffffff", textDecoration: "underline", textUnderlineOffset: "4px" }}
                >
                  {settings.contactEmail}
                </a>
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--ufy-purple-200)",
              }}
            >
              Navigation
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {visibleNav.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--ufy-purple-100)",
                    transition: "color var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ufy-purple-100)")}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#submit-idea"
                style={{
                  fontSize: "0.92rem",
                  color: "var(--ufy-purple-200)",
                  fontWeight: 600,
                }}
              >
                Propose a Community Idea →
              </a>
            </div>
          </div>

          {/* Privacy & Organization Notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--ufy-purple-200)",
              }}
            >
              Youth Privacy
            </h4>

            <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--ufy-purple-100)" }}>
              {settings.privacyNotice ||
                "We strictly uphold youth privacy. We do not sell data, track invasive identifiers, or require unnecessary personal details."}
            </p>

            {settings.socialGithub && (
              <a
                href={settings.socialGithub}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.88rem",
                  color: "var(--ufy-purple-200)",
                  textDecoration: "underline",
                }}
              >
                View Project on GitHub
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--ufy-purple-900)",
            paddingTop: "28px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            fontSize: "0.85rem",
            color: "var(--ufy-purple-300)",
          }}
        >
          <div>{settings.copyrightText || `© ${new Date().getFullYear()} UFY. All rights reserved.`}</div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={scrollToTop}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--ufy-purple-200)",
                fontSize: "0.85rem",
              }}
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>

            {/* Admin Portal Entry Link */}
            <Link
              href="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--ufy-purple-200)",
                padding: "4px 10px",
                borderRadius: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              <Lock size={12} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

