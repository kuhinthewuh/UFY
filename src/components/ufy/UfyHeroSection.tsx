"use client";

import React from "react";
import Link from "next/link";
import CutoutTypography from "./CutoutTypography";
import { ArrowUpRight, Play, Mail, HeartHandshake } from "lucide-react";

interface UfyHeroSectionProps {
  onOpenModal: () => void;
  eyebrow?: string;
  marqueeText?: string;
  sticker1?: string;
  sticker2?: string;
  sticker2Url?: string;
  sticker3?: string;
}

export default function UfyHeroSection({
  onOpenModal,
  eyebrow = "ufy — up for youth\nyouth community initiative",
  marqueeText = "ufy",
  sticker1 = "manteca, ca • youth hq\nestablished for youth",
  sticker2 = "get involved to help",
  sticker2Url = "/volunteer",
  sticker3 = "up for youth • tangible care",
}: UfyHeroSectionProps) {
  const safeEyebrow = eyebrow || "ufy — up for youth\nyouth community initiative";
  const safeMarquee = (marqueeText && marqueeText.trim()) || "ufy";
  const safeSticker1 = sticker1 || "manteca, ca • youth hq\nestablished for youth";
  const safeSticker2 = sticker2 || "get involved to help";
  const safeSticker3 = sticker3 || "up for youth • tangible care";

  const eyebrowLines = safeEyebrow.split("\n");
  const sticker1Lines = safeSticker1.split("\n");

  const marqueeItems = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <section className="pt-24 pb-8 w-full">
      {/* Top Centered Editorial Eyebrow */}
      <div className="ufy-container text-center mb-4 flex flex-col items-center justify-center">
        <div className="inline-flex flex-col items-center text-center">
          {eyebrowLines.map((line, i) => (
            <span
              key={i}
              className={
                i === 0
                  ? "text-[15px] sm:text-[17px] font-extrabold tracking-tight text-[#7629f0] lowercase text-center"
                  : "text-[15px] sm:text-[17px] font-medium tracking-tight text-[#140529]/85 lowercase text-center"
              }
            >
              {line}
            </span>
          ))}
        </div>
      </div>

      {/* True Edge-to-Edge Dashed Frame & Full-Bleed Auto-Scrolling Sign */}
      <div className="w-full px-3 sm:px-6 lg:px-10">
        <div className="ufy-dashed-box w-full py-8 sm:py-12 min-h-[450px] sm:min-h-[510px] flex flex-col justify-between overflow-hidden rounded-[4px]">
          {/* Subtle Corner Registration Marks (Editorial Print Vibe) */}
          <div className="px-6 sm:px-10 grid grid-cols-2 sm:grid-cols-3 items-center text-[11px] font-mono font-bold text-[#7629f0]/75 uppercase tracking-widest">
            <span className="text-left">EST. MANTECA, CA // YOUTH-LED</span>
            <span className="hidden sm:inline text-center">
              LETTERS · FIRST-AID · VIDEOS · LIBRARIES
            </span>
            <span className="text-right">UP FOR YOUTH (UFY)</span>
          </div>

          {/* Full-Bleed Edge-to-Edge Left-to-Right Auto-Scrolling "ufy" Marquee */}
          <div className="w-full overflow-hidden select-none py-4 my-2 relative flex items-center">
            <div className="animate-marquee-lr flex items-center shrink-0">
              {/* Track Half A */}
              <div className="flex items-center shrink-0">
                {marqueeItems.map((idx) => (
                  <div
                    key={`a-${idx}`}
                    className="shrink-0 flex items-center justify-center px-6 sm:px-10"
                  >
                    <CutoutTypography text={safeMarquee} size="hero" />
                  </div>
                ))}
              </div>
              {/* Track Half B (Identical clone for zero-jump infinite loop) */}
              <div className="flex items-center shrink-0" aria-hidden="true">
                {marqueeItems.map((idx) => (
                  <div
                    key={`b-${idx}`}
                    className="shrink-0 flex items-center justify-center px-6 sm:px-10"
                  >
                    <CutoutTypography text={safeMarquee} size="hero" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Signature Tilted Sticker Cards + Quick Action Pills */}
          <div className="px-6 sm:px-12 flex flex-col items-center justify-center text-center gap-6 z-10">
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-9">
              {/* Sticker 1: HQ / Location */}
              <div className="ufy-sticker ufy-sticker-black ufy-tilt-neg3 font-medium text-center">
                <span className="underline decoration-1 underline-offset-4">
                  {sticker1Lines.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < sticker1Lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </div>

              {/* Sticker 2: Primary Interactive Action */}
              {sticker2Url && sticker2Url !== "#modal" ? (
                <Link
                  href={sticker2Url}
                  className="ufy-sticker ufy-sticker-purple ufy-tilt-pos3 cursor-pointer text-[18px] sm:text-[21px] font-bold inline-flex items-center justify-center gap-2 text-center"
                >
                  <span className="underline decoration-1 underline-offset-4">{safeSticker2}</span>
                  <ArrowUpRight size={18} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="ufy-sticker ufy-sticker-purple ufy-tilt-pos3 cursor-pointer text-[18px] sm:text-[21px] font-bold inline-flex items-center justify-center gap-2 text-center"
                >
                  <span className="underline decoration-1 underline-offset-4">{safeSticker2}</span>
                  <ArrowUpRight size={18} />
                </button>
              )}

              {/* Sticker 3: Mission Stamp */}
              <div className="ufy-sticker ufy-sticker-violet ufy-tilt-neg1 font-semibold text-center">
                {safeSticker3}
              </div>
            </div>

            {/* Secondary Action Strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                href="/letters"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-[#d4b8fc] text-xs sm:text-sm font-extrabold text-[#140529] hover:text-[#7629f0] shadow-sm transition-all"
              >
                <Mail size={14} className="text-[#7629f0]" />
                <span>Write a Virtual Letter</span>
              </Link>
              <Link
                href="/videos"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-[#d4b8fc] text-xs sm:text-sm font-extrabold text-[#140529] hover:text-[#7629f0] shadow-sm transition-all"
              >
                <Play size={14} className="text-[#7629f0]" />
                <span>Watch Educational Videos</span>
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-[#d4b8fc] text-xs sm:text-sm font-extrabold text-[#140529] hover:text-[#7629f0] shadow-sm transition-all"
              >
                <HeartHandshake size={14} className="text-[#7629f0]" />
                <span>Earn Volunteer Hours</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
