"use client";

import React from "react";
import Link from "next/link";
import CutoutTypography from "./CutoutTypography";

interface UfyLeadersSectionProps {
  onOpenModal: () => void;
}

export default function UfyLeadersSection({ onOpenModal }: UfyLeadersSectionProps) {
  return (
    <section id="leaders" className="py-12 px-4 sm:px-8 max-w-[1360px] mx-auto">
      {/* Giant "leaders" Cut-Out Header */}
      <div className="flex justify-center mb-[-26px] z-20 relative">
        <CutoutTypography
          text="leaders"
          size="lg"
          primaryColor="#7629f0"
          secondaryColor="#140529"
          accentColor="#8e48ff"
          dashColor="#7629f0"
        />
      </div>

      {/* Large Dashed Box Container (Closer Spacing) */}
      <div className="border-2 border-dashed border-[#7629f0]/45 p-6 sm:p-12 relative bg-transparent">
        {/* Top Leader: Sophia Chen (Centered) */}
        <div className="max-w-[480px] mx-auto mb-16 text-center sm:text-left">
          <div className="flex justify-center mb-5">
            {/* Artsy Diagonalized Photo Card */}
            <div className="transform -rotate-5 hover:-rotate-2 transition-transform duration-300 inline-block bg-white p-2.5 shadow-md">
              <div className="w-[190px] h-[190px] sm:w-[210px] sm:h-[210px] overflow-hidden bg-[#7629f0]">
                <img
                  src="/readymag_assets/speaker_1_giovanna.png"
                  alt="Sophia Chen"
                  className="w-full h-full object-cover ufy-duotone-purple"
                />
              </div>
            </div>
          </div>

          <h3 className="text-[30px] sm:text-[36px] font-normal text-[#140529] tracking-tight leading-none mb-1.5">
            sophia chen
          </h3>
          <p className="text-[13.5px] text-[#7629f0] font-semibold mb-2.5">
            founder &amp; coordinator,{" "}
            <button
              type="button"
              onClick={onOpenModal}
              className="underline decoration-1 underline-offset-2 hover:text-[#5013b8]"
            >
              hospitalized letters initiative
            </button>
          </p>
          <p className="text-[13px] leading-relaxed text-[#140529]/90 font-normal">
            Sophia is a health sciences student at McGill University dedicated to patient empathy and pediatric wellness. She founded UFY after seeing firsthand how isolating long-term hospital stays are for children. She coordinates weekly card-making sessions across local schools and manages delivery logistics to children's hospitals in Montreal.
          </p>
        </div>

        {/* Middle Two Leaders: Left & Right Grid with Artsy Diagonalized Photographs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Leader 2: Alex Tremblay & Laura Sauchelli (Left, tilted -6deg) */}
          <div className="max-w-[460px]">
            <div className="mb-5 transform -rotate-6 hover:-rotate-2 transition-transform duration-300 inline-block bg-white p-2.5 shadow-md">
              <div className="w-[190px] h-[190px] sm:w-[220px] sm:h-[220px] overflow-hidden bg-[#140529]">
                <img
                  src="/readymag_assets/speaker_2_lino_laura.png"
                  alt="Alex Tremblay and Laura Sauchelli"
                  className="w-full h-full object-cover ufy-duotone-violet"
                />
              </div>
            </div>
            <h3 className="text-[30px] sm:text-[34px] font-normal text-[#140529] tracking-tight leading-tight mb-1.5">
              alex tremblay{" "}
              <span className="text-[#8e48ff]">and</span>{" "}
              laura sauchelli
            </h3>
            <p className="text-[13.5px] text-[#7629f0] font-semibold mb-2.5">
              directors of{" "}
              <button
                type="button"
                onClick={onOpenModal}
                className="underline decoration-1 underline-offset-2 hover:text-[#5013b8]"
              >
                first-aid &amp; cpr youth workshops
              </button>
            </p>
            <p className="text-[13px] leading-relaxed text-[#140529]/90 font-normal mb-2">
              Alex and Laura are certified youth first-aid and CPR instructors who believe emergency preparedness belongs in the hands of everyday teenagers. They develop interactive peer-to-peer lesson plans, bring simulation mannequins to high schools, and demystify AED and bleeding control so young people can act without hesitation.
            </p>
            <p className="text-[11px] text-[#7629f0]/70 font-mono">
              certified red cross &amp; st. john ambulance mentors
            </p>
          </div>

          {/* Leader 3: Amina Diallo (Right, tilted +5deg) */}
          <div className="max-w-[460px] md:ml-auto">
            <div className="mb-5 transform rotate-5 hover:rotate-1 transition-transform duration-300 inline-block bg-white p-2.5 shadow-md">
              <div className="w-[190px] h-[190px] sm:w-[220px] sm:h-[220px] overflow-hidden bg-[#7629f0]">
                <img
                  src="/readymag_assets/speaker_3_helena.png"
                  alt="Amina Diallo"
                  className="w-full h-full object-cover ufy-duotone-purple"
                />
              </div>
            </div>
            <h3 className="text-[30px] sm:text-[34px] font-normal text-[#140529] tracking-tight leading-tight mb-1.5">
              amina diallo
            </h3>
            <p className="text-[13.5px] text-[#7629f0] font-semibold mb-2.5">
              lead coordinator,{" "}
              <button
                type="button"
                onClick={onOpenModal}
                className="underline decoration-1 underline-offset-2 hover:text-[#5013b8]"
              >
                community library book drives
              </button>
            </p>
            <p className="text-[13px] leading-relaxed text-[#140529]/90 font-normal">
              Amina is a student community organizer passionate about literacy equity. She oversees book donation collection drives across university campuses, collaborates with public librarians to restock underserved branches, and coordinates the installation of Little Free Health Libraries in neighborhood parks.
            </p>
          </div>
        </div>

        {/* Bottom Leader: Liam Patel & Esenia (Centered, tilted +4deg) */}
        <div className="max-w-[480px] mx-auto text-center sm:text-left">
          <div className="flex justify-center mb-5">
            <div className="transform rotate-4 hover:rotate-1 transition-transform duration-300 inline-block bg-white p-2.5 shadow-md">
              <div className="w-[190px] h-[190px] sm:w-[210px] sm:h-[210px] overflow-hidden bg-[#8e48ff]">
                <img
                  src="/readymag_assets/speaker_4_esenia.png"
                  alt="Liam Patel and Esenia"
                  className="w-full h-full object-cover ufy-duotone-violet"
                />
              </div>
            </div>
          </div>
          <h3 className="text-[30px] sm:text-[36px] font-normal text-[#140529] tracking-tight leading-none mb-1.5">
            liam patel &amp; esenia
          </h3>
          <p className="text-[13.5px] text-[#7629f0] font-semibold mb-2.5">
            creative directors &amp;{" "}
            <span className="underline decoration-1 underline-offset-2">
              pediatric health zine editors
            </span>
          </p>
          <p className="text-[13px] leading-relaxed text-[#140529]/90 font-normal">
            Liam and Esenia turn complex medical knowledge into beautifully illustrated, youth-friendly pocket guides and zines. Distributed freely at libraries and workshops, their materials empower teens with clear understanding of adolescent health, allergy management, and mental wellness.
          </p>
        </div>
      </div>
    </section>
  );
}
