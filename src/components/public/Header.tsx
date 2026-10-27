"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, X, Volume2 } from "lucide-react";
import { NavigationItemData, SiteSettingsData } from "@/lib/types";

interface HeaderProps {
  settings: SiteSettingsData;
  navItems: NavigationItemData[];
  onOpenSoumission?: () => void;
}

export default function Header({ settings, navItems, onOpenSoumission }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleNav = navItems.filter((i) => i.isVisible && !i.isCta);

  return (
    <>
      <header className={`tok-header ${scrolled ? "tok-header--scrolled" : ""}`}>
        {/* Brand Wordmark (TOK-styled ufy) */}
        <Link href="/" className="tok-header__logo" aria-label="UFY Homepage">
          ufy<span className="tok-header__logo-dot">.</span>
        </Link>

        {/* Floating Center Nav Pills */}
        <nav className="tok-header__nav" aria-label="Main Navigation">
          <Link href="#mission" className="tok-header__link">
            AGENCY // 360°
          </Link>
          <Link href="#programs" className="tok-header__link">
            PROJECTS
          </Link>
          <Link href="#team" className="tok-header__link">
            CREW
          </Link>
          <Link href="#accepted-ideas" className="tok-header__link">
            COMMUNITY
          </Link>
          <Link href="/admin/login" className="tok-header__link" style={{ opacity: 0.7 }}>
            ADMIN
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="tok-header__actions">
          {/* Status pill indicator */}
          <div
            className="tok-tag-white"
            style={{ display: "none", alignItems: "center", gap: 6, cursor: "default" }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--ufy-purple-bright)",
                boxShadow: "0 0 10px var(--ufy-purple-bright)",
              }}
            />
            <span style={{ fontSize: 10 }}>ONLINE // YOUTH</span>
          </div>

          {/* TOK Signature "SOUMISSION / PROPOSE AN IDEA" Pill Button */}
          <button
            type="button"
            className="tok-btn-primary"
            onClick={onOpenSoumission}
            style={{ padding: "12px 24px", fontSize: "13px" }}
          >
            PROPOSE AN IDEA
            <Sparkles size={14} style={{ marginLeft: 8 }} />
          </button>

          {/* Hamburger toggle */}
          <button
            type="button"
            className="tok-header__burger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <div
              className="tok-header__burger-line"
              style={{
                transform: mobileMenuOpen ? "rotate(45deg) translate(2.5px, 2.5px)" : "none",
              }}
            />
            <div
              className="tok-header__burger-line"
              style={{
                transform: mobileMenuOpen ? "rotate(-45deg) translate(2.5px, -2.5px)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile / Flyout Menu Overlay */}
      <div className={`tok-menu-overlay ${mobileMenuOpen ? "tok-menu-overlay--open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="tok-tag">UFY // MENU</span>
          <button
            type="button"
            className="tok-header__burger"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Menu"
          >
            <X size={20} color="#ffffff" />
          </button>
        </div>

        <div className="tok-menu-overlay__links">
          <Link
            href="#mission"
            className="tok-menu-overlay__link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>01</span> AGENCY // 360°
          </Link>
          <Link
            href="#programs"
            className="tok-menu-overlay__link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>02</span> PROJECTS
          </Link>
          <Link
            href="#team"
            className="tok-menu-overlay__link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>03</span> YOUTH CREW
          </Link>
          <Link
            href="#accepted-ideas"
            className="tok-menu-overlay__link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>04</span> ACCEPTED IDEAS
          </Link>
          <Link
            href="/admin/login"
            className="tok-menu-overlay__link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>05</span> PORTAL // CMS
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>
              YOUTH HEADQUARTERS
            </div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>MONTREAL, QC // CANADA</div>
          </div>

          <button
            type="button"
            className="tok-btn-primary"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSoumission?.();
            }}
          >
            PROPOSE AN IDEA
            <ArrowUpRight size={16} style={{ marginLeft: 8 }} />
          </button>
        </div>
      </div>
    </>
  );
}
