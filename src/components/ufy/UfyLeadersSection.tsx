"use client";

import React from "react";
import Link from "next/link";
import CutoutTypography from "./CutoutTypography";
import ClothespinPolaroid from "./ClothespinPolaroid";
import { ArrowRight } from "lucide-react";
import { TeamMemberData } from "@/lib/types";

interface UfyLeadersSectionProps {
  onOpenModal: () => void;
  title?: string;
  subtitle?: string | null;
  members?: TeamMemberData[];
  enableDuotone?: boolean;
}

const FALLBACK_PHOTOS = [
  "/readymag_assets/speaker_1_giovanna.png",
  "/readymag_assets/speaker_2_lino_laura.png",
  "/readymag_assets/speaker_3_helena.png",
  "/readymag_assets/speaker_4_esenia.png",
];

const PEG_COLORS = ["#e0c7a8", "#7629f0", "#8e48ff", "#d4b8fc"];

export default function UfyLeadersSection({
  onOpenModal,
  title = "leaders",
  subtitle,
  members = [],
  enableDuotone = true,
}: UfyLeadersSectionProps) {
  // Group members into rows of 3 so each row hangs cleanly from a continuous edge-to-edge clothesline wire!
  const rows: TeamMemberData[][] = [];
  for (let i = 0; i < members.length; i += 3) {
    rows.push(members.slice(i, i + 3));
  }

  return (
    <section id="leaders" className="py-14 w-full">
      <div className="w-full px-3 sm:px-6 lg:px-10">
        {/* Giant Cut-Out Header */}
        <div className="w-full flex justify-center text-center mb-[-24px] z-20 relative">
          <CutoutTypography text={title.toLowerCase()} size="lg" />
        </div>

        {/* Edge-to-Edge Dashed Frame */}
        <div className="ufy-dashed-box w-full px-6 sm:px-12 lg:px-16 pt-12 pb-12 sm:pt-16 sm:pb-16 rounded-[4px] overflow-hidden">
          {subtitle && (
            <p className="text-center text-sm sm:text-base text-[#5416b3] font-medium max-w-2xl mx-auto mb-12">
              {subtitle}
            </p>
          )}

          <div className="space-y-20">
            {rows.map((rowMembers, rIdx) => (
              <div key={rIdx} className="relative">
                {/* Continuous Edge-to-Edge Clothesline Wire Passing Directly Through Every Clothespin at y=22px */}
                <div className="hidden lg:flex items-center absolute top-[22px] -left-16 -right-16 z-10 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#140529] border-2 border-white shadow-md shrink-0" />
                  <div className="flex-1 h-[3px] bg-gradient-to-r from-[#b483f8] via-[#7629f0] to-[#b483f8] shadow-[0_3px_6px_rgba(118,41,240,0.28)]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#140529] border-2 border-white shadow-md shrink-0" />
                </div>

                <div
                  className={`grid grid-cols-1 md:grid-cols-2 ${
                    rowMembers.length >= 3 ? "lg:grid-cols-3" : ""
                  } gap-12 lg:gap-10 justify-items-center`}
                >
                  {rowMembers.map((member, mIdx) => {
                    const globalIdx = rIdx * 3 + mIdx;
                    const photo =
                      member.photoUrl || FALLBACK_PHOTOS[globalIdx % FALLBACK_PHOTOS.length];
                    const tilt = globalIdx % 2 === 0 ? -3.5 : 3.5;
                    const pegColor =
                      member.pegColor || PEG_COLORS[globalIdx % PEG_COLORS.length];
                    const duotoneMode = !enableDuotone
                      ? "none"
                      : globalIdx % 2 === 0
                      ? "purple"
                      : "violet";

                    return (
                      <div
                        key={member.id}
                        className="flex flex-col items-center text-center max-w-[360px] w-full"
                      >
                        {/* Polaroid Photo Physically Clamped to the Wire by Spring Clothespin */}
                        <div className="mb-6">
                          <ClothespinPolaroid
                            imageUrl={photo}
                            alt={member.name}
                            pegColor={pegColor}
                            tiltAngle={tilt}
                            duotone={duotoneMode}
                            focalPointX={member.focalPointX ?? 50}
                            focalPointY={member.focalPointY ?? 50}
                            showIndividualWire="mobile"
                            widthClass="w-[225px] sm:w-[245px]"
                            aspectClass="h-[225px] sm:h-[245px]"
                          />
                        </div>

                        <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#140529] tracking-tight leading-tight mb-1 lowercase">
                          {member.name}
                        </h3>

                        <p className="text-[13px] text-[#7629f0] font-bold mb-2.5">
                          {member.role}
                          {member.pronouns ? ` · (${member.pronouns})` : ""}
                        </p>

                        <p className="text-[13.5px] leading-relaxed text-[#140529]/85 font-normal">
                          {member.bio}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Link to Full Team Page */}
          <div className="mt-14 pt-8 border-t border-[#7629f0]/20 flex flex-wrap items-center justify-center gap-4">
            <Link href="/team" className="btn-outline text-xs sm:text-sm px-6 py-3">
              <span>Meet the Entire Up for Youth Team</span>
              <ArrowRight size={15} />
            </Link>
            <Link href="/volunteer" className="btn-primary text-xs sm:text-sm px-6 py-3">
              <span>Join Our Organizing Circle</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
