"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Mail, Linkedin, Globe, HeartHandshake } from "lucide-react";
import ClothespinPolaroid from "@/components/ufy/ClothespinPolaroid";
import CutoutTypography from "@/components/ufy/CutoutTypography";

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  pronouns?: string | null;
  department?: string | null;
  photoUrl?: string | null;
  focalPointX: number;
  focalPointY: number;
  pegColor?: string;
  linkUrl?: string | null;
  linkType?: string | null;
  displayOrder: number;
}

interface TeamGalleryClientProps {
  title: string;
  subtitle: string;
  initialMembers: TeamMemberItem[];
  enableDuotone?: boolean;
}

const FALLBACK_PHOTOS = [
  "/readymag_assets/speaker_1_giovanna.png",
  "/readymag_assets/speaker_2_lino_laura.png",
  "/readymag_assets/speaker_3_helena.png",
  "/readymag_assets/speaker_4_esenia.png",
];

const PEG_COLORS = ["#e0c7a8", "#7629f0", "#8e48ff", "#d4b8fc"];

export default function TeamGalleryClient({
  title,
  subtitle,
  initialMembers,
  enableDuotone = true,
}: TeamGalleryClientProps) {
  const [selectedDept, setSelectedDept] = useState("ALL");

  const departments = [
    "ALL",
    ...Array.from(new Set(initialMembers.map((m) => m.department).filter(Boolean))),
  ];

  const filteredMembers =
    selectedDept === "ALL"
      ? initialMembers
      : initialMembers.filter((m) => m.department === selectedDept);

  // Group into clothesline wire rows of 3 for desktop edge-to-edge wire alignment
  const rows: TeamMemberItem[][] = [];
  for (let i = 0; i < filteredMembers.length; i += 3) {
    rows.push(filteredMembers.slice(i, i + 3));
  }

  return (
    <div className="w-full">
      {/* Edge-to-Edge Hero Header */}
      <section className="ufy-container text-center mb-14 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center mb-4">
          <CutoutTypography text="our team" size="lg" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#140529] tracking-tight max-w-5xl mx-auto leading-[1.08] mb-5 text-center">
          {title}
        </h1>

        <p className="text-base sm:text-xl text-[#5416b3] max-w-3xl mx-auto font-medium leading-relaxed mb-8 text-center">
          {subtitle}
        </p>

        {/* Department Filter Pills */}
        {departments.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {departments.map((dept) => (
              <button
                key={dept as string}
                onClick={() => setSelectedDept(dept as string)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                  selectedDept === dept
                    ? "bg-[#7629f0] text-white shadow-md scale-105"
                    : "bg-white text-[#140529] border border-[#d4b8fc] hover:bg-[#ebdffe]"
                }`}
              >
                {dept === "ALL" ? "All UFY Organizers" : (dept as string)}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Edge-to-Edge Dashed Frame with Clothesline Wire Rows */}
      <section className="w-full px-3 sm:px-6 lg:px-10 mb-20">
        <div className="ufy-dashed-box w-full px-6 sm:px-12 lg:px-16 py-14 sm:py-20 rounded-[6px] overflow-hidden">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-bold text-[#140529]">No team members found in this circle yet.</p>
            </div>
          ) : (
            <div className="space-y-24">
              {rows.map((rowMembers, rIdx) => (
                <div key={rIdx} className="relative">
                  {/* Continuous Edge-to-Edge Clothesline Wire Passing Right Through Every Clothespin at y=22px */}
                  <div className="hidden lg:flex items-center absolute top-[22px] -left-16 -right-16 z-10 pointer-events-none">
                    <div className="w-4 h-4 rounded-full bg-[#140529] border-2 border-white shadow-md shrink-0" />
                    <div className="flex-1 h-[3px] bg-gradient-to-r from-[#b483f8] via-[#7629f0] to-[#b483f8] shadow-[0_3px_6px_rgba(118,41,240,0.3)]" />
                    <div className="w-4 h-4 rounded-full bg-[#140529] border-2 border-white shadow-md shrink-0" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 lg:gap-12 justify-items-center">
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
                          className="flex flex-col items-center text-center max-w-[380px] w-full"
                        >
                          {/* Clothespin Physically Attached to Wire & Polaroid Frame */}
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
                              widthClass="w-[235px] sm:w-[260px]"
                              aspectClass="h-[235px] sm:h-[260px]"
                            />
                          </div>

                          {/* Name & Pronouns */}
                          <div className="flex flex-wrap items-baseline justify-center gap-2 mb-1.5">
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#140529] tracking-tight leading-tight lowercase">
                              {member.name}
                            </h3>
                            {member.pronouns && (
                              <span className="text-xs font-mono text-[#5416b3]/75 font-semibold">
                                ({member.pronouns})
                              </span>
                            )}
                          </div>

                          {/* Role & Department */}
                          <div className="mb-3">
                            <span className="inline-block text-xs sm:text-sm font-extrabold text-[#7629f0] bg-[#ebdffe]/70 px-3 py-0.5 rounded-full border border-[#d4b8fc]">
                              {member.role}
                            </span>
                            {member.department && (
                              <span className="text-xs text-[#5416b3] font-semibold block mt-1">
                                {member.department}
                              </span>
                            )}
                          </div>

                          {/* Bio */}
                          <p className="text-sm text-[#140529]/85 font-normal leading-relaxed mb-4">
                            {member.bio}
                          </p>

                          {/* Optional Social / Contact Link */}
                          {member.linkUrl && (
                            <div className="mt-auto pt-1">
                              <a
                                href={member.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#d4b8fc] text-xs font-extrabold text-[#7629f0] hover:bg-[#7629f0] hover:text-white transition-all shadow-sm"
                              >
                                {member.linkType === "linkedin" ? (
                                  <Linkedin size={13} />
                                ) : member.linkType === "email" ? (
                                  <Mail size={13} />
                                ) : (
                                  <Globe size={13} />
                                )}
                                <span>Connect</span>
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Edge-to-Edge Join the UFY Team Callout */}
      <section className="ufy-container">
        <div className="bg-white p-8 sm:p-14 rounded-3xl border-2 border-[#140529] shadow-[8px_10px_0px_rgba(20,5,41,0.9)] flex flex-col items-center justify-center text-center gap-8">
          <div className="text-center max-w-2xl flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#7629f0] bg-[#ebdffe] px-3.5 py-1 rounded-full border border-[#d4b8fc]">
              Join Up for Youth
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#140529] mt-3 mb-3 text-center">
              Want to Lead a CPR Workshop, Letter Drive, or Chapter?
            </h2>
            <p className="text-sm sm:text-base text-[#5416b3] font-medium leading-relaxed text-center">
              Up for Youth welcomes student facilitators, creatives, and organizers everywhere. Create a free volunteer account to start earning verified hours or pitch a new community project.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#7629f0] hover:bg-[#6019d4] text-white font-extrabold text-sm shadow-lg transition-all"
            >
              <HeartHandshake size={17} />
              <span>Become a UFY Volunteer</span>
            </Link>
            <Link
              href="/propose"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-[#ebdffe] text-[#140529] border-2 border-[#140529] font-extrabold text-sm transition-all"
            >
              <span>Propose an Initiative</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
