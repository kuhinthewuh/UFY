"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Compass,
  MapPin,
  Calendar,
  Heart,
  Activity,
  BookOpen,
  Award,
  ChevronRight,
  X,
  Flag,
} from "lucide-react";
import CutoutTypography from "@/components/ufy/CutoutTypography";
import ClothespinPolaroid from "@/components/ufy/ClothespinPolaroid";

interface JourneyNodeItem {
  id: string;
  title: string;
  dateLabel: string;
  location: string;
  category: string;
  description: string;
  stats?: string | null;
  imageUrl?: string | null;
  badgeLabel?: string | null;
  isHighlight: boolean;
  displayOrder: number;
}

interface JourneyTrailClientProps {
  title: string;
  subtitle: string;
  initialNodes: JourneyNodeItem[];
}

interface Point {
  x: number;
  y: number;
}

export default function JourneyTrailClient({
  title,
  subtitle,
  initialNodes,
}: JourneyTrailClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeModalNode, setActiveModalNode] = useState<JourneyNodeItem | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const trailContainerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [trailPath, setTrailPath] = useState("");
  const [branchSegments, setBranchSegments] = useState<
    Array<{ id: string; x1: number; y1: number; x2: number; y2: number }>
  >([]);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const dynamicCategories = Array.from(new Set(initialNodes.map((n) => n.category)));
  const categories = ["ALL", ...dynamicCategories];

  const filteredNodes =
    selectedCategory === "ALL"
      ? initialNodes
      : initialNodes.filter((node) => node.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Hospital Action":
        return Heart;
      case "First-Aid CPR":
        return Activity;
      case "Book Drive":
        return BookOpen;
      default:
        return Award;
    }
  };

  // Measure exact waypoint centers & card edges so the SVG trail connects cleanly through every single node without drift or overlap
  const recomputeTrail = useCallback(() => {
    const container = trailContainerRef.current;
    if (!container || filteredNodes.length === 0) {
      setTrailPath("");
      setBranchSegments([]);
      return;
    }

    const cRect = container.getBoundingClientRect();
    if (cRect.width === 0 || cRect.height === 0) return;

    setSvgSize({ width: cRect.width, height: cRect.height });

    const pts: Point[] = [];
    const branches: Array<{ id: string; x1: number; y1: number; x2: number; y2: number }> = [];

    filteredNodes.forEach((node, idx) => {
      const btn = nodeRefs.current[node.id];
      const card = cardRefs.current[node.id];
      if (!btn) return;
      const bRect = btn.getBoundingClientRect();
      const cx = bRect.left - cRect.left + bRect.width / 2;
      const cy = bRect.top - cRect.top + bRect.height / 2;
      pts.push({ x: cx, y: cy });

      if (card && cRect.width >= 768) {
        const cardRect = card.getBoundingClientRect();
        const isEven = idx % 2 === 0;
        const targetX = isEven
          ? cardRect.right - cRect.left
          : cardRect.left - cRect.left;
        branches.push({
          id: node.id,
          x1: cx,
          y1: cy,
          x2: targetX,
          y2: cy,
        });
      }
    });

    if (pts.length === 0) {
      setTrailPath("");
      setBranchSegments([]);
      return;
    }

    // Build smooth cubic bezier curve passing dead-center through every waypoint
    let d = `M ${pts[0].x.toFixed(1)} ${Math.max(0, pts[0].y - 36).toFixed(1)} L ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const midY = (p1.y + p2.y) / 2;
      // Gentle S-curve tension even when x coordinates weave
      d += ` C ${p1.x.toFixed(1)} ${midY.toFixed(1)}, ${p2.x.toFixed(1)} ${midY.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x.toFixed(1)} ${Math.min(cRect.height, last.y + 36).toFixed(1)}`;

    setTrailPath(d);
    setBranchSegments(branches);
  }, [filteredNodes]);

  useEffect(() => {
    recomputeTrail();
    const timer = setTimeout(recomputeTrail, 120);
    window.addEventListener("resize", recomputeTrail);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && trailContainerRef.current) {
      observer = new ResizeObserver(() => recomputeTrail());
      observer.observe(trailContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", recomputeTrail);
      if (observer) observer.disconnect();
    };
  }, [recomputeTrail]);

  return (
    <div className="w-full relative">
      {/* Edge-to-Edge Hero Header */}
      <section className="ufy-container text-center mb-14 relative flex flex-col items-center justify-center">
        <div className="hidden xl:flex flex-col items-center absolute right-12 top-2 bg-white/95 backdrop-blur-md border-2 border-[#140529] p-4 rounded-2xl shadow-[5px_6px_0px_rgba(20,5,41,0.9)] rotate-6">
          <Compass
            size={30}
            className="text-[#7629f0] animate-spin"
            style={{ animationDuration: "24s" }}
          />
          <span className="font-mono text-[10px] font-extrabold text-[#140529] mt-1.5 tracking-widest">
            UFY TRAIL MAP
          </span>
        </div>

        <div className="w-full flex justify-center mb-4">
          <CutoutTypography text="our journey" size="lg" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#140529] tracking-tight max-w-5xl mx-auto leading-[1.08] mb-5 text-center">
          {title}
        </h1>

        <p className="text-base sm:text-xl text-[#5416b3] max-w-3xl mx-auto font-medium leading-relaxed mb-8 text-center">
          {subtitle}
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                selectedCategory === cat
                  ? "bg-[#7629f0] text-white shadow-md scale-105"
                  : "bg-white text-[#140529] border border-[#d4b8fc] hover:bg-[#ebdffe]"
              }`}
            >
              {cat === "ALL" ? `All Trail Stops (${initialNodes.length})` : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Edge-to-Edge Treasure Map Trail Canvas */}
      <section className="w-full px-3 sm:px-6 lg:px-10 mb-16">
        <div className="ufy-dashed-box w-full px-4 sm:px-10 lg:px-16 py-12 sm:py-16 rounded-[6px]">
          {filteredNodes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#d4b8fc]">
              <Compass size={48} className="mx-auto text-[#7629f0] mb-3 opacity-60" />
              <h3 className="text-xl font-bold text-[#140529]">No milestones in this category yet</h3>
              <p className="text-sm text-[#5416b3]">Select another category or view all trail stops.</p>
            </div>
          ) : (
            <div ref={trailContainerRef} className="relative w-full py-6">
              {/* Dynamically Measured SVG Trail Connecting Exact Center of Every Waypoint Node */}
              {svgSize.width > 0 && trailPath ? (
                <svg
                  width={svgSize.width}
                  height={svgSize.height}
                  viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
                  className="absolute inset-0 pointer-events-none z-0 overflow-visible"
                >
                  {/* Soft Outer Glow along the Main Winding Trail */}
                  <path
                    d={trailPath}
                    fill="none"
                    stroke="rgba(118, 41, 240, 0.16)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Dotted Winding Trail Line */}
                  <path
                    d={trailPath}
                    fill="none"
                    stroke="#7629f0"
                    strokeWidth="3.5"
                    strokeDasharray="9 9"
                    strokeLinecap="round"
                  />
                  {/* Horizontal Branch Connectors from Central Waypoints Directly to Each Card */}
                  {branchSegments.map((seg) => (
                    <line
                      key={seg.id}
                      x1={seg.x1}
                      y1={seg.y1}
                      x2={seg.x2}
                      y2={seg.y2}
                      stroke="#8e48ff"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
              ) : (
                /* Pre-Hydration Fallback Spine (Zero Visual Glitch on SSR) */
                <div className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-6 bottom-6 border-l-[3px] border-dashed border-[#7629f0] pointer-events-none z-0" />
              )}

              {/* Trail Start Marker */}
              <div className="hidden md:flex justify-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#140529] text-white text-[11px] font-mono font-bold uppercase tracking-widest shadow-md">
                  <Flag size={12} className="text-[#d4b8fc]" />
                  <span>Expedition Origin</span>
                </div>
              </div>

              {/* Milestones List — Strict 3-Column Non-Overlapping Grid on Desktop */}
              <div className="space-y-14 md:space-y-20 relative z-10">
                {filteredNodes.map((node, index) => {
                  const Icon = getCategoryIcon(node.category);
                  const isEven = index % 2 === 0;
                  const isHovered = hoveredNodeId === node.id;
                  // Gentle winding offset on desktop so the path visibly snakes while staying 100% connected!
                  const waveOffsetClass = isEven ? "md:-translate-x-5" : "md:translate-x-5";

                  const eventCardElement = (
                    <div
                      ref={(el) => {
                        cardRefs.current[node.id] = el;
                      }}
                      onClick={() => setActiveModalNode(node)}
                      className={`bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border-2 transition-all duration-300 relative group cursor-pointer ${
                        node.isHighlight
                          ? "border-[#140529] shadow-[8px_10px_0px_rgba(20,5,41,0.9)]"
                          : "border-[#d4b8fc] shadow-md hover:shadow-xl hover:border-[#7629f0]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8f4fe] text-[#7629f0] font-extrabold text-xs border border-[#d4b8fc]">
                            <Icon size={13} />
                            <span>{node.category}</span>
                          </span>
                          {node.badgeLabel && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold border border-amber-300">
                              {node.badgeLabel}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#5416b3]">
                          <Calendar size={13} />
                          <span>{node.dateLabel}</span>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#140529] mb-2 leading-tight group-hover:text-[#7629f0] transition-colors">
                        {node.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-3.5">
                        <MapPin size={13} className="text-[#7629f0] shrink-0" />
                        <span>{node.location}</span>
                      </div>

                      <p className="text-sm sm:text-[15px] text-[#5416b3] font-medium leading-relaxed mb-5">
                        {node.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-neutral-100">
                        {node.stats ? (
                          <div className="font-extrabold text-xs text-[#7629f0] bg-[#ebdffe] px-3.5 py-1.5 rounded-full border border-[#d4b8fc]">
                            🎯 {node.stats}
                          </div>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalNode(node);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-black text-[#7629f0] hover:text-[#5c18c9] transition-transform group-hover:translate-x-1"
                        >
                          <span>Inspect Trail Stop</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );

                  const companionVisualElement = node.imageUrl ? (
                    <div className="flex justify-center">
                      <ClothespinPolaroid
                        imageUrl={node.imageUrl}
                        alt={node.title}
                        pegColor={isEven ? "#e0c7a8" : "#7629f0"}
                        tiltAngle={isEven ? 2.5 : -2.5}
                        showIndividualWire={true}
                        widthClass="w-[260px] sm:w-[300px]"
                        aspectClass="h-[175px] sm:h-[195px]"
                        onClick={() => setActiveModalNode(node)}
                        caption={
                          <div className="text-center font-mono text-[11px] font-bold text-[#140529]">
                            Stop #{index + 1} · {node.location}
                          </div>
                        }
                      />
                    </div>
                  ) : (
                    <div className="hidden md:flex justify-center">
                      <div
                        onClick={() => setActiveModalNode(node)}
                        className="cursor-pointer flex flex-col items-center justify-center px-7 py-6 border-2 border-dashed border-[#7629f0]/40 rounded-3xl bg-white/80 hover:bg-white text-center max-w-[280px] shadow-sm transition-all"
                      >
                        <Compass size={24} className="text-[#7629f0] mb-2" />
                        <span className="text-xs font-extrabold text-[#140529] uppercase tracking-wider">
                          Waypoint #{index + 1}
                        </span>
                        <span className="text-xs font-semibold text-[#5416b3] mt-1">
                          {node.dateLabel} · {node.location}
                        </span>
                      </div>
                    </div>
                  );

                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className="relative grid grid-cols-[48px_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_140px_minmax(0,1fr)] items-center gap-4 md:gap-6"
                    >
                      {/* Desktop Left Column */}
                      <div className="hidden md:block">
                        {isEven ? eventCardElement : companionVisualElement}
                      </div>

                      {/* Waypoint Marker Column (Col 1 on Mobile, Col 2 Center Spine on Desktop) */}
                      <div className="flex items-center justify-center relative z-20">
                        <button
                          ref={(el) => {
                            nodeRefs.current[node.id] = el;
                          }}
                          type="button"
                          onClick={() => setActiveModalNode(node)}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 shadow-lg ${waveOffsetClass} ${
                            node.isHighlight
                              ? "bg-[#7629f0] border-white text-white ring-4 ring-[#8e48ff]/35"
                              : isHovered
                              ? "bg-[#8e48ff] border-white text-white scale-110"
                              : "bg-white border-[#7629f0] text-[#7629f0] hover:scale-110"
                          }`}
                          title={`Stop #${index + 1}: ${node.title}`}
                        >
                          {index + 1}
                        </button>
                      </div>

                      {/* Desktop Right Column */}
                      <div className="hidden md:block">
                        {isEven ? companionVisualElement : eventCardElement}
                      </div>

                      {/* Mobile Card Column */}
                      <div className="md:hidden space-y-4">
                        {eventCardElement}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal / Expanded Details Drawer */}
      {activeModalNode && (
        <div
          className="fixed inset-0 z-50 bg-[#140529]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalNode(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#140529] shadow-2xl p-6 sm:p-10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalNode(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100 hover:bg-[#ebdffe] flex items-center justify-center text-[#140529] transition-all"
            >
              <X size={18} />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-[#ebdffe] text-[#7629f0] font-extrabold text-xs">
                {activeModalNode.category}
              </span>
              {activeModalNode.badgeLabel && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
                  {activeModalNode.badgeLabel}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
                <Calendar size={13} />
                <span>{activeModalNode.dateLabel}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#140529] mb-2 leading-tight">
              {activeModalNode.title}
            </h2>

            <div className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-6">
              <MapPin size={16} className="text-[#7629f0]" />
              <span>{activeModalNode.location}</span>
            </div>

            {activeModalNode.imageUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-[#d4b8fc] shadow-md max-h-72">
                <img
                  src={activeModalNode.imageUrl}
                  alt={activeModalNode.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
                Milestone Story &amp; Community Reach
              </h4>
              <p className="text-base text-[#140529] font-medium leading-relaxed">
                {activeModalNode.description}
              </p>
            </div>

            {activeModalNode.stats && (
              <div className="p-4 rounded-2xl bg-[#f8f4fe] border border-[#d4b8fc] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#5416b3]">Verified Impact Metric</div>
                  <div className="text-lg font-black text-[#7629f0]">{activeModalNode.stats}</div>
                </div>
                <Award size={28} className="text-[#7629f0]" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
