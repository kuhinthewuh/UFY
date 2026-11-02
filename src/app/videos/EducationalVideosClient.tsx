"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  ExternalLink,
  Clock,
  UserCheck,
  Columns,
  Grid,
  Eye,
  GraduationCap,
  X,
  ArrowRight,
} from "lucide-react";
import CutoutTypography from "@/components/ufy/CutoutTypography";
import { extractYoutubeId, getVideoThumbnailUrl } from "@/lib/site-data";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl?: string | null;
  duration?: string | null;
  instructor?: string | null;
  viewsCount: number;
  isFeatured: boolean;
  displayOrder: number;
}

interface EducationalVideosClientProps {
  title: string;
  subtitle: string;
  initialVideos: VideoItem[];
  initialEducatedCount: number;
  defaultColumns: 2 | 3;
}

export default function EducationalVideosClient({
  title,
  subtitle,
  initialVideos,
  initialEducatedCount,
  defaultColumns,
}: EducationalVideosClientProps) {
  const [educatedCount, setEducatedCount] = useState(initialEducatedCount);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [gridCols, setGridCols] = useState<2 | 3>(defaultColumns);
  const [playingInlineIds, setPlayingInlineIds] = useState<Record<string, boolean>>({});
  const [pulseBump, setPulseBump] = useState(false);
  const hasCountedPageVisit = useRef(false);

  // Increment live "X People Educated" counter on page arrival
  useEffect(() => {
    if (hasCountedPageVisit.current) return;
    hasCountedPageVisit.current = true;

    fetch("/api/videos/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page" }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.educatedCount === "number") {
          setEducatedCount(data.educatedCount);
          setPulseBump(true);
          setTimeout(() => setPulseBump(false), 700);
        }
      })
      .catch(() => {});
  }, []);

  const triggerVideoEducationClick = (videoId: string) => {
    setEducatedCount((prev) => prev + 1);
    setPulseBump(true);
    setTimeout(() => setPulseBump(false), 600);

    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, viewsCount: v.viewsCount + 1 } : v))
    );

    fetch("/api/videos/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, type: "play" }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.educatedCount === "number") {
          setEducatedCount(data.educatedCount);
        }
      })
      .catch(() => {});
  };

  const handlePlayInline = (video: VideoItem) => {
    const ytId = extractYoutubeId(video.youtubeUrl);
    triggerVideoEducationClick(video.id);
    if (ytId) {
      setPlayingInlineIds((prev) => ({ ...prev, [video.id]: true }));
    } else {
      window.open(video.youtubeUrl, "_blank", "noopener,noreferrer");
    }
  };

  const categories = [
    "ALL",
    ...Array.from(new Set(videos.map((v) => v.category).filter(Boolean))),
  ];

  const filteredVideos =
    selectedCategory === "ALL"
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Edge-to-Edge Hero Header + Live "People Educated" Counter */}
      <section className="ufy-container text-center mb-12 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center mb-4">
          <CutoutTypography text="videos" size="lg" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#140529] tracking-tight max-w-5xl mx-auto leading-[1.08] mb-5 text-center">
          {title}
        </h1>

        <p className="text-base sm:text-xl text-[#5416b3] max-w-3xl mx-auto font-medium leading-relaxed mb-8 text-center">
          {subtitle}
        </p>

        {/* Live Click Counter Banner: "X People Educated" */}
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 px-7 py-4 rounded-3xl bg-[#140529] text-white border-2 border-[#7629f0] shadow-[8px_10px_0px_rgba(118,41,240,0.35)]">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4b8fc] font-bold">
              Live Impact Tracker
            </span>
          </div>

          <div className="hidden sm:block w-px h-6 bg-white/20" />

          <div
            className={`text-2xl sm:text-3xl font-black tracking-tight transition-transform duration-300 ${
              pulseBump ? "scale-110 text-[#c084fc]" : "text-white"
            }`}
          >
            {educatedCount.toLocaleString()}{" "}
            <span className="text-base sm:text-lg font-extrabold text-[#ebdffe]">
              People Educated
            </span>
          </div>
        </div>
      </section>

      {/* Filter Bar & 2-vs-3 Column Switcher */}
      <section className="ufy-container mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-white/85 backdrop-blur-md px-5 py-4 rounded-2xl border border-[#d4b8fc] shadow-sm">
          {/* Tabular Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#7629f0] text-white shadow-sm"
                    : "bg-[#f8f4fe] text-[#140529] border border-[#d4b8fc] hover:bg-[#ebdffe]"
                }`}
              >
                {cat === "ALL" ? `All Modules (${videos.length})` : cat}
              </button>
            ))}
          </div>

          {/* 2-per-row / 3-per-row Toggle */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#f8f4fe] p-1.5 rounded-xl border border-[#d4b8fc] shrink-0">
            <span className="text-[11px] font-bold text-[#5416b3] px-2">Row View:</span>
            <button
              type="button"
              onClick={() => setGridCols(2)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                gridCols === 2
                  ? "bg-[#7629f0] text-white shadow-sm"
                  : "text-[#140529] hover:bg-[#ebdffe]"
              }`}
            >
              <Columns size={14} />
              <span>2 / Row</span>
            </button>
            <button
              type="button"
              onClick={() => setGridCols(3)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                gridCols === 3
                  ? "bg-[#7629f0] text-white shadow-sm"
                  : "text-[#140529] hover:bg-[#ebdffe]"
              }`}
            >
              <Grid size={14} />
              <span>3 / Row</span>
            </button>
          </div>
        </div>
      </section>

      {/* Edge-to-Edge Rounded Tabular Video Nodes Grid */}
      <section className="w-full px-3 sm:px-6 lg:px-10 mb-20">
        <div className="ufy-dashed-box w-full px-5 sm:px-10 lg:px-14 py-12 sm:py-16 rounded-[6px]">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#d4b8fc]">
              <GraduationCap size={48} className="mx-auto text-[#7629f0] mb-3 opacity-60" />
              <h3 className="text-xl font-black text-[#140529]">No educational videos in this tab yet</h3>
              <p className="text-sm text-[#5416b3] mt-1">
                Admins can add YouTube modules anytime from the Admin Portal.
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                gridCols === 3 ? "xl:grid-cols-3" : "xl:grid-cols-2"
              } gap-8 lg:gap-10`}
            >
              {filteredVideos.map((video, idx) => {
                const ytId = extractYoutubeId(video.youtubeUrl);
                const thumbUrl = getVideoThumbnailUrl(video.youtubeUrl, video.thumbnailUrl);
                const isPlaying = Boolean(playingInlineIds[video.id] && ytId);

                return (
                  <article
                    key={video.id}
                    className="group bg-white rounded-[28px] border-2 border-[#140529] shadow-[7px_9px_0px_rgba(20,5,41,0.9)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Rounded Tabular Node Header Strip */}
                      <div className="px-5 py-3 bg-[#f8f4fe] border-b-2 border-[#140529]/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#7629f0]" />
                          <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-[#7629f0]">
                            Module #{String(idx + 1).padStart(2, "0")} · {video.category}
                          </span>
                        </div>
                        {video.isFeatured && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Aesthetic Video Thumbnail OR Direct Embedded YouTube Player */}
                      <div className="relative aspect-video w-full bg-[#140529] overflow-hidden border-b-2 border-[#140529]">
                        {isPlaying && ytId ? (
                          <div className="relative w-full h-full">
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full border-0"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setPlayingInlineIds((prev) => ({ ...prev, [video.id]: false }))
                              }
                              title="Close embedded player"
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#140529]/85 text-white hover:bg-[#7629f0] flex items-center justify-center shadow-md transition-colors"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePlayInline(video)}
                            className="w-full h-full relative block text-left group/thumb focus:outline-none"
                          >
                            <img
                              src={thumbUrl}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-95"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#140529]/75 via-[#140529]/20 to-transparent" />

                            {/* Tactile Center Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-[#7629f0] group-hover/thumb:bg-[#8e48ff] text-white border-[3px] border-white shadow-[0_10px_28px_rgba(20,5,41,0.55)] flex items-center justify-center group-hover/thumb:scale-110 transition-all duration-300">
                                <Play size={28} className="fill-white ml-1" />
                              </div>
                            </div>

                            {/* Duration & Watch Inline Pill */}
                            <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold border border-white/25">
                                Click to Watch Inline
                              </span>
                              {video.duration && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#140529]/90 text-white font-mono text-xs font-bold">
                                  <Clock size={11} />
                                  <span>{video.duration}</span>
                                </span>
                              )}
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Card Copy */}
                      <div className="p-6 sm:p-7 text-center flex flex-col items-center">
                        <h3 className="text-xl sm:text-2xl font-black text-[#140529] leading-snug mb-2.5 group-hover:text-[#7629f0] transition-colors text-center">
                          {video.title}
                        </h3>
                        <p className="text-sm text-[#5416b3] font-medium leading-relaxed mb-4 text-center">
                          {video.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Instructor + Views + External YouTube Link */}
                    <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-xs font-bold text-neutral-600">
                        {video.instructor && (
                          <span className="inline-flex items-center gap-1.5 text-[#140529]">
                            <UserCheck size={14} className="text-[#7629f0]" />
                            <span>{video.instructor}</span>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-neutral-500 font-mono">
                          <Eye size={13} />
                          <span>{video.viewsCount.toLocaleString()}</span>
                        </span>
                      </div>

                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => triggerVideoEducationClick(video.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8f4fe] hover:bg-[#7629f0] text-[#7629f0] hover:text-white border border-[#d4b8fc] text-xs font-extrabold transition-all"
                      >
                        <span>YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Suggest or Film an Educational Video Callout */}
      <section className="ufy-container">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-[#140529] shadow-[8px_10px_0px_rgba(20,5,41,0.9)] flex flex-col items-center justify-center text-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#7629f0] bg-[#ebdffe] px-3.5 py-1 rounded-full border border-[#d4b8fc]">
              Youth Educators Wanted
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#140529] mt-3 mb-2 text-center">
              Want to Film a Peer Health Lesson for Volunteer Credit?
            </h2>
            <p className="text-sm sm:text-base text-[#5416b3] font-medium max-w-2xl text-center">
              Join Up for Youth as a peer educator to script, record, or translate accessible health &amp; first-aid tutorials for youth everywhere.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#7629f0] hover:bg-[#6019d4] text-white font-extrabold text-sm shadow-md transition-all"
            >
              <span>Join UFY Volunteers</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

