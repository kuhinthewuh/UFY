"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="pt-28 pb-12 px-4 sm:px-8 max-w-[1440px] mx-auto">
      {/* Top Header Tag */}
      <div className="text-center mb-6">
        <h2 className="text-[17px] font-normal tracking-tight text-[#003227] leading-tight">
          readymag
          <br />
          community meetup
        </h2>
      </div>

      {/* Large Dashed Box Container */}
      <div className="relative border-2 border-dashed border-[#003227]/40 rounded-none p-6 sm:p-10 min-h-[460px] flex flex-col justify-between overflow-hidden bg-transparent">
        {/* Giant Milan Typography Marching Across Screen */}
        <div className="w-full overflow-hidden select-none py-4">
          <div className="flex items-center justify-start gap-4 sm:gap-8 min-w-[1200px]">
            <img
              src="/readymag_assets/svg_1.svg"
              alt="milan"
              className="h-[120px] sm:h-[180px] w-auto object-contain shrink-0"
            />
            <img
              src="/readymag_assets/svg_2.svg"
              alt="milan"
              className="h-[120px] sm:h-[180px] w-auto object-contain shrink-0"
            />
            <img
              src="/readymag_assets/svg_3.svg"
              alt="milan"
              className="h-[120px] sm:h-[180px] w-auto object-contain shrink-0 opacity-80"
            />
          </div>
        </div>

        {/* 3 Tilted Sticker Cards */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 mb-4 z-10">
          {/* Card 1: Pop-Eye Studio (Dark Forest Green) */}
          <Link
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#003227] text-white px-7 py-5 text-[17px] sm:text-[19px] font-normal leading-snug transform -rotate-3 hover:-rotate-1 transition-transform shadow-md rounded-[2px]"
          >
            <span className="underline decoration-1 underline-offset-4">
              pop-eye studio,
              <br />
              via livigno, 18
            </span>
          </Link>

          {/* Card 2: Register to come (Vibrant Stamp Red) */}
          <button
            type="button"
            className="inline-block bg-[#D51F1F] text-white px-8 py-5 text-[19px] sm:text-[21px] font-normal transform rotate-3 hover:rotate-6 transition-transform shadow-md rounded-[2px] cursor-pointer"
          >
            <span className="underline decoration-1 underline-offset-4">
              register to come
            </span>
          </button>

          {/* Card 3: June 26, 18:00 (Bright Grass Green) */}
          <div className="inline-block bg-[#2B9209] text-white px-7 py-5 text-[17px] sm:text-[19px] font-normal shadow-md rounded-[2px]">
            June 26, 18:00
          </div>
        </div>
      </div>
    </section>
  );
}
