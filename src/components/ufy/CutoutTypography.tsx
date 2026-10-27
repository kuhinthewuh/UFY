"use client";

import React from "react";

interface CutoutTypographyProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  dashColor?: string;
}

export default function CutoutTypography({
  text,
  className = "",
  size = "lg",
  primaryColor = "#7629f0",
  secondaryColor = "#140529",
  accentColor = "#8e48ff",
  dashColor = "#7629f0",
}: CutoutTypographyProps) {
  const letters = text.split("");

  // Determine height and font size based on scale
  const fontSizes = {
    sm: { height: 70, size: 55, y: 50 },
    md: { height: 110, size: 85, y: 80 },
    lg: { height: 160, size: 125, y: 125 },
    xl: { height: 210, size: 165, y: 165 },
  };

  const { height, size: fSize, y } = fontSizes[size];
  const charWidth = fSize * 0.62;
  const totalWidth = Math.max(300, letters.length * charWidth + 50);

  const colors = [primaryColor, secondaryColor, accentColor, primaryColor, secondaryColor];

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      style={{ height: `${height}px`, width: "auto", display: "inline-block" }}
      className={`overflow-visible select-none ${className}`}
      role="img"
      aria-label={text}
    >
      <defs>
        <filter id="cutout-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="3" dy="4" stdDeviation="0" floodColor="rgba(0,0,0,0.15)" />
        </filter>
      </defs>

      {/* Layer 1: Dashed Cut-Out Offset Outline (Readymag Stamp Stitch Effect) */}
      <text
        x="26"
        y={y + 6}
        fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
        fontWeight="900"
        fontSize={fSize}
        letterSpacing="-0.04em"
        fill="none"
        stroke={dashColor}
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      >
        {text}
      </text>

      {/* Layer 2: White Paper Border Cut-Out */}
      <text
        x="20"
        y={y}
        fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
        fontWeight="900"
        fontSize={fSize}
        letterSpacing="-0.04em"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth={Math.max(8, fSize * 0.1)}
        strokeLinejoin="round"
        filter="url(#cutout-shadow)"
      >
        {text}
      </text>

      {/* Layer 3: Colored Letters with Alternating Palette */}
      <text
        x="20"
        y={y}
        fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
        fontWeight="900"
        fontSize={fSize}
        letterSpacing="-0.04em"
      >
        {letters.map((char, idx) => (
          <tspan
            key={idx}
            fill={colors[idx % colors.length]}
          >
            {char}
          </tspan>
        ))}
      </text>
    </svg>
  );
}
