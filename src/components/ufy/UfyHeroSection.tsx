"use client";

import React from "react";
import CutoutTypography from "./CutoutTypography";

interface UfyHeroSectionProps {
  onOpenModal: () => void;
}

export default function UfyHeroSection({ onOpenModal }: UfyHeroSectionProps) {
  return (
    <section className="pt-24 pb-8 px-4 sm:px-8 max-w-[1360px] mx-auto">
      {/* Top Header Tag */}
      <div className="text-center mb-4">
        <h2 className="text-[16px] sm:text-[18px] font-normal tracking-tight text-[#140529] leading-tight">
          ufy
          <br />
          youth community initiative
        </h2>
      </div>

      {/* Large Dashed Box Container (Closer Spacing matching Screenshot) */}
      <div className="ufy-dashed-box relative p-5 sm:p-8 min-h-[380px] flex flex-col justify-between overflow-hidden bg-transparent rounded-[2px]">
        {/* Left-to-Right Scrolling Marquee of Giant "ufy" Cut-Out Words */}
        <div className="w-full overflow-hidden select-none py-2 relative">
          <div className="flex items-center gap-10 whitespace-nowrap animate-marquee-lr">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <div key={idx} className="shrink-0 flex items-center gap-8">
                <CutoutTypography
                  text="ufy"
                  size="xl"
                  primaryColor="#7629f0"
                  secondaryColor="#140529"
                  accentColor="#8e48ff"
                  dashColor="#7629f0"
                />
                <span className="text-3xl text-[#7629f0]/40 font-black">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Tilted/Diagonalized Sticker Cards with Artsy Rotation */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mt-6 mb-2 z-10">
          {/* Card 1: Montreal Youth HQ (Deep Obsidian Violet) */}
          <div className="ufy-sticker ufy-sticker-black ufy-tilt-neg3">
            <span className="underline decoration-1 underline-offset-4">
              montreal youth hq,
              <br />
              410 rue saint-pierre
            </span>
          </div>

          {/* Card 2: Get involved (Electric Royal Purple with interactive tilt) */}
          <button
            type="button"
            onClick={onOpenModal}
            className="ufy-sticker ufy-sticker-purple ufy-tilt-pos3 cursor-pointer text-[18px] sm:text-[20px] font-semibold"
          >
            <span className="underline decoration-1 underline-offset-4">
              get involved to help
            </span>
          </button>

          {/* Card 3: Mission Note (Bright Electric Violet) */}
          <div className="ufy-sticker ufy-sticker-violet ufy-tilt-neg1 font-medium">
            youth-led • tangible care
          </div>
        </div>
      </div>
    </section>
  );
}
