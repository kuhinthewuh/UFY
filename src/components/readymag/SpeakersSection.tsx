"use client";

import React from "react";
import Link from "next/link";

export default function SpeakersSection() {
  return (
    <section className="py-16 px-4 sm:px-8 max-w-[1440px] mx-auto">
      {/* Giant "speakers" Cut-Out Header */}
      <div className="flex justify-center mb-[-24px] z-20 relative">
        <img
          src="/readymag_assets/svg_9.svg"
          alt="speakers"
          className="h-[110px] sm:h-[160px] w-auto object-contain"
        />
      </div>

      {/* Large Dashed Box Container */}
      <div className="border-2 border-dashed border-[#003227]/40 p-8 sm:p-14 relative bg-transparent">
        {/* Top Speaker: Giovanna Crise (Centered) */}
        <div className="max-w-[480px] mx-auto mb-20 text-center sm:text-left">
          <div className="flex justify-center mb-6">
            <div className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] overflow-hidden rounded-none shadow-sm">
              <img
                src="/readymag_assets/speaker_1_giovanna.png"
                alt="Giovanna Crise"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h3 className="text-[32px] sm:text-[38px] font-normal text-[#003227] tracking-tight leading-none mb-2">
            giovanna crise
          </h3>
          <p className="text-[14px] text-[#D51F1F] font-medium mb-3">
            multidisciplinary designer &amp; brand strategist at{" "}
            <Link
              href="https://illo.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-2"
            >
              illo.tv
            </Link>
          </p>
          <p className="text-[13.5px] leading-relaxed text-[#003227] font-normal">
            Giovanna is a multidisciplinary designer from Trieste, currently based in Torino. With a passion for storytelling, photography, and interactive design, her work explores the intersection of culture and creativity. One of her favorite personal projects made with Readymag,{" "}
            <span className="text-[#D51F1F] underline decoration-1 underline-offset-2">Korea Travel Zine</span>, blends editorial and digital design through an interactive lens. She currently works as a brand strategist at illo.tv, where she oversees the studio’s image.
          </p>
        </div>

        {/* Middle Two Speakers: Left & Right Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mb-20">
          {/* Speaker 2: Lino Di Maio & Laura Sauchelli (Left, tilted card) */}
          <div className="max-w-[460px]">
            <div className="mb-6 transform -rotate-3 hover:-rotate-1 transition-transform inline-block">
              <div className="w-[200px] h-[200px] sm:w-[230px] sm:h-[230px] overflow-hidden bg-white p-2 shadow-md">
                <img
                  src="/readymag_assets/speaker_2_lino_laura.png"
                  alt="Lino Di Maio and Laura Sauchelli"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-[32px] sm:text-[36px] font-normal text-[#003227] tracking-tight leading-tight mb-2">
              lino di maio{" "}
              <span className="text-[#2B9209]">and</span>{" "}
              laura sauchelli
            </h3>
            <p className="text-[14px] text-[#D51F1F] font-medium mb-3">
              co-founders of{" "}
              <Link
                href="https://pop-eye.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-1 underline-offset-2"
              >
                pop-eye studio
              </Link>
            </p>
            <p className="text-[13.5px] leading-relaxed text-[#003227] font-normal mb-3">
              pop-eye studio is a Milan-based creative studio turning different ideas into bold visuals. They mix graphic design, illustration, digital products and a pinch of weirdness to help brands stand out. From logos to websites to visual stories that would make your eyeballs happy, they craft everything with love, color, and just the right amount of chaos. The name is a nod to Lino's sailor grandpa story—always watching, always exploring.
            </p>
            <p className="text-[11px] text-[#003227]/60 font-mono">
              photo credit: stefania zanetti
            </p>
          </div>

          {/* Speaker 3: Helena Sciavarrello (Right, tilted card) */}
          <div className="max-w-[460px] md:ml-auto">
            <div className="mb-6 transform rotate-3 hover:rotate-1 transition-transform inline-block">
              <div className="w-[200px] h-[200px] sm:w-[230px] sm:h-[230px] overflow-hidden bg-white p-2 shadow-md">
                <img
                  src="/readymag_assets/speaker_3_helena.png"
                  alt="Helena Sciavarrello"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-[32px] sm:text-[36px] font-normal text-[#003227] tracking-tight leading-tight mb-2">
              helena sciavarrello
            </h3>
            <p className="text-[14px] text-[#D51F1F] font-medium mb-3">
              <Link
                href="https://instagram.com/sainthelenastudio"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-1 underline-offset-2"
              >
                sainthelenastudio
              </Link>
            </p>
            <p className="text-[13.5px] leading-relaxed text-[#003227] font-normal">
              helena is a designer, content creator, and design educator based in torino. drawing inspiration from her roots and culture, she brings authenticity to every project—from branding and illustration to social media and beyond. passionate about meaningful (and fun) work, helena shares design insights, tutorials, and behind-the-scenes glimpses of her creative process on tiktok, where she’s built a vibrant community of fellow designers.
            </p>
          </div>
        </div>

        {/* Bottom Speaker: Esenia Hortus (Centered) */}
        <div className="max-w-[480px] mx-auto text-center sm:text-left">
          <div className="flex justify-center mb-6">
            <div className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] overflow-hidden rounded-none shadow-sm">
              <img
                src="/readymag_assets/speaker_4_esenia.png"
                alt="Esenia Hortus"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h3 className="text-[32px] sm:text-[38px] font-normal text-[#003227] tracking-tight leading-none mb-2">
            esenia hortus
          </h3>
          <p className="text-[14px] text-[#D51F1F] font-medium mb-3">
            social media and community lead at{" "}
            <Link
              href="https://readymag.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-2"
            >
              readymag
            </Link>
          </p>
          <p className="text-[13.5px] leading-relaxed text-[#003227] font-normal">
            esenia is a social media and community strategist based in barcelona. at readymag, she leads community initiatives and oversees social media and the{" "}
            <span className="text-[#D51F1F] underline decoration-1 underline-offset-2">ambassador program</span> — connecting designers from around the world. esenia will give a live demo at the meetup, sharing recent readymag updates and practical tips.
          </p>
        </div>
      </div>
    </section>
  );
}
