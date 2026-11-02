"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, HeartHandshake } from "lucide-react";

export interface NavLinkItem {
  id?: string;
  label: string;
  path: string;
  target?: string;
  isVisible?: boolean;
  isCta?: boolean;
}

export interface UfyNavbarProps {
  onOpenModal?: () => void;
  navItems?: NavLinkItem[];
  settings?: {
    brandTagline?: string | null;
    logoUrl?: string | null;
    logoHeight?: number | null;
    primaryCtaLabel?: string | null;
    primaryCtaUrl?: string | null;
    primaryCtaVisible?: boolean | null;
  } | null;
  brandTagline?: string;
  logoUrl?: string | null;
  logoHeight?: number;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaVisible?: boolean;
}

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: "Home", path: "/" },
  { label: "Videos", path: "/videos" },
  { label: "Virtual Letters", path: "/letters" },
  { label: "Journey", path: "/journey" },
  { label: "Impact", path: "/impact" },
  { label: "Our Team", path: "/team" },
  { label: "Gallery", path: "/gallery" },
  { label: "Propose", path: "/propose" },
];

export default function UfyNavbar({
  onOpenModal,
  navItems,
  settings,
  brandTagline,
  logoUrl,
  logoHeight,
  ctaLabel,
  ctaUrl,
  ctaVisible,
}: UfyNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const resolvedBrandTagline = brandTagline ?? settings?.brandTagline ?? "Up for Youth";
  const resolvedLogoUrl = logoUrl !== undefined ? logoUrl : settings?.logoUrl;
  const resolvedLogoHeight = logoHeight ?? settings?.logoHeight ?? 36;
  const resolvedCtaLabel = ctaLabel ?? settings?.primaryCtaLabel ?? "Volunteer";
  const resolvedCtaUrl = ctaUrl ?? settings?.primaryCtaUrl ?? "/volunteer";
  const resolvedCtaVisible = ctaVisible ?? settings?.primaryCtaVisible ?? true;

  const links =
    navItems && navItems.length > 0
      ? navItems.filter((i) => i.isVisible !== false && !i.isCta)
      : DEFAULT_NAV_LINKS;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 lg:px-12 py-3.5 grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center pointer-events-none transition-all">
        {/* Left: UFY — Up for Youth Circular Brand Mark */}
        <div className="pointer-events-auto flex items-center justify-start gap-3 shrink-0">
          <Link
            href="/"
            aria-label="UFY — Up for Youth Home"
            className="flex items-center gap-2.5 group"
          >
            {resolvedLogoUrl ? (
              <img
                src={resolvedLogoUrl}
                alt="Up for Youth"
                style={{ height: `${resolvedLogoHeight}px`, width: "auto" }}
                className="rounded-lg object-contain shadow-sm"
              />
            ) : (
              <div
                style={{ backgroundColor: "var(--ufy-primary-purple, #7629f0)" }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-[15px] tracking-tight transition-transform group-hover:scale-105 shadow-md border-2 border-white"
              >
                ufy
              </div>
            )}
            <div className="hidden 2xl:flex flex-col leading-none">
              <span className="font-black text-[13.5px] tracking-tight text-[#140529] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[#d4b8fc]/70 shadow-sm">
                {resolvedBrandTagline}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Mathematically Centered & Evenly Spaced Floating Pill Navigation Bar */}
        <div className="pointer-events-auto hidden lg:flex items-center justify-center justify-self-center">
          <nav className="bg-white/95 backdrop-blur-md border border-[#d4b8fc]/90 rounded-full px-3 py-1.5 shadow-[0_8px_28px_rgba(118,41,240,0.12)] flex items-center justify-center gap-1 xl:gap-1.5 text-[12.5px] xl:text-[13px] font-bold text-[#140529]">
            {links.map((item) => {
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname === item.path || pathname.startsWith(item.path + "/");

              return (
                <Link
                  key={item.path + item.label}
                  href={item.path}
                  target={item.target === "_blank" ? "_blank" : undefined}
                  rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                  style={
                    isActive
                      ? { backgroundColor: "var(--ufy-primary-purple, #7629f0)", color: "#ffffff" }
                      : undefined
                  }
                  className={`px-3.5 xl:px-4 py-1.5 rounded-full transition-all whitespace-nowrap text-center ${
                    isActive
                      ? "shadow-sm"
                      : "text-[#140529] hover:text-[#7629f0] hover:bg-[#f7f4fc]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Volunteer Sign-Up, Quick Modal & Admin Portal */}
        <div className="pointer-events-auto flex items-center justify-end gap-2 shrink-0 justify-self-end">
          <Link
            href="/admin/login"
            className="hidden sm:inline-flex text-[12.5px] font-bold text-[#140529] bg-white/85 backdrop-blur-sm px-3.5 py-2 rounded-full border border-[#d4b8fc]/80 hover:border-[#7629f0] hover:bg-white transition-all shadow-sm"
          >
            Admin
          </Link>

          {resolvedCtaVisible && (
            <Link
              href={resolvedCtaUrl || "/volunteer"}
              style={{ backgroundColor: "var(--ufy-primary-purple, #7629f0)" }}
              className="text-[12.5px] sm:text-[13px] font-extrabold text-white hover:opacity-95 px-4 sm:px-5 py-2 rounded-full transition-all shadow-[0_6px_18px_rgba(118,41,240,0.3)] hover:shadow-[0_8px_24px_rgba(118,41,240,0.42)] hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <HeartHandshake size={14} />
              <span>{resolvedCtaLabel || "Volunteer"}</span>
            </Link>
          )}

          {onOpenModal && (
            <button
              type="button"
              onClick={onOpenModal}
              className="hidden md:inline-flex text-[12.5px] font-extrabold text-[#140529] bg-white hover:bg-[#f8f4fe] px-4 py-2 rounded-full border-2 border-[#140529] shadow-[2px_3px_0px_#140529] transition-transform hover:-translate-y-0.5 items-center justify-center"
            >
              <span>Pitch Idea</span>
            </button>
          )}

          {/* Mobile/Tablet Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden w-10 h-10 rounded-full bg-white border border-[#d4b8fc] shadow-md flex items-center justify-center text-[#140529] hover:text-[#7629f0]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#140529]/65 backdrop-blur-sm lg:hidden flex flex-col justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl p-6 shadow-2xl border-t-2 border-[#140529] max-h-[86vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#7629f0] text-white font-black text-sm flex items-center justify-center">
                  ufy
                </div>
                <div>
                  <div className="font-black text-[#140529] leading-none">Up for Youth</div>
                  <div className="text-[11px] font-mono text-[#7629f0]">Explore UFY Pages</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[#140529]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-4">
              {links.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname === item.path || pathname.startsWith(item.path + "/");
                return (
                  <Link
                    key={item.path + item.label}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      isActive
                        ? "bg-[#7629f0] text-white shadow-sm"
                        : "text-[#140529] bg-[#f8f4fe] hover:bg-[#ebdffe]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={15} className={isActive ? "text-white" : "text-[#7629f0]"} />
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row gap-2.5">
              <Link
                href="/volunteer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#7629f0] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <HeartHandshake size={16} />
                <span>Volunteer Sign-Up</span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-3 rounded-xl border border-[#d4b8fc] text-[#140529] font-bold text-sm hover:bg-[#f7f4fc]"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
