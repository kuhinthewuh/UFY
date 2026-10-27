"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowUp, Sparkles, Send, Check } from "lucide-react";
import { SiteSettingsData, NavigationItemData } from "@/lib/types";

interface FooterProps {
  settings: SiteSettingsData;
  navItems: NavigationItemData[];
  onOpenSoumission?: () => void;
}

export default function Footer({ settings, navItems, onOpenSoumission }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="tok-footer">
      {/* 3-Column TOK Agency Grid */}
      <div className="tok-footer__grid">
        {/* Col 1: Newsletter & Mission */}
        <div>
          <span className="tok-footer__tag">NEWSLETTER // DISPATCH</span>
          <h3 className="tok-footer__heading">
            STAY TUNED TO YOUTH HEALTH INNOVATION.
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 440, marginBottom: 28, lineHeight: 1.6 }}>
            Receive monthly updates on newly certified workshops, Little Library installations, and open youth leadership calls.
          </p>

          {subscribed ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(118, 41, 240, 0.15)",
                border: "1px solid var(--ufy-purple)",
                padding: "12px 20px",
                borderRadius: "var(--radius-pill)",
                color: "#ffffff",
                fontFamily: "var(--font-heading)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <Check size={16} color="var(--ufy-purple-bright)" />
              WELCOME TO THE UFY COMMUNITY
            </div>
          ) : (
            <form onSubmit={handleNewsletter} style={{ display: "flex", gap: 10, maxWidth: 460 }}>
              <input
                type="email"
                className="tok-input"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{ padding: "14px 20px", borderRadius: "var(--radius-pill)" }}
              />
              <button
                type="submit"
                className="tok-btn-primary"
                style={{ flexShrink: 0, padding: "14px 24px" }}
              >
                JOIN
                <Send size={14} style={{ marginLeft: 6 }} />
              </button>
            </form>
          )}
        </div>

        {/* Col 2: Navigation & Tracks */}
        <div>
          <span className="tok-footer__tag">INDEX // NAVIGATION</span>
          <div className="tok-footer__links">
            <Link href="#mission" className="tok-footer__link">
              360° SERVICES <ArrowUpRight size={14} />
            </Link>
            <Link href="#programs" className="tok-footer__link">
              FEATURED PROJECTS <ArrowUpRight size={14} />
            </Link>
            <Link href="#team" className="tok-footer__link">
              YOUTH CREW <ArrowUpRight size={14} />
            </Link>
            <Link href="#accepted-ideas" className="tok-footer__link">
              COMMUNITY PROPOSALS <ArrowUpRight size={14} />
            </Link>
            <Link href="/admin/login" className="tok-footer__link" style={{ opacity: 0.6 }}>
              ADMIN PORTAL <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Col 3: Information & Soumission CTA */}
        <div>
          <span className="tok-footer__tag">CONTACT // MONTREAL HQ</span>
          <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 24 }}>
            <p style={{ color: "#ffffff", fontWeight: 700, marginBottom: 4 }}>UFY YOUTH ACTION</p>
            <p>Montreal, Quebec, Canada</p>
            <p>hello@ufy.org</p>
            <p>+1 (514) 840-0000</p>
          </div>

          <button
            type="button"
            className="tok-btn-primary"
            onClick={onOpenSoumission}
            style={{ width: "100%", padding: "14px 24px" }}
          >
            REQUEST A PROPOSAL
            <Sparkles size={16} style={{ marginLeft: 8 }} />
          </button>
        </div>
      </div>

      {/* Massive TOK-Style Animated Brand Wordmark */}
      <div className="tok-footer__giant-brand" aria-hidden="true">
        <div className="tok-footer__giant-text">
          UFY
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="tok-footer__bottom">
        <div>
          © 2026 UFY Organization — All Youth Rights Reserved. Registered Canadian Non-Profit.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
            MONTREAL • QUEBEC • CANADA
          </span>

          <button
            type="button"
            onClick={scrollToTop}
            className="tok-btn-secondary"
            style={{ width: 40, height: 40, padding: 0, borderRadius: "50%" }}
            aria-label="Scroll back to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
