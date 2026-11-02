"use client";

import React, { useId } from "react";

interface CutoutTypographyProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  dashColor?: string;
}

export default function CutoutTypography({
  text,
  className = "",
  size = "lg",
  primaryColor = "var(--ufy-primary-purple, #7629f0)",
  dashColor = "var(--ufy-primary-purple, #7629f0)",
}: CutoutTypographyProps) {
  const rawId = useId();
  const filterId = `cutout-shadow-${rawId.replace(/:/g, "")}`;
  const cleanText = (text || "ufy").trim();

  const fontSizes = {
    sm: { height: 84, size: 54, y: 42 },
    md: { height: 124, size: 82, y: 62 },
    lg: { height: 172, size: 116, y: 88 },
    xl: { height: 236, size: 164, y: 122 },
    hero: { height: 280, size: 204, y: 146 },
  };

  const { height, size: fSize, y } = fontSizes[size];
  const charWidth = fSize * 0.62;
  const totalWidth = Math.max(260, Math.ceil(cleanText.length * charWidth + 88));
  const centerX = totalWidth / 2;

  return (
    <svg
      width={totalWidth}
      height={height}
      viewBox={`0 0 ${totalWidth} ${height}`}
      style={{
        width: size === "hero" ? `${totalWidth}px` : "100%",
        maxWidth: size === "hero" ? "none" : `${totalWidth}px`,
        height: size === "hero" ? `${height}px` : "auto",
        maxHeight: `${height}px`,
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
      }}
      className={`overflow-visible select-none mx-auto ${className}`}
      role="img"
      aria-label={cleanText}
    >
      <defs>
        <filter id={filterId} x="-15%" y="-15%" width="135%" height="135%">
          <feDropShadow dx="3" dy="4" stdDeviation="0" floodColor="rgba(20,5,41,0.18)" />
        </filter>
      </defs>

      {/* Layer 1: Dashed Cut-Out Offset Outline (Readymag Stamp Stitch Effect) */}
      <text
        x={centerX + 5}
        y={y + 5}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-heading, 'Plus Jakarta Sans', 'Outfit', sans-serif)"
        fontWeight="900"
        fontSize={fSize}
        letterSpacing="-0.02em"
        wordSpacing="0.16em"
        fill="none"
        stroke={dashColor}
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      >
        {cleanText}
      </text>

      {/* Layer 2: White Paper Border Cut-Out */}
      <text
        x={centerX}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-heading, 'Plus Jakarta Sans', 'Outfit', sans-serif)"
        fontWeight="900"
        fontSize={fSize}
        letterSpacing="-0.02em"
        wordSpacing="0.16em"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth={Math.max(10, fSize * 0.11)}
        strokeLinejoin="round"
        filter={`url(#${filterId})`}
      >
        {cleanText}
      </text>

      {/* Layer 3: Crisp Single-Color Cut-Out Letters (Solid Purple or Black for 100% Word Readability) */}
      <text
        x={centerX}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-heading, 'Plus Jakarta Sans', 'Outfit', sans-serif)"
        fontWeight="900"
        fontSize={fSize}
        letterSpacing="-0.02em"
        wordSpacing="0.16em"
        fill={primaryColor}
      >
        {cleanText}
      </text>
    </svg>
  );
}
