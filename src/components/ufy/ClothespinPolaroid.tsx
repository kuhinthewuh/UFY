"use client";

import React from "react";

interface ClothespinSvgProps {
  color?: string;
}

export function ClothespinSvg({ color = "#d8b082" }: ClothespinSvgProps) {
  return (
    <svg
      width="26"
      height="50"
      viewBox="0 0 26 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_4px_5px_rgba(20,5,41,0.32)] select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Subtle Paper Contact Shadow */}
      <rect x="6" y="26" width="15" height="22" rx="2" fill="rgba(20,5,41,0.18)" />
      {/* Main Wooden / Colored Peg Body */}
      <rect
        x="4"
        y="2"
        width="18"
        height="44"
        rx="3"
        fill={color}
        stroke="rgba(20,5,41,0.28)"
        strokeWidth="1.2"
      />
      {/* Center Vertical Split Line */}
      <line
        x1="13"
        y1="2"
        x2="13"
        y2="18"
        stroke="rgba(20,5,41,0.22)"
        strokeWidth="1"
      />
      {/* Top Bevel Highlight */}
      <rect x="5.5" y="3.5" width="4" height="40" rx="1.5" fill="rgba(255,255,255,0.24)" />
      {/* Wire Groove Notch at y=20 */}
      <rect x="3.5" y="18.5" width="19" height="4.5" rx="1.5" fill="rgba(20,5,41,0.35)" />
      {/* Metallic Spring Coil Band */}
      <rect
        x="2.5"
        y="19"
        width="21"
        height="4"
        rx="1.5"
        fill="#cbd5e1"
        stroke="#475569"
        strokeWidth="1"
      />
      {/* Spring Wire Vertical Prong */}
      <path
        d="M13 19V31"
        stroke="#64748b"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Clamping Jaw Gripping Ridges */}
      <line x1="6" y1="39" x2="20" y2="39" stroke="rgba(20,5,41,0.2)" strokeWidth="1" />
      <line x1="6" y1="42" x2="20" y2="42" stroke="rgba(20,5,41,0.2)" strokeWidth="1" />
    </svg>
  );
}

interface ClothespinPolaroidProps {
  imageUrl: string;
  alt: string;
  pegColor?: string;
  tiltAngle?: number;
  duotone?: "purple" | "violet" | "none";
  aspectClass?: string;
  widthClass?: string;
  focalPointX?: number;
  focalPointY?: number;
  showIndividualWire?: boolean | "mobile";
  caption?: React.ReactNode;
  overlay?: React.ReactNode;
  onClick?: () => void;
}

export default function ClothespinPolaroid({
  imageUrl,
  alt,
  pegColor = "#e0c7a8",
  tiltAngle = -3,
  duotone = "none",
  aspectClass = "h-[240px] sm:h-[260px]",
  widthClass = "w-[230px] sm:w-[255px]",
  focalPointX = 50,
  focalPointY = 50,
  showIndividualWire = false,
  caption,
  overlay,
  onClick,
}: ClothespinPolaroidProps) {
  const duotoneClass =
    duotone === "purple"
      ? "ufy-duotone-purple"
      : duotone === "violet"
      ? "ufy-duotone-violet"
      : "";

  return (
    <div className="relative inline-flex flex-col items-center group">
      {/* Optional Individual Mini Wire Segment (for standalone cards or mobile stacked rows) */}
      {showIndividualWire && (
        <div
          className={`absolute top-[22px] -left-10 -right-10 h-[3px] pointer-events-none z-10 items-center ${
            showIndividualWire === "mobile" ? "flex lg:hidden" : "flex"
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#140529] border border-white shadow-sm shrink-0" />
          <div className="flex-1 h-[2.5px] bg-gradient-to-r from-[#9353f4] via-[#7629f0] to-[#9353f4] shadow-[0_2px_4px_rgba(118,41,240,0.28)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#140529] border border-white shadow-sm shrink-0" />
        </div>
      )}

      {/* Pivoting Polaroid + Clothespin Unit (Transform Origin right on the wire at y=22px!) */}
      <div
        onClick={onClick}
        style={{
          transform: `rotate(${tiltAngle}deg)`,
          transformOrigin: "50% 22px",
          transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "rotate(0deg) scale(1.035)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `rotate(${tiltAngle}deg) scale(1)`;
        }}
        className={`relative pt-[28px] z-20 ${onClick ? "cursor-pointer" : ""}`}
      >
        {/* Clothespin Straddling Wire at y=22px and Clamping Polaroid Top Edge (y=28px..48px) */}
        <div className="absolute top-[1px] left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <ClothespinSvg color={pegColor} />
        </div>

        {/* Crisp Polaroid Paper Frame */}
        <div
          className={`bg-white p-3.5 sm:p-4 pt-5 pb-5 rounded-[3px] shadow-[0_14px_32px_-6px_rgba(20,5,41,0.2),0_4px_12px_rgba(20,5,41,0.08)] group-hover:shadow-[0_24px_48px_-8px_rgba(118,41,240,0.34)] border border-[#140529]/12 transition-shadow ${widthClass}`}
        >
          <div className={`w-full ${aspectClass} overflow-hidden bg-[#140529] rounded-[2px] relative`}>
            <img
              src={imageUrl}
              alt={alt}
              style={{ objectPosition: `${focalPointX}% ${focalPointY}%` }}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${duotoneClass}`}
              loading="lazy"
            />
            {overlay}
          </div>

          {caption && <div className="pt-3.5 px-0.5 text-left">{caption}</div>}
        </div>
      </div>
    </div>
  );
}
