"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const columns = [
    {
      title: "company",
      links: [
        { label: "about", href: "#about" },
        { label: "careers", href: "#careers" },
        { label: "reviews", href: "#reviews" },
        { label: "terms of service", href: "#terms" },
        { label: "privacy policy", href: "#privacy" },
        { label: "cookie policy", href: "#cookies" },
      ],
    },
    {
      title: "product",
      links: [
        { label: "pricing", href: "#pricing" },
        { label: "templates", href: "#templates" },
        { label: "product updates", href: "#updates" },
        { label: "affiliate program", href: "#affiliate" },
        { label: "referral program", href: "#referral" },
        { label: "r/m discount", href: "#discount" },
        { label: "forum", href: "#forum" },
        { label: "status", href: "#status" },
        { label: "help", href: "#help" },
      ],
    },
    {
      title: "case studies",
      links: [
        { label: "examples", href: "#examples" },
        { label: "freelancers", href: "#freelancers" },
        { label: "agencies", href: "#agencies" },
        { label: "students", href: "#students" },
        { label: "companies", href: "#companies" },
        { label: "portfolios", href: "#portfolios" },
        { label: "presentations", href: "#presentations" },
      ],
    },
    {
      title: "editorials",
      links: [
        { label: "all editorials", href: "#all-editorials" },
        { label: "designing women", href: "#designing-women" },
        { label: "reshaping career", href: "#reshaping-career" },
        { label: "collaboration report", href: "#collaboration" },
        { label: "design almanac", href: "#almanac" },
        { label: "design stories", href: "#stories" },
        { label: "websites of the year", href: "#websites-of-the-year" },
      ],
    },
    {
      title: "resources",
      links: [
        { label: "blog", href: "#blog" },
        { label: "newsletter", href: "#newsletter" },
        { label: "instagram", href: "#instagram" },
        { label: "threads", href: "#threads" },
        { label: "youtube", href: "#youtube" },
        { label: "tiktok", href: "#tiktok" },
        { label: "linkedin", href: "#linkedin" },
        { label: "explore", href: "#explore" },
      ],
    },
  ];

  return (
    <footer className="bg-[#282828] text-neutral-300 pt-16 pb-12 px-6 sm:px-12 mt-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[14px] font-normal text-neutral-400 mb-4 lowercase tracking-tight">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-neutral-200 hover:text-white transition-colors lowercase"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-neutral-700/60 text-[12px] text-neutral-400">
          © 2024 Readymag Inc.
        </div>
      </div>
    </footer>
  );
}
