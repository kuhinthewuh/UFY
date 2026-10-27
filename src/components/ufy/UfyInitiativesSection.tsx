"use client";

import React from "react";
import CutoutTypography from "./CutoutTypography";
import { Mail, HeartPulse, BookOpen, ArrowUpRight } from "lucide-react";

interface UfyInitiativesSectionProps {
  onOpenModal: () => void;
}

export default function UfyInitiativesSection({ onOpenModal }: UfyInitiativesSectionProps) {
  const initiatives = [
    {
      id: "letters",
      num: "01",
      title: "handcrafted letters for hospitalized children",
      tagline: "personalized art, letters & bedside encouragement",
      description:
        "We mobilize students and young volunteers across Montreal to design, illustrate, and write personalized, encouraging cards for children in pediatric wards. Each letter is crafted with care to bring warmth, human connection, and joy during extended hospital stays.",
      impact: "1,250+ cards delivered across 4 regional pediatric centers",
      cta: "write a letter with us",
      tilt: "transform -rotate-4 hover:-rotate-1",
      icon: Mail,
      accentColor: "#7629f0",
      bgColor: "bg-[#7629f0]",
    },
    {
      id: "workshops",
      num: "02",
      title: "community first-aid & cpr workshops",
      tagline: "peer-led emergency resuscitation & bleeding control",
      description:
        "Hands-on, zero-jargon first-aid workshops designed and taught by certified student instructors for teenagers, student athletes, and families. Participants gain real tactile confidence with pediatric CPR mannequins, choking relief techniques, and rapid wound management.",
      impact: "540+ youth certified with life-saving emergency training",
      cta: "request a workshop",
      tilt: "transform rotate-4 hover:rotate-1",
      icon: HeartPulse,
      accentColor: "#140529",
      bgColor: "bg-[#140529]",
    },
    {
      id: "libraries",
      num: "03",
      title: "local library book donations & micro-libraries",
      tagline: "youth book drives & public reading access pipelines",
      description:
        "Running year-round youth book drives and installing curated public health, science, and creative literature into public libraries and neighborhood Little Free Libraries. We eliminate book deserts so every young person has direct, free access to inspiring books.",
      impact: "3,200+ books collected and placed in community access stations",
      cta: "donate books / sponsor library",
      tilt: "transform -rotate-3 hover:rotate-0",
      icon: BookOpen,
      accentColor: "#8e48ff",
      bgColor: "bg-[#8e48ff]",
    },
  ];

  return (
    <section id="initiatives" className="py-12 px-4 sm:px-8 max-w-[1360px] mx-auto">
      {/* Giant "initiatives" Cut-Out Header */}
      <div className="flex justify-center mb-[-28px] z-20 relative">
        <CutoutTypography
          text="initiatives"
          size="lg"
          primaryColor="#7629f0"
          secondaryColor="#140529"
          accentColor="#8e48ff"
          dashColor="#7629f0"
        />
      </div>

      {/* Large Dashed Box Container (Closer Spacing) */}
      <div className="border-2 border-dashed border-[#7629f0]/45 p-6 sm:p-12 relative bg-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
          {initiatives.map((init) => {
            const Icon = init.icon;
            return (
              <div
                key={init.id}
                id={init.id}
                className="flex flex-col justify-between bg-white/70 border border-neutral-300/80 p-6 sm:p-7 shadow-sm rounded-[2px] transition-all hover:bg-white hover:shadow-md"
              >
                <div>
                  {/* Diagonalized Artsy Badge */}
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-2 text-white px-3.5 py-2 text-[12px] font-bold uppercase tracking-wider ${init.bgColor} ${init.tilt} transition-transform shadow-sm`}
                    >
                      <Icon size={14} />
                      <span>INITIATIVE // {init.num}</span>
                    </div>

                    <span className="font-mono text-[12px] font-bold text-[#7629f0]">
                      UFY CORE
                    </span>
                  </div>

                  <h3 className="text-[26px] sm:text-[30px] font-normal text-[#140529] tracking-tight leading-tight mb-2">
                    {init.title}
                  </h3>

                  <p className="text-[13px] text-[#7629f0] font-semibold mb-3">
                    {init.tagline}
                  </p>

                  <p className="text-[13.5px] leading-relaxed text-[#140529]/90 font-normal mb-6">
                    {init.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-[12px] font-mono font-medium text-[#140529]/70 mb-3">
                    ✦ {init.impact}
                  </div>

                  <button
                    type="button"
                    onClick={onOpenModal}
                    className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#7629f0] hover:text-[#5013b8] transition-colors underline decoration-1 underline-offset-4"
                  >
                    <span>{init.cta}</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
