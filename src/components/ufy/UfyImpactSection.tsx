"use client";

import React from "react";
import Link from "next/link";
import CutoutTypography from "./CutoutTypography";
import { ArrowRight } from "lucide-react";

interface ImpactItem {
  id: string;
  label: string;
  currentValue: number;
  targetValue: number;
  prefix?: string | null;
  suffix?: string | null;
  color: string;
}

interface UfyImpactSectionProps {
  onOpenModal: () => void;
  bannerText?: string;
  title?: string;
  subtitle?: string | null;
  metrics?: ImpactItem[];
  instagramUrl?: string | null;
}

export default function UfyImpactSection({
  onOpenModal,
  bannerText = "thank you for standing with Up for Youth!\nevery virtual letter written, workshop hosted, and book donated\nupdates our live Manteca & global community counters.",
  title = "join the movement",
  metrics = [],
  instagramUrl = "https://instagram.com/ufy_youth",
}: UfyImpactSectionProps) {
  const bannerLines = bannerText.split("\n");

  const displayMetrics =
    metrics.length > 0
      ? metrics.slice(0, 6)
      : [
          {
            id: "1",
            label: "Hospital Letters Delivered",
            currentValue: 0,
            targetValue: 0,
            prefix: "",
            suffix: "",
            color: "#7629f0",
          },
          {
            id: "2",
            label: "Youth CPR Certified",
            currentValue: 0,
            targetValue: 0,
            prefix: "",
            suffix: "",
            color: "#140529",
          },
          {
            id: "3",
            label: "Books Donated",
            currentValue: 0,
            targetValue: 0,
            prefix: "",
            suffix: "",
            color: "#8e48ff",
          },
          {
            id: "4",
            label: "People Educated Online",
            currentValue: 0,
            targetValue: 0,
            prefix: "",
            suffix: "",
            color: "#7629f0",
          },
        ];

  return (
    <section id="impact" className="py-14 w-full">
      <div className="w-full px-3 sm:px-6 lg:px-10">
        {/* Community Milestone Notification Stamp */}
        <div className="flex justify-center mb-[-24px] z-20 relative px-4">
          <div className="bg-white border-2 border-[#7629f0] px-7 py-4 rounded-xl shadow-[4px_6px_0px_rgba(118,41,240,0.22)] max-w-[540px] text-center">
            <p className="text-[13.5px] sm:text-[14.5px] text-[#140529] leading-snug font-semibold text-center">
              {bannerLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < bannerLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>

        {/* Edge-to-Edge Dashed Box Container */}
        <div className="ufy-dashed-box w-full px-6 sm:px-12 lg:px-16 pt-14 pb-12 text-center rounded-[4px]">
          {/* Giant Cut-Out Typography — Clean Single-Color Heading Without Hard-to-Read Subtitle */}
          <div className="w-full flex flex-col items-center justify-center text-center my-4 overflow-hidden">
            <CutoutTypography
              text={title.toLowerCase()}
              size="lg"
              primaryColor="var(--ufy-primary-purple, #7629f0)"
            />
          </div>

          {/* Expansive Live Impact Counter Chips */}
          <div
            className={`grid grid-cols-2 ${
              displayMetrics.length >= 6
                ? "md:grid-cols-3 xl:grid-cols-6"
                : "md:grid-cols-4"
            } gap-4 sm:gap-6 my-10`}
          >
            {displayMetrics.map((m) => (
              <div
                key={m.id}
                className="bg-white p-5 sm:p-6 border-2 border-[#140529]/15 hover:border-[#7629f0] shadow-sm hover:shadow-md rounded-2xl transition-all flex flex-col items-center justify-center text-center"
              >
                <div
                  style={{ color: m.color || "#7629f0" }}
                  className="text-[28px] sm:text-[34px] font-black leading-none mb-2 tracking-tight text-center"
                >
                  {m.prefix}
                  {(m.currentValue ?? m.targetValue ?? 0).toLocaleString()}
                  {m.suffix}
                </div>
                <div className="text-[11.5px] font-mono font-bold text-[#140529]/80 uppercase leading-snug text-center">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Subtext & Action Links */}
          <div className="max-w-3xl mx-auto mt-8 space-y-3 text-center">
            <p className="text-[16px] sm:text-[19px] text-[#140529] font-medium text-center">
              follow Up for Youth on{" "}
              <a
                href={instagramUrl || "https://instagram.com/ufy_youth"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7629f0] font-bold underline decoration-2 underline-offset-4 hover:text-[#5013b8]"
              >
                instagram @ufy_youth
              </a>{" "}
              for weekly card-making dates and CPR clinics.
            </p>

            <p className="text-[16px] sm:text-[19px] text-[#140529] font-medium text-center">
              want to earn volunteer hours or start a UFY chapter at your school?{" "}
              <Link
                href="/volunteer"
                className="text-[#7629f0] font-bold underline decoration-2 underline-offset-4 hover:text-[#5013b8]"
              >
                sign up as an Up for Youth volunteer
              </Link>{" "}
              or{" "}
              <button
                type="button"
                onClick={onOpenModal}
                className="text-[#7629f0] font-bold underline decoration-2 underline-offset-4 hover:text-[#5013b8] cursor-pointer"
              >
                pitch a collaboration
              </button>
              .
            </p>

            <div className="pt-4 flex justify-center">
              <Link href="/impact" className="btn-outline text-xs sm:text-sm px-6 py-2.5">
                <span>Explore Live Impact Counters</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
