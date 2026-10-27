"use client";

import React from "react";
import Link from "next/link";
import CutoutTypography from "./CutoutTypography";

interface UfyImpactSectionProps {
  onOpenModal: () => void;
}

export default function UfyImpactSection({ onOpenModal }: UfyImpactSectionProps) {
  return (
    <section id="impact" className="py-12 px-4 sm:px-8 max-w-[1360px] mx-auto">
      {/* Community Milestone Notification Pill */}
      <div className="flex justify-center mb-[-24px] z-20 relative">
        <div className="bg-white border border-[#7629f0]/40 px-6 py-3.5 rounded-none shadow-sm max-w-[460px] text-center">
          <p className="text-[13px] sm:text-[14px] text-[#140529] leading-snug font-normal">
            thank you for standing with Montreal youth!
            <br />
            we’ve delivered 1,250+ cards, trained 540+ peers,
            <br />
            and donated 3,200+ books to public libraries.
          </p>
        </div>
      </div>

      {/* Large Dashed Box Container (Closer Spacing) */}
      <div className="border-2 border-dashed border-[#7629f0]/45 p-6 sm:p-12 text-center relative bg-transparent">
        {/* Giant Cut-Out Typography */}
        <div className="flex flex-col items-center justify-center my-6 space-y-2">
          <CutoutTypography
            text="join the movement"
            size="lg"
            primaryColor="#7629f0"
            secondaryColor="#140529"
            accentColor="#8e48ff"
            dashColor="#7629f0"
          />
          <CutoutTypography
            text="action over words"
            size="md"
            primaryColor="#140529"
            secondaryColor="#7629f0"
            accentColor="#8e48ff"
            dashColor="#7629f0"
          />
        </div>

        {/* 4 Tangible Impact Counter Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[900px] mx-auto my-8">
          <div className="bg-white p-4 border border-neutral-300/80 shadow-sm rounded-[2px]">
            <div className="text-[28px] sm:text-[32px] font-extrabold text-[#7629f0] leading-none mb-1">
              1,250+
            </div>
            <div className="text-[12px] font-mono text-[#140529]/80 uppercase">
              Hospital Letters Delivered
            </div>
          </div>

          <div className="bg-white p-4 border border-neutral-300/80 shadow-sm rounded-[2px]">
            <div className="text-[28px] sm:text-[32px] font-extrabold text-[#140529] leading-none mb-1">
              540+
            </div>
            <div className="text-[12px] font-mono text-[#140529]/80 uppercase">
              Youth CPR Certified
            </div>
          </div>

          <div className="bg-white p-4 border border-neutral-300/80 shadow-sm rounded-[2px]">
            <div className="text-[28px] sm:text-[32px] font-extrabold text-[#8e48ff] leading-none mb-1">
              3,200+
            </div>
            <div className="text-[12px] font-mono text-[#140529]/80 uppercase">
              Books Donated
            </div>
          </div>

          <div className="bg-white p-4 border border-neutral-300/80 shadow-sm rounded-[2px]">
            <div className="text-[28px] sm:text-[32px] font-extrabold text-[#7629f0] leading-none mb-1">
              180+
            </div>
            <div className="text-[12px] font-mono text-[#140529]/80 uppercase">
              Active Youth Volunteers
            </div>
          </div>
        </div>

        {/* Subtext & Action Links */}
        <div className="max-w-[700px] mx-auto mt-8 space-y-2">
          <p className="text-[16px] sm:text-[19px] text-[#140529] font-normal">
            follow us on{" "}
            <Link
              href="https://instagram.com/ufy_youth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7629f0] underline decoration-1 underline-offset-4 hover:text-[#5013b8]"
            >
              instagram @ufy_youth
            </Link>{" "}
            for weekly card-making dates and workshops.
          </p>

          <p className="text-[16px] sm:text-[19px] text-[#140529] font-normal">
            if you'd like to launch a UFY chapter at your school,{" "}
            <button
              type="button"
              onClick={onOpenModal}
              className="text-[#7629f0] underline decoration-1 underline-offset-4 hover:text-[#5013b8] cursor-pointer"
            >
              apply to become a ufy ambassador
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
