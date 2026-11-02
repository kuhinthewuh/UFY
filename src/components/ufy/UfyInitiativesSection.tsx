"use client";

import React from "react";
import Link from "next/link";
import CutoutTypography from "./CutoutTypography";
import { Mail, HeartPulse, BookOpen, Play, Award, ArrowUpRight } from "lucide-react";
import { ProgramData } from "@/lib/types";

interface UfyInitiativesSectionProps {
  onOpenModal: () => void;
  title?: string;
  subtitle?: string | null;
  programs?: ProgramData[];
}

const DEFAULT_INITIATIVES = [
  {
    id: "letters",
    title: "letters & affirmations for hospitalized kids",
    category: "Pediatric Care",
    summary: "personalized art, virtual & handwritten bedside encouragement",
    description:
      "Up for Youth mobilizes students and volunteers to write heartwarming physical and virtual letters for children in pediatric wards—bringing human warmth, encouragement, and verified volunteer service hours.",
    impactStat: "0 Letters Delivered",
    ctaLabel: "write a virtual letter",
    externalUrl: "/letters",
    accentColor: "#7629f0",
  },
  {
    id: "workshops",
    title: "peer first-aid, cpr & educational videos",
    category: "Health Education",
    summary: "hands-on emergency resuscitation & bite-sized video lessons",
    description:
      "Zero-jargon first-aid workshops and on-demand educational videos taught by certified student instructors. Teens gain real tactile confidence in CPR rhythm, AED pads, and choking relief.",
    impactStat: "0 People Educated",
    ctaLabel: "explore educational videos",
    externalUrl: "/videos",
    accentColor: "#140529",
  },
  {
    id: "libraries",
    title: "neighborhood book drives & micro-libraries",
    category: "Community Literacy",
    summary: "youth book drives & free neighborhood reading stations",
    description:
      "Running year-round youth book drives and stocking Little Free Libraries with health, STEM, and creative stories so every young person has free, walk-up access to inspiring books.",
    impactStat: "0 Books Shared",
    ctaLabel: "propose a library or book drive",
    externalUrl: "/propose",
    accentColor: "#8e48ff",
  },
];

export default function UfyInitiativesSection({
  onOpenModal,
  title = "initiatives",
  subtitle,
  programs,
}: UfyInitiativesSectionProps) {
  const items =
    programs && programs.length > 0
      ? programs.map((p, idx) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          summary: p.summary,
          description: p.description,
          impactStat: p.impactStat || p.dateLabel || "Up for Youth Core Initiative",
          ctaLabel: p.ctaLabel || "get involved",
          externalUrl: p.externalUrl || "#modal",
          accentColor:
            p.accentColor ||
            (idx % 3 === 0 ? "#7629f0" : idx % 3 === 1 ? "#140529" : "#8e48ff"),
        }))
      : DEFAULT_INITIATIVES;

  const tilts = ["ufy-tilt-neg3", "ufy-tilt-pos3", "ufy-tilt-neg1"];
  const icons = [Mail, HeartPulse, BookOpen, Play, Award];

  return (
    <section id="initiatives" className="py-14 w-full">
      <div className="w-full px-3 sm:px-6 lg:px-10">
        {/* Giant Cut-Out Header */}
        <div className="w-full flex flex-col items-center justify-center text-center mb-[-24px] z-20 relative">
          <CutoutTypography text={title.toLowerCase()} size="lg" />
        </div>

        {/* Edge-to-Edge Dashed Frame */}
        <div className="ufy-dashed-box w-full px-6 sm:px-12 lg:px-16 pt-12 pb-10 sm:pt-14 sm:pb-14 rounded-[4px]">
          {subtitle && (
            <p className="text-center text-sm sm:text-base text-[#5416b3] font-medium max-w-2xl mx-auto mb-10">
              {subtitle}
            </p>
          )}

          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              items.length >= 3 ? "xl:grid-cols-3" : ""
            } gap-8 lg:gap-10`}
          >
            {items.map((init, idx) => {
              const Icon = icons[idx % icons.length];
              const tilt = tilts[idx % tilts.length];
              const num = String(idx + 1).padStart(2, "0");
              const isLink =
                init.externalUrl &&
                init.externalUrl !== "#modal" &&
                init.externalUrl !== "#submit-idea";

              return (
                <div
                  key={init.id}
                  className="flex flex-col items-center text-center justify-between bg-white border-2 border-[#140529]/15 hover:border-[#7629f0] p-7 sm:p-9 shadow-[0_10px_28px_rgba(20,5,41,0.06)] hover:shadow-[0_18px_40px_rgba(118,41,240,0.14)] rounded-2xl transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Centered Artsy Badge & Category Pill */}
                    <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                      <div
                        style={{ backgroundColor: init.accentColor }}
                        className={`inline-flex items-center gap-2 text-white px-3.5 py-2 text-[11.5px] font-extrabold uppercase tracking-wider rounded-[3px] ${tilt} shadow-sm`}
                      >
                        <Icon size={14} />
                        <span>PILLAR // {num}</span>
                      </div>

                      <span className="font-mono text-[11px] font-extrabold text-[#7629f0] bg-[#f8f4fe] px-2.5 py-1 rounded-full border border-[#ebdffe]">
                        {init.category}
                      </span>
                    </div>

                    <h3 className="text-[24px] sm:text-[28px] font-extrabold text-[#140529] tracking-tight leading-[1.15] mb-2.5 group-hover:text-[#7629f0] transition-colors text-center">
                      {init.title}
                    </h3>

                    <p className="text-[13.5px] text-[#7629f0] font-bold mb-3.5 text-center">
                      {init.summary}
                    </p>

                    <p className="text-[14px] leading-relaxed text-[#140529]/85 font-normal mb-6 text-center">
                      {init.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#ebdffe] flex flex-col items-center gap-3 w-full">
                    <div className="text-[12px] font-mono font-bold text-[#5416b3] text-center">
                      {init.impactStat}
                    </div>

                    {isLink ? (
                      <Link
                        href={init.externalUrl}
                        className="inline-flex items-center justify-center gap-1.5 text-[14px] font-extrabold text-[#7629f0] hover:text-[#5013b8] transition-colors underline decoration-2 underline-offset-4"
                      >
                        <span>{init.ctaLabel}</span>
                        <ArrowUpRight size={15} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={onOpenModal}
                        className="inline-flex items-center justify-center gap-1.5 text-[14px] font-extrabold text-[#7629f0] hover:text-[#5013b8] transition-colors underline decoration-2 underline-offset-4"
                      >
                        <span>{init.ctaLabel}</span>
                        <ArrowUpRight size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
