"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { NavigationItemData, SiteSettingsData } from "@/lib/types";

interface HeaderProps {
  settings: SiteSettingsData;
  navItems: NavigationItemData[];
}

export default function Header({ settings, navItems }: HeaderProps) {
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
  const ctaNav = navItems.find((i) => i.isCta && i.isVisible);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.94)" : "rgba(255, 255, 255, 1)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--ufy-purple-100)" : "1px solid transparent",
        transition: "all var(--transition-normal)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "80px" }}>
        {/* Brand / Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="UFY Logo"
              style={{ height: `${settings.logoHeight || 36}px`, width: "auto", objectFit: "contain" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  backgroundColor: "var(--ufy-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  letterSpacing: "-0.03em",
                  boxShadow: "0 4px 12px rgba(118, 41, 240, 0.25)",
                }}
              >
                U
              </div>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "var(--ufy-purple-900)",
                }}
              >
                UFY
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "32px" }}
          aria-label="Main Navigation"
          className="desktop-nav"
        >
          {visibleNav.map((item) => (
            <a
              key={item.id}
              href={item.path}
              target={item.target}
              rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--ufy-purple-900)",
                transition: "color var(--transition-fast)",
                padding: "8px 0",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ufy-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ufy-purple-900)")}
            >
              {item.label}
            </a>
          ))}

          {/* Primary CTA */}
          {settings.primaryCtaVisible && (
            <a
              href={settings.primaryCtaUrl || "#submit-idea"}
              className="btn btn-primary"
              data-cta="true"
              style={{ padding: "10px 22px", fontSize: "0.9rem" }}
            >
              <Sparkles size={16} />
              <span>{settings.primaryCtaLabel || "Propose an Idea"}</span>
            </a>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: "none",
            padding: "8px",
            color: "var(--ufy-purple-900)",
            borderRadius: "8px",
          }}
          className="mobile-nav-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(16px)",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 49,
            borderTop: "1px solid var(--ufy-purple-100)",
          }}
        >
          {visibleNav.map((item) => (
            <a
              key={item.id}
              href={item.path}
              target={item.target}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--ufy-purple-900)",
                padding: "12px 0",
                borderBottom: "1px solid var(--ufy-purple-50)",
              }}
            >
              {item.label}
            </a>
          ))}

          {settings.primaryCtaVisible && (
            <a
              href={settings.primaryCtaUrl || "#submit-idea"}
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ marginTop: "16px", width: "100%", padding: "14px", justifyContent: "center" }}
            >
              <Sparkles size={18} />
              <span>{settings.primaryCtaLabel || "Propose an Idea"}</span>
            </a>
          )}
        </div>
      )}
    </header>
  );
}

