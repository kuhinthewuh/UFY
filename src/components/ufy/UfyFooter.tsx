"use client";

import React from "react";
import Link from "next/link";
import { HeartHandshake, Mail, ArrowUpRight } from "lucide-react";

interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

interface UfyFooterProps {
  onOpenModal?: () => void;
  settings?: {
    brandTagline?: string | null;
    footerMissionText?: string | null;
    footerLocationText?: string | null;
    footerColumnsJson?: string | null;
    contactEmail?: string | null;
    ufyInboxEmail?: string | null;
    socialInstagram?: string | null;
    socialYoutube?: string | null;
    socialLinkedin?: string | null;
    socialGithub?: string | null;
    copyrightText?: string | null;
    privacyNotice?: string | null;
  } | null;
}

export default function UfyFooter({ settings }: UfyFooterProps) {
  const contactEmail = settings?.contactEmail || "hello@ufy.org";
  const inboxEmail = settings?.ufyInboxEmail || "ideas@ufy.org";
  const instagramUrl = settings?.socialInstagram || "https://instagram.com/ufy_youth";

  let columns: FooterColumn[] = [
    {
      title: "explore ufy",
      links: [
        { label: "home — up for youth", href: "/" },
        { label: "educational videos", href: "/videos" },
        { label: "virtual letters & affirmations", href: "/letters" },
        { label: "volunteer sign-up & hours", href: "/volunteer" },
        { label: "past event journey", href: "/journey" },
      ],
    },
    {
      title: "community & proof",
      links: [
        { label: "live impact counters", href: "/impact" },
        { label: "meet our youth leaders", href: "/team" },
        { label: "3d dome photo gallery", href: "/gallery" },
        { label: "propose an idea dossier", href: "/propose" },
      ],
    },
    {
      title: "flagship programs",
      links: [
        { label: "hospitalized youth letters", href: "/letters" },
        { label: "peer first-aid & cpr clinics", href: "/videos" },
        { label: "neighborhood book drives", href: "/#initiatives" },
        { label: "school chapter incubator", href: "/volunteer" },
      ],
    },
    {
      title: "connect & admin",
      links: [
        { label: "instagram @ufy_youth", href: instagramUrl },
        { label: `proposals: ${inboxEmail}`, href: "/propose" },
        { label: `general: ${contactEmail}`, href: `mailto:${contactEmail}` },
        { label: "admin site builder portal", href: "/admin/login" },
      ],
    },
  ];

  if (settings?.footerColumnsJson) {
    try {
      const parsed = JSON.parse(settings.footerColumnsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        columns = parsed;
      }
    } catch {}
  }

  return (
    <footer
      style={{ backgroundColor: "var(--ufy-footer-obsidian, #0d0519)" }}
      className="text-neutral-300 pt-16 pb-12 mt-20 border-t-2 border-[#7629f0]/40 w-full text-center"
    >
      <div className="ufy-container">
        {/* Top Centered Brand Mission Strip */}
        <div className="flex flex-col items-center justify-center gap-6 pb-12 mb-12 border-b border-white/10 text-center">
          <div className="max-w-2xl flex flex-col items-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
              <div
                style={{ backgroundColor: "var(--ufy-primary-purple, #7629f0)" }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm border-2 border-white/80"
              >
                ufy
              </div>
              <div className="text-center sm:text-left">
                <div className="text-white font-black text-lg tracking-tight leading-none">
                  Up for Youth (UFY)
                </div>
                <div className="text-xs font-mono text-[#b483f8] mt-0.5">
                  Youth-Led Action · Health Literacy · Community Care
                </div>
              </div>
            </div>
            <p className="text-sm text-neutral-300/90 leading-relaxed text-center">
              {settings?.footerMissionText ||
                "Up for Youth (UFY) connects young changemakers with real first-aid training, hospital letter drives, educational videos, and community micro-libraries."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/volunteer"
              style={{ backgroundColor: "var(--ufy-primary-purple, #7629f0)" }}
              className="px-6 py-3 rounded-full text-white font-extrabold text-sm shadow-lg hover:opacity-95 transition-all inline-flex items-center justify-center gap-2"
            >
              <HeartHandshake size={16} />
              <span>Sign Up to Volunteer</span>
            </Link>
            <Link
              href="/letters"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all inline-flex items-center justify-center gap-2"
            >
              <Mail size={15} className="text-[#b483f8]" />
              <span>Write a Virtual Letter</span>
            </Link>
          </div>
        </div>

        {/* Centered Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12 text-center">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col items-center">
              <h4 className="text-[12px] font-extrabold text-[#b483f8] mb-4 uppercase tracking-widest font-mono text-center">
                {col.title}
              </h4>
              <ul className="space-y-2.5 flex flex-col items-center">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto") ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[13.5px] text-neutral-300 hover:text-white transition-colors inline-flex items-center justify-center gap-1"
                      >
                        <span>{link.label}</span>
                        {link.href.startsWith("http") && <ArrowUpRight size={12} className="opacity-60" />}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-neutral-300 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal & Location Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-2 text-[12px] text-neutral-400 text-center">
          <div className="font-mono text-[11px] text-[#b483f8]">
            <span>{settings?.footerLocationText || "MANTECA, CA • UP FOR YOUTH (UFY)"}</span>
          </div>
          <div>
            {settings?.copyrightText ||
              "© 2026 Up for Youth (UFY). All rights reserved."}
          </div>
          {settings?.privacyNotice && (
            <div className="text-[11px] text-neutral-500">{settings.privacyNotice}</div>
          )}
        </div>
      </div>
    </footer>
  );
}
