"use client";

import React from "react";
import Link from "next/link";

interface UfyFooterProps {
  onOpenModal: () => void;
}

export default function UfyFooter({ onOpenModal }: UfyFooterProps) {
  const columns = [
    {
      title: "organization",
      links: [
        { label: "about ufy", href: "#hero" },
        { label: "student leadership", href: "#leaders" },
        { label: "our mission", href: "#initiatives" },
        { label: "montreal chapter", href: "#hero" },
        { label: "terms of service", href: "#" },
        { label: "privacy policy", href: "#" },
      ],
    },
    {
      title: "initiatives",
      links: [
        { label: "letters for hospitalized kids", href: "#letters" },
        { label: "community first-aid & cpr", href: "#workshops" },
        { label: "library book donations", href: "#libraries" },
        { label: "pediatric health zines", href: "#initiatives" },
        { label: "school workshop tour", href: "#workshops" },
      ],
    },
    {
      title: "get involved",
      links: [
        { label: "write encouraging cards", href: "#letters" },
        { label: "host a first-aid session", href: "#workshops" },
        { label: "donate children's books", href: "#libraries" },
        { label: "become a ufy ambassador", href: "#impact" },
        { label: "join volunteer crew", href: "#impact" },
      ],
    },
    {
      title: "resources",
      links: [
        { label: "cpr quick-reference card", href: "#" },
        { label: "choking & bleeding guides", href: "#" },
        { label: "book drop locations", href: "#" },
        { label: "zine downloads (pdf)", href: "#" },
        { label: "youth health faq", href: "#" },
      ],
    },
    {
      title: "connect",
      links: [
        { label: "instagram @ufy_youth", href: "https://instagram.com/ufy_youth" },
        { label: "montreal youth hub", href: "#" },
        { label: "email: hello@ufy.org", href: "mailto:hello@ufy.org" },
        { label: "phone: +1 (514) 840-0000", href: "tel:+15148400000" },
        { label: "admin cms portal", href: "/admin/login" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0d0519] text-neutral-300 pt-16 pb-12 px-6 sm:px-12 mt-16 border-t border-[#7629f0]/30">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-14">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-bold text-[#8e48ff] mb-4 lowercase tracking-tight uppercase">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <Link
                        href={link.href}
                        className="text-[13px] text-neutral-300 hover:text-white transition-colors lowercase"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[13px] text-neutral-300 hover:text-white transition-colors lowercase"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-neutral-400">
          <div>
            © 2026 UFY Organization — Youth-Led Compassionate Community Action. Registered Canadian Non-Profit.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-[#8e48ff]">
            <span>MONTREAL, QC</span>
            <span>✦</span>
            <span>HEALTH EDUCATION &amp; LITERACY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
