"use client";

import React, { useState } from "react";
import Link from "next/link";
import CutoutTypography from "./CutoutTypography";
import { Heart, Sun, Mail, X, PenLine, Award, Smile } from "lucide-react";
import { AffirmationLetterData } from "@/lib/types";

interface UfyAffirmationsStripProps {
  letters: AffirmationLetterData[];
  title?: string;
  subtitle?: string | null;
}

export default function UfyAffirmationsStrip({
  letters,
  title = "words of affirmation",
  subtitle = "Click any sealed envelope to open a real note of warmth written by our youth community—or write one yourself to brighten someone's day!",
}: UfyAffirmationsStripProps) {
  const [activeLetter, setActiveLetter] = useState<AffirmationLetterData | null>(null);
  const [heartedIds, setHeartedIds] = useState<Record<string, boolean>>({});
  const [localHearts, setLocalHearts] = useState<Record<string, number>>({});

  const getStampIcon = (style: string) => {
    switch (style) {
      case "star":
        return Award;
      case "sun":
        return Sun;
      case "sparkle":
        return Smile;
      default:
        return Heart;
    }
  };

  const handleHeart = async (letter: AffirmationLetterData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (heartedIds[letter.id]) return;

    setHeartedIds((prev) => ({ ...prev, [letter.id]: true }));
    setLocalHearts((prev) => ({
      ...prev,
      [letter.id]: (prev[letter.id] ?? letter.heartsCount) + 1,
    }));

    try {
      await fetch(`/api/letters/${letter.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "heart" }),
      });
    } catch {}
  };

  return (
    <section id="affirmations" className="py-14 w-full">
      <div className="w-full px-3 sm:px-6 lg:px-10">
        {/* Cut-Out Section Header */}
        <div className="w-full flex justify-center text-center mb-[-22px] z-20 relative">
          <CutoutTypography text={title.toLowerCase()} size="md" />
        </div>

        <div className="ufy-dashed-box w-full px-6 sm:px-12 lg:px-16 pt-12 pb-10 sm:pt-14 sm:pb-14 rounded-[4px] text-center">
          <div className="flex flex-col items-center justify-center gap-4 mb-10 text-center">
            <div className="max-w-2xl flex flex-col items-center">
              <p className="text-sm sm:text-base text-[#140529]/85 font-medium leading-relaxed text-center">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href="/letters"
                className="btn-primary text-xs sm:text-sm px-5 py-2.5"
              >
                <PenLine size={15} />
                <span>Write a Quick Note</span>
              </Link>
              <Link
                href="/volunteer"
                className="btn-outline text-xs sm:text-sm px-5 py-2.5"
              >
                <Award size={15} className="text-[#7629f0]" />
                <span>Write for Volunteer Hours</span>
              </Link>
            </div>
          </div>

          {/* Interactive Sealed Envelopes Grid or Clean Empty State */}
          {!letters || letters.length === 0 ? (
            <div className="bg-white/90 rounded-3xl p-8 sm:p-12 border-2 border-dashed border-[#7629f0]/40 max-w-2xl mx-auto text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#f8f4fe] border border-[#d4b8fc] text-[#7629f0] flex items-center justify-center mb-4">
                <Mail size={26} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#140529] mb-2 text-center">
                Be the First to Seal a Virtual Letter
              </h3>
              <p className="text-sm sm:text-base text-[#5416b3] font-medium max-w-lg mb-6 text-center">
                Our community affirmation wall is ready for launch! Write the very first virtual letter for hospitalized youth or fellow students—and earn verified volunteer hours when signed into your UFY account.
              </p>
              <Link href="/letters" className="btn-primary text-xs sm:text-sm px-6 py-3">
                <PenLine size={15} />
                <span>Write the First Affirmation Letter</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {letters.slice(0, 8).map((letter, idx) => {
              const StampIcon = getStampIcon(letter.stampStyle);
              const tilt = idx % 2 === 0 ? -1.8 : 1.8;

              return (
                <button
                  key={letter.id}
                  type="button"
                  onClick={() => setActiveLetter(letter)}
                  style={{
                    backgroundColor: letter.stationeryColor || "#ffffff",
                    transform: `rotate(${tilt}deg)`,
                  }}
                  className="group relative text-center p-6 rounded-2xl border-2 border-[#140529]/20 hover:border-[#7629f0] shadow-[0_10px_26px_rgba(20,5,41,0.08)] hover:shadow-[0_18px_38px_rgba(118,41,240,0.22)] hover:!rotate-0 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between min-h-[205px] overflow-hidden"
                >
                  {/* Top Airmail Corner Postage Stamp */}
                  <div className="flex items-start justify-between gap-2 mb-4 w-full">
                    <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#7629f0] border border-[#d4b8fc]">
                      {letter.recipientTag}
                    </span>

                    <div className="w-10 h-11 rounded-[3px] bg-white border-2 border-dashed border-[#7629f0] flex items-center justify-center text-[#7629f0] shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                      <StampIcon size={17} />
                    </div>
                  </div>

                  {/* Preview Teaser */}
                  <p className="text-sm font-semibold text-[#140529] line-clamp-3 leading-relaxed mb-4 text-center">
                    “{letter.message}”
                  </p>

                  {/* Envelope Wax Seal Footer */}
                  <div className="pt-3 border-t border-[#140529]/10 flex items-center justify-between text-xs w-full">
                    <span className="font-mono font-bold text-[#5416b3] truncate max-w-[140px]">
                      — {letter.authorName}
                    </span>
                    <span className="inline-flex items-center gap-1 font-extrabold text-[#7629f0] group-hover:underline">
                      <span>Open Letter</span>
                      <span>→</span>
                    </span>
                  </div>
                </button>
              );
            })}
            </div>
          )}
        </div>
      </div>

      {/* Opened Letter Modal */}
      {activeLetter && (
        <div
          className="fixed inset-0 z-[95] bg-[#140529]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveLetter(null)}
        >
          <div
            style={{ backgroundColor: activeLetter.stationeryColor || "#ffffff" }}
            className="max-w-lg w-full rounded-3xl border-2 border-[#140529] shadow-[12px_16px_0px_rgba(118,41,240,0.5)] p-7 sm:p-10 relative text-center flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveLetter(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[#140529]/15 flex items-center justify-center text-[#140529]"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#d4b8fc] text-xs font-mono font-extrabold text-[#7629f0] mb-5">
              <Mail size={13} />
              <span>{activeLetter.recipientTag}</span>
            </div>

            <p className="text-lg sm:text-xl font-semibold text-[#140529] leading-relaxed whitespace-pre-line mb-8 text-center">
              “{activeLetter.message}”
            </p>

            <div className="pt-5 border-t border-[#140529]/15 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              <div className="text-center sm:text-left">
                <div className="text-xs font-mono uppercase text-[#5416b3]">Written with care by</div>
                <div className="text-base font-black text-[#140529]">{activeLetter.authorName}</div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleHeart(activeLetter)}
                  className={`px-4 py-2 rounded-full font-extrabold text-xs inline-flex items-center gap-1.5 border transition-all ${
                    heartedIds[activeLetter.id]
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50"
                  }`}
                >
                  <Heart
                    size={14}
                    className={heartedIds[activeLetter.id] ? "fill-white" : "fill-rose-500"}
                  />
                  <span>
                    {localHearts[activeLetter.id] ?? activeLetter.heartsCount} Hearts
                  </span>
                </button>

                <Link
                  href="/letters"
                  onClick={() => setActiveLetter(null)}
                  className="btn-primary text-xs px-4 py-2"
                >
                  <span>Write One Too</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
